import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, JsonpClientBackend } from '@angular/common/http'
import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { User } from '../interface/user';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURI = 'https://us-central1-mywebassignment-db81c.cloudfunctions.net'
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  //Constructor to store current User
  constructor(private http: HttpClient) {
    const storedUser: User = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('User' + storedUser);

    this.userSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    
    this.user = this.userSubject.asObservable();
    if (this.userSubject.value == null || this.userSubject.value._id == undefined) {
      this.userSubject.next(null)
    }
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  //Method to create new user
  createUser(user: User): Observable<User> {

    const uri: string = this.apiURI + '/users';

    return this.http.post<User>(uri, user).
      pipe(
        catchError(this.handleError)
      );
  }

  //Method to get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiURI}/users`)
      .pipe(
        catchError(this.handleError)
      )
  }

  //Method to Login
  public login(email: string, password: string): Observable<any> {

    return this.http.post<any>(`${this.apiURI}/auth`, { email: email, password: password },
      { withCredentials: true }).
      pipe(map(user => {

        //Get the expiry time from the JWT
        const payload = JSON.parse(atob(user.accessToken.split('.')[1]));
        const expires = new Date(payload.exp * 1000);

        //Set current user in local storage
        localStorage.setItem('currentUser', JSON.stringify(user))
        this.userSubject.next(user);

        this.startAuthenticateTimer(expires);
        return user;
      }
      ))
  }

  //Logout Method
  logout() {
    //Removes user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
  }

  //Method to refresh Token when it is about to expire
  private getNewAccessToken(): Observable<any> {

    return this.http.post<any>(`${this.apiURI}/auth/refresh`, {userid : this.userValue?._id},
      { withCredentials: true }).
      pipe(map(user => {
        console.log('here')

        const payload = JSON.parse(atob(user.accessToken.split('.')[1]));
        const expires = new Date(payload.exp * 1000);

        localStorage.setItem('currentUser', JSON.stringify(user))
        this.userSubject.next(user);

        this.startAuthenticateTimer(expires);
        return user;
      }),
        catchError(this.handleError))
  }

  //Method to handle error
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      //Client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      //Backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);

      if (error.status == 412) {
        return throwError('412 Error' + JSON.stringify(error.error))
      }

      if (error.status == 401){
        localStorage.removeItem('currentUser');
        this.userSubject.next(null);
        return throwError('401 Error' + JSON.stringify(error.error))
      }

    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  private authenticateTimeout?: any;

  private startAuthenticateTimer(expires: Date) {
    console.log(expires);

    //Set a timeout to re-authenticate with the api one minute before the token expires
    const timeout = expires.getTime() - Date.now() - (60 * 1000);

    this.authenticateTimeout = setTimeout(() => {
      console.log('timer gone ');
      this.getNewAccessToken().subscribe();
      this.logout(); //Logs out when token expires
    }, timeout);
  }
}