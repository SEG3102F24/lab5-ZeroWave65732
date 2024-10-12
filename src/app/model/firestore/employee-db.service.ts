import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  collectionData
} from '@angular/fire/firestore';
import {Observable} from "rxjs";
import {Employee} from "../employee";
import {AuthService} from "../../authentication/auth.service";

@Injectable({
  providedIn: 'root'
})
export class EmployeeDbService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  getEmployees(): Observable<Employee[]> {
    const employees = collection(this.firestore, 'employees', this.authService.userid);
    return collectionData(employees, {idField: 'id'}) as Observable<Employee[]>;
  }

  createEmployee(employee: Employee) {
    // Convert the Employee object to a plain object
    const employeeData = {
      name: employee.name,
      dateOfBirth: employee.dateOfBirth,
      city: employee.city,
      salary: employee.salary,
      gender: employee.gender,
      email: employee.email
    };

    // Reference to the top-level employees collection
    const employeesCollection = collection(this.firestore, 'employees', this.authService.userid);

    // Add the employee data to Firestore
    return addDoc(employeesCollection, employeeData);
  }


  updateEmployee(employee: Employee) {
    const employeeData = {
      name: employee.name,
      dateOfBirth: employee.dateOfBirth,
      city: employee.city,
      salary: employee.salary,
      gender: employee.gender,
      email: employee.email
    };
    const employeeId = employee.id;
    delete employee.id;
    const employees = collection(this.firestore, 'employee', this.authService.userid, 'addresses');
    const employeeRef = doc(employees, employeeId!);
    // @ts-ignore
    return setDoc(employeeRef, employee);
  }

  deleteEmployee(employeeId: string): Promise<void> {
    const employees = collection(this.firestore, 'employee', this.authService.userid);
    const employeeRef = doc(employees, employeeId);
    return deleteDoc(employeeRef)
  }
}
