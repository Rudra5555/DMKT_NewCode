import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  departmentNameList: any;
  plantNameList: any;
  sanitizedImage: SafeUrl = "";

  constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const storedClient = localStorage.getItem('selectedClient');
    if (storedClient) {
      const client = JSON.parse(storedClient);

      this.id=client.userId;
      this.userName=client.userName;
      this.role=client.accessRoles;
      this.phoneNumber=client.phoneNumber;
      this.emailId=client.emailId;
      // this.picture=client.userPicture;

      this.picture = client.userPicture;
      this.sanitizedImage = this.sanitizer.bypassSecurityTrustUrl(this.picture);
      this.departmentNameList = client.departmentNameList;
     
      


      console.log('Received Client Data:', client);
      // alert('Client Name: ' + client.userName);
    } else {
      console.log('No client data found');
    }
    this.cdr.detectChanges();
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
