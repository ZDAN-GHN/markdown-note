import { useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewRef.current) return;

    const renderMarkdown = () => {
      const html = marked.parse(content);
      const cleanHtml = DOMPurify.sanitize(html as string, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 'del', 'code', 'pre',
          'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'a', 'img', 'table', 'thead', 'tbody',
          'tr', 'th', 'td', 'span', 'div', 'hr', 'input', 'label'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'type', 'checked', 'disabled'],
      });
      
      if (previewRef.current) {
        previewRef.current.innerHTML = cleanHtml;
      }
    };

    renderMarkdown();
  }, [content]);

  return (
    <div className="h-full w-full overflow-auto">
      <div
        ref={previewRef}
        className="markdown-preview p-6 text-geek-text font-mono text-sm leading-relaxed"
        style={{
          backgroundColor: '#1a1a1a',
          minHeight: '100%',
        }}
      >
        <style>{`
          .markdown-preview h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 1.5em 0 0.5em 0;
            color: #39ff14;
            border-bottom: 1px solid #333;
            padding-bottom: 0.3em;
          }
          .markdown-preview h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 1.5em 0 0.5em 0;
            color: #39ff14;
            border-bottom: 1px solid #333;
            padding-bottom: 0.3em;
          }
          .markdown-preview h3 {
            font-size: 1.25em;
            font-weight: bold;
            margin: 1.5em 0 0.5em 0;
            color: #39ff14;
          }
          .markdown-preview h4 {
            font-size: 1em;
            font-weight: bold;
            margin: 1.5em 0 0.5em 0;
            color: #39ff14;
          }
          .markdown-preview p {
            margin: 1em 0;
            line-height: 1.6;
          }
          .markdown-preview code {
            background-color: #1a1a1a;
            color: #39ff14;
            padding: 0.2em 0.4em;
            border-radius: 0;
            font-family: 'Fira Code', 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
          }
          .markdown-preview pre {
            background-color: #1a1a1a;
            border: 1px solid #333;
            padding: 1em;
            overflow-x: auto;
            margin: 1em 0;
          }
          .markdown-preview pre code {
            background-color: transparent;
            padding: 0;
            color: #c0c0c0;
          }
          .markdown-preview blockquote {
            border-left: 4px solid #39ff14;
            padding-left: 1em;
            margin: 1em 0;
            color: #666;
            background-color: #1a1a1a;
            padding: 0.5em 1em;
          }
          .markdown-preview ul, .markdown-preview ol {
            margin: 1em 0;
            padding-left: 2em;
          }
          .markdown-preview li {
            margin: 0.5em 0;
          }
          .markdown-preview ul li::marker {
            color: #39ff14;
          }
          .markdown-preview ol li::marker {
            color: #39ff14;
          }
          .markdown-preview a {
            color: #39ff14;
            text-decoration: none;
            border-bottom: 1px solid #39ff14;
          }
          .markdown-preview a:hover {
            background-color: #39ff14;
            color: #0a0a0a;
          }
          .markdown-preview table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
            border: 1px solid #333;
          }
          .markdown-preview th, .markdown-preview td {
            border: 1px solid #333;
            padding: 0.5em 1em;
            text-align: left;
          }
          .markdown-preview th {
            background-color: #1a1a1a;
            color: #39ff14;
            font-weight: bold;
          }
          .markdown-preview hr {
            border: none;
            border-top: 1px solid #333;
            margin: 2em 0;
          }
          .markdown-preview img {
            max-width: 100%;
            height: auto;
            border: 1px solid #333;
          }
          .markdown-preview strong {
            color: #39ff14;
            font-weight: bold;
          }
          .markdown-preview em {
            color: #c0c0c0;
            font-style: italic;
          }
        `}</style>
      </div>
    </div>
  );
}
