export interface Message {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageInput {
  title: string;
  content: string;
}

