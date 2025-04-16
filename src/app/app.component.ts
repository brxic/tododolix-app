import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TodoComponent} from './todo/todo.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  todos = [
    {todo: "Get groceries", done: false},
    {todo: "Go for a run", done: false},
    {todo: "Pay the bills", done: false}
  ]

  ngOnInit(): void {
  }
}
