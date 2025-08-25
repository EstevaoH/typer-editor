import { EditorOptions } from '@tiptap/core';

export interface CustomEditorOptions extends Partial<EditorOptions> {
  immediatelyRender?: boolean;
}

export interface EditorConfig {
  extensions: any[];
  content: string;
  onUpdate?: (props: { editor: any }) => void;
  onBlur?: (props: { editor: any }) => void;
  editorProps?: any;
  immediatelyRender?: boolean;
}