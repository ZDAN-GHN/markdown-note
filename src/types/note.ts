export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface NoteStorage {
  notes: Note[];
  currentNoteId: string | null;
}
