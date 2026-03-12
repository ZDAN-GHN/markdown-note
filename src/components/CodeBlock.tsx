import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  children: string;
}

export default function CodeBlock({ language, children }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      customStyle={{
        backgroundColor: '#1a1a1a',
        borderRadius: '0',
        fontSize: '14px',
        fontFamily: '"Fira Code", "Monaco", "Courier New", monospace',
        padding: '16px',
        margin: '1em 0',
      }}
      codeTagProps={{
        style: {
          fontFamily: '"Fira Code", "Monaco", "Courier New", monospace',
          fontSize: '14px',
        },
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
}
