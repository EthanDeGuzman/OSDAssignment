import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { User } from 'src/app/interface/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  userList: User[] = [];
  message: string = "";

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.GetllAllUser().subscribe(user => this.userList = user);
  }

}
