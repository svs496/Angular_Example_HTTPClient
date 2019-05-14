import { Component, OnInit } from '@angular/core';
import { ITask } from '../model/task.model';
import { TaskService } from '../shared/task.service';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],

})
export class TaskListComponent implements OnInit {

  allTasks: ITask[];
  filteredTasks: ITask[];
  addMode : boolean


  constructor(private taskService: TaskService) { }


  async ngOnInit() {
    this.addMode = false;
    this.allTasks = [];
    this.getallTasks() 
  }

  private getallTasks() {
    this.taskService.getTasks()
      .subscribe(response => {
        this.allTasks = [];
        this.allTasks = response;
      }, (err) => { console.log('error Message from component' + err); });
  
    }

  addTask() {
    this.addMode = true;
  }

  cancelAddTask() {
    this.addMode = false;
  }

  backFromAddTask() {
    this.getallTasks();
    this.addMode = false;
  }

  populateTasks(outputTasks: ITask[]) {
    this.filteredTasks = outputTasks;
  }

   modalActionCompleted() {
    this.taskService.getTasks()
      .subscribe(response => {
        const temp = response
        this.allTasks = [];
        this.allTasks = temp;
       
      }, (err) => { console.log('error Message from component' + err); });

  }

}
