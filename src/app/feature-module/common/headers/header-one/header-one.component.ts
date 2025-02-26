import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SideBarService } from 'src/app/core/services/side-bar/side-bar.service';
import { NavigationEnd, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { E } from '@angular/cdk/keycodes';
import Swal from 'sweetalert2';



interface data {
  id: number, hodName: string, docName: string, last_modified?: string, requestorName: string, documentId?: number;
}

interface modalUserData {
  RequestedDocumentName: string, DepartmentName: string, UniqueDocumentName: string, ApproverRejecterName: string, plantName: string,
  reason: string, attachment: string, RequestedStatus: string, DocumentType: string;
}

interface modalHodData {
  RequestedDocumentName: string, DepartmentName: string, UniqueDocumentName: string, ApproverRejecterName: string, plantName: string,
  reason: string, attachment: string, RequestedStatus: string, DocumentType: string, RequesterName: string;
}

interface UpdateDocumentStatusResponse {
  status: number;
  message: string;
  data?: any; // Optional if you have other fields in the response
}


interface DocumentData {
  stepId: number;
  documentId: number;
  documentName: string;
  generateBy: number;
  requesterName: string;
  uniqueDocumentName: string;
  fileUrl: string;
  executerName: string;
  departmentName: string;
  plantName: string;
  generatedByEmail: string;
  userDepartment: string | null;
  documentType: string;
  generateOn: string;
  assignTo: number;
  documentApprovalStatus: string;
  executedBy: string;
  executedOn: string | null;
  uploadImg: string;
}

interface ApiResponse {
  status: number;
  data: DocumentData[];
}

@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss'],
})
export class HeaderOneComponent implements OnInit {
  public base = '';
  public page = '';
  public routes = routes;
  public miniSidebar = false;
  public baricon = false;
  public uname: any;
  public userRole: any;
  public roleFlag: boolean = true;
  public roleFlagStatutory: boolean = true;
  public roleLibFlag: boolean = true;
  public rejectReasonFlag = false;
  public roleFlagHod: boolean = true;
  public hodNotify!: Array<data>;
  public userNotify!: Array<data>;
  public notificationData!: Array<data>;
  public notificationDataTwo!: Array<data>;
  public userNotificationData!: Array<data>;
  public userModalData!: Array<modalUserData>;
  public hodModalData!: Array<modalHodData>;
  public notificationCount: any;
  public notificationCountTwo: any;
  public selectedItem: any = null;
  public selectedHodItem: any;
  public userNotifyCount: any;
  public userNotifyCountTwo: any;
  public hodModalForm !: FormGroup;
  public loggedHodId: any;
  public loggedUserId: any;
  public dataArray: DocumentData[] = [];
  public reasonFlag: boolean = false;
  roles: any;
  selectedRole: string = '';
  resp: any;
  msg: any;
  respData: any;
  notificTwo: any;
  selectFileData: any;
  public reason: string = '';
  public loggedSuperUserId: any;
  approverStatus: any;
  public userReasonFlag: boolean = true;
  public disableSubmitBtn: boolean = false;
  selectedUserRole: any;
  dateFlag: boolean = false;
  formattedDate: any;
  validUpto: any;
  validUptoFormated: any;
  expDateFlag: boolean = false;
  selectedFileUploadData: any;
  userFileReasonFlag: boolean = false;
  readNotification: any;
  statutoryUnreadNotification: any;
  statutoryReadNotification: any;
  expDate: any;
 
  constructor(
    private sideBar: SideBarService,private cdr: ChangeDetectorRef,
    private router: Router, private fb: FormBuilder, private loginService: LoginComponentService, private snackBar: MatSnackBar

  ) {


    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res === 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
        if (
          this.base === 'components' ||
          this.page === 'tasks' ||
          this.page === 'email'
        ) {
          this.baricon = false;
          localStorage.setItem('baricon', 'false');
        } else {
          this.baricon = true;
          localStorage.setItem('baricon', 'true');
        }
      }
    });
    if (localStorage.getItem('baricon') == 'true') {
      this.baricon = true;
    } else {
      this.baricon = false;
    }


  }
  ngOnInit(): void {

    
    this.hodModalForm = this.fb.group({
      status: ['', Validators.required],
      expDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
    // let expDate = this.hodModalForm.get('expDate')?.value;
    // if (expDate) {
    //   const date = new Date(expDate);
    //   const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits for the day
    //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    //   const year = date.getFullYear();
    //   const formattedDate = `${day} ${month} ${year}`;
    //   console.log(formattedDate); // Output: 17 01 2025
    // }
    // this.dateFlag = true;

    this.selectedUserRole = localStorage.getItem('role');
    this.loggedUserId = localStorage.getItem('loggedInUserId');

    this.loginService.accessRole(this.loggedUserId).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.resp = event.body.response
          this.roles = this.resp;
          // localStorage.setItem('Arole', this.roles);
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      }
    });


    // this.loginService.notificTwo(this.loggedUserId).subscribe({
    //   next: (event: any) => {
    //     if (event instanceof HttpResponse) {
    //       this.resp = event.body.data
    //       const notificTwoo = this.resp;
    //       console.log("before filter::::",notificTwoo);
          
    //        // Filter out only the notifications where markAsRead is false
    //   this.notificTwo = this.resp.filter((notification: any) => !notification.markAsRead); //markedAsRead = false
      
    //   console.log("Filtered notificTwo::::", this.notificTwo);

    //   this.readNotification = this.resp.filter((notification: any) => notification.markAsRead); //markedAsRead = true
    //       // console.log("readNotification", this.readNotification);
    //   localStorage.setItem('fileUploadNotificationList', JSON.stringify(this.readNotification));
          
    //       this.userNotifyCountTwo = this.notificTwo.length;
    //     }
    //   },
    //   error: (err: any) => {
    //     if (err.error && err.error.message) {
    //       this.msg += " " + err.error.message;
    //     }
    //   }
    // });

    this.userNotificationBell(this.loggedUserId);
    this.userFileNotificationBell(this.loggedUserId);

    this.uname = localStorage.getItem("loggedUserName");
    console.log(this.uname);

    this.userRole = localStorage.getItem('role');
    this.roleWiseTotification();

    // Fetch notifications
    if (this.loggedUserId) {
      console.log("loggged lib;;;;", this.loggedUserId);

      this.loginService.getNotifications(this.loggedUserId).subscribe(
        (response: any) => {
          if (response.body && response.body.status === 200) {
            this.notificationData = response.body.data.map((notification: any) => ({
              id: notification.documentId,
              stepId: notification.stepId,
              documentId: notification.documentId,
              docName: notification.documentName,
              RequestedDocumentName: notification.documentName,
              requestorName: notification.requesterName,
              RequesterName: notification.requesterName,
              UniqueDocumentName: notification.uniqueDocumentName,
              plantName: notification.plantName,
              DepartmentName: notification.departmentName,
              DocumentType: notification.documentType,
              hodName: notification.executerName || 'HOD',
              uploadImg: notification.uploadImg,
            }));
            console.log("rrrrrrrr;;;", this.notificationData);

            this.notificationCount = this.notificationData.length;
          } else {
          }
        },
        (error) => {
          console.error('Failed to fetch notifications:', error);
        }
      );
    } else {
    }

    this.notificationData = this.hodNotify

    if (this.notificationCount != null) {
      this.notificationCount = this.notificationData.length;
    }


  }


  userNotificationBell(userId: any) {
    
    if (!userId) {
      return;
    } else {

      this.loginService.userNotification(userId).subscribe({
        
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.resp = event.body.data
            // this.respData = this.resp;
            this.respData = this.resp.filter((notification: any) => !notification.markAsRead);  //markedAsRead = false
      
      console.log("Filtered statutoryUnreadNotification", this.respData);

      this.statutoryReadNotification = this.resp.filter((notification: any) => notification.markAsRead);  //markedAsRead = true
          // console.log("send statutoryReadNotification read list", this.statutoryReadNotification);
          localStorage.setItem('statutoryReadNotificationList', JSON.stringify(this.statutoryReadNotification));
            

            this.userNotificationData = this.respData;
            this.userNotifyCount = this.userNotificationData.length;

          }
        },
        error: (err: any) => {
          if (err.error && err.error.message) {
            this.msg += " " + err.error.message;
          }
        }
      });

    }

  }

  userFileNotificationBell(userId: any) {
    
    if (!userId) {
      return;
    } else {
      this.loginService.notificTwo(userId).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.resp = event.body.data
            const notificTwoo = this.resp;
            console.log("before filter::::",notificTwoo);
            
             // Filter out only the notifications where markAsRead is false
        this.notificTwo = this.resp.filter((notification: any) => !notification.markAsRead); //markedAsRead = false
        
        console.log("Filtered notificTwo::::", this.notificTwo);
  
        this.readNotification = this.resp.filter((notification: any) => notification.markAsRead); //markedAsRead = true
            // console.log("readNotification", this.readNotification);
        localStorage.setItem('fileUploadNotificationList', JSON.stringify(this.readNotification));
            
            this.userNotifyCountTwo = this.notificTwo.length;
          }
        },
        error: (err: any) => {
          if (err.error && err.error.message) {
            this.msg += " " + err.error.message;
          }
        }
      });

    }

  }



  getApprovalStatus(status: string): string {
    switch (status) {
      case 'P':
        return 'Pending';
      case 'R':
        return 'Rejected';
      case 'A':
        return 'Approved';
      default:
        return status;
    }
  }


  getApprovalStatusUserModal(status: string): string {
    switch (status) {
      case 'P':
        return 'Pending';
      case 'R':
        return 'Rejected';
      case 'A':
        return 'Approved';
      default:
        return status;
    }
  }

  onRoleChange(role: any) {
    this.selectedRole = role;
    this.selectedUserRole = role;
    console.log('Selected Role:', this.selectedRole);
    localStorage.setItem('role', this.selectedRole);
    localStorage.getItem('role');
    // this.router.navigate([routes.employee]);
    // location.href = location.href;            //page reload code
    this.router.navigate([routes.employee]).then(() => {
      location.href = location.href; // Reloads the page after navigation
    });
  }



  getMimeType(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'html':
        return 'text/html';
      default:
        return 'application/octet-stream';
    }
  }


  statusSelect(event: any) {

    const status = this.hodModalForm.get('status')?.value;
    const reason = this.hodModalForm.get('reason')?.value;




    this.approverStatus = event.target.value;
    console.log('Approver Status:', this.approverStatus);
    
    if (this.approverStatus == "R") {
      this.expDateFlag = true;
     
      console.log(this.expDateFlag);
      
      this.reasonFlag = true;
    } if (this.approverStatus == "A") {
      this.expDateFlag = false;
      this.disableSubmitBtn = false;
      this.reasonFlag = false;
    } if (this.approverStatus == '') {
      this.expDateFlag = false;
      this.reasonFlag = false;
    }
    console.log('expDateFlag:', this.expDateFlag);
    this.cdr.detectChanges(); // Force UI update if needed


    if (status == 'R' && reason == '') {
      // console.error('Provide the reason for the rejection!');
      
      this.rejectReasonFlag = true;
      this.disableSubmitBtn = true;
      return;
    } if (status == 'R' && reason != '') {
      this.rejectReasonFlag = false;
      this.disableSubmitBtn = false;
    } if (status == 'A') {
      this.disableSubmitBtn = false;
    } else {
      this.rejectReasonFlag = false;
      this.disableSubmitBtn = true;
    }
  }



  rejectReason(event: any) {
    const rejectReason = event.target.value
    if (rejectReason) {
      this.disableSubmitBtn = false;
    }
  }



  updateDocumentStatus(): void {
    if (!this.selectedHodItem) {
      console.error('No document selected');
      return;
    }

    // Retrieve form values
    const status = this.hodModalForm.get('status')?.value;
    const reason = this.hodModalForm.get('reason')?.value;
    this.expDate = this.hodModalForm.get('expDate')?.value;
    console.log('Form START:', this.expDate);
    
    if (this.expDate != '') {
      const date = new Date(this.expDate);
      const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits for the day
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const year = date.getFullYear();
      this.formattedDate = `${day}-${month}-${year}`;
      // console.log("FOrmated data :",this.formattedDate); // Output: 17 01 2025
    }
    else{
      this.formattedDate = '';
      // console.log("F)))))rmated data :",this.formattedDate);
    }
  
    if (this.expDate) {
      const selectedDate = new Date(this.expDate);
      const currentDate = new Date();
    
      // Set time for both dates to 00:00:00 to compare only the date part
      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
    
      if (selectedDate <= currentDate) {
        this.dateFlag = true;
        console.error('The selected date must be greater than the current date.');
        // Optionally, set an error in the form control or display an error message
        this.hodModalForm.get('expDate')?.setErrors({ invalidDate: true });
      } else {
        console.log('The selected date is valid.');
      }
    }
    console.log('Form  END:',   this.expDate);
    // Validation checks
    if (!status) {
      console.error('No status selected');
      this.unsuccessfulSubmitAlert();
      return;
    }



    const payload = {
      executedBy: this.loggedUserId,
      stepId: this.selectedHodItem?.stepId,
      documentId: this.selectedHodItem?.documentId,
      documentApprovalStatus: status,
      expDate: this.formattedDate,
      reason: reason
    };
    console.log('Payload:', payload);
    


    this.loginService.updateDocumentStatus(payload).subscribe((response: Object | null) => {
      if (response && (response as UpdateDocumentStatusResponse).status === 200) {
        const typedResponse = response as UpdateDocumentStatusResponse; // Type assertion
        const message = typedResponse.message; // Extract the message from the response



        if (message && message !== 'Error!!') {
          if (message == "Success!!") {
            this.successfulSubmitAlert();
          }

          // Remove the approved/rejected notification from the notification list
          this.notificationData = this.notificationData.filter(item => item.documentId !== this.selectedHodItem?.documentId);
          // Update the notification count
          this.notificationCount = this.notificationData.length;
          this.selectedHodItem = null;
        } else {
          // Handle the error message from the backend
          console.error('Error updating document status:', message);
          if (message == 'Error!!') {
            this.unsuccessfulSubmitAlert();
          }

        }

      } else {
        // Handle unexpected status codes
        const errorMessage = (response as UpdateDocumentStatusResponse)?.message || 'Unknown error';
        console.error('Unexpected response:', errorMessage);
        this.snackBar.open('Unexpected response: ' + errorMessage, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    }, error => {
      console.error('Error updating document status:', error);
      this.snackBar.open('Error updating document status: ' + error.message, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    });
  }



  successfulSubmitAlert() {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your request is being submitted successfully.",
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      // // window.location.reload();
      // location.href = location.href;
    });
  }

  unsuccessfulSubmitAlert() {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Select the status!",
    });
  }




  onHodItemClick(requestorName: string): void {

    // Find the item based on requestorName or other unique identifiers
    const selectedItem = this.notificationData.find(item => item.requestorName === requestorName);
    if (selectedItem) {
      console.log('Selected item:', selectedItem);
      
      this.selectedHodItem = selectedItem;
    } else {
      console.error('Item not found for:', requestorName);
    }
  }


  onItemClick(item: any): void {
    this.selectFileData = item;
    console.log('Selected item:', this.selectFileData);
    this.validUpto = this.selectFileData.validUpto;
    // console.log('Valid Upto:', validUpto);
    if (this.validUpto) {
      const dateObj = new Date(this.validUpto); // Convert string to Date object
      this.validUptoFormated = dateObj.toLocaleDateString('en-GB'); // Format date to DD-MM-YYYY
      console.log('Valid Upto (Formatted):', this.validUptoFormated);
    }
    if (this.selectFileData.reason == null) {
      this.userReasonFlag = true;
    } else {
      this.userReasonFlag = false;
    }


     // Call API to mark as read
  this.loginService.markedAsReadStatutoryNotification(item.stepId).subscribe({
    next: (event: any) => {
      if (event instanceof HttpResponse) {
        const res = event.body.status
        console.log("looollll,",res);
          if(res == 200){
      this.userNotificationBell(this.loggedUserId)
      }
        
      }
    },
    error: (error: any) => {
      console.error('Error marking as read:', error);
    }
  });

  }

  onFileNotificationClick(item:any ){
console.log('Selected item workflowDocId:', item.workflowDocId);
// console.log('Selected item onFileNotificationClick:', item);

this.selectedFileUploadData = item;
if (this.selectedFileUploadData.reason == null || this.selectedFileUploadData.reason == '') {
  this.userFileReasonFlag = true;
} else {
  this.userFileReasonFlag = false;
}

  // Call API to mark as read
  this.loginService.markedAsReadFileNotification(item.workflowDocId).subscribe({
    next: (response: any) => {
      console.log('Marked as read response:', response);
      if(response.status == 200){
     this.userFileNotificationBell(this.loggedUserId)
      }
    },
    error: (error: any) => {
      console.error('Error marking as read:', error);
    }
  });

  

  }



  public roleWiseTotification() {

    if (this.userRole == "Admin" || this.userRole == "Librarian") {
      this.roleFlag = true;
      this.roleFlagHod = true;
      this.roleLibFlag = true;
    }
    if (this.userRole == "User" || this.userRole == "SuperUser") {
      this.roleFlagHod = true;
      this.roleFlag = false;
      this.roleLibFlag = true;
      
    }
    if (this.userRole == "HOD") {
      this.roleFlag = true;
      this.roleFlagHod = false;
      this.roleLibFlag = true;
    }
    if (this.userRole == "Librarian") {
      this.roleLibFlag = false;
      this.roleFlag = true;
      this.roleFlagHod = true;

    }
    if (this.userRole == "User") {
      this.roleFlagHod = true;
      this.roleFlag = false;
      this.roleLibFlag = true;
      this.roleFlagStatutory=false;
      
    }
  }



  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }

  public togglesMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }

  public logout() {

    sessionStorage.getItem("user_role")

    this.router.navigate([routes.login])
  }



  navigation() {
    this.router.navigate([routes.search]);
  }
  
}
