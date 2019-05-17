import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { IProject } from '../model/project.model';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
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


  getProjectById(id: number): Observable<IProject> {
    return this.http.get<IProject>(this.envUrl.urlAddress + 'api/project/' + id)
      .pipe(
        map(res => {
          return res as IProject;
        }),
        catchError((e: Response) => this.handleError(e))
      );
  }

  getProjects(): Observable<IProject[]> {
    return this.http.get<IProject[]>(this.envUrl.urlAddress + 'api/project')
      .pipe(
        map(res => {
          return res as IProject[];
        }),
        catchError((e: Response) => this.handleError(e))
      );
  }

  addProject(project: IProject): Observable<IProject> {
    return this.http.post<IProject>(this.envUrl.urlAddress + 'api/project/', JSON.stringify(project), ProjectService.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  editProject(id: number, project: IProject): Observable<any> {
    return this.http.put<IProject>(this.envUrl.urlAddress + 'api/project/' + id, JSON.stringify(project), ProjectService.httpOptions).pipe(
      tap(_ => console.log(`updated user id=${id}`)),
      catchError(this.handleError)
    );
  }

}
