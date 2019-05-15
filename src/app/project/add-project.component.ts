import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IProject } from '../model/project.model';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';
import { ProjectService } from '../shared/project.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  projectForm: FormGroup
  project: IProject
  sortBy: string = 'startDate';
  allProjects: IProject[] = [];
  addMode: boolean
  editProjectId: number;

  constructor(
    private fb: FormBuilder,
    @Inject(TOASTR_TOKEN) private toastr: Toastr, private projectService: ProjectService) {
    this.addMode = true;
  }

  validationMessages = {
    'projectName': {
      'required': 'Project name is required',
      'minlength': 'Project name should be more than 10 chars',
      'maxlength': 'Project name should be less than 100 chars'
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
    "projectName": '',
    "priority": '',
    "startDate": '',
    "endDate": '',
    "dateGroup": ''
  };

  ngOnInit() {

    this.getAllProjects();

    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      priority: '0',
      dateGroup: this.fb.group(
        {
          startDate: ['', Validators.required],
          endDate: ['', Validators.required]
        }, { validator: compareDate }),
    });

    this.projectForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.projectForm);
    });

  } //end ngOnInit

  getAllProjects() {
    this.projectService.getUsers()
      .subscribe(response => {
        this.allProjects = [];
        this.allProjects = response;
      }, (err) => { console.log('error Message from component' + err); });
  }

  private restFormAndCallService() {
    this.projectForm.reset({
      "projectName": '',
      "priority": '',
      "startDate": '',
      "endDate": ''
    });
    this.getAllProjects();
    this.addMode = true;
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      var prjct = {
        projectName: this.projectForm.value.projectName,
        priority: this.projectForm.value.priority,
        startDate: this.projectForm.value.dateGroup.startDate,
        endDate: this.projectForm.value.dateGroup.endDate
      };
      this.projectService.addProject(prjct)
        .subscribe(res => {
          this.toastr.success('New project added!');
          this.restFormAndCallService();
        },
          (error => {
            this.toastr.error("Some thing went wrong. Contact Administrator.")
            console.error(error);
          })
        )
    }
  }


  //loop through form controls and formgroup. both derrive from abstract control
  logValidationErrors(group: FormGroup = this.projectForm) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

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


}//end class

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