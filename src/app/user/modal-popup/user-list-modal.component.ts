import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { IUser } from '../../model/user.model';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-view-user-modal',
  templateUrl: './user-list-modal.component.html'
})
export class UserListModalComponent implements OnInit {

  originalUserList: IUser[] = [];
  userList: IUser[] = [];
  _customFilter: string;
  public modalHeader: string;
  public notFoundMessage :string;

  event: EventEmitter<any> = new EventEmitter();

  get filterUser(): string {
    return this._customFilter;
  }
  set filterUser(value: string) {
    this._customFilter = value;
    this.applyFilters();
  }

  applyFilters() {
   
    this.userList = [];
    this.userList = this.originalUserList.filter(usr =>
      (usr.firstName.toLowerCase().indexOf(this._customFilter) !== -1)
      || (usr.lastName.toLowerCase().indexOf(this._customFilter) !== -1)
    );
  }

  constructor(private bsModalRef: BsModalRef, private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe(response => {
        this.originalUserList = response;
        this.userList = response;
      }, (err) => { console.log('error Message from component' + err); });

  }

  onClose() {
    this.bsModalRef.hide();
  }

  selectUser(userId: number, firstName: string, lastName: string) {
    var managerDetail =
    {
      'userName': firstName + ' ' + lastName,
      'userId': userId
    };
    this.event.emit(managerDetail);
    this.bsModalRef.hide();
  }

}
