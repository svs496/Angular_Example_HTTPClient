import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ITask } from '../model/task.model';
import { TaskService } from '../shared/task.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  @Output() backFromAddTask = new EventEmitter()

  taskForm: FormGroup
  task: ITask;
  parentTasks: [];
  title: string;
  subHeading: string;

  minDate :Date
  stDt : any

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService) { }

  validationMessages = {
    'taskDescription': {
      'required': 'Task is required',
      'minlength': 'Task should be more than 5 chars',
      'maxlength': 'Task should be less than 50 chars'
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
  };

  cancel() {
    this.backFromAddTask.emit();
  }

  ngOnInit() {

    this.populateParentTaskDropdown();

    this.taskForm = this.fb.group({
      taskDescription: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      parentTask: '',
      priority: '1',
      dateGroup: this.fb.group(
        {
          startDate: ['', Validators.required],
          endDate: ['', Validators.required]
        }, { validator: compareDate }),
    });

    this.taskForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.taskForm);
    });

    this.title = "Create Task"
    this.subHeading = "Add new task details :"


  } // end ngOnInit


  private populateParentTaskDropdown() {
    this.taskService.getParentTasks()
      .subscribe(response => {
        this.parentTasks = response;
      }, (err) => { console.log('error Message from component' + err); });
  }

  //loop through form controls and formgroup. both derrive from abstract control
  logValidationErrors(group: FormGroup = this.taskForm) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (key === 'startDate')
      {
       
          if(abstractControl.value !== '')
          {
            this.stDt = new Date (abstractControl.value).toLocaleDateString();
         
          }
      }

      if (key === 'endDate')
      {
        if(typeof this.stDt != 'undefined')
        {
          this.minDate = new Date(this.stDt);
        }
      }

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
    this.mapDataToModel();
    this.taskService.addTask(this.task);
    this.backFromAddTask.emit();
  }

  mapDataToModel() {
    this.task = {
      taskId: null,
      parentId: this.taskForm.value.parentTask === '' ? null : +this.taskForm.value.parentTask,
      taskDescription: this.taskForm.value.taskDescription,
      priority: this.taskForm.value.priority,
      startDate: this.taskForm.value.dateGroup.startDate,
      endDate: this.taskForm.value.dateGroup.endDate,
      isComplete: false
    };
  }

} //end of class


/*Cross field validation using custom validator */
function compareDate(group: AbstractControl): { [key: string]: any } | null {

  const startDateControl = group.get('startDate');
  const endDateControl = group.get('endDate');

  var startDate = new Date(startDateControl.value) ;
  var endDate = new Date(endDateControl.value);
 
  if (startDate.getTime() > endDate.getTime())
  {
    return { 'dateMismatch': true }
  }
  //both dates should be selected
  if (startDate && endDate) {
    return null
  }
  
  
}