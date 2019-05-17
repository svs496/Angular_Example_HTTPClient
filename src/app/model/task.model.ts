export interface ITask
{
    taskId:number
    parentTaskId:number
    taskName:string
    startDate:Date
    endDate:Date
    priority:number
    status:number
    projectId: number
    userId:number
}