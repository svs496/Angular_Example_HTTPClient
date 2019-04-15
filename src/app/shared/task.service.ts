import { Injectable } from '@angular/core';
import { ITask } from '../model/task.model';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})


export class TaskService {

  tempTaskId: number;

  static readonly  API_URL = environment.apiUrlAddress;
  
  static readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }


  settempTaskId(val: number) {
    this.tempTaskId = val;
  }

  gettempTaskId() {
    return this.tempTaskId;
  }

  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(TaskService.API_URL + 'api/task')
      .pipe(
        map(res => {
          return res as ITask[];
        }),
        catchError((e: Response) => this.handleError(e))
      );
  }


  getTaskById(id: number): Observable<ITask> {
    return this.http.get<ITask>(TaskService.API_URL + 'api/task/' + id)
      .pipe(
        map(res => {
          return res as ITask;
        }),
        catchError((e: Response) => this.handleError(e))
      );
  }

  addTask(task: any): Observable<any> {
    console.log(JSON.stringify(task));
    return this.http.post<any>(TaskService.API_URL + 'api/task/', JSON.stringify(task), TaskService.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  editTask(id:number,task: ITask): Observable<any> {
    return this.http.put(TaskService.API_URL + 'api/task/' + id, JSON.stringify(task), TaskService.httpOptions).pipe(
      tap(_ => console.log(`updated task id=${id}`)),
      catchError(this.handleError)
    );
  }

  deleteTask(id: number) : Observable<any> {
    return this.http.delete<any>(TaskService.API_URL + 'api/task/' + id, TaskService.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  endTask(id: number) {
    
  }

  getParentTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(TaskService.API_URL + 'api/parenttask')
      .pipe(
        map(res => {
          return res as ITask[];
        }),
        catchError((e: Response) => this.handleError(e))
      );
  }



  private handleError(error) {
    // let errorMessage = '';
    // if (error.error instanceof ErrorEvent) {
    //   // Get client-side error
    //   errorMessage = error.error.message;
    // } else {
    //   // Get server-side error
    //   errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    // }
    //window.alert(errorMessage);
    return throwError(error);
  }



}// end class

