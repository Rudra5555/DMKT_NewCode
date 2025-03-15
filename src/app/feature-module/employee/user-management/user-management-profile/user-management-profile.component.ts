
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IdleService } from 'src/app/services/idle.service'; // Import IdleService
import { routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-user-management-profile',
  templateUrl: './user-management-profile.component.html',
  styleUrls: ['./user-management-profile.component.scss']
})
export class UserManagementProfileComponent implements OnInit {
  public routes = routes;
  isClassAdded = false;
  isHiddenTask = false;
  id: any;
  userName: any;
  role: any;
  phoneNumber: any;
  emailId: any;
  picture: any;
  sanitizedImage: SafeUrl = '';
  departmentNameList: any;
  plantNameList: any;

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private idleService: IdleService // Inject IdleService here
  ) {}

  ngOnInit(): void {
    const storedClient = this.idleService.getClientData(); // Get client data from IdleService
    if (storedClient) {
      this.id = storedClient.userId;
      this.userName = storedClient.userName;
      this.role = storedClient.accessRoles;
      this.phoneNumber = storedClient.phoneNumber;
      this.emailId = storedClient.emailId;
      this.picture = storedClient.userPicture;
      this.sanitizedImage = this.sanitizer.bypassSecurityTrustUrl(this.picture);
      this.departmentNameList = storedClient.departmentNameList;
    } else { 
    }
    this.cdr.detectChanges();
  }

 
}
