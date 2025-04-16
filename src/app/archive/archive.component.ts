import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser, NgClass, NgForOf} from '@angular/common';
import { Todo } from '../todo/todo.component';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  imports: [
    NgClass,
    NgForOf
  ]
})
export class ArchiveComponent implements OnInit {
  archivedTodos: Todo[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem('todos');
      const allTodos: Todo[] = raw ? JSON.parse(raw) : [];
      this.archivedTodos = allTodos.filter(todo => todo.archived);
    }
  }

  clearArchive() {
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem('todos');
      let all: Todo[] = raw ? JSON.parse(raw) : [];
      all = all.filter(todo => !todo.archived);
      localStorage.setItem('todos', JSON.stringify(all));
      this.archivedTodos = [];
    }
  }

  getWeekday(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'low': return 'low.png';
      case 'medium': return 'medium.png';
      case 'high': return 'high.png';
      default: return '';
    }
  }
}
