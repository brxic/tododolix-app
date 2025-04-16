import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {DatePipe, isPlatformBrowser, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

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

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  imports: [
    NgClass,
    NgForOf,
    FormsModule,
    NgIf
  ]
})
export class TodoComponent {
  todos: Todo[] = [];
  showForm = false;
  isEditMode = false;
  formTodo: Todo = this.createEmptyTodo();
  todoToDelete: Todo | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTodos();
      this.saveTodos();
    }
  }

  createEmptyTodo(): Todo {
    return {
      id: '',
      description: '',
      date: '',
      priority: 'low',
      status: 'open',
      archived: false,
    };
  }

  getPriorityIcon(priority: Priority): string {
    switch (priority) {
      case 'low': return 'low.png';
      case 'medium': return 'medium.png';
      case 'high': return 'high.png';
      default: return '';
    }
  }

  getWeekday(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  cycleStatus(todo: Todo) {
    const nextStatus: Record<Status, Status> = {
      'open': 'in-progress',
      'in-progress': 'done',
      'done': 'open'
    };
    todo.status = nextStatus[todo.status];

    if (todo.status === 'done') {
      todo.archived = true;
    }

    this.saveTodos();
  }

  openCreateForm() {
    this.formTodo = this.createEmptyTodo();
    this.isEditMode = false;
    this.showForm = true;
    this.saveTodos();
  }

  editTodo(todo: Todo) {
    this.formTodo = { ...todo };
    this.isEditMode = true;
    this.showForm = true;
    this.saveTodos();
  }

  saveTodo() {
    if (this.isEditMode) {
      this.todos = this.todos.map(t => t.id === this.formTodo.id ? { ...this.formTodo } : t);
    } else {
      this.formTodo.id = crypto.randomUUID();
      this.todos.push({ ...this.formTodo });
    }
    this.cancelForm();
    this.saveTodos();
  }

  cancelForm() {
    this.showForm = false;
    this.formTodo = this.createEmptyTodo();
    this.isEditMode = false;
    this.saveTodos();
  }

  confirmDelete(todo: Todo) {
    this.todoToDelete = todo;
    this.saveTodos();
  }

  cancelDelete() {
    this.todoToDelete = null;
    this.saveTodos();
  }

  archiveTodo(todo: Todo): void {
    todo.archived = true;
    this.saveTodos();
  }

  loadTodos() {
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem('todos');
      this.todos = raw ? JSON.parse(raw).filter((t: Todo) => !t.archived) : [];
      this.saveTodos();
    }
  }

  saveTodos() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  }
}
