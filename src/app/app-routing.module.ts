import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTaskComponent } from './tasks/create-task.component';
import { AddUserComponent } from './user/add-user.component';
import { AddProjectComponent } from './project/add-project.component';
import { ViewTaskComponent } from './tasks/view-task.component';

const routes: Routes = [
  { path:'tasks/view',component:ViewTaskComponent  },
  { path:'task/edit/:id',component:CreateTaskComponent },
  { path:'user/add',component:AddUserComponent },
  { path:'project/add',component:AddProjectComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
