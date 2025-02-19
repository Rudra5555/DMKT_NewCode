import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { routes } from 'src/app/core/core.index';
interface data {
  value: string;
}

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
})
export class EmployeeProfileComponent implements OnInit {
  public selectedValue1 = '';
  public selectedValue2 = '';
  public selectedValue3 = '';
  public selectedValue4 = '';
  public selectedValue5 = '';
  public selectedValue6 = '';
  public selectedValue7 = '';
  public selectedValue8 = '';
  public selectedValue9 = '';
  public selectedValue10 = '';
  public selectedValue11 = '';
  public selectedValue12 = '';
  public selectedValue13 = '';
  public selectedValue14 = '';
  public selectedValue15 = '';
  public routes = routes;
  bsValue = new Date();
  public addEmployeeForm!: FormGroup;
  userName: any;
  userId: any;
  roles: any;
  phone: any;
  email: any;
  deptNames: any;
  plantNames: any;
  firstName:any;
  lastName:any;
  departmentNameList:any;
  picture:any;
  accessRoles: any;
  sanitizedImage: any;
  constructor(private formBuilder: FormBuilder,private sanitizer: DomSanitizer,) {}

  ngOnInit() {
    this.addEmployeeForm = this.formBuilder.group({
      client: ['', [Validators.required]],
    });

    this.userName = localStorage.getItem("loggedUserName");
    this.userId = localStorage.getItem("loggedInUserId");
    this.roles = localStorage.getItem("role");
    this.accessRoles = localStorage.getItem("accessRole");
    this.firstName = localStorage.getItem("name");
    this.lastName = localStorage.getItem("title");
    this.phone = localStorage.getItem("phNumberLog");
    this.email = localStorage.getItem("EmailLog");
    this.picture = localStorage.getItem("PictureLog") || '/assets/img/userIcon.png';
    this.sanitizedImage = this.sanitizer.bypassSecurityTrustUrl(this.picture);

console.log("Picture",this.picture);

    const storedData = localStorage.getItem('deptDetails');
    this.departmentNameList = storedData ? JSON.parse(storedData) : [];
    
    console.log("deptDetails",this.departmentNameList);
    console.log("Name",this.firstName);
    

    

  }

  
}
