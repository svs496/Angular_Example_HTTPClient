import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';
import { UserService } from '../shared/user.service';
import { IUser } from '../model/user.model';
import { Router } from '@angular/router';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup
  user: IUser;
  sortBy: string = 'firstName';
  allUsers: IUser[];
  addMode: boolean
  cardHeader: string
  editUserId: number;

  constructor(
    private fb: FormBuilder,
    @Inject(TOASTR_TOKEN) private toastr: Toastr, private userService: UserService) {
    this.addMode = true;
  }

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
    'employeeID': {
      'required': 'employeeID is required',
      'minlength': 'employeeID should have 6 chars',
      'maxlength': 'employeeID should be 6 chars'
    }
  };

  formErrors = {
    "firstName": '',
    "lastName": '',
    "employeeID": ''
  };

  ngOnInit() {

    console.log("11");

    this.getAllUsers();

    if (this.addMode) {
      this.cardHeader = 'Add New User'
    }
    else
      this.cardHeader = 'Edit User'

    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      employeeID: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.userForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.userForm);
    });

    if (!this.addMode) {
      console.log("hi");

    }

  }//ngOnit

  getUserById() {
    this.userService.getUserById(this.editUserId)
      .subscribe(response => {
        console.log(response);
        this.userForm.patchValue({
          userId: response.userId,
          firstName: response.firstName,
          lastName: response.lastName,
          employeeID: response.employeeID
        });
      });
  }

  private getAllUsers() {
    this.userService.getUsers()
      .subscribe(response => {
        this.allUsers = [];
        this.allUsers = response;
      }, (err) => { console.log('error Message from component' + err); });
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

  cancel() {
    this.userForm.reset({
      'firstName': '',
      'lastName': '',
      'employeeID': ''
    });
  }

  changeToEditMode($event: number) {
    this.editUserId = $event;
    this.addMode = false;
    this.getUserById();
  }

  deleteComplete($event) {
    //console.log($event);
    if ($event === 'DeleteSuccess') {
      this.getAllUsers();
    }
  }

  edit() {
    if (this.userForm.valid) {
      var user = {
        userId: this.editUserId,
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        employeeID: this.userForm.value.employeeID
      };

      this.userService.editUser(this.editUserId, user)
        .subscribe(resp => {
          this.toastr.success('User edit success!');
          this.restFormAndCallService();
        },
          (error => {
            this.toastr.error("Some thing went wrong... Contact Administrator.")
            console.error(error);
          })
        );

    }
  }


  private restFormAndCallService() {
    this.userForm.reset({
      'firstName': '',
      'lastName': '',
      'employeeID': ''
    });
    this.getAllUsers();
    this.addMode = true;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      var user = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        employeeID: this.userForm.value.employeeID
      };

      this.userService.addUser(user)
        .subscribe(res => {
          this.toastr.success('New User added!');
          this.restFormAndCallService();
        },
          (error => {
            this.toastr.error("Some thing went wrong... Contact Administrator.")
            console.error(error);
          })
        )
    }
  }
}
