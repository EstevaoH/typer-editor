"use client"
import React, { useEffect, useRef, useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import "highlight.js/styles/atom-one-dark.css";
import { ToolBar } from '@/components/toolbar';
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { all, createLowlight } from 'lowlight'
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align';
import ListKeymap from '@tiptap/extension-list-keymap'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import OrderedList from "@tiptap/extension-ordered-list"
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Blockquote from '@tiptap/extension-blockquote'
import Document from '@tiptap/extension-document'
import { MenuFloating } from '@/components/menu-floating';
import { MenuBubble } from '@/components/menu-bubble';
import { useDocuments } from '@/context/documents-context';

const limit = 42400
const lowlight = createLowlight(all)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)


export function Editor() {
    const { currentDocument, updateDocument, saveDocument } = useDocuments()
    const [title, setTitle] = useState(currentDocument?.title || '')
    const [isEditorFocused, setIsEditorFocused] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                document: false
            }),
            Document,
            Underline,
            TextStyle,
            Blockquote,
            Color.configure({
                types: ['textStyle'],
            }),
            CharacterCount.configure({
                limit,
            }),
            Link.configure({
                openOnClick: true,
                autolink: false,
                defaultProtocol: 'https',
                protocols: ['http', 'https'],
                isAllowedUri: (url, ctx) => {
                    try {
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)
                        console.log(parsedUrl)
                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false
                        }
                        const disallowedProtocols = ['ftp', 'file', 'mailto']
                        const protocol = parsedUrl.protocol.replace(':', '')

                        if (disallowedProtocols.includes(protocol)) {
                            return false
                        }
                        const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

                        if (!allowedProtocols.includes(protocol)) {
                            return false
                        }
                        const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                        const domain = parsedUrl.hostname

                        if (disallowedDomains.includes(domain)) {
                            return false
                        }
                        return true
                    } catch {
                        return false
                    }
                },
                shouldAutoLink: url => {
                    try {
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)
                        const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                        const domain = parsedUrl.hostname

                        return !disallowedDomains.includes(domain)
                    } catch {
                        return false
                    }
                },

            }),
            Highlight.configure({ multicolor: true }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Image,
            Youtube.configure({
                inline: false,
                width: 640,
                height: 480,
                controls: true,
                nocookie: true,
                HTMLAttributes: {
                    class: 'embedded-youtube',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image', 'youtube'],
                alignments: ['left', 'center', 'right'],
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: 'inline-list',
                },
                itemTypeName: 'listItem',
                keepMarks: true,
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'inline-list',
                },
                keepMarks: true,
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: 'inline-task-list',
                },
            }),
            ListItem.configure({
                HTMLAttributes: {
                    class: 'inline-item',
                },
            }),
            TaskItem.configure({
                HTMLAttributes: {
                    class: 'inline-task-item',
                },
                nested: true,
            }),
            ListKeymap,
        ],
        content: currentDocument?.content || '',
        onUpdate: ({ editor }) => {
            updateDocument({ content: editor.getHTML() })
        },
        editorProps: {
            attributes: {
                class: "outline-none",
            },
            handleDOMEvents: {
                focus: () => {
                    setIsEditorFocused(true)
                    return false
                },
                blur: () => {
                    setIsEditorFocused(false)
                    return false
                }
            }
        },
        immediatelyRender: false
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
                setIsEditorFocused(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])


    useEffect(() => {
        setTitle(currentDocument?.title || '')
    }, [currentDocument])
    useEffect(() => {
        if (editor && currentDocument) {
            editor.commands.setContent(currentDocument.content || '', false);
        }
    }, [currentDocument?.id]);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (title !== currentDocument?.title) {
                if (currentDocument) {
                    updateDocument({ title });
                } else if (title.trim()) {
                    saveDocument(title);
                }
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [title, currentDocument, updateDocument, saveDocument])
    return (
        <>
            <ToolBar editor={editor} />
            <div className="flex h-[calc(100vh-4rem)]">
                <div className="flex-1 overflow-auto p-4">
                    <div className="max-w-screen prose prose-violet tiptap">
                        <div className="mb-4">
                            <textarea
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={() => {
                                    if (title.trim() && !currentDocument) {
                                        saveDocument(title);
                                    } else if (currentDocument && title !== currentDocument.title) {
                                        updateDocument({ title });
                                    }
                                }}
                                placeholder="Digite o título aqui"
                                className="w-full bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground text-foreground resize-none overflow-hidden border-b pb-2 focus:border-primary transition-colors"
                                style={{ minHeight: '60px', height: 'auto' }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                                rows={1}
                            />
                        </div>
                        <div
                            ref={editorRef}
                            className={`min-h-[100vh] border rounded-lg p-4 transition-colors ${isEditorFocused
                                ? 'border-primary ring-primary/20'
                                : 'border-border hover:border-border/80'
                                }`}
                        >
                            <EditorContent
                                editor={editor}
                                className="outline-none"
                            />
                        </div>
                        {editor && <MenuFloating editor={editor} />}
                        {editor && <MenuBubble editor={editor} />}
                    </div>
                </div>
            </div>
        </>
    );
}