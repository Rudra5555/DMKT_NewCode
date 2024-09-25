import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SearchComponent } from './search/search.component';
import { FaqComponent } from './faq/faq.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { HodComponent } from './hod/hod.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { UnderMaintenanceComponent } from './under-maintenance/under-maintenance.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PlantAComponent } from './plant-a/plant-a.component';
import { UploadDocComponent } from './upload-doc/upload-doc.component';
// import { DataTablesModule } from 'angular-datatables';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AcceptRequestComponent } from './accept-request/accept-request.component';
import { ListRequestComponent } from './list-request/list-request.component';
import { ApprovalListComponent } from './approval-list/approval-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditorModule } from 'primeng/editor';
import { RequestedDocComponent } from './requested-doc/requested-doc.component';
import { MainHeadComponent } from './main-head/main-head.component';
import { PlantComponent } from './plant/plant.component';
import { DepartmentComponent } from './department/department.component';
import { SubAreaComponent } from './sub-area/sub-area.component';
import { ProgressComponent } from './upload-doc/progress/progress.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { LibRecentUploadedComponent } from './lib-recent-uploaded/lib-recent-uploaded.component';
import { UserDocumentUpload } from './user-document-upload/user-document-upload.component';
import { VerifyUploadedDocumentComponent } from './verify-uploaded-document/verify-uploaded-document.component';
import { ApprovedRejectDocListComponent } from './approvedReject-doc-list/approvedReject-doc-list.component';



@NgModule({
  declarations: [
    PagesComponent,
    SearchComponent,
    FaqComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    BlankPageComponent,
    MainHeadComponent,
    RequestFormComponent,
    HodComponent,
    PlantAComponent,
    UploadDocComponent,
    ComingSoonComponent,
    AcceptRequestComponent,
    ListRequestComponent,
    ApprovalListComponent,
    RequestedDocComponent,
    UnderMaintenanceComponent,
    PlantComponent,
    DepartmentComponent,
    SubAreaComponent,
    ProgressComponent,
    LibRecentUploadedComponent,
    UserDocumentUpload,
    VerifyUploadedDocumentComponent,
    ApprovedRejectDocListComponent
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    MatSelectModule,
    NgxDropzoneModule,
    SharedModule,
    EditorModule,
    NgMultiSelectDropDownModule,
    NgxDocViewerModule,
  

  ]
})
export class PagesModule { }
