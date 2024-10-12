import { Routes } from '@angular/router';
import {EmployeeComponent} from "./employee/employee.component";
import {EmployeesComponent} from "./employees/employees.component";
import {AuthGuard} from "@angular/fire/auth-guard"
import {SignInComponent} from "./sign-in/sign-in.component";
import {PasswordForgotComponent} from "./password-forgot/password-forgot.component";
import {SignUpComponent} from "./sign-up/sign-up.component";

export const routes: Routes = [
  {path: 'employee', component: EmployeeComponent},
  {path: 'employees', component: EmployeesComponent},
  {path: '', redirectTo: 'employee', pathMatch: 'full'},
  {path: '**', component: EmployeesComponent},
  {path: '', redirectTo: '/sign-in', pathMatch: 'full'},
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'Employess', component: EmployeesComponent, canActivate:[AuthGuard]},
  {path: 'password-forgot', component: PasswordForgotComponent}
];

