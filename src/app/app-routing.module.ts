import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { ArchiveComponent } from './archive/archive.component';
const routes: Routes = [
  { path: 'tasks', component: TodoComponent },
  { path: 'archive', component: ArchiveComponent },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
