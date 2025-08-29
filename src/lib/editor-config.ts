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
import { Placeholder } from '@tiptap/extensions'
import SearchNReplace from '@sereneinserenade/tiptap-search-and-replace';

const limit = 42400;
const lowlight = createLowlight(all);

lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

export const editorExtensions: any[] = [
  StarterKit.configure({
    document: false
  }),
  Placeholder.configure({
    placeholder: 'Começe a escrever por aqui...',
  }),
  SearchNReplace.configure({
    searchResultClass: 'search-result',
    // : 'search-result-current',
    disableRegex: false, // also no need to explain
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
        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`);
        if (!ctx.defaultValidate(parsedUrl.href)) {
          return false;
        }
        const disallowedProtocols = ['ftp', 'file', 'mailto'];
        const protocol = parsedUrl.protocol.replace(':', '');

        if (disallowedProtocols.includes(protocol)) {
          return false;
        }
        const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme));

        if (!allowedProtocols.includes(protocol)) {
          return false;
        }
        const disallowedDomains = ['example-phishing.com', 'malicious-site.net'];
        const domain = parsedUrl.hostname;

        if (disallowedDomains.includes(domain)) {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    },
    shouldAutoLink: url => {
      try {
        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`);
        const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com'];
        const domain = parsedUrl.hostname;

        return !disallowedDomains.includes(domain);
      } catch {
        return false;
      }
    },
  }),
  Highlight.configure({
    multicolor: true, HTMLAttributes: {
      class: 'search-highlight',
    }
  },),
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
];

export const editorProps = {
  attributes: {
    class: "outline-none",
  },
  handleDOMEvents: {
    focus: () => {
      return false;
    },
    blur: () => {
      return false;
    }
  }
};