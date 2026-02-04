import {Component, OnInit} from '@angular/core';
import {TodoService} from '../todo/todo.service';
import {Todo} from '../todo/todo.model';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-archive',
  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './archive.component.html'
})
export class ArchiveComponent implements OnInit {
  archivedTodos: Todo[] = [];

  constructor(public todoService: TodoService) {
  }

  ngOnInit(): void {
    this.archivedTodos = this.todoService.getArchived();

  }

  clearArchive(): void {
    this.todoService.clearArchive();
    this.archivedTodos = this.todoService.getArchived();
  }

  getWeekday(dateStr: string): string {
    return this.todoService.getWeekday(dateStr);
  }

  getPriorityIcon(priority: string): string {
    return this.todoService.getPriorityIcon(priority);
  }
}
