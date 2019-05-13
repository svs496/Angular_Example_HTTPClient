import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTaskComponent } from './tasks/create-task.component';
import { TaskListComponent } from './tasks/task-list.component';
import { AddUserComponent } from './user/add-user.component';
import { AddProjectComponent } from './project/add-project.component';

const routes: Routes = [
  { path:'tasks/view',component:TaskListComponent  },
  { path:'task/new',component:CreateTaskComponent },
  { path:'user/add',component:AddUserComponent },
  { path:'project/add',component:AddProjectComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
