import { Component, OnInit, Input, OnChanges, Output, EventEmitter, Inject, ChangeDetectionStrategy } from '@angular/core';
import { IUser } from '../model/user.model';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewUserComponent implements OnInit, OnChanges {

  @Input() users: IUser[];
  sortBy: string = 'firstName';
  visibleUsers: IUser[] = [];
  _customFilter: string;


  @Output() editMessageEvent = new EventEmitter<number>();
  @Output() deleteMessageEvent = new EventEmitter<string>();

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.SortAndFilterUsers();
  }
  constructor(@Inject(TOASTR_TOKEN) private toastr: Toastr, private userService: UserService) { }

  private SortAndFilterUsers() {

    if (this.users) {
      this.visibleUsers = [];

      
      if (this._customFilter && this._customFilter.length > 0) {
        this.visibleUsers = this.users.filter(usr =>
          (usr.firstName.toLowerCase().indexOf(this._customFilter) !== -1)
          || (usr.lastName.toLowerCase().indexOf(this._customFilter) !== -1)
        );
      }
      else
        this.visibleUsers = this.users;

        console.log(this.sortBy);
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

  ngOnInit() {
  }

  setSortValue(sortString: string) {
    this.sortBy = sortString;
    this.SortAndFilterUsers();
  }

  get filterUser(): string {
    return this._customFilter;
  }
  set filterUser(value: string) {
    this._customFilter = value;
    this.SortAndFilterUsers();
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