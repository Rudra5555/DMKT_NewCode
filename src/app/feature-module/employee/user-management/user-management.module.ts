import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserManagementProfileComponent } from './user-management-profile/user-management-profile.component';
import {UserManagementModalComponent } from './user-management-modal/user-management-modal.component';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProgressComponent } from './user-management-modal/progress/progress.component';


@NgModule({
  declarations: [
    UserManagementComponent,
    UserListComponent,
    UserManagementProfileComponent,
    UserManagementModalComponent,
    ProgressComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
    
  ]
})
export class UserManagementModule { }
