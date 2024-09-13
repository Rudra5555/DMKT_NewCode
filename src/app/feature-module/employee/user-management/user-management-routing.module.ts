import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { UserManagementContentPageComponent } from './user-management-content-page/user-management-content-page.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserManagementProfileComponent } from './user-management-profile/user-management-profile.component';
import { UserManagementComponent } from './user-management.component';

const routes: Routes = [
  { 
    path: '', 
    component: UserManagementComponent,
    children: [
      { path: "user-list", component: UserListComponent },
      { path: "user-management-profile", component: UserManagementProfileComponent },
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
