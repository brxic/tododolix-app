import {Injectable, inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Todo, Status} from './todo.model';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TodoService {
  private createRequest$ = new Subject<void>();
  private todos: Todo[] = [];
  private readonly STORAGE_KEY = 'todos';
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.loadTodos();
  }

  getAll(): Todo[] {
    return this.todos;
  }

  triggerCreate(): void {
    this.createRequest$.next();
  }
  onCreateRequest() {
    return this.createRequest$.asObservable();
  }

  getActive(): Todo[] {
    return this.todos.filter(t => !t.archived && t.status !== 'done');
  }

  getArchived(): Todo[] {
    return this.todos.filter(t => t.archived);
  }

  getWeekday(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {weekday: 'short'}).toUpperCase();
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'low':
        return 'low.png';
      case 'medium':
        return 'medium.png';
      case 'high':
        return 'high.png';
      default:
        return '';
    }
  }

  getActiveCount(): number {
    return this.todos.filter(t => !t.archived && t.status !== 'done').length;
  }

  add(todo: Todo): void {
    this.todos.push(todo);
    this.saveTodos();
  }

  update(updated: Todo): void {
    this.todos = this.todos.map(t => t.id === updated.id ? updated : t);
    this.saveTodos();
  }

  archive(todo: Todo): void {
    todo.archived = true;
    this.saveTodos();
  }

  clearArchive(): void {
    this.todos = this.todos.filter(t => !t.archived);
    this.saveTodos();
  }

  cycleStatus(todo: Todo): void {
    const next: Record<Status, Status> = {open: 'in-progress', 'in-progress': 'done', done: 'open'};
    todo.status = next[todo.status];
    if (todo.status === 'done') {
      todo.archived = true;
    }
    this.saveTodos();
  }

  private saveTodos(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
    }
  }

  private loadTodos(): void {
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      this.todos = raw ? JSON.parse(raw) : [];
    }
  }
}
