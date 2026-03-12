import { useState } from 'react'
import MarkdownEditor from './components/MarkdownEditor'
import MarkdownPreview from './components/MarkdownPreview'
import NoteList from './components/NoteList'
import { NoteProvider, useNotes } from './contexts/NoteContext'

const DEFAULT_CONTENT = `# 极客风格 Markdown 编辑器

欢迎使用极客风格的 Markdown 编辑器！

## 功能特性

- 实时预览: 左侧编辑，右侧实时预览
- 极客风格: 深色背景，荧光绿高亮
- 代码高亮: 支持多种编程语言语法高亮
- 行号显示: 编辑器显示行号
- 响应式布局: 适配不同屏幕尺寸

## 代码示例

### JavaScript

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

const result = greet('Geek');
console.log(result);
\`\`\`

### Python

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

result = greet("Geek")
print(result)
\`\`\`

### Java

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        String name = "Geek";
        System.out.println("Hello, " + name + "!");
    }
}
\`\`\`

### TypeScript

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(user: User): User {
  return {
    ...user,
    id: Date.now()
  };
}
\`\`\`

### CSS

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1a1a;
  color: #39ff14;
}
\`\`\`

## 表格示例

| 特性 | 状态 |
|------|------|
| 编辑器 | ✅ |
| 预览 | ✅ |
| 代码高亮 | ✅ |
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

function AppContent() {
  const { currentNote, updateNote, createNote } = useNotes()
  const [content, setContent] = useState(DEFAULT_CONTENT)

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    if (currentNote) {
      updateNote({
        ...currentNote,
        content: newContent,
      })
    }
  }

  const handleCreateFirstNote = () => {
    const note = createNote('我的第一条笔记')
    updateNote({
      ...note,
      content: DEFAULT_CONTENT,
    })
  }

  return (
    <div className="h-screen w-screen bg-geek-bg flex flex-col">
      <header className="h-12 border-b border-geek-border flex items-center px-4 bg-geek-bg">
        <h1 className="text-geek-highlight font-mono text-lg font-bold">
          &lt;GeekMarkdown /&gt;
        </h1>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-64 h-full border-r border-geek-border flex flex-col flex-shrink-0">
          <div className="h-8 border-b border-geek-border flex items-center px-4 bg-geek-bg">
            <span className="text-geek-muted font-mono text-sm">NOTES</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <NoteList />
          </div>
        </div>
        
        <div className="flex-1 h-full border-r border-geek-border flex flex-col min-w-0">
          <div className="h-8 border-b border-geek-border flex items-center px-4 bg-geek-bg">
            <span className="text-geek-muted font-mono text-sm">EDITOR</span>
          </div>
          <div className="flex-1 overflow-hidden">
            {currentNote ? (
              <MarkdownEditor value={currentNote.content} onChange={handleContentChange} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-geek-muted font-mono">
                <p className="mb-4">选择一条笔记开始编辑</p>
                <button
                  onClick={handleCreateFirstNote}
                  className="px-4 py-2 bg-geek-highlight text-geek-bg font-mono text-sm font-bold hover:bg-geek-highlight-hover transition-colors"
                >
                  创建第一条笔记
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 h-full flex flex-col min-w-0">
          <div className="h-8 border-b border-geek-border flex items-center px-4 bg-geek-bg">
            <span className="text-geek-muted font-mono text-sm">PREVIEW</span>
          </div>
          <div className="flex-1 overflow-hidden">
            {currentNote ? (
              <MarkdownPreview content={currentNote.content} />
            ) : (
              <div className="h-full flex items-center justify-center text-geek-muted font-mono">
                <p>选择一条笔记查看预览</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <NoteProvider>
      <AppContent />
    </NoteProvider>
  )
}

export default App
