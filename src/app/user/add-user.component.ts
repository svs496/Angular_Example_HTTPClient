import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';
import { UserService } from '../shared/user.service';
import { IUser } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup
  user: IUser;


  constructor(
    private fb: FormBuilder,
    @Inject(TOASTR_TOKEN) private toastr: Toastr, private router:Router,
    private userService: UserService) { }

  validationMessages = {
    'firstName': {
      'required': 'First name is required',
      'minlength': 'First name should have atleast two characters',
      'maxlength': 'First name should be less than 40 chars'
    },
    'lastName': {
      'required': 'Last name is required',
      'minlength': 'Last name should have atleast two characters',
      'maxlength': 'Last name should be less than 40 chars'
    },
    'employeeId': {
      'required': 'EmployeeId is required',
      'minlength': 'EmployeeId should have 6 chars',
      'maxlength': 'EmployeeId should be 6 chars'
    }
  };

  formErrors = {
    "firstName": '',
    "lastName": '',
    "employeeId": ''
  };

  ngOnInit() {

    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      employeeId: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.userForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.userForm);
    });

  }

  //loop through form controls and formgroup. both derrive from abstract control
  logValidationErrors(group: FormGroup = this.userForm) {
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

  onSubmit(): void {
    if (this.userForm.valid) {
      var user = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        employeeId: this.userForm.value.employeeId
      };

      this.userService.addUser(user)
        .subscribe(res => {
          this.toastr.success('New User added!');
          this.router.navigate(['user/add']);
        },
          (error => {
            this.toastr.error("Some thing went wrong... Contact Administrator.")
            console.error(error);
          })
        )
    }
  }
}
