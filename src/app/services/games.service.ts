import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators'
import { Games } from '../interface/games';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  //API URL for Firebase Function
  private dataUri = 'https://us-central1-mywebassignment-db81c.cloudfunctions.net'

  //Constructor to use HTTP Client Module
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  //GET Method
  getGames(): Observable<Games[]>{
    console.log('getGames called');

    return this.http.get<Games[]>(this.dataUri + '/getGames')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  //POST Method
  addGame(game: Games): Observable<Games> {
    return this.http.post<Games>(this.dataUri + '/addGame', game)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  //PUT Method
  updateGame(id: string, game: Games): Observable<Games> {
    console.log('subscribing to update' + id);
    let gameURI: string = this.dataUri + '/updateGame?id=' + id;
    return this.http.put<Games>(gameURI, game)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  //DELETE Method
  deleteGame(id: string): Observable<unknown> {
    const url = this.dataUri + '/deleteGame?id=' + id; // DELETE 
    return this.http.delete(url)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  //Error Handling
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
