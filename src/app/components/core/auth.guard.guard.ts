import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/interface/user';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

private user : User | null = null;

  constructor(private userService: UserService){
    this.userService.user.subscribe( user => this.user = user);
    console.log ('Here email address: ' + this.user?.email)
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let isLoggedIn = ! (this.user == null ) ;
    console.log ('Here Access Token: ' + this.user?.accessToken);
    console.log('Route Guard is ' + isLoggedIn);

    return isLoggedIn;
  }
  
}