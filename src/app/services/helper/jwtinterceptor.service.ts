import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class JwtinterceptorService {
  constructor(private userService: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const user = this.userService.userValue;
      const accessToken = user?.accessToken;
      const isApiUrl = 'https://us-central1-mywebassignment-db81c.cloudfunctions.net'
      
      //Add Bearer Token header if user is logged in and request is the correct url
      if (accessToken && isApiUrl) {
          request = request.clone({
              setHeaders: { Authorization: `Bearer ${accessToken}` }
          });
      }
      return next.handle(request);
  }
}