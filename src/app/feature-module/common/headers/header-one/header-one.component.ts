import { Component, OnInit } from '@angular/core';
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
  public rejectReasonFlag = false;
  public roleFlagHod: boolean = true;
  public hodNotify!: Array<data>;
  public userNotify!: Array<data>;
  public notificationData!: Array<data>;
  public userNotificationData!: Array<data>;
  public userModalData!: Array<modalUserData>;
  public hodModalData!: Array<modalHodData>;
  public notificationCount: any;
  public selectedItem: any = null;
  public selectedHodItem: any;
  public userNotifyCount: any;
  public hodModalForm !: FormGroup;
  public loggedHodId: any;
  public loggedUserId: any;
  public dataArray: DocumentData[] = [];
  public reasonFlag: boolean = false;
  resp: any;
  msg: any;
  respData: any;
  selectFileData: any;
  public reason: string = '';
  public loggedSuperUserId: any;
  approverStatus: any;
  public userReasonFlag: boolean = true;
  public disableSubmitBtn: boolean = false;
  constructor(
    private sideBar: SideBarService,
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
      reason: ['', Validators.required]
    });

    this.loggedUserId = localStorage.getItem('loggedInUserId');
    this.userNotificationBell(this.loggedUserId);
    this.uname = localStorage.getItem("loggedUserName");
    this.userRole = localStorage.getItem('role');
    this.roleWiseTotification();

    // Fetch notifications
    if (this.loggedUserId) {
      console.log();

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


  public userNotificationBell(userId: any) {

    if (!userId) {
      return;
    } else {

      this.loginService.userNotification(userId).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.resp = event.body.data

            this.respData = this.resp;

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
    if (this.approverStatus == "R") {
      this.reasonFlag = true;


    } if (this.approverStatus == "A") {
      this.disableSubmitBtn = false;
      this.reasonFlag = false;
    } if (this.approverStatus == '') {
      this.reasonFlag = false;
    }


    if (status == 'R' && reason == '') {

      console.error('Provide the reason for the rejection!');
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

    // Validation checks
    if (!status) {
      console.error('No status selected');
      this.unsuccessfulSubmitAlert();
      return;
    }



    const payload = {
      stepId: this.selectedHodItem?.stepId,
      documentId: this.selectedHodItem?.documentId,
      documentApprovalStatus: status,
      reason: reason
    };


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
      window.location.reload();
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
      this.selectedHodItem = selectedItem;
    } else {
      console.error('Item not found for:', requestorName);
    }
  }


  onItemClick(item: any): void {
    this.selectFileData = item;
    if (this.selectFileData.reason == null) {
      this.userReasonFlag = true;
    } else {
      this.userReasonFlag = false;
    }

  }



  public roleWiseTotification() {

    if (this.userRole == "Admin" || this.userRole == "Librarian") {
      this.roleFlag = true;
      this.roleFlagHod = true;
    }
    if (this.userRole == "User" || this.userRole == "SuperUser") {
      this.roleFlagHod = true;
      this.roleFlag = false;
    }
    if (this.userRole == "HOD") {
      this.roleFlag = true;
      this.roleFlagHod = false;
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
