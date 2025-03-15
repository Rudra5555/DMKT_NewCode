import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserManagementProfileComponent } from './user-management-profile/user-management-profile.component';
import { UserManagementComponent } from './user-management.component';
import { AuthGuard } from '../../main/dashboard/AuthGuard';

const routes: Routes = [
  { 
    path: '', 
    component: UserManagementComponent,
    children: [
      { path: "user-list", component: UserListComponent,canActivate: [AuthGuard]  },
      { path: "user-management-profile", component: UserManagementProfileComponent,canActivate: [AuthGuard]  },
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
