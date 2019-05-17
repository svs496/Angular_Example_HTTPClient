import { Component, OnInit, Inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';
import { TaskService } from '../shared/task.service';
import { UserListModalComponent } from '../user/modal-popup/user-list-modal.component';
import { ParentTaskModalComponent } from './modal-popup/parent-task-modal.component';
import { ProjectListModalComponent } from '../project/modal-popup/project-list-modal.component';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  taskForm: FormGroup
  userId: number
  parentTaskId :number
  projectId:number

  bsModalRef: BsModalRef
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  };

  constructor(
    private fb: FormBuilder, private bsModalService: BsModalService, private userService: UserService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr, private taskService: TaskService) {

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
    'dateGroup': {
      'dateMismatch': 'Task End Date cannot be before Task Start Date'
    }
  };

  formErrors = {
    "taskName": '',
    "priority": '',
    "startDate": '',
    "endDate": '',
    "dateGroup": ''
  };

  ngOnInit() {
    this.taskForm = this.fb.group({
      taskName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      parentTask: '',
      priority: '1',
      userName : '',
      projectName :'',
      dateGroup: this.fb.group(
        {
          startDate: ['', Validators.required],
          endDate: ['', Validators.required]
        }, { validator: compareDate }),
    });

    this.taskForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.taskForm);
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

      var tasktoAdd = {
        parentTaskId: this.parentTaskId,
        taskName: this.taskForm.value.taskName,
        priority: this.taskForm.value.priority,
        startDate: this.taskForm.value.dateGroup.startDate,
        endDate: this.taskForm.value.dateGroup.endDate,
        status: 1,
        projectId: this.projectId,
        userId: this.userId 
      };

      this.taskService.addTask(tasktoAdd)
        .subscribe(res => {
          this.toastr.success('A new Task is added!');
        },
          (error => {
            this.toastr.error("Some thing went wrong. Contact Administrator.")
            console.error(error);
          })
        )
    }
  }

  cancel() {

  }


  selectUser() {
    this.bsModalRef = this.bsModalService.show(UserListModalComponent, this.config);
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