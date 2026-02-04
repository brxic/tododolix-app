import {Component, OnDestroy, OnInit} from '@angular/core';
import { Todo, Priority } from './todo.model'; // falls du das ausgelagert hast
import { TodoService } from './todo.service';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { Router } from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgClass,
    NgForOf
  ]
})
export class TodoComponent implements OnInit, OnDestroy{
  showForm = false;
  isEditMode = false;
  useTimeRange = false;
  formTodo: Todo = this.createEmptyTodo();
  todoToDelete: Todo | null = null;
  draggedTodoId: string | null = null;
  private createSub!: Subscription;

  constructor(public todoService: TodoService, private router: Router) {}

  ngOnInit(): void {
    this.createSub = this.todoService.onCreateRequest().subscribe(() => {
      console.log('onCreateRequest');
      this.openCreateForm();
    });
  }

  get isStartPage(): boolean {
    return this.router.url ==='/';
  }

  createEmptyTodo(): Todo {
    return {
      id: '',
      description: '',
      date: '',
      time: '',
      endTime: '',
      priority: 'low',
      status: 'open',
      archived: false,
      color: 'yellow',
      order: 0,
    };
  }

  openCreateForm() {
    this.formTodo = this.createEmptyTodo();
    this.isEditMode = false;
    console.log('openCreateForm');
    this.showForm = true;
  }

  editTodo(todo: Todo) {
    this.formTodo = { ...todo };
    this.useTimeRange = !!(todo.endTime && todo.endTime !== todo.time);
    this.isEditMode = true;
    this.showForm = true;
  }

  saveTodo() {
    this.todoService.ensureNotificationPermission();
    if (!this.useTimeRange) {
      this.formTodo.endTime = '';
    }
    if (this.isEditMode) {
      this.todoService.update(this.formTodo);
    } else {
      this.formTodo.id = Date.now().toString() + Math.random().toString(36).substring(2, 8);
      this.formTodo.order = this.todoService.getActiveCount();
      this.todoService.add(this.formTodo);
    }
    this.cancelForm();
  }

  cancelForm() {
    this.formTodo = this.createEmptyTodo();
    this.useTimeRange = false;
    this.showForm = false;
    this.isEditMode = false;
  }

  confirmDelete(todo: Todo) {
    this.todoToDelete = todo;
  }

  cancelDelete() {
    this.todoToDelete = null;
  }

  archiveTodo(todo: Todo): void {
    this.todoService.archive(todo);
    this.todoToDelete = null;
  }

  cycleStatus(todo: Todo) {
    this.todoService.cycleStatus(todo);
  }

  getActiveTodos(): Todo[] {
    return this.todoService.getActive();
  }

  getWeekday(dateStr: string): string {
    return this.todoService.getWeekday(dateStr);
  }

  getPriorityIcon(priority: Priority): string {
    return this.todoService.getPriorityIcon(priority);
  }

  getTimeLabel(todo: Todo): string {
    if (!todo.time) {
      return '';
    }
    if (todo.endTime && todo.endTime !== todo.time) {
      return `${todo.time} - ${todo.endTime}`;
    }
    return todo.time;
  }

  onDragStart(todo: Todo, event: DragEvent): void {
    this.draggedTodoId = todo.id;
    event.dataTransfer?.setData('text/plain', todo.id);
    event.dataTransfer?.setDragImage(event.currentTarget as Element, 20, 20);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(target: Todo, event: DragEvent): void {
    event.preventDefault();
    const draggedId = this.draggedTodoId || event.dataTransfer?.getData('text/plain');
    if (!draggedId || draggedId === target.id) {
      return;
    }
    this.todoService.reorderActive(draggedId, target.id);
    this.draggedTodoId = null;
  }

  onDragEnd(): void {
    this.draggedTodoId = null;
  }

  ngOnDestroy(): void {
    this.createSub.unsubscribe();
  }
}
