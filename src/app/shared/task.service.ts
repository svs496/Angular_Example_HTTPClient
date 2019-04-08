import { Injectable } from '@angular/core';
import { ITask } from '../model/task.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tempTaskId :number;
  constructor() { }


  settempTaskId(val: number){
    this.tempTaskId = val;
  }

  gettempTaskId(){
    return this.tempTaskId;
  }

  getTasks(): Observable<ITask[]> {
    let subject = new Subject<ITask[]>()
    setTimeout(() => {
      subject.next(TASKS);
      subject.complete();
    }, 1000);
    return subject;
  }

  getTaskById(id: number): ITask {
    return TASKS.find(event => event.taskId === id);
  }

  addTask(task: ITask) {
    task.taskId = + TASKS.length + 1;
    TASKS.push(task)
  }

  editTask(task: ITask) {
    let index = TASKS.findIndex(x => x.taskId == task.taskId)
    //console.log(TASKS[index]);
    TASKS[index] = task
    //console.log(TASKS[index]);
  }

  deleteTask(id: number) {
    var taskToRemove = this.getTaskById(id);
    TASKS.splice(TASKS.indexOf(taskToRemove),1);
    //console.log(TASKS);
  }

  endTask (id:number){
    let index = TASKS.findIndex(x => x.taskId == id)
    TASKS[index].isComplete = true;
    TASKS[index].endDate = new Date();
  }

  getParentTasks(): Observable<any> {
    let subject = new Subject<any>()
    setTimeout(() => {
      subject.next(PARENTTASK);
      subject.complete();
    }, 100);
    return subject;
  }

  getParentTaskName (id : number) : string
  {
    let index = PARENTTASK.findIndex(x => x.taskid == id)
    return PARENTTASK[index].taskDescription;
  }

}// end class

const PARENTTASK = [
  {taskid : 100, taskDescription : 'No Parent Task'},
  {taskid : 1, taskDescription : 'Stage 1'},
  {taskid : 3, taskDescription : 'Create Data Layer'},
  {taskid : 4, taskDescription : 'Create Web API'},
  {taskid : 5, taskDescription : 'Stage 2 work'},
  {taskid : 6, taskDescription : 'Integeration testing'}
  
];

const TASKS: ITask[] = [
  {
    taskId: 1,
    parentId: 100,
    taskDescription: 'Stage 1',
    startDate: new Date('03/26/2019'),
    endDate: new Date(),
    priority: 10,
    isComplete: false
  },
  {
    taskId: 2,
    parentId: 1,
    taskDescription: 'Generate Service Classes',
    startDate: new Date('03/27/2019'),
    endDate: new Date('03/30/2019'),
    priority: 28,
    isComplete: false
  },
  {
    taskId: 3,
    parentId: 1,
    taskDescription: 'Generate Components',
    startDate: new Date('03/30/2019'),
    endDate: new Date('03/30/2019'),
    priority: 15,
    isComplete: false
  },
  {
    taskId: 4,
    parentId: 1,
    taskDescription: 'Complete UI Layer',
    startDate: new Date('04/02/2019'),
    endDate: new Date('04/02/2019'),
    priority: 12,
    isComplete: false
  },
  {
    taskId: 5,
    parentId: 100,
    taskDescription: 'Stage 2 work',
    startDate: new Date('04/04/2019'),
    endDate: new Date(),
    priority: 30,
    isComplete: false
  },
  {
    taskId: 6,
    parentId: 5,
    taskDescription: 'Business Layer',
    startDate: new Date('04/05/2019'),
    endDate: new Date(),
    priority: 20,
    isComplete: false
  },
  {
    taskId: 7,
    parentId: 5,
    taskDescription: 'Web API Layer',
    startDate: new Date('04/01/2019'),
    endDate: new Date(),
    priority: 30,
    isComplete: false
  },
  {
    taskId: 8,
    parentId: 5,
    taskDescription: 'Data Layer',
    startDate: new Date('04/02/2019'),
    endDate: new Date(),
    priority: 30,
    isComplete: false
  },
  {
    taskId:9,
    parentId: 100,
    taskDescription: 'Stage 3',
    startDate: new Date('4/03/2019'),
    endDate: new Date(),
    priority: 5,
    isComplete: false
  }
]
