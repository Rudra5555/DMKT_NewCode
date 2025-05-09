
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
  profileImage: SafeUrl | string = 'assets/img/userIcon.png';

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private idleService: IdleService // Inject IdleService here
  ) {}

  ngOnInit(): void {
   // Retrieve client data from IdleService
const storedClient = this.idleService.getClientData();

if (storedClient) {
  // Assign client data to component properties
  this.id = storedClient.userId;
  this.userName = storedClient.userName;
  this.role = storedClient.accessRoles;
  this.phoneNumber = storedClient.phoneNumber;
  this.emailId = storedClient.emailId;
  this.picture = storedClient.userPicture;
  this.departmentNameList = storedClient.departmentNameList;

  // Sanitize user profile picture if available
  if (this.picture && this.picture.trim() !== '') {
    this.sanitizedImage = this.sanitizer.bypassSecurityTrustUrl(this.picture);
  } else {
    // Fallback to default image
    const fallbackImageUrl = './assets/img/userIcon.png';
    this.sanitizedImage = this.sanitizer.bypassSecurityTrustUrl(fallbackImageUrl);
    console.log('No profile picture found, using default image.');
  }

  // Debug: Log picture URL
  console.log('Loaded Profile Picture URL:', this.picture || 'Using fallback image');
}

    // console.log('Image URL:', this.sanitizedImage);
    
  // this.profileImage = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    this.cdr.detectChanges();

  }

 
}
