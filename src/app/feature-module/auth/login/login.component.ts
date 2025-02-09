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

import { AES } from 'crypto-ts';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { an } from '@fullcalendar/core/internal-common';



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
  public data : any;
  
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
        password: ['', [Validators.required, Validators.minLength(6),this.lowercasePasswordValidator]],
      
      });
     
      // // localStorage.setItem("Passeord", "password");\
      // localStorage.removeItem('user_role');
      
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



//   onClickSubmit(formData: any){
// // alert("called 1st")
// if (this.loginForm.invalid) {
//    this.loginForm.markAllAsTouched();
//     return;
  
// }

//  let loginData={
//   'userName': this.loginForm.controls['emailId'].value,
//   'password': this.loginForm.controls['password'].value
//  }



// if(loginData){
//  // //console.log("hii")
//   //console.log("payload ::" ,JSON.stringify(loginData))
//   this.loginService.login(loginData).subscribe({
//     next: (event: any) => {
//       if (event instanceof HttpResponse) {
//         this.data = event.body
//         // console.log("jjjjjjjjjj",JSON.stringify(this.data))
//       //  //console.log(resp.value.role)
       
//         if(this.data!=null){
         
//           if(this.data.response!=null){
//             this.getRoleData = this.data.response.role;

//             // console.log("kkkkkkkkkkk",this.getRoleData)

//             localStorage.setItem('role', this.getRoleData)
//           }
//           else{
//             // this.bottomCenter()
//             this.errorFlg=true;
//             this.errorMsg="Invalid UserName Or Password!!!!!"

//             setTimeout(()=>{
//               this.resetErrFlag()
//               }, 2000);
            
//           }
       
          
//           // //console.log("inside datattaaaaaaaaa")
//         //  //console.log(resp.value.role)
//          // sessionStorage.setItem('user_role', resp.value.role);
//           // const observable = from(this.data.response.role);
 
//           // this.dataService.send_data.next(this.data.response.role)

//          // localStorage.setItem('user_role', resp.value.role);

//          if(this.getRoleData == "Admin"){

//           // this.router.navigate([routes.adminDashboard],{queryParams : this.data.value});
//           // localStorage.setItem("loggedUserName",this.data.response.userName);

//           const userId = this.data.response.userId;
//           // //console.log("userID",userId)
//           const userName = this.data.response.userName; 
//           //this.router.navigate([routes.adminDashboard], { queryParams: { userId: userId } });

//           const secretKey = this.timestamp;
//           const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.response.userId), secretKey).toString();
//           console.log("encrypted::",encryptedParam);
//           this.router.navigate([routes.employee],{queryParams : { param: encryptedParam }})
          
        
//           localStorage.setItem("loggedUserName", userName);
          
//           // const userId = this.data.response.userId;
//           localStorage.setItem("loggedInUserId",userId);

//         }


//         if(this.getRoleData == "Librarian"){

//           const userId = this.data.response.userId;

//           localStorage.setItem("loggedInUserId",userId);
        
//           //  this.router.navigate([routes.employee],{queryParams : this.data.value})
//           const secretKey = this.timestamp;
//           const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.value), secretKey).toString();
//           console.log("encrypted::",encryptedParam);
//           this.router.navigate([routes.employee],{queryParams : { param: encryptedParam }})

//           localStorage.setItem("loggedUserName",this.data.response.userName);

          
//         }

//         if(this.getRoleData == "User"){
//           const userId = this.data.response.userId;
//           // localStorage.setItem("loggedUserId",userId);

//           localStorage.setItem("loggedInUserId",userId)
          

//           const navigationExtras:NavigationExtras = {
//             state:{
//               username:this.getRoleData
//             }
//           }
//          localStorage.setItem("loggedUserName",this.data.response.userName);
//          const secretKey = this.timestamp;
//          const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.response), secretKey).toString();
//          console.log("encrypted::",encryptedParam);
         

//           this.router.navigate([routes.employee],{queryParams : { param: encryptedParam }})

//           // this.router.navigate([routes.employee],{queryParams : this.data.response})
//         }
//         if(this.getRoleData == "SuperUser"){
//           this.router.navigate([routes.employee],{queryParams : this.data.response})
//           console.log("super user",this.getRoleData)
//           const secretKey = this.timestamp;
//           const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.response), secretKey).toString();
//           console.log("encrypted::",encryptedParam);
          
        
//           localStorage.setItem("loggedUserName",this.data.response.userName);
//           const userId = this.data.response.userId;
//           localStorage.setItem("loggedSuperUserId",userId);
//           localStorage.setItem("loggedInUserId",userId);
//         }

//         if(this.getRoleData == "HOD"){

//           const hodId = this.data.response.userId;
//           localStorage.setItem("loggedHodId",hodId);
//           localStorage.setItem("loggedInUserId",hodId)
//           //console.log("hodID",hodId)
//           const navigationExtras:NavigationExtras = {
//             state:{
//               username:this.getRoleData
//             }
//           }
//          localStorage.setItem("loggedUserName",this.data.response.userName);
//          const secretKey =  this.timestamp;
//          const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.response), secretKey).toString();
//          console.log("encrypted::",encryptedParam);
         

//           this.router.navigate([routes.employee],{queryParams : { param: encryptedParam }})
//         }

       

//         }
      
       
//        // alert(this.getRoleData)
      


     




       
//         const msg = JSON.stringify(event) + ": Successful!";
//         // this.message.push(msg);
//         //console.log(msg)
//       //  this.fileInfos = this.uploadService.getFiles();
//       }
//     },
//     error: (err: any) => {
//       let msg = loginData + ": Failed!";

//       if (err.error && err.error.message) {
//         msg += " " + err.error.message;
//       }

//       this.message.push(msg);
//      // this.fileInfos = this.uploadService.getFiles();
//     }
//   });

  


// } //end if


// /*if(this.getRoleData == "Admin"){
//   this.router.navigate([routes.adminDashboard]);

// }
// if(this.getRoleData == "Librarian"){

//   this.router.navigate([routes.leadDashboard])
// }
// if(this.getRoleData == "User"){
//   this.router.navigate([routes.employee])
// }
// if(this.getRoleData == "SuperUser"){
//   this.router.navigate([routes.employee])
// }*/
 
 
// //  const t = (localStorage.getItem('EmailId'));
// //     //console.log(t)
  
//     // //console.log(this.loginForm.controls['emailId'].value)
//     // const test = this.loginForm.controls['emailId'].value

//     // //console.log("onClick",test)
//     // sessionStorage.setItem('Email', test);
//     // localStorage.setItem('EmailId', test );
//     // //console.log("localShtorage value: ",localStorage.getItem('EmailId' ));
//     // //console.log("SessionShtorage value: ",sessionStorage.getItem('Email'))
//     this.test();
//   }
  
onClickSubmit(formData: any){
  // alert("called 1st")
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
           this.data = event.body
  
         
          if(this.data!=null){
           
            if(this.data.status ===417){

              this.errorFlg=true;
              this.errorMsg="Invalid UserName Or Password!!!!!"
  
              setTimeout(()=>{
                this.resetErrFlag()
                }, 2000);

            }
            else if(this.data.status === 200 && this.data.response === null){
              this.modalMessage =this.data.message;
              this.sucessAlert( this.modalMessage);
             
            }
            else{
              this.getRoleData = this.data.response.role;
              localStorage.setItem('role', this.getRoleData)
            }
         
            
  
           if(this.getRoleData == "Admin"){

            const userId = this.data.response.userId;
            const userName = this.data.response.userName; 
            const secretKey = this.timestamp;
            const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.response.userId), secretKey).toString();
            console.log("encrypted::",encryptedParam);
            this.router.navigate([routes.employee],{queryParams : { param: encryptedParam }}) 
            localStorage.setItem("loggedUserName", userName);
            localStorage.setItem("loggedInUserId",userId);
  
          }
  
  
          if(this.getRoleData == "Librarian"){
  
            const userId = this.data.response.userId;  
            localStorage.setItem("loggedInUserId",userId);
            const secretKey = this.timestamp;
            const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.value), secretKey).toString();
            console.log("encrypted::",encryptedParam);
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
           console.log("encrypted::",encryptedParam);     
            this.router.navigate([routes.employee],{queryParams : { param: encryptedParam }})
          }

          if(this.getRoleData == "SuperUser"){
            this.router.navigate([routes.employee],{queryParams : this.data.response})
            console.log("super user",this.getRoleData)
            const secretKey = this.timestamp;
            const encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(this.data.response), secretKey).toString();
            console.log("encrypted::",encryptedParam);

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
           console.log("encrypted::",encryptedParam);
           
  
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


  test(){

   // const Test1 = sessionStorage.getItem('Email');
  //  //console.log("from Session"+Test1)

  //  const test2 = localStorage.getItem('EmailId');
  //  //console.log("from Session"+test2)

   
  }
  // bottomCenter(message: string, tittle?: string) {
  //   this.toaster.info(message, tittle || 'Kanakku', {
  //     timeOut: 1000,
  //     progressBar: true,
  //     progressAnimation: 'increasing',
  //     positionClass: 'toast-bottom-center',
  //   });
  // }
  resetErrFlag(){
    this.errorFlg=false;
  }
}
