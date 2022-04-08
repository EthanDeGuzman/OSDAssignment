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
  user?: User | null;

  //Get Current User
  constructor (private userService: UserService, private router: Router) {
    this.userService.user.subscribe( user => this.user = user)
  }

  //When Logout is clicked redirect to Login Route
  logout(){
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
