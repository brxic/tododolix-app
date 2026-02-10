import {Component, OnInit} from '@angular/core';
import {TodoService} from '../todo/todo.service';
import {Todo} from '../todo/todo.model';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {SettingsService} from '../settings/settings.service';

@Component({
  selector: 'app-archive',
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './archive.component.html'
})
export class ArchiveComponent implements OnInit {
  archivedTodos: Todo[] = [];

  constructor(
    public todoService: TodoService,
    public settings: SettingsService
  ) {}

  ngOnInit(): void {
    this.archivedTodos = this.todoService.getArchived();
  }

  clearArchive(): void {
    this.todoService.clearArchive();
    this.archivedTodos = this.todoService.getArchived();
  }

  restoreTodo(todo: Todo): void {
    this.todoService.restore(todo);
    this.archivedTodos = this.todoService.getArchived();
  }

  getWeekday(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(this.settings.locale(), {weekday: 'short'}).toUpperCase();
  }

  getTimeLabel(todo: Todo): string {
    if (!todo.time) {
      return '';
    }
    const start = this.settings.formatTime(todo.time);
    if (todo.endTime && todo.endTime !== todo.time) {
      return `${start} - ${this.settings.formatTime(todo.endTime)}`;
    }
    return start;
  }
}
