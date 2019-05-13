import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { Observable, throwError } from 'rxjs';
import { IUser } from '../model/user.model';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  static readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  private handleError(error) {
    console.log(error);
    return throwError(error);
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.envUrl.urlAddress + 'api/user')
      .pipe(
        map(res => {
          return res as IUser[];
        }),
        catchError((e: Response) => this.handleError(e))
      );
  }

  addUser(user: any): Observable<any> {
    console.log(JSON.stringify(user));
    return this.http.post<any>(this.envUrl.urlAddress + 'api/user/', JSON.stringify(user), UserService.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  editUser(id: number, user: IUser): Observable<any> {
    return this.http.put(this.envUrl.urlAddress + 'api/user/' + id, JSON.stringify(user), UserService.httpOptions).pipe(
      tap(_ => console.log(`updated user id=${id}`)),
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(this.envUrl.urlAddress + 'api/user/' + id, UserService.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

}
