import {Component, OnDestroy, OnInit} from '@angular/core';
import { Todo, Priority, Status } from './todo.model'; // falls du das ausgelagert hast
import { TodoService } from './todo.service';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as crypto from 'node:crypto';
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
  formTodo: Todo = this.createEmptyTodo();
  todoToDelete: Todo | null = null;
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
      priority: 'low',
      status: 'open',
      archived: false,
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
    this.isEditMode = true;
    this.showForm = true;
  }

  saveTodo() {
    if (this.isEditMode) {
      this.todoService.update(this.formTodo);
    } else {
      this.formTodo.id = Date.now().toString() + Math.random().toString(36).substring(2, 8);
      this.todoService.add(this.formTodo);
    }
    this.cancelForm();
  }

  cancelForm() {
    this.formTodo = this.createEmptyTodo();
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

  ngOnDestroy(): void {
    this.createSub.unsubscribe();
  }
}
