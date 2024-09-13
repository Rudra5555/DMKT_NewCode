import { Component } from '@angular/core';
import { routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-user-management-profile',
  templateUrl: './user-management-profile.component.html',
  styleUrls: ['./user-management-profile.component.scss']
})
export class UserManagementProfileComponent {
  public routes = routes;
  isClassAdded = false;
  isHiddenTask = false;

  isTaskCompleted: boolean[] = [false];

  toggleTaskCompleted(index: number) {
    this.isTaskCompleted[index] = !this.isTaskCompleted[index];
  }

  public isHidden: boolean[] = [false];
  toggleVisibility(index: number) {
    this.isHidden[index] = !this.isHidden[index];
  }
  addClass(){
    this.isClassAdded =!this.isClassAdded
  }
  taskDelete(){
    this.isHiddenTask = !this.isHiddenTask;
  }
}
