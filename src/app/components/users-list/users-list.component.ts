import { Component, OnInit } from '@angular/core';
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

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (value: User[]) => this.userList = value,
      complete: () => console.log('users service finished'),
      error: (mess) => this.message = mess
    })
  }

  dismissAlert() {
    this.message = "";
}
}
