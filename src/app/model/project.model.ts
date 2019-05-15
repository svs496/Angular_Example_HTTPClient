import { IUser } from './user.model';
import { ITask } from './task.model';

export interface IProject
{
    projectId:number
    projectName:string
    startDate:Date
    endDate:Date
    priority:number
    userId : number
    tasks: ITask[]
    user : IUser
}