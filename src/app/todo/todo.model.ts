export type Priority = 'low' | 'medium' | 'high';
export type Status = 'open' | 'in-progress' | 'done';

export interface Todo {
  id: string;
  description: string;
  date: string;
  priority: Priority;
  status: Status;
  archived: boolean;
}
