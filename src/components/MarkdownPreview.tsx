import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import CodeBlock from './CodeBlock';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="h-full w-full overflow-auto">
      <div className="markdown-preview p-4 text-geek-text font-mono text-sm" style={{ backgroundColor: '#1a1a1a', minHeight: '100%', lineHeight: '1.4' }}>
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
            margin: 0 0 1em 0;
            line-height: 1.4;
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
            padding: 0;
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
            color: #c0c0c0 !important;
            font-size: 1.1em !important;
            font-weight: bold !important;
          }
          .markdown-preview ol li::marker {
            color: #c0c0c0 !important;
            font-size: 1.1em !important;
            font-weight: bold !important;
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
            color: #c0c0c0;
            font-weight: bold;
          }
          .markdown-preview em {
            color: #c0c0c0;
            font-style: italic;
          }
        `}</style>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            ul({ children, ...props }) {
              return (
                <ul {...props} style={{ listStyleType: 'disc', listStylePosition: 'inside' }}>
                  {children}
                </ul>
              );
            },
            ol({ children, ...props }) {
              return (
                <ol {...props} style={{ listStyleType: 'decimal', listStylePosition: 'inside' }}>
                  {children}
                </ol>
              );
            },
            li({ children, ...props }) {
              return (
                <li {...props} style={{ color: '#c0c0c0', fontSize: '1.1em', fontWeight: 'normal' }}>
                  {children}
                </li>
              );
            },
            code({ node, className, children, ...props }) {
              const inline = (props as any).inline;
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : 'text';
              
              if (!inline && match) {
                return <CodeBlock language={language}>{String(children).replace(/\n$/, '')}</CodeBlock>;
              }
              
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
