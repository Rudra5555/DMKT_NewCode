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
  id:any;
  userName:any;
  role:any;
  phoneNumber:any;
  emailId:any;
  picture:any;

  isTaskCompleted: boolean[] = [false];

  ngOnInit(): void {
    const storedClient = localStorage.getItem('selectedClient');
    if (storedClient) {
      const client = JSON.parse(storedClient);

      this.id=client.userId;
      this.userName=client.userName;
      this.role=client.role;
      this.phoneNumber=client.phoneNumber;
      this.emailId=client.emailId;
      this.picture=client.userPicture;
      // this.picture = client?.picture || 'assets/default-image.jpg';
      // this.picture = client.picture;
      


      console.log('Received Client Data:', client);
      // alert('Client Name: ' + client.userName);
    } else {
      console.log('No client data found');
    }
  }

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
