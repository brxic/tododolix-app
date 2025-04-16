import { Component } from '@angular/core';
import {Todo, TodoComponent} from './todo/todo.component';
import {RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common'; // oder aus shared file

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    TodoComponent,
    NgIf
  ]
})
export class AppComponent {
  menuOpen = false;
  activeTaskCount = 0;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  updateCounter(tasks: Todo[]) {
    this.activeTaskCount = tasks.filter(t => !t.archived).length;
  }
}
