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

  constructor(private router: Router,private loginService : LoginComponentService,private dataService : DataService ,private formBuilder: FormBuilder) {}


  ngOnInit(): void {


// ***********encryption part**********
let payload = {
  "id": "",
  "first_name": "biplob",
  "last_name": "das",
  "email": "biplob1@gmail.com",
  "user_name": "biplob",
  "password": "Biplob123@#",
  "role": "DO"
};

// //console.log(JSON.stringify(payload));

// Encrypt the payload using AES
const encryptedMessage = AES.encrypt(JSON.stringify(payload), '123').toString();

// //console.log("This is the encrypted message:", encryptedMessage);

// Decrypt the message
const bytes = AES.decrypt(encryptedMessage, "123");
const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

// //console.log("Decrypted data:", JSON.stringify(decryptedData, null, 2));




    localStorage.clear();
      // this.loginForm = this.formBuilder.group({
      //   emailId: ['',[]],
      //   password: ['',[]]
        
      // });

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
 // //console.log("hii")
  //console.log("payload ::" ,JSON.stringify(loginData))
  this.loginService.login(loginData).subscribe({
    next: (event: any) => {
      if (event instanceof HttpResponse) {
        this.data = event.body
        // console.log("jjjjjjjjjj",JSON.stringify(this.data))
      //  //console.log(resp.value.role)
       
        if(this.data!=null){
         
          if(this.data.response!=null){
            this.getRoleData = this.data.response.role;

            // console.log("kkkkkkkkkkk",this.getRoleData)

            localStorage.setItem('role', this.getRoleData)
          }
          else{
            // this.bottomCenter()
            this.errorFlg=true;
            this.errorMsg="Invalid UserName Or Password!!!!!"

            setTimeout(()=>{
              this.resetErrFlag()
              }, 2000);
            
          }
       
          
          // //console.log("inside datattaaaaaaaaa")
        //  //console.log(resp.value.role)
         // sessionStorage.setItem('user_role', resp.value.role);
          // const observable = from(this.data.response.role);
 
          // this.dataService.send_data.next(this.data.response.role)

         // localStorage.setItem('user_role', resp.value.role);

         if(this.getRoleData == "Admin"){

          // this.router.navigate([routes.adminDashboard],{queryParams : this.data.value});
          // localStorage.setItem("loggedUserName",this.data.response.userName);

          const userId = this.data.response.userId;
          // //console.log("userID",userId)
          const userName = this.data.response.userName; 
     
          this.router.navigate([routes.adminDashboard], { queryParams: { userId: userId } });
        
          localStorage.setItem("loggedUserName", userName);
          
          // const userId = this.data.response.userId;
          localStorage.setItem("loggedInUserId",userId);

        }


        if(this.getRoleData == "Librarian"){

          const userId = this.data.response.userId;

          localStorage.setItem("loggedInUserId",userId);
        
          this.router.navigate([routes.employee],{queryParams : this.data.value})
          localStorage.setItem("loggedUserName",this.data.response.userName);

          
        }

        if(this.getRoleData == "User"){
          const userId = this.data.response.userId;
          // localStorage.setItem("loggedUserId",userId);

          localStorage.setItem("loggedInUserId",userId)

          const navigationExtras:NavigationExtras = {
            state:{
              username:this.getRoleData
            }
          }
         localStorage.setItem("loggedUserName",this.data.response.userName);
          this.router.navigate([routes.employee],{queryParams : this.data.response})
        }
        if(this.getRoleData == "SuperUser"){
          this.router.navigate([routes.employee],{queryParams : this.data.response})
          localStorage.setItem("loggedUserName",this.data.response.userName);
          const userId = this.data.response.userId;
          localStorage.setItem("loggedSuperUserId",userId);
          localStorage.setItem("loggedInUserId",userId);
        }

        if(this.getRoleData == "HOD"){

          const hodId = this.data.response.userId;
          localStorage.setItem("loggedHodId",hodId);
          localStorage.setItem("loggedInUserId",hodId)
          //console.log("hodID",hodId)
          const navigationExtras:NavigationExtras = {
            state:{
              username:this.getRoleData
            }
          }
         localStorage.setItem("loggedUserName",this.data.response.userName);
          this.router.navigate([routes.employee],{queryParams : this.data.response})
        }

       

        }
      
       
       // alert(this.getRoleData)
      


     




       
        const msg = JSON.stringify(event) + ": Successful!";
        // this.message.push(msg);
        //console.log(msg)
      //  this.fileInfos = this.uploadService.getFiles();
      }
    },
    error: (err: any) => {
      let msg = loginData + ": Failed!";

      if (err.error && err.error.message) {
        msg += " " + err.error.message;
      }

      this.message.push(msg);
     // this.fileInfos = this.uploadService.getFiles();
    }
  });

  


} //end if


/*if(this.getRoleData == "Admin"){
  this.router.navigate([routes.adminDashboard]);

}
if(this.getRoleData == "Librarian"){

  this.router.navigate([routes.leadDashboard])
}
if(this.getRoleData == "User"){
  this.router.navigate([routes.employee])
}
if(this.getRoleData == "SuperUser"){
  this.router.navigate([routes.employee])
}*/
 
 
//  const t = (localStorage.getItem('EmailId'));
//     //console.log(t)
  
    // //console.log(this.loginForm.controls['emailId'].value)
    // const test = this.loginForm.controls['emailId'].value

    // //console.log("onClick",test)
    // sessionStorage.setItem('Email', test);
    // localStorage.setItem('EmailId', test );
    // //console.log("localShtorage value: ",localStorage.getItem('EmailId' ));
    // //console.log("SessionShtorage value: ",sessionStorage.getItem('Email'))
    this.test();
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
