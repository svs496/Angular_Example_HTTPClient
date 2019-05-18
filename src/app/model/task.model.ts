export interface ITask
{
    taskId:number
    parentTaskId?:number
    taskName:string
    parentTaskName?:string
    startDate:Date
    endDate:Date
    priority:number
    status:number
    projectId: number
    userId:number,
    projectName?:string
    userName?:string
    isParentTask?:boolean
    createTime ? : Date
}