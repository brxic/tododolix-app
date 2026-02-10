import {Injectable, inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Todo, TodoColor} from './todo.model';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TodoService {
  private createRequest$ = new Subject<void>();
  private todos: Todo[] = [];
  private notificationTimers = new Map<string, number[]>();
  private readonly STORAGE_KEY = 'todos';
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.loadTodos();
    this.rescheduleAll();
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
    return this.todos
      .filter(t => !t.archived)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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

  getColorClass(color: TodoColor | string): string {
    switch (color) {
      case 'green':
        return 'card-green';
      case 'blue':
        return 'card-blue';
      default:
        return 'card-yellow';
    }
  }

  getActiveCount(): number {
    return this.todos.filter(t => !t.archived).length;
  }

  add(todo: Todo): void {
    this.normalizeTodo(todo);
    if (todo.order === undefined || todo.order === null) {
      todo.order = this.getNextOrder();
    }
    this.todos.push(todo);
    this.saveTodos();
    this.scheduleNotifications(todo);
  }

  update(updated: Todo): void {
    this.normalizeTodo(updated);
    this.todos = this.todos.map(t => t.id === updated.id ? updated : t);
    this.saveTodos();
    this.scheduleNotifications(updated);
  }

  archive(todo: Todo): void {
    todo.archived = true;
    this.saveTodos();
    this.clearNotifications(todo.id);
  }

  clearArchive(): void {
    this.todos = this.todos.filter(t => !t.archived);
    this.saveTodos();
  }

  restore(todo: Todo): void {
    todo.archived = false;
    todo.status = 'open';
    todo.order = this.getNextOrder();
    this.saveTodos();
    this.scheduleNotifications(todo);
  }

  reorderActive(draggedId: string, targetId: string): void {
    if (draggedId === targetId) {
      return;
    }
    const active = this.getActive();
    const draggedIndex = active.findIndex(t => t.id === draggedId);
    const targetIndex = active.findIndex(t => t.id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }
    const [dragged] = active.splice(draggedIndex, 1);
    const insertIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
    active.splice(insertIndex, 0, dragged);
    for (let i = 0; i < active.length; i += 1) {
      active[i].order = i;
    }
    this.saveTodos();
  }

  cycleStatus(todo: Todo): void {
    if (todo.status === 'open') {
      todo.status = 'in-progress';
      this.scheduleNotifications(todo);
      this.saveTodos();
      return;
    }
    if (todo.status === 'in-progress') {
      todo.status = 'done';
      this.clearNotifications(todo.id);
      this.saveTodos();
      return;
    }
    if (todo.status === 'done') {
      todo.archived = true;
      this.clearNotifications(todo.id);
      this.saveTodos();
    }
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
      this.normalizeTodos();
    }
  }

  ensureNotificationPermission(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!('Notification' in window)) {
      return;
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.rescheduleAll();
        }
      });
    }
  }

  private rescheduleAll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!('Notification' in window)) {
      return;
    }
    if (Notification.permission !== 'granted') {
      return;
    }
    for (const todo of this.todos) {
      this.scheduleNotifications(todo);
    }
  }

  private scheduleNotifications(todo: Todo): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!('Notification' in window)) {
      return;
    }
    if (Notification.permission !== 'granted') {
      return;
    }
    if (todo.archived || todo.status === 'done') {
      this.clearNotifications(todo.id);
      return;
    }
    if (!todo.date || !todo.time) {
      this.clearNotifications(todo.id);
      return;
    }

    const start = new Date(`${todo.date}T${todo.time}:00`);
    if (Number.isNaN(start.getTime())) {
      return;
    }

    this.clearNotifications(todo.id);

    const now = Date.now();
    const reminders: Array<{ at: number; label: string; timeRef: 'start' | 'end' }> = [];
    const startAt = start.getTime();
    const endAtRaw = todo.endTime ? new Date(`${todo.date}T${todo.endTime}:00`).getTime() : null;
    const hasRange = !!(endAtRaw && endAtRaw > startAt);
    const endAt = hasRange ? endAtRaw : null;
    const minutesToStart = (startAt - now) / (60 * 1000);
    const shortNotice = minutesToStart > 0 && minutesToStart <= 20;
    const beforeMinutesByPriority: Record<'low' | 'medium' | 'high', number[]> = {
      low: [15],
      medium: [60, 15],
      high: [180, 60, 15]
    };
    const beforeOffsets = shortNotice ? [Math.max(1, Math.floor(minutesToStart / 2))] : beforeMinutesByPriority[todo.priority];

    for (const minutesBefore of beforeOffsets) {
      reminders.push({
        at: startAt - minutesBefore * 60 * 1000,
        label: this.buildBeforeLabel(todo.priority, minutesBefore),
        timeRef: 'start'
      });
    }
    reminders.push({ at: startAt, label: this.buildStartLabel(todo.priority), timeRef: 'start' });

    if (hasRange && endAt) {
      const endLeadMinutes = todo.priority === 'high' ? 20 : todo.priority === 'medium' ? 10 : 5;
      reminders.push(
        { at: endAt - endLeadMinutes * 60 * 1000, label: `Endet in ${endLeadMinutes} Min`, timeRef: 'end' },
        { at: endAt, label: 'Endzeit erreicht', timeRef: 'end' }
      );
    }

    const timers: number[] = [];
    for (const reminder of reminders) {
      if (reminder.at <= now) {
        continue;
      }
      const timeoutId = window.setTimeout(() => {
        const refDate = reminder.timeRef === 'end' && endAt ? new Date(endAt) : start;
        const timeLabel = refDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        new Notification(todo.description, { body: `${reminder.label} • ${timeLabel}` });
      }, reminder.at - now);
      timers.push(timeoutId);
    }
    if (timers.length > 0) {
      this.notificationTimers.set(todo.id, timers);
    }
  }

  private clearNotifications(todoId: string): void {
    const timers = this.notificationTimers.get(todoId);
    if (timers) {
      for (const id of timers) {
        clearTimeout(id);
      }
      this.notificationTimers.delete(todoId);
    }
  }

  private getNextOrder(): number {
    if (this.todos.length === 0) {
      return 0;
    }
    const maxOrder = Math.max(...this.todos.map(t => (t.order ?? 0)));
    return maxOrder + 1;
  }

  private normalizeTodos(): void {
    let nextOrder = 0;
    for (const todo of this.todos) {
      this.normalizeTodo(todo);
      if (todo.order === undefined || todo.order === null) {
        todo.order = nextOrder;
      }
      nextOrder = Math.max(nextOrder, (todo.order ?? 0) + 1);
    }
  }

  private normalizeTodo(todo: Todo): void {
    if (!todo.color) {
      todo.color = 'yellow';
    }
    if (!todo.endTime) {
      todo.endTime = todo.time || '';
    }
  }

  private buildBeforeLabel(priority: 'low' | 'medium' | 'high', minutesBefore: number): string {
    if (priority === 'high') {
      return `Dringend: Start in ${minutesBefore} Min`;
    }
    if (priority === 'medium') {
      return `Bald faellig: ${minutesBefore} Min`;
    }
    return `Erinnerung: Start in ${minutesBefore} Min`;
  }

  private buildStartLabel(priority: 'low' | 'medium' | 'high'): string {
    if (priority === 'high') {
      return 'Dringend: jetzt starten';
    }
    if (priority === 'medium') {
      return 'Startzeit ist jetzt';
    }
    return 'Zeit fuer diese Aufgabe';
  }
}
