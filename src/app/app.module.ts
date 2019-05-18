import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TaskService } from './shared/task.service';
import { CreateTaskComponent } from './tasks/create-task.component';
import { Toastr, TOASTR_TOKEN } from './common/toastr.service';
import { JQ_TOKEN } from './common/jQuery.service';
import { EnvironmentUrlService } from './shared/environment-url.service';
import { NavBarComponent } from './nav/nav-bar.component';
import { AddUserComponent } from './user/add-user.component';
import { AddProjectComponent } from './project/add-project.component';
import { UserService } from './shared/user.service';
import { ProjectService } from './shared/project.service';
import { ViewUserComponent } from './user/view-user.component';
import { ViewProjectComponent } from './project/view-project.component';
import { UserListModalComponent } from './user/modal-popup/user-list-modal.component';
import { DeleteTaskComponent } from './tasks/modal-popup/delete-task.component';
import { EditTaskComponent } from './tasks/modal-popup/edit-task.component';
import { EndTaskComponent } from './tasks/modal-popup/end-task.component';
import { ParentTaskModalComponent } from './tasks/modal-popup/parent-task-modal.component';
import { ProjectListModalComponent } from './project/modal-popup/project-list-modal.component';
import { ViewTaskComponent } from './tasks/view-task.component';


let toastr: Toastr = window['toastr'];
let jQuery = window['$'];

@NgModule({
  declarations: [
    AppComponent,
    CreateTaskComponent,
    DeleteTaskComponent,
    EditTaskComponent,
    EndTaskComponent,
    NavBarComponent,
    AddUserComponent,
    AddProjectComponent,
    ViewUserComponent,
    ViewProjectComponent,
    UserListModalComponent,
    ParentTaskModalComponent,
    ProjectListModalComponent,
    ViewTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    TaskService,
    { provide: TOASTR_TOKEN, useValue: toastr },
    { provide: JQ_TOKEN, useValue: jQuery },
    EnvironmentUrlService ,
    BsModalService,
    UserService,
    ProjectService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditTaskComponent, 
    DeleteTaskComponent, 
    EndTaskComponent,
    UserListModalComponent,
    ParentTaskModalComponent,
    ProjectListModalComponent
  ]
})
export class AppModule { }