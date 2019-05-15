import { Component, OnInit, Input } from '@angular/core';
import { IProject } from '../model/project.model';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {

  @Input() projects: IProject[];
  @Input() sortBy: string;
  visibleUsers: IProject[] = [];

  constructor() { }

  ngOnInit() {
  }

}
