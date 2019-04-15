import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TaskListComponent } from './tasks/task-list.component';
import { TaskService } from './shared/task.service';
import { TaskThumbnailComponent } from './tasks/task-thumbnail.component';
import { CreateTaskComponent } from './tasks/create-task.component';
import { DeleteTaskComponent } from './tasks/delete-task.component';
import { EditTaskComponent } from './tasks/edit-task.component';
import { EndTaskComponent } from './tasks/end-task.component';
import { SearchTaskComponent } from './tasks/search-task.component';
import { Toastr, TOASTR_TOKEN } from './common/toastr.service';
import { JQ_TOKEN } from './common/jQuery.service';

let toastr: Toastr = window['toastr'];
let jQuery = window['$'];

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskThumbnailComponent,
    CreateTaskComponent,
    DeleteTaskComponent,
    EditTaskComponent,
    EndTaskComponent,
    SearchTaskComponent
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
    BsModalService
  ],
  bootstrap: [AppComponent],
  entryComponents: [EditTaskComponent, DeleteTaskComponent, EndTaskComponent]
})
export class AppModule { }
