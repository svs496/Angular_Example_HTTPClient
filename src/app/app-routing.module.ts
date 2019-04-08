import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTaskComponent } from './tasks/create-task.component';
import { TaskListComponent } from './tasks/task-list.component';

const routes: Routes = [
  { path:'tasks/new',component:CreateTaskComponent },
  { path:'tasks',component:TaskListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
