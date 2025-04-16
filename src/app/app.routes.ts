import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { ArchiveComponent } from './archive/archive.component';
import { HowtouseComponent } from './howtouse/howtouse.component';

export const routes: Routes = [
  { path: '', component: TodoComponent },
  { path: 'archive', component: ArchiveComponent },
  { path: 'howtouse', component: HowtouseComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
