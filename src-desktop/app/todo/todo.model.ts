export type Priority = 'low' | 'medium' | 'high';
export type TodoColor = 'yellow' | 'green' | 'blue';
export type Status = 'open' | 'in-progress' | 'done';

export interface Todo {
  id: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  priority: Priority;
  status: Status;
  archived: boolean;
  color: TodoColor;
  order: number;
}
