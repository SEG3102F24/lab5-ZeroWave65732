import {Component, inject, OnInit} from '@angular/core';
import {EmployeeService} from "../service/employee.service";
import { RouterLink } from '@angular/router';
import {NgFor, AsyncPipe, DatePipe, NgStyle} from '@angular/common';
import {Employee} from "../model/employee";
import {EmployeeDbService} from "../model/firestore/employee-db.service";
import {EmployeeComponent} from "../employee/employee.component";
import {Observable} from "rxjs";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.css'],
    standalone: true,
  imports: [
    RouterLink,
    NgFor,
    AsyncPipe,
    DatePipe,
    EmployeeComponent,
    NgStyle,
    ReactiveFormsModule
  ]
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  currentEmployee: Employee|null = null;
  message: string ='';
  hideMsg=true;
  msgStyle= {
    color: '',
    'background-color': 'white',
    'font-size': '150%',
  };
  private store: EmployeeDbService = inject(EmployeeDbService);

  ngOnInit() : void {
    this.message ='';
    this.store.getEmployees().subscribe(data => {
      this.employees = data.map( e=> {
        return {
          id: e.id,
          ...e
        } as Employee;
      });
    });
  }

  select(employee: Employee): void {
    this.currentEmployee = employee;
  }

  showMessage(type: string, msg: string): void {
    this.msgStyle.color = type === 'error' ? 'red':'blue';
    this.message = msg;
    this.hideMsg = false;
    setTimeout(
      ()=>{
        this.hideMsg=true;
    }, 2500
    );
  }

  deleteCurrent(): void {
    if (this.currentEmployee && this.currentEmployee.id !== null) {
      this.employees =
        this.employees.filter((employee: Employee) => employee !== this.currentEmployee);
      // ***** permanently delete
      this.store.deleteEmployee(this.currentEmployee.id!)
        .then(_ =>
          this.showMessage('info', 'The address entry was successfully deleted')
        )
        .catch(_=>
        this.showMessage('error', 'Error unable to delete the address entry')
        );
      this.currentEmployee = null;
    }
  }

  saveCurrent(): void {
    if(this.currentEmployee && this.currentEmployee.id === null) {
      this.store.createEmployee(this.currentEmployee)
        .then(
          (docRef: any) => {
            this.currentEmployee!.id = docRef;
            this.showMessage('info', 'The address entry was successfully saved');
          }
        )
        .catch((_: any) =>
          this.showMessage('error', 'Error unable to save the address entry')
        );
      }else{
      this.store.updateEmployee(this.currentEmployee!)
        .then((_:any) =>
        this.showMessage('info', 'The Employee was successfully updated')
        )
        .catch((_:any)=>
        this.showMessage('error', 'Error unable to update Employee')
      );
    }
  }
}
