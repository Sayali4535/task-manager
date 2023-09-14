import { Component } from '@angular/core';
import { Task } from '../core/entities/task-dto';
import { AppService } from '../app.service';
import { Message, MessageService } from 'primeng/api';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
// Component to perform CRU operations on tasks
export class HomeComponent {

  // Stores original tasks
  tasks: any[] = [];

  // Stores updated tasks
  modifiedTasks: any[] = [];

  // Used in HTML to display Status dropdown option values
  statusOptions: any[]= [{name:"NEW", value: "NEW"}, { name:"IN PROGRESS", value: "IN PROGRESS"}, { name:"COMPLETED", value: "COMPLETED"}];

  // To display success/failure messages 
  msgs: Message[] = [];

  constructor( private appService: AppService, private msgServce: MessageService ) {}

  ngOnInit() {
    this.getTasks();
  }

  // Gets tasks stored in task.json 
  private getTasks(): void {
    this.appService.getTasks().subscribe( (tasks: any ) =>{
      console.log( "Task received: " + tasks);
      this.tasks = Task.readJsonList( tasks );

      this.tasks.forEach( (task: Task) =>{
        this.modifiedTasks.push( task.clone());
      })
    });
  }

  // Cancels changes made by user
  public onClickOfCancel(): void {
    this.modifiedTasks = [];

    this.tasks.forEach( (task: Task) =>{
      this.modifiedTasks.push( task.clone());
    })
  }

  // Saves added/updated/deleted tasks
  public onClickOfSave(): void {
    console.log( "On click of save" );
    let validTasks: boolean = this.validateTasks();
    this.tasks=[];
    let clonedTask: Task;

    if( validTasks ) {
      this.modifiedTasks.forEach( (modifiedTask: Task ) => {
        modifiedTask.setState("");
        clonedTask = modifiedTask.clone();
        this.tasks.push( clonedTask );
      } )
      this.msgServce.add( {severity:'success', summary:'Successful',detail:'Tasks are saved'} );
    }
  }

  // Validates added/updated tasks, validations are -
  // 1. Title is required
  // 2. Due Date is required
  private validateTasks(): boolean {
    let validTasks: boolean = true;
    let taskTitle: string = "";
    let tasksSize: number = this.modifiedTasks.length;
    let modifiedTask: Task;

    for( let i:number =0; i<tasksSize; i++ ) {
      modifiedTask = this.modifiedTasks[ i ];
      modifiedTask.hasError = false;
      taskTitle = modifiedTask.getTitle();

      // Validation for title
      if( taskTitle == undefined || taskTitle == null || taskTitle.trim().length == 0 ) {
        validTasks = false;
        modifiedTask.hasError = true;
        this.msgServce.add( {severity:'error', summary:'Failure',detail:'Please provide title'} );
        break;
      }

      // Validation for Due Date
      if( modifiedTask.getDueDate() == undefined || modifiedTask.getDueDate() == null ) {
        validTasks = false;
        modifiedTask.hasError = true;
        this.msgServce.add( {severity:'error', summary:'Failure',detail:'Please provide due date'} );
        break;
      }
    } 
    
    return validTasks;
  }

  // Adds new task
  public onClickOfAdd(): void {
    console.log('On click of add');
    let newTask: Task = new Task();
    newTask.setId( uuidv4() );
    newTask.setState( 'ADDED' );
    this.modifiedTasks.push( newTask );
  }

  // UPdates existing task
  public onClickOfEdit( modifiedTask: Task ): void {
    console.log("On click of edit");
    modifiedTask.setState( "MODIFIED" );
  }

  // Deletes newly added/existing task
  public onClickOfDelete( taskToBeDeleted: Task ): void {
    console.log( "On click of delete" );
    this.modifiedTasks = this.modifiedTasks.filter( (modifiedTask: Task) => {
         if (modifiedTask.getId() != taskToBeDeleted.getId() ) {
            return true;
         }
         return false;
      });
  }

  // Updates status value on status dropdown change
  public onStatusChange( event:any,task:Task): void {
    console.log( event );
    let updatedStatus:string = event.value.value;
    task.setStatus( updatedStatus );
    task.statusUIObj = event.value;
  }

  public clearMessages(): void {
    this.msgs = [];
  }
}
