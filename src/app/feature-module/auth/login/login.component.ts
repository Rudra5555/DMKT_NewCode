import { HttpResponse } from '@angular/common/http';
import { STRING_TYPE } from '@angular/compiler';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/core/core.index';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router ,NavigationExtras} from '@angular/router';
import { Subscription } from 'rxjs';
import { routes } from 'src/app/core/core.index';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { Subject, from } from 'rxjs';

import { AES } from 'crypto-js';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { an } from '@fullcalendar/core/internal-common';
// import crypto from 'crypto-js';
// import CryptoJS from 'crypto-js';


const subject = new Subject<string>();

interface returndata {
  message: string | null;
  status: string | null;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public routes = routes;
  public loginForm!: FormGroup;
  message: any;
  public getRoleData:any;
  public getTitle:any;
  public getDisplayName:any;
  public departmentDetails:any;
  public data : any;
  public getPhNumber:any;
  public getEmail:any;
  public getPicture:any;
  accessRoles: any;
  
  errorFlg:boolean=false
  errorMsg:any;
  toaster: any;
  timestamp: string ='';
  modalMessage: string = '';
  

  constructor(private router: Router,private loginService : LoginComponentService,private dataService : DataService ,private formBuilder: FormBuilder) {}




  ngOnInit(): void {
    this.timestamp = Date.now().toString();
    localStorage.clear();
      this.loginForm = this.formBuilder.group({
        emailId: ['', [Validators.required]],  
        password: ['', [Validators.required]],
      
      }); 


  }

  lowercasePasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const uppercaseRegex = /[A-Z]/; 
    if (password && uppercaseRegex.test(password)) {
      return { notLowercase: true };
    }
    return null;
  }

get formFields(){return this.loginForm.controls; }


onClickSubmit(formData: any){
  if (this.loginForm.invalid) {
     this.loginForm.markAllAsTouched();
      return;
  }
  
   let loginData={
    'userName': this.loginForm.controls['emailId'].value,
    'password': this.loginForm.controls['password'].value
   }
  
  if(loginData){

    
   


    this.loginService.login(loginData).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
         
          const decryptedData = this.loginService.convertEncToDec(event.body);
          
          const jsonObj = JSON.parse(decryptedData);
          if (jsonObj.status === 200) {
          }
                
          // this.data = jsonObj;
          this.data={
            "status": 200,
            "response": {
                "userName": "Librarian",
                "userId":3,
                "role": "Librarian",
                "accessRoles": [
                    "User",
                    "Admin",
                    "HOD"
                ],
                "title":"Rahul",
                "displayName": "Das",
                "departmentNameList": [
                    {
                        "departmentName": "OPERATION",
                        "plantName": "CPP-2 (540MW)"
                    },
                    {
                        "departmentName": "C&I",
                        "plantName": "CPP-3 (1200MW)"
                    }
                ],
                "userPicture": "1234567890",
                "phoneNumber": "9678824924",
                "emailId": "nitish@gmail.com"
            },
            "message": "success!!"
        }

      //   this.data={
      //     "status": 200,
      //     "response": {
      //         "userName": "User",
      //         "userId":1,
      //         "role": "User",
      //         "accessRoles": [
      //             "User",
      //             "Admin",
      //             "HOD"
      //         ],
      //         "title":"Biplob",
      //         "displayName": "Das",
      //         "departmentNameList": [
      //             {
      //                 "departmentName": "OPERATION",
      //                 "plantName": "CPP-2 (540MW)"
      //             },
      //             {
      //                 "departmentName": "C&I",
      //                 "plantName": "CPP-3 (1200MW)"
      //             }
      //         ],
      //         "userPicture": "1234567890",
      //         "phoneNumber": "9678824924",
      //         "emailId": "nitish@gmail.com"
      //     },
      //     "message": "success!!"
      // }

    //   this.data={
    //     "status": 200,
    //     "response": {
    //         "userName": "Admin",
    //         "userId":2,
    //         "role": "Admin",
    //         "accessRoles": [
    //             "User",
    //             "Admin",
    //             "HOD"
    //         ],
    //         "title":"Nitish",
    //         "displayName": "Paul",
    //         "departmentNameList": [
    //             {
    //                 "departmentName": "OPERATION",
    //                 "plantName": "CPP-2 (540MW)"
    //             },
    //             {
    //                 "departmentName": "C&I",
    //                 "plantName": "CPP-3 (1200MW)"
    //             }
    //         ],
    //         "userPicture": "1234567890",
    //         "phoneNumber": "9678824924",
    //         "emailId": "nitish@gmail.com"
    //     },
    //     "message": "success!!"
    // }
          console.log("DecResData",this.data);
  
          if(this.data!=null){   
            if(this.data.status ===417){

              this.errorFlg=true;
              this.errorMsg="Invalid UserName Or Password!!!!!"
  
              setTimeout(()=>{
                this.resetErrFlag()
              },2000);

            }
            else if(this.data.status === 200 && this.data.response === null){
              this.modalMessage =this.data.message;
             
              
              this.sucessAlert(this.modalMessage);
            }
            else{
              this.getRoleData = this.data.response.role;
              this.getTitle = this.data.response.title;
              this.getDisplayName = this.data.response.displayName;
              this.departmentDetails = this.data.response.departmentNameList;
              this.getPhNumber = this.data.response.phoneNumber;
              this.getEmail = this.data.response.emailId;
              this.getPicture = this.data.response.userPicture;
              this.accessRoles = this.data.response.accessRoles;
              
              

              localStorage.setItem('role',this.getRoleData);
              localStorage.setItem('accessRole',this.accessRoles);
              localStorage.setItem('title',this.getTitle);
              localStorage.setItem('name',this.getDisplayName);
              localStorage.setItem('deptDetails', JSON.stringify(this.departmentDetails));

              localStorage.setItem('phNumberLog',this.getPhNumber);
              localStorage.setItem('EmailLog',this.getEmail);
              localStorage.setItem('PictureLog',this.getPicture);
            }
         
            
  
           if(this.getRoleData == "Admin"){

            const userId = this.data.response.userId;
            const userName = this.data.response.userName; 
            const secretKey = this.timestamp;
            const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.response.userId), secretKey).toString();
            // console.log("encrypted::",encryptedParam);
            this.router.navigate([routes.employee],{queryParams : { param: encryptedParam }}) 
            localStorage.setItem("loggedUserName", userName);
            localStorage.setItem("loggedInUserId",userId);
  
          }
  
  
          if(this.getRoleData == "Librarian"){
            const userId = this.data.response.userId;  
            localStorage.setItem("loggedInUserId",userId);
            const secretKey = this.timestamp;
            const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.value), secretKey).toString();
            // console.log("encrypted::",encryptedParam);
            this.router.navigate([routes.employee],{queryParams : { param: encryptedParam }})   
            localStorage.setItem("loggedUserName",this.data.response.userName);        
          }
  
          if(this.getRoleData == "User"){
            const userId = this.data.response.userId;
            localStorage.setItem("loggedInUserId",userId)
            const navigationExtras:NavigationExtras = {
              state:{
                username:this.getRoleData
              }
            }
           localStorage.setItem("loggedUserName",this.data.response.userName);
           const secretKey = this.timestamp;
           const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.response), secretKey).toString();
          //  console.log("encrypted::",encryptedParam);     
            this.router.navigate([routes.employee],{queryParams : { param: encryptedParam }})
          }

          if(this.getRoleData == "SuperUser"){
            this.router.navigate([routes.employee],{queryParams : this.data.response})
            const secretKey = this.timestamp;
            const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.response), secretKey).toString();
            // console.log("encrypted::",encryptedParam);

            localStorage.setItem("loggedUserName",this.data.response.userName);
            const userId = this.data.response.userId;
            localStorage.setItem("loggedSuperUserId",userId);
            localStorage.setItem("loggedInUserId",userId);
          }
  
          if(this.getRoleData == "HOD"){
  
            const hodId = this.data.response.userId;
            localStorage.setItem("loggedHodId",hodId);
            localStorage.setItem("loggedInUserId",hodId)
            const navigationExtras:NavigationExtras = {
              state:{
                username:this.getRoleData
              }
            }
           localStorage.setItem("loggedUserName",this.data.response.userName);
           const secretKey =  this.timestamp;
           const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.response), secretKey).toString();
          //  console.log("encrypted::",encryptedParam);
          
            this.router.navigate([routes.employee],{queryParams : { param: encryptedParam }})
          }
          }    
          const msg = JSON.stringify(event) + ": Successful!";
        }
      },
      error: (err: any) => {
        let msg = loginData + ": Failed!";
  
        if (err.error && err.error.message) {
          msg += " " + err.error.message;
        }
        this.message.push(msg); 
      }
    }); 
  }
}

sucessAlert(message:any){
Swal.fire({
  title: message,
  icon: "success"
});
}
  navigate() {
    this.router.navigate([routes.adminDashboard]);
  }
  public password : boolean[] = [false];

  public togglePassword(index: any){
    this.password[index] = !this.password[index]
  }

  resetErrFlag(){
    this.errorFlg=false;
  }
}
