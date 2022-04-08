import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userForm!: FormGroup;
  message: String = "";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(3)])
    })
  }

  onSubmit() {
    this.userService.createUser(this.userForm?.value)
      .subscribe({
        next: user => {
          console.log(JSON.stringify(user) + ' has been added');
          this.message = "New user has been added";
        },
        error: (err) => this.message = err
      });

      this.userForm.reset();
  }

  dismissAlert() {
    this.message = "";
  }

  //Get for invalid/touched
  get firstName() {
    return this.userForm?.get('firstName');
  }
  get lastName() {
    return this.userForm?.get('lastName');
  }
  get email() {
    return this.userForm?.get('email');
  }
  get password() {
    return this.userForm?.get('password');
  }
}
