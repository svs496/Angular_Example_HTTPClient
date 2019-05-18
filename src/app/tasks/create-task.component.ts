import { Component, OnInit, Inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';
import { TaskService } from '../shared/task.service';
import { UserListModalComponent } from '../user/modal-popup/user-list-modal.component';
import { ParentTaskModalComponent } from './modal-popup/parent-task-modal.component';
import { ProjectListModalComponent } from '../project/modal-popup/project-list-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { getLocaleDateTimeFormat } from '@angular/common';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  taskForm: FormGroup;
  userId: number;
  parentTaskId: number;
  projectId: number;
  isParentTask: boolean = false;
  editTaskId: number = 0;
  title: string;
  buttonModeText: string;
  editTaskStartDate: Date;
  editTaskEndDate: Date
  editTaskPriority: number;
  editTaskCreateDate : Date

  bsModalRef: BsModalRef
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  };

  constructor(
    private fb: FormBuilder, private bsModalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private taskService: TaskService) {

  }

  validationMessages = {
    'taskName': {
      'required': 'Task is required',
      'minlength': 'Task should be more than 10 chars',
      'maxlength': 'Task should be less than 100 chars'
    },
    'priority': {
      'required': 'Priority is required'
    },
    'startDate': {
      'required': 'Start Date is required'
    },
    'endDate': {
      'required': 'End Date is required'
    },
    'projectName': {
      'required': 'Project Name is required'
    },
    'dateGroup': {
      'dateMismatch': 'Task End Date cannot be before Task Start Date'
    }
  };

  formErrors = {
    "taskName": '',
    "priority": '',
    "startDate": '',
    "endDate": '',
    "dateGroup": '',
    "projectName": ''
  };

  ngOnInit() {

    this.taskForm = this.fb.group({
      taskName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      parentTask: '',
      priority: '0',
      userName: '',
      projectName: '',
      dateGroup: this.fb.group(
        {
          startDate: ['', Validators.required],
          endDate: ['', Validators.required]
        }, { validator: compareDate }),
    });

    // this.taskForm.get('dateGroup').get('startDate').setValue(response.startDate);
    this.taskForm.controls['projectName'].disable();
    this.taskForm.controls['parentTask'].disable();
    this.taskForm.controls['userName'].disable();

    this.taskForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.taskForm);
    });

    this.route.paramMap.subscribe(parameterMap => {
      const id = +parameterMap.get('id');
      this.editTaskId = id;
      this.changetoEditMode(id);
    });



  } //ng onInit


  changetoEditMode(id: number) {
    if (id != 0) {
      this.title = "Edit Task";
      this.buttonModeText = "Edit Task";
      this.taskService.getTaskById(id)
        .subscribe(response => {
          this.taskForm.patchValue({
            taskName: response.taskName,
            priority: response.priority,
            parentTask: response.parentTaskName,
            userName: response.userName,
            projectName: response.projectName,
            dateGroup:
            {
              // startDate: response.startDate,
              endDate: response.endDate
            }
          });

          this.taskForm.get('dateGroup').get('startDate').setValue(response.startDate);
          this.projectId = response.projectId;
          this.userId = response.userId;
          this.parentTaskId = response.parentTaskId;
          this.editTaskEndDate = response.endDate;
          this.editTaskStartDate = response.startDate;
          this.editTaskPriority = response.priority;
          this.editTaskCreateDate = response.createTime;

          if (response.isParentTask) {
            this.disablePTControls();
          }

        });
    }
    else {
      this.title = "Create Task";
      this.buttonModeText = "Add Task";
      this.ResetCreateTaskForm();
    }

  }

  cancel() {
    this.ResetCreateTaskForm();
  }


  private ResetCreateTaskForm() {
    this.taskForm.get('dateGroup').get('startDate').enable();
    this.taskForm.get('dateGroup').get('endDate').enable();
    this.taskForm.get('priority').enable();
    //this.taskForm.get('dateGroup').get('startDate').setValue(new Date(Date.now()));
    this.isParentTask = false;

    this.taskForm.reset({
      'taskName': '',
      'parentTask': '',
      'priority': '0',
      'userName': '',
      'projectName': '',
      'dateGroup': {
        'startDate': new Date(Date.now()),
        'endDate': ''
      }
    });
  }

  //loop through form controls and formgroup. both derrive from abstract control
  logValidationErrors(group: FormGroup = this.taskForm) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      // if (key === 'startDate') {

      //   if (abstractControl.value !== '') {
      //     this.stDt = new Date(abstractControl.value).toLocaleDateString();

      //   }
      // }

      // if (key === 'endDate') {
      //   if (typeof this.stDt != 'undefined') {
      //     this.minDate = new Date(this.stDt);
      //   }
      // }

      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {

      var tasktoAdd = this.mapToModal();

      if (this.editTaskId === 0) {
        this.CallAddTaskAPI(tasktoAdd);
      }
      else {
        tasktoAdd.taskId = this.editTaskId;
        tasktoAdd.createTime = this.editTaskCreateDate
        this.CallEditTaskAPI(tasktoAdd);
      }

    }
  }

  private CallAddTaskAPI(tasktoAdd: { parentTaskId: number; taskName: any; priority: any; startDate: any; endDate: any; status: number; projectId: number; userId: number; }) {
    this.taskService.addTask(tasktoAdd).subscribe(res => {
      this.toastr.success('A new Task is added!');
      this.ResetCreateTaskForm();
    }, (error => {
      this.toastr.error("Some thing went wrong. Contact Administrator.");
      console.error(error);
    }));
  }


  private CallEditTaskAPI(tasktoAdd: { parentTaskId: number; taskName: any; priority: any; startDate: any; endDate: any; status: number; projectId: number; userId: number; }) {
    this.taskService.editTask(this.editTaskId, tasktoAdd).subscribe(res => {
      this.toastr.success('Task edited succssfully!');
      this.ResetCreateTaskForm();
      this.router.navigate(['tasks/view']);

    }, (error => {
      this.toastr.error("Some thing went wrong. Contact Administrator.");
      console.error(error);
    }));
  }



  private mapToModal() {
    return {
      parentTaskId: this.isParentTask ? null : this.parentTaskId,
      taskName: this.taskForm.value.taskName.toUpperCase(),
      priority: this.isParentTask ? 0 : this.taskForm.value.priority,
      startDate: this.isParentTask ? null : this.taskForm.value.dateGroup.startDate,
      endDate: this.isParentTask ? null : this.taskForm.value.dateGroup.endDate,
      status: 1,
      projectId: this.projectId,
      userId: this.userId,
      taskId: 0,
      isParentTask: this.isParentTask,
      createTime :new Date(Date.now())
    };
  }

  enableorDisableParentTaskControls(check: any) {
    if (check.target.checked) {
      this.disablePTControls();
    }
    else {
      this.enablePTControls();

    }

  }

  private enablePTControls() {
    this.taskForm.get('dateGroup').get('startDate').enable();
    this.taskForm.get('dateGroup').get('endDate').enable();
    this.taskForm.get('priority').enable();
    this.isParentTask = false;
    if (this.editTaskId != 0) {
      if (this.editTaskStartDate)
        this.taskForm.get('dateGroup').get('startDate').setValue(this.editTaskStartDate);
      if (this.editTaskEndDate)
        this.taskForm.get('dateGroup').get('endDate').setValue(this.editTaskEndDate);
      if (this.editTaskPriority > 0)
        this.taskForm.get('priority').setValue(this.editTaskPriority);
    }
    else {
      this.taskForm.get('dateGroup').get('startDate').setValue(new Date(Date.now()));
    }
  }

  private disablePTControls() {
    this.isParentTask = true;
    this.taskForm.get('dateGroup').get('startDate').disable();
    this.taskForm.get('dateGroup').get('endDate').disable();
    this.taskForm.get('priority').disable();
    this.taskForm.get('dateGroup').get('endDate').setValue('');
    this.taskForm.get('dateGroup').get('startDate').setValue('');
    this.taskForm.get('priority').setValue('0');
  }

  selectUser() {
    this.bsModalRef = this.bsModalService.show(UserListModalComponent, this.config);
    this.bsModalRef.content.modalHeader = "User";
    this.bsModalRef.content.notFoundMessage = "No User Record Found.";

    this.bsModalRef.content.event.subscribe((result: any) => {
      this.taskForm.controls['userName'].setValue(result.userName);
      this.userId = result.userId;
    });
  }

  selectParentTask() {
    this.bsModalRef = this.bsModalService.show(ParentTaskModalComponent, this.config);
    this.bsModalRef.content.event.subscribe((result: any) => {
      this.taskForm.controls['parentTask'].setValue(result.taskName);
      this.parentTaskId = result.taskId;
    });
  }


  selectProject() {
    this.bsModalRef = this.bsModalService.show(ProjectListModalComponent, this.config);

    this.bsModalRef.content.event.subscribe((result: any) => {
      this.taskForm.controls['projectName'].setValue(result.projectName);
      this.projectId = result.projectId;
    });
  }

}//end of class


/*Cross field validation using custom validator */
function compareDate(group: AbstractControl): { [key: string]: any } | null {

  const startDateControl = group.get('startDate');
  const endDateControl = group.get('endDate');

  var startDate = new Date(startDateControl.value);
  var endDate = new Date(endDateControl.value);

  if (startDate.getTime() > endDate.getTime()) {
    return { 'dateMismatch': true }
  }
  //both dates should be selected
  if (startDate && endDate) {
    return null
  }
}