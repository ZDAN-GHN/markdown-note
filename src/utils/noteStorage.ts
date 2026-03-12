import type { Note, NoteStorage } from '../types/note';

const STORAGE_KEY = 'geek-markdown-notes';

const DEFAULT_STORAGE: NoteStorage = {
  notes: [],
  currentNoteId: null,
};

export const noteStorage = {
  get(): NoteStorage {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return DEFAULT_STORAGE;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load notes from localStorage:', error);
      return DEFAULT_STORAGE;
    }
  },

  save(storage: NoteStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error('Failed to save notes to localStorage:', error);
    }
  },

  createNote(title: string): Note {
    const now = Date.now();
    return {
      id: `note-${now}-${Math.random().toString(36).substr(2, 9)}`,
      title: title || '未命名笔记',
      content: '',
      createdAt: now,
      updatedAt: now,
      tags: [],
    };
  },

  updateNote(note: Note): void {
    const storage = this.get();
    const index = storage.notes.findIndex((n) => n.id === note.id);
    if (index !== -1) {
      storage.notes[index] = {
        ...note,
        updatedAt: Date.now(),
      };
      this.save(storage);
    }
  },

  deleteNote(noteId: string): void {
    const storage = this.get();
    storage.notes = storage.notes.filter((n) => n.id !== noteId);
    if (storage.currentNoteId === noteId) {
      storage.currentNoteId = null;
    }
    this.save(storage);
  },

  setCurrentNote(noteId: string | null): void {
    const storage = this.get();
    storage.currentNoteId = noteId;
    this.save(storage);
  },

  getCurrentNote(): Note | null {
    const storage = this.get();
    if (!storage.currentNoteId) {
      return null;
    }
    return storage.notes.find((n) => n.id === storage.currentNoteId) || null;
  },

  searchNotes(query: string): Note[] {
    const storage = this.get();
    if (!query.trim()) {
      return storage.notes;
    }
    const lowerQuery = query.toLowerCase();
    return storage.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery)
    );
  },

  getAllNotes(): Note[] {
    return this.get().notes;
  },
};
