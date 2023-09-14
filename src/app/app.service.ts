import { Injectable } from "@angular/core";
import { Task } from "./core/entities/task-dto";
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class AppService {

    constructor( private http: HttpClient ){}

    public getTasks() {
        return this.http.get( 'assets/tasks.json');
    }
}