import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <app-task-list></app-task-list>
  <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'task-manager-app';
}
