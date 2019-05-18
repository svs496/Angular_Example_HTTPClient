import { Injectable } from '@angular/core';
import { ITask } from '../model/task.model';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { EnvironmentUrlService } from './environment-url.service';


@Injectable({
  providedIn: 'root'
})


export class TaskService {

  tempTaskId: number;


  static readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient,  private envUrl: EnvironmentUrlService) { }


  settempTaskId(val: number) {
    this.tempTaskId = val;
  }

  gettempTaskId() {
    return this.tempTaskId;
  }

  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.envUrl.urlAddress + 'api/task/get/')
      .pipe(
        map(res => {
          return res as ITask[];
        }),
        catchError((e: Response) => this.handleError(e))
      );
  }


  getTaskById(id: number): Observable<ITask> {
    return this.http.get<ITask>(this.envUrl.urlAddress + 'api/task/get/' + id)
      .pipe(
        map(res => {
          return res as ITask;
        }),
        catchError((e: Response) => this.handleError(e))
      );
  }


  getTasksByProjectId(id: number): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.envUrl.urlAddress + 'api/task/GetTasksByProjectId/' + id)
      .pipe(
        map(res => {
          return res as ITask[];
        }),
        catchError((e: Response) => this.handleError(e))
      );
  }



  addTask(task: any): Observable<any> {
    return this.http.post<any>(this.envUrl.urlAddress + 'api/task/post', JSON.stringify(task), TaskService.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  editTask(id:number,task: any): Observable<any> {
    return this.http.put(this.envUrl.urlAddress + 'api/task/put/' + id, JSON.stringify(task), TaskService.httpOptions).pipe(
      tap(_ => console.log(`updated task id=${id}`)),
      catchError(this.handleError)
    );
  }


  deleteTask(id: number) : Observable<any> {
    return this.http.delete<any>(this.envUrl.urlAddress + 'api/task/delete/' + id, TaskService.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

 

  getParentTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.envUrl.urlAddress + 'api/task/GetParentTasks/')
      .pipe(
        map(res => {
          return res as ITask[];
        }),
        catchError((e: Response) => this.handleError(e))
      );
  }



  private handleError(error) {
   
    console.log(error);
    return throwError(error);
  }



}// end class

