import { useEffect, useRef } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, drawSelection, dropCursor } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { bracketMatching, indentOnInput, foldGutter } from '@codemirror/language';
import { autocompletion } from '@codemirror/autocomplete';
import { highlightSelectionMatches } from '@codemirror/search';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const isInitializedRef = useRef(false);
  const isInternalChangeRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        autocompletion(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        highlightSelectionMatches(),
        EditorView.theme({
          '&': {
            backgroundColor: '#1a1a1a',
            color: '#c0c0c0',
            fontSize: '14px',
            fontFamily: '"Fira Code", "Monaco", "Courier New", monospace',
          },
          '&.cm-editor': {
            height: '100%',
          },
          '.cm-scroller': {
            fontFamily: '"Fira Code", "Monaco", "Courier New", monospace',
            overflow: 'auto',
          },
          '.cm-content': {
            padding: '16px',
            fontFamily: '"Fira Code", "Monaco", "Courier New", monospace',
          },
          '.cm-gutters': {
            backgroundColor: '#1a1a1a',
            color: '#666666',
            border: 'none',
            borderRight: '1px solid #333333',
          },
          '.cm-activeLineGutter': {
            backgroundColor: '#1a1a1a',
            color: '#39ff14',
          },
          '.cm-activeLine': {
            backgroundColor: '#1a1a1a',
          },
          '.cm-lineNumbers': {
            color: '#666666',
          },
          '.cm-lineNumbers .cm-gutterElement': {
            color: '#666666',
          },
          '.cm-cursor': {
            borderLeftColor: '#39ff14',
          },
          '.cm-selectionBackground': {
            backgroundColor: '#39ff1433',
          },
          '.cm-focused': {
            outline: 'none',
          },
          '.cm-matchingBracket': {
            color: '#39ff14',
            fontWeight: 'bold',
          },
          '.cm-nonmatchingBracket': {
            color: '#ff0000',
          },
        }),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !isInternalChangeRef.current) {
            onChange(update.state.doc.toString());
          }
          isInternalChangeRef.current = false;
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;
    isInitializedRef.current = true;

    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isInitializedRef.current || !viewRef.current) return;
    
    const currentValue = viewRef.current.state.doc.toString();
    if (value !== currentValue) {
      requestAnimationFrame(() => {
        if (!viewRef.current) return;
        
        isInternalChangeRef.current = true;
        const transaction = viewRef.current.state.update({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: value,
          },
        });
        viewRef.current.dispatch(transaction);
      });
    }
  }, [value]);

  return (
    <div className="h-full w-full border-r border-geek-border">
      <div ref={editorRef} className="h-full" />
    </div>
  );
}
