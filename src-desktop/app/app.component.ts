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
  isMenuCollapsed = true;

  constructor(
    public todoService: TodoService,
    public settings: SettingsService,
    private router: Router
  ) {}

  get isNotStartPage(): boolean {
    return this.router.url !== '/';
  }

  get isStartPage(): boolean {
    return this.router.url === '/';
  }

  get pageTitle(): string {
    if (this.router.url.startsWith('/archive')) {
      return this.settings.t('archive_title');
    }
    if (this.router.url.startsWith('/config') || this.router.url.startsWith('/howtouse')) {
      return this.settings.t('config_title');
    }
    return this.settings.t('your_tasks');
  }

  get pageSubtitle(): string {
    if (this.router.url.startsWith('/archive')) {
      return this.settings.t('archive_sub');
    }
    if (this.router.url.startsWith('/config') || this.router.url.startsWith('/howtouse')) {
      return this.settings.t('config_sub');
    }
    return this.settings.t('your_tasks_sub');
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

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
}
