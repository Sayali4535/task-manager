import { DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from "@angular/common";

export class Task {
    private id: string = "";
    private title: string="";
    private description: string = "";
    private dueDate!: Date;
    private status: string = "NEW";
    public statusUIObj: any = { name: this.status, value: this.status };
    public hasError: boolean = false;
    private state: string = "";

    public clone(): Task {
        let clonedTask: Task = new Task();
        clonedTask.id = this.id;
        clonedTask.title = this.title;
        clonedTask.description = this.description;
        clonedTask.dueDate = this.dueDate;
        clonedTask.status = this.status;
        clonedTask.statusUIObj = { name: this.status, value: this.status };

        return clonedTask;
    }

    public static readJsonList( taskJson:any[] ): Task[] {
        let task: Task;
        let tasks: Task[] = [];
        taskJson.forEach( ( task: any) => {
            task = this.readJson( task );
            tasks.push( task );
        } )

        return tasks;
    }

    public static readJson( taskJson: any ): Task { 
        let task: Task = new Task();
        task.id = taskJson['id'];
        task.title = taskJson['title'];
        task.description = taskJson[ 'description'];
        task.status = taskJson['status'];
        task.statusUIObj = { name: task.status, value: task.status };
        task.state = "";

        let dueDateStr: string = taskJson[ 'dueDate' ];
        if( dueDateStr != null && dueDateStr != undefined ){
            const datePipe = new DatePipe('en-US');
            let dateStr: any = datePipe.transform( dueDateStr, 'M/d/yy');
            task.dueDate = new Date( dateStr );
        }

        return task;
    }

    public getId(): string {
        return this.id;
    }

    public setId( id: string ): void {
        this.id = id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getDescription(): string {
        return this.description;
    }

    public getDueDate(): Date {
        return this.dueDate;
    }

    public getStatus(): string {
        return this.status;
    }

    public setStatus( status:string ): void {
        this.status = status;
    }

    public getState(): string {
        return this.state;
    }

    public setState( state: string ): void {
        this.state = state;
    }
}