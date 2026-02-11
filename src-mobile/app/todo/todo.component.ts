import {Component, OnDestroy, OnInit} from '@angular/core';
import {Todo} from './todo.model';
import {TodoService} from './todo.service';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SettingsService} from '../settings/settings.service';

type TimeFilter = 'all' | 'today' | 'morning' | 'afternoon' | 'week';
type PriorityFilter = 'all' | 'low' | 'medium' | 'high';

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
export class TodoComponent implements OnInit, OnDestroy {
  showForm = false;
  formMounted = false;
  formActive = false;
  isEditMode = false;
  useTimeRange = false;
  quickInput = '';
  filtersOpen = false;
  filtersMounted = false;
  filtersActive = false;
  timeFilter: TimeFilter = 'all';
  priorityFilter: PriorityFilter = 'all';
  formTodo: Todo = this.createEmptyTodo();
  todoToDelete: Todo | null = null;
  deleteMounted = false;
  deleteActive = false;
  draggedTodoId: string | null = null;
  private createSub!: Subscription;

  constructor(
    public todoService: TodoService,
    public settings: SettingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createSub = this.todoService.onCreateRequest().subscribe(() => {
      this.openCreateForm();
    });
  }

  get isStartPage(): boolean {
    return this.router.url === '/';
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

  openCreateForm(): void {
    this.formTodo = this.createEmptyTodo();
    this.quickInput = '';
    this.isEditMode = false;
    this.openFormDialog();
  }

  editTodo(todo: Todo): void {
    this.formTodo = {...todo};
    this.quickInput = todo.description;
    this.useTimeRange = !!(todo.endTime && todo.endTime !== todo.time);
    this.isEditMode = true;
    this.openFormDialog();
  }

  saveTodo(): void {
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
    this.closeFormDialog();
  }

  duplicateFromEdit(): void {
    if (!this.isEditMode) {
      return;
    }
    this.formTodo = {
      ...this.formTodo,
      id: '',
      status: 'open',
      archived: false,
      order: this.todoService.getActiveCount()
    };
    this.isEditMode = false;
  }

  cancelForm(): void {
    this.closeFormDialog();
  }

  private resetFormState(): void {
    this.formTodo = this.createEmptyTodo();
    this.quickInput = '';
    this.useTimeRange = false;
    this.isEditMode = false;
  }

  applyQuickPreset(preset: 'now' | 'today_pm' | 'tomorrow_am' | 'tomorrow_evening'): void {
    const now = new Date();
    if (preset === 'now') {
      this.formTodo.date = this.isoDate(0);
      this.formTodo.time = this.roundedTime(15);
      return;
    }
    if (preset === 'today_pm') {
      this.formTodo.date = this.isoDate(0);
      this.formTodo.time = '18:00';
      return;
    }
    if (preset === 'tomorrow_am') {
      this.formTodo.date = this.isoDate(1);
      this.formTodo.time = '09:00';
      return;
    }
    this.formTodo.date = this.isoDate(1);
    this.formTodo.time = '20:00';
    if (now.getHours() >= 20) {
      this.formTodo.date = this.isoDate(2);
    }
  }

  setDuration(minutes: number): void {
    if (!this.formTodo.time) {
      this.formTodo.time = this.roundedTime(15);
    }
    this.useTimeRange = true;
    this.formTodo.endTime = this.addMinutes(this.formTodo.time, minutes);
  }

  applyQuickInput(): void {
    const raw = this.quickInput.trim();
    if (!raw) {
      return;
    }

    let working = raw;

    const timeMatch = working.match(/\b(\d{1,2}:\d{2})\b/);
    if (timeMatch?.[1]) {
      this.formTodo.time = this.normalizeTime(timeMatch[1]);
      working = working.replace(timeMatch[0], ' ');
    }

    const durationMatch = working.match(/\+(\d+)(m|h)\b/i);
    if (durationMatch?.[1] && durationMatch[2]) {
      const amount = Number(durationMatch[1]);
      const unit = durationMatch[2].toLowerCase();
      if (!Number.isNaN(amount)) {
        const minutes = unit === 'h' ? amount * 60 : amount;
        this.setDuration(minutes);
      }
      working = working.replace(durationMatch[0], ' ');
    }

    if (/\b(today|heute)\b/i.test(working)) {
      this.formTodo.date = this.isoDate(0);
      working = working.replace(/\b(today|heute)\b/gi, ' ');
    }
    if (/\b(tomorrow|morgen)\b/i.test(working)) {
      this.formTodo.date = this.isoDate(1);
      working = working.replace(/\b(tomorrow|morgen)\b/gi, ' ');
    }

    const weekdayMatch = this.parseNextWeekday(working);
    if (weekdayMatch) {
      this.formTodo.date = this.isoDate(weekdayMatch.offsetDays);
      working = working.replace(weekdayMatch.matched, ' ');
    }

    if (working.includes('!!')) {
      this.formTodo.priority = 'high';
    } else if (working.includes('!')) {
      this.formTodo.priority = 'medium';
    }
    working = working.replace(/!+/g, ' ');

    const colorMatch = working.match(/#(blue|green|yellow|blau|gruen|gelb)\b/i);
    if (colorMatch?.[1]) {
      const color = colorMatch[1].toLowerCase();
      if (color === 'blue' || color === 'blau') {
        this.formTodo.color = 'blue';
      } else if (color === 'green' || color === 'gruen') {
        this.formTodo.color = 'green';
      } else {
        this.formTodo.color = 'yellow';
      }
      working = working.replace(colorMatch[0], ' ');
    }

    working = working.replace(/\s{2,}/g, ' ').trim();
    if (working) {
      this.formTodo.description = working;
    }

    if (!this.formTodo.date) {
      this.formTodo.date = this.isoDate(0);
    }
    if (!this.formTodo.time) {
      this.formTodo.time = this.roundedTime(15);
    }
  }

  confirmDelete(todo: Todo): void {
    this.todoToDelete = todo;
    this.deleteMounted = true;
    this.deleteActive = false;
    window.requestAnimationFrame(() => {
      this.deleteActive = true;
    });
  }

  cancelDelete(): void {
    this.closeDeleteDialog();
  }

  archiveTodo(todo: Todo): void {
    this.todoService.archive(todo);
    this.closeDeleteDialog();
  }

  cycleStatus(todo: Todo): void {
    this.todoService.cycleStatus(todo);
  }

  getActiveTodos(): Todo[] {
    const active = this.todoService.getActive();
    return active.filter((todo) => this.matchesFilters(todo));
  }

  toggleFilters(): void {
    if (this.filtersOpen) {
      this.filtersOpen = false;
      this.filtersActive = false;
      window.setTimeout(() => {
        if (!this.filtersOpen) {
          this.filtersMounted = false;
        }
      }, 190);
      return;
    }
    this.filtersOpen = true;
    this.filtersMounted = true;
    this.filtersActive = false;
    window.requestAnimationFrame(() => {
      this.filtersActive = true;
    });
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

  statusLabel(status: Todo['status']): string {
    if (status === 'open') {
      return this.settings.t('status_open');
    }
    if (status === 'in-progress') {
      return this.settings.t('status_progress');
    }
    return this.settings.t('status_done');
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

  private openFormDialog(): void {
    this.showForm = true;
    this.formMounted = true;
    this.formActive = false;
    window.requestAnimationFrame(() => {
      this.formActive = true;
    });
  }

  private closeFormDialog(): void {
    this.formActive = false;
    window.setTimeout(() => {
      this.formMounted = false;
      this.showForm = false;
      this.resetFormState();
    }, 230);
  }

  private closeDeleteDialog(): void {
    this.deleteActive = false;
    window.setTimeout(() => {
      this.deleteMounted = false;
      this.todoToDelete = null;
    }, 200);
  }

  private isoDate(offsetDays: number): string {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private roundedTime(stepMinutes: number): string {
    const now = new Date();
    const minutes = now.getMinutes();
    const rounded = Math.ceil(minutes / stepMinutes) * stepMinutes;
    now.setMinutes(rounded, 0, 0);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private addMinutes(time: string, minutes: number): string {
    const [hhRaw, mmRaw] = time.split(':');
    const hh = Number(hhRaw);
    const mm = Number(mmRaw);
    if (Number.isNaN(hh) || Number.isNaN(mm)) {
      return time;
    }
    const total = (hh * 60 + mm + minutes + 24 * 60) % (24 * 60);
    const outH = String(Math.floor(total / 60)).padStart(2, '0');
    const outM = String(total % 60).padStart(2, '0');
    return `${outH}:${outM}`;
  }

  private normalizeTime(time: string): string {
    const [hhRaw, mmRaw] = time.split(':');
    const hh = Number(hhRaw);
    const mm = Number(mmRaw);
    if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
      return time;
    }
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }

  private parseNextWeekday(input: string): { offsetDays: number; matched: string } | null {
    const weekdayPatterns: Array<{ regex: RegExp; day: number }> = [
      { regex: /\b(monday|montag|mon|mo)\b/i, day: 1 },
      { regex: /\b(tuesday|dienstag|tue|tues|di)\b/i, day: 2 },
      { regex: /\b(wednesday|mittwoch|wed|mi)\b/i, day: 3 },
      { regex: /\b(thursday|donnerstag|thu|thur|thurs|do)\b/i, day: 4 },
      { regex: /\b(friday|freitag|fri|fr)\b/i, day: 5 },
      { regex: /\b(saturday|samstag|sat|sa)\b/i, day: 6 },
      { regex: /\b(sunday|sonntag|sun|so)\b/i, day: 0 }
    ];

    for (const entry of weekdayPatterns) {
      const match = input.match(entry.regex);
      if (!match?.[0]) {
        continue;
      }
      return {
        offsetDays: this.nextWeekdayOffset(entry.day),
        matched: match[0]
      };
    }

    return null;
  }

  private nextWeekdayOffset(targetDay: number): number {
    const currentDay = new Date().getDay();
    let offset = (targetDay - currentDay + 7) % 7;
    if (offset === 0) {
      offset = 7;
    }
    return offset;
  }

  private matchesFilters(todo: Todo): boolean {
    if (this.priorityFilter !== 'all' && todo.priority !== this.priorityFilter) {
      return false;
    }

    if (this.timeFilter === 'all') {
      return true;
    }

    const start = this.getTodoStart(todo);
    if (!start) {
      return false;
    }

    const now = new Date();
    if (this.timeFilter === 'today') {
      return this.isSameDay(start, now);
    }
    if (this.timeFilter === 'morning') {
      return this.isSameDay(start, now) && start.getHours() < 12;
    }
    if (this.timeFilter === 'afternoon') {
      return this.isSameDay(start, now) && start.getHours() >= 12;
    }
    return this.isInCurrentWeek(start, now);
  }

  private getTodoStart(todo: Todo): Date | null {
    if (!todo.date || !todo.time) {
      return null;
    }
    const value = new Date(`${todo.date}T${todo.time}:00`);
    if (Number.isNaN(value.getTime())) {
      return null;
    }
    return value;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  private isInCurrentWeek(value: Date, now: Date): boolean {
    const start = new Date(now);
    const day = start.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + offset);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    return value >= start && value < end;
  }
}
