import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser, NgForOf} from '@angular/common';
import { Todo } from '../todo/todo.component';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  imports: [
    NgForOf
  ]
})
export class ArchiveComponent {
  archivedTodos: Todo[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem('todos');
      const all: Todo[] = raw ? JSON.parse(raw) : [];
      this.archivedTodos = all.filter(todo => todo.archived);
    }
  }
}
