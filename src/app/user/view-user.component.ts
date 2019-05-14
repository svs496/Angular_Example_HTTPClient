import { Component, OnInit, Input, OnChanges, Output, EventEmitter, Inject } from '@angular/core';
import { IUser } from '../model/user.model';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, OnChanges {

  @Input() users: IUser[];
  @Input() sortBy: string;
  visibleUsers: IUser[] = [];

  @Output() editMessageEvent = new EventEmitter<number>();
  @Output() deleteMessageEvent = new EventEmitter<string>();

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (this.users) {
      this.visibleUsers = this.users;
      if (this.sortBy === 'firstName') {
        this.visibleUsers.sort(sortByFirstName);
      }
      else if (this.sortBy === 'lastName') {
        this.visibleUsers.sort(sortByLastName);
      }

      else if (this.sortBy === 'employeeID') {
        this.visibleUsers.sort(sortByemployeeID);
      }

    }
  }
  constructor(@Inject(TOASTR_TOKEN) private toastr: Toastr, private userService: UserService) { }

  ngOnInit() {
  }

  editUser(id: number) {
    this.editMessageEvent.emit(id);
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id)
      .subscribe(res => {
        this.toastr.success("User record deleted.");
        this.deleteMessageEvent.emit('DeleteSuccess');
      },
        (error) => {
          if (error.status == '409') {
            this.toastr.error(error.error.customMessage);
          }
          else {
            this.toastr.error("Operation Failed. Contact Admin!")
          }
        });
  }

}

function sortByFirstName(u1: IUser, u2: IUser) {
  if (u1.firstName > u2.firstName) return 1
  else if (u1.firstName === u2.firstName) return 0
  else return -1
}

function sortByLastName(u1: IUser, u2: IUser) {
  if (u1.lastName > u2.lastName) return 1
  else if (u1.lastName === u2.lastName) return 0
  else return -1
}

function sortByemployeeID(u1: IUser, u2: IUser) {
  if (u1.employeeID > u2.employeeID) return 1
  else if (u1.employeeID === u2.employeeID) return 0
  else return -1
}