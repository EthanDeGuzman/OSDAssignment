import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup = new FormGroup({});
  message: String = "";

  constructor(
      private fb: FormBuilder,
      private userService: UserService
  ) {  }

  ngOnInit() {
      this.signinForm = this.fb.group({
          email: [null, [Validators.required, Validators.email]],
          password: [null, Validators.required]
      });
  }
  get form() 
  { 
      return this.signinForm.controls; 
  }

  onSubmit() {
      this.userService.login(this.form.email.value, this.form.password.value)
          .subscribe(
              data => {
                  console.log(data);
                  this.message = `Login successful for ${data.firstName}`
              },
              error => {
                  console.log(error);
                  this.message = "ERROR! Unable to log in please try again"
              });

      this.signinForm.reset();
  }

  dismissAlert() {
      this.message = "";
  }

  get email() {
    return this.signinForm?.get('email');
  }
  get password() {
    return this.signinForm?.get('password');
  }
}
