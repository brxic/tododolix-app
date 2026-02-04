import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TodoService } from './todo/todo.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { TodoComponent } from './todo/todo.component';

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
export class AppComponent implements OnInit {
  menuOpen = true;
  menuActive = true;
  isDark = false;

  toggleMenu() {
    if (!isPlatformBrowser(this.platformId)) {
      this.menuOpen = !this.menuOpen;
      this.menuActive = this.menuOpen;
      return;
    }
    if (this.menuOpen) {
      this.menuActive = false;
      window.setTimeout(() => {
        this.menuOpen = false;
      }, 220);
      return;
    }
    this.menuOpen = true;
    window.requestAnimationFrame(() => {
      this.menuActive = true;
    });
  }

  constructor(
    public todoService: TodoService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
  }

  get isNotStartPage(): boolean {
    return this.router.url !=='/';
  }

  triggerQuickCreate(): void {
    console.log('Quick Create');
    this.todoService.triggerCreate();
  }

  get taskCount(): number {
    return this.todoService.getActiveCount();
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.applyTheme(true);
      return;
    }
    if (saved === 'light') {
      this.applyTheme(false);
      return;
    }
    if (window.innerWidth < 1100) {
      this.menuOpen = false;
      this.menuActive = false;
    }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    this.applyTheme(prefersDark);
  }

  toggleTheme(): void {
    this.applyTheme(!this.isDark);
  }

  private applyTheme(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.isDark = isDark;
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
