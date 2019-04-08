export interface ITask
{
    taskId:number
    parentId:number
    taskDescription:string
    startDate:Date
    endDate:Date
    priority:number
    isComplete:boolean
}