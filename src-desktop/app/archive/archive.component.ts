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
    const dateLabel = this.futureDateLabel(todo.date);
    if (todo.endTime && todo.endTime !== todo.time) {
      const range = `${start} - ${this.settings.formatTime(todo.endTime)}`;
      return dateLabel ? `${dateLabel} · ${range}` : range;
    }
    return dateLabel ? `${dateLabel} · ${start}` : start;
  }

  private futureDateLabel(dateStr: string): string {
    const date = this.parseTodoDate(dateStr);
    if (!date || !this.isMoreThanWeekAway(date)) {
      return '';
    }
    return date.toLocaleDateString(this.settings.locale(), {
      day: '2-digit',
      month: '2-digit'
    });
  }

  private parseTodoDate(dateStr: string): Date | null {
    if (!dateStr) {
      return null;
    }
    const value = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(value.getTime())) {
      return null;
    }
    return value;
  }

  private isMoreThanWeekAway(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 7;
  }
}
