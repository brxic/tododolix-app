import {Routes} from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { ArchiveComponent } from './archive/archive.component';
import { HowtouseComponent } from './howtouse/howtouse.component';

export const routes: Routes = [
  { path: '', component: TodoComponent },
  { path: 'archive', component: ArchiveComponent },
  { path: 'config', component: HowtouseComponent },
  { path: 'howtouse', redirectTo: 'config', pathMatch: 'full' }
];
