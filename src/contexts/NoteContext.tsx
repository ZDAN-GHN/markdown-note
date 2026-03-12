import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Note } from '../types/note';
import { noteStorage } from '../utils/noteStorage';

interface NoteContextType {
  notes: Note[];
  currentNote: Note | null;
  searchQuery: string;
  filteredNotes: Note[];
  createNote: (title: string) => Note;
  updateNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  selectNote: (noteId: string | null) => void;
  setSearchQuery: (query: string) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storage = noteStorage.get();
    setNotes(storage.notes);
    const current = storage.currentNoteId
      ? storage.notes.find((n) => n.id === storage.currentNoteId) || null
      : null;
    setCurrentNote(current);
  }, []);

  const createNote = useCallback((title: string) => {
    const newNote = noteStorage.createNote(title);
    const storage = noteStorage.get();
    storage.notes.unshift(newNote);
    noteStorage.save(storage);
    setNotes(storage.notes);
    return newNote;
  }, []);

  const updateNote = useCallback((note: Note) => {
    noteStorage.updateNote(note);
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n.id === note.id ? { ...note, updatedAt: Date.now() } : n))
    );
    if (currentNote?.id === note.id) {
      setCurrentNote({ ...note, updatedAt: Date.now() });
    }
  }, [currentNote]);

  const deleteNote = useCallback((noteId: string) => {
    noteStorage.deleteNote(noteId);
    setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteId));
    if (currentNote?.id === noteId) {
      setCurrentNote(null);
    }
  }, [currentNote]);

  const selectNote = useCallback((noteId: string | null) => {
    noteStorage.setCurrentNote(noteId);
    const note = noteId ? notes.find((n) => n.id === noteId) || null : null;
    setCurrentNote(note);
  }, [notes]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <NoteContext.Provider
      value={{
        notes,
        currentNote,
        searchQuery,
        filteredNotes,
        createNote,
        updateNote,
        deleteNote,
        selectNote,
        setSearchQuery,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
}
