import { useState, useRef, useEffect } from 'react';
import { useNotes } from '../contexts/NoteContext';
import ContextMenu from './ContextMenu';

export default function NoteList() {
  const { filteredNotes, currentNote, selectNote, createNote, deleteNote, updateNote, setSearchQuery, searchQuery } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, noteId: '' });
  const [renamingNoteId, setRenamingNoteId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    if (renamingNoteId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingNoteId]);

  const handleCreateNote = () => {
    if (!newTitle.trim()) return;
    const note = createNote(newTitle.trim());
    setNewTitle('');
    setIsCreating(false);
    selectNote(note.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateNote();
    }
  };

  const handleBlur = () => {
    if (newTitle.trim()) {
      handleCreateNote();
    } else {
      setNewTitle('');
      setIsCreating(false);
    }
  };

  const handleDeleteNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这条笔记吗？')) {
      deleteNote(noteId);
      setContextMenu({ visible: false, x: 0, y: 0, noteId: '' });
    }
  };

  const handleContextMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      noteId,
    });
  };

  const handleRename = () => {
    const note = filteredNotes.find((n) => n.id === contextMenu.noteId);
    if (note) {
      setRenamingNoteId(note.id);
      setRenamingTitle(note.title);
    }
    setContextMenu({ visible: false, x: 0, y: 0, noteId: '' });
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, noteId: string) => {
    if (e.key === 'Enter') {
      handleRenameConfirm(noteId);
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  const handleRenameConfirm = (noteId: string) => {
    if (renamingTitle.trim()) {
      const note = filteredNotes.find((n) => n.id === noteId);
      if (note) {
        updateNote({
          ...note,
          title: renamingTitle.trim(),
        });
      }
    }
    setRenamingNoteId(null);
    setRenamingTitle('');
  };

  const handleRenameBlur = (noteId: string) => {
    handleRenameConfirm(noteId);
  };

  const handleRenameCancel = () => {
    setRenamingNoteId(null);
    setRenamingTitle('');
  };

  const sortedNotes = [...filteredNotes].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="h-full flex flex-col bg-geek-bg">
      <div className="p-3 border-b border-geek-border">
        <input
          type="text"
          placeholder="搜索笔记..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 px-3 bg-geek-input border border-geek-border text-geek-text font-mono text-sm placeholder-geek-muted focus:outline-none focus:border-geek-highlight"
        />
      </div>

      {isCreating && (
        <div className="p-3 border-b border-geek-border">
          <input
            ref={inputRef}
            type="text"
            placeholder="输入笔记标题..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full py-2 px-3 bg-geek-input border border-geek-highlight text-geek-text font-mono text-sm placeholder-geek-muted focus:outline-none"
            autoFocus
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {sortedNotes.length === 0 ? (
          <div className="p-4 text-center text-geek-muted font-mono text-sm">
            {searchQuery ? '没有找到匹配的笔记' : '暂无笔记，点击下方按钮创建'}
          </div>
        ) : (
          <ul className="divide-y divide-geek-border">
            {sortedNotes.map((note) => (
              <li
                key={note.id}
                onClick={() => selectNote(note.id)}
                onContextMenu={(e) => handleContextMenu(e, note.id)}
                className={`group relative py-3 px-4 cursor-pointer hover:bg-geek-hover transition-colors ${
                  currentNote?.id === note.id ? 'bg-geek-active' : ''
                }`}
              >
                {renamingNoteId === note.id ? (
                  <input
                    ref={renameInputRef}
                    type="text"
                    value={renamingTitle}
                    onChange={(e) => setRenamingTitle(e.target.value)}
                    onKeyDown={(e) => handleRenameKeyDown(e, note.id)}
                    onBlur={() => handleRenameBlur(note.id)}
                    className="w-full py-1 px-2 bg-geek-input border border-geek-highlight text-geek-text font-mono text-sm focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="flex-1 truncate font-mono text-sm text-geek-text">
                        {note.title || '未命名笔记'}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-geek-muted font-mono">
                      {new Date(note.updatedAt).toLocaleString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 border-t border-geek-border">
        <button
          onClick={() => setIsCreating(true)}
          className="w-full py-2 px-4 bg-geek-highlight text-geek-bg font-mono text-sm font-bold hover:bg-geek-highlight-hover transition-colors"
        >
          + 新建笔记
        </button>
      </div>

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        onClose={() => setContextMenu({ visible: false, x: 0, y: 0, noteId: '' })}
      >
        <button
          onClick={handleRename}
          className="w-full text-left px-4 py-2 text-geek-text font-mono text-sm hover:bg-geek-hover transition-colors"
        >
          重命名
        </button>
        <button
          onClick={(e) => handleDeleteNote(e, contextMenu.noteId)}
          className="w-full text-left px-4 py-2 text-red-400 font-mono text-sm hover:bg-geek-hover transition-colors"
        >
          删除
        </button>
      </ContextMenu>
    </div>
  );
}
