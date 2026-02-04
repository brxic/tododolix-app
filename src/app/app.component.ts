import { Component } from '@angular/core';
import { TodoService } from './todo/todo.service';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {Subscription} from 'rxjs';
import {TodoComponent} from './todo/todo.component';

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
  private createSub!: Subscription;

  title(title: any) {
      throw new Error('Method not implemented.');
  }
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  constructor(public todoService: TodoService, private router: Router) {
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
}
