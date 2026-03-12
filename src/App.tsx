import { useState } from 'react'
import MarkdownEditor from './components/MarkdownEditor'
import MarkdownPreview from './components/MarkdownPreview'

const DEFAULT_CONTENT = `# 极客风格 Markdown 编辑器

欢迎使用极客风格的 Markdown 编辑器！

## 功能特性

- **实时预览**: 左侧编辑，右侧实时预览
- **极客风格**: 深色背景，荧光绿高亮
- **代码高亮**: 支持代码块语法高亮
- **行号显示**: 编辑器显示行号
- **响应式布局**: 适配不同屏幕尺寸

## 代码示例

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('Geek'));
\`\`\`

## 表格示例

| 特性 | 状态 |
|------|------|
| 编辑器 | ✅ |
| 预览 | ✅ |
| 存储 | 🚧 |

## 列表示例

- 第一项
- 第二项
  - 子项 1
  - 子项 2
- 第三项

## 引用示例

> 这是一个引用块
> 可以包含多行内容

---

开始你的创作吧！
`

function App() {
  const [content, setContent] = useState(DEFAULT_CONTENT)

  return (
    <div className="h-screen w-screen bg-geek-bg flex flex-col">
      <header className="h-12 border-b border-geek-border flex items-center px-4 bg-geek-bg">
        <h1 className="text-geek-highlight font-mono text-lg font-bold">
          &lt;GeekMarkdown /&gt;
        </h1>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 h-full border-r border-geek-border flex flex-col">
          <div className="h-8 border-b border-geek-border flex items-center px-4 bg-geek-bg">
            <span className="text-geek-muted font-mono text-sm">EDITOR</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <MarkdownEditor value={content} onChange={setContent} />
          </div>
        </div>
        
        <div className="flex-1 h-full flex flex-col">
          <div className="h-8 border-b border-geek-border flex items-center px-4 bg-geek-bg">
            <span className="text-geek-muted font-mono text-sm">PREVIEW</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <MarkdownPreview content={content} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
