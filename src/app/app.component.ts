import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './interface/user';
import { UserService } from './services/user.service';
import {} from '@angular/fire/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WebAssignment';

  constructor (public userService: UserService,) {

  }
}
