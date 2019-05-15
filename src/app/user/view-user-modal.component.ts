import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { IUser } from '../model/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-view-user-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.css']
})
export class ViewUserModalComponent implements OnInit {

  users: IUser[] = [];
  filterUsers: IUser[] = [];
  _customFilter: string;
  ;
  event: EventEmitter<any> = new EventEmitter();

  get filterUser(): string {
    return this._customFilter;
  }
  set filterUser(value: string) {
    this._customFilter = value;
    this.applyFilters();
  }

  applyFilters() {
    this.filterUsers = [];
    this.filterUsers = this.users.filter(usr =>
      (usr.firstName.toLowerCase().indexOf(this._customFilter) !== -1)
      || (usr.lastName.toLowerCase().indexOf(this._customFilter) !== -1)
    );
  }

  constructor(private bsModalRef: BsModalRef, private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe(response => {
        this.users = response;
        this.filterUsers = response;
      }, (err) => { console.log('error Message from component' + err); });

  }

  onClose() {
    this.bsModalRef.hide();
  }

  selectUser(userId: number,firstName :string, lastName :string) {
    var managerDetail =
    {
      'managerName': firstName + ' ' + lastName,
      'managerId': userId
    };
    this.event.emit(managerDetail);
    this.bsModalRef.hide();
  }

}
