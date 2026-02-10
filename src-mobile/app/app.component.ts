import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TodoComponent} from './todo/todo.component';
import {TodoService} from './todo/todo.service';
import {SettingsService} from './settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    NgIf,
    RouterLink,
    RouterLinkActive,
    TodoComponent
  ]
})
export class AppComponent {
  constructor(
    public todoService: TodoService,
    public settings: SettingsService,
    private router: Router
  ) {}

  get isNotStartPage(): boolean {
    return this.router.url !== '/';
  }

  get taskCount(): number {
    return this.todoService.getActiveCount();
  }

  triggerQuickCreate(): void {
    this.todoService.triggerCreate();
  }

  toggleThemeQuick(): void {
    this.settings.setThemeMode(this.settings.themeMode === 'dark' ? 'light' : 'dark');
  }
}
