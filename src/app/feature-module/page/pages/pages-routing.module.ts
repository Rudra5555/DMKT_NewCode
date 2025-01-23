import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { HodComponent } from './hod/hod.component';
import { FaqComponent } from './faq/faq.component';
import { PagesComponent } from './pages.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SearchComponent } from './search/search.component';
import { TermsComponent } from './terms/terms.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { UnderMaintenanceComponent } from './under-maintenance/under-maintenance.component';
import { UploadDocComponent } from './upload-doc/upload-doc.component';
import { PlantAComponent } from './plant-a/plant-a.component';
import { AcceptRequestComponent } from './accept-request/accept-request.component';
import { ListRequestComponent } from './list-request/list-request.component';
import { ApprovalListComponent } from './approval-list/approval-list.component';
import { RequestedDocComponent } from './requested-doc/requested-doc.component'; 
import { MainHeadComponent } from './main-head/main-head.component';
import { PlantComponent } from './plant/plant.component';
import { DepartmentComponent } from './department/department.component';
import { SubAreaComponent } from './sub-area/sub-area.component';
import { LibRecentUploadedComponent } from './lib-recent-uploaded/lib-recent-uploaded.component';
import { UserDocumentUpload } from './user-document-upload/user-document-upload.component';
import { VerifyUploadedDocumentComponent } from './verify-uploaded-document/verify-uploaded-document.component';
import { ApprovedRejectDocListComponent } from './approvedReject-doc-list/approvedReject-doc-list.component';
import { StatutoryDocComponent } from './statutory-doc/statutory-doc.component';
import { AuthGuard } from '../../main/dashboard/AuthGuard';





const routes: Routes = [
  { 
    path: '', 
    component: PagesComponent,
    children: [
      { path: "search", component: SearchComponent,canActivate: [AuthGuard] },
      { path: "faq", component: FaqComponent,canActivate: [AuthGuard] },
      { path: "terms", component: TermsComponent,canActivate: [AuthGuard] },
      { path: "privacy-policy", component: PrivacyPolicyComponent,canActivate: [AuthGuard] },
      { path: "blank-page", component: BlankPageComponent,canActivate: [AuthGuard] },
      { path: "request-form", component: RequestFormComponent,canActivate: [AuthGuard] },
      { path: "hod", component: HodComponent,canActivate: [AuthGuard] },
      { path: "coming-soon", component: ComingSoonComponent,canActivate: [AuthGuard] },
      { path: "under-maintenance", component: UnderMaintenanceComponent,canActivate: [AuthGuard] },
      { path: "upload-doc", component: UploadDocComponent,canActivate: [AuthGuard] },
      { path: "plant-a", component: PlantAComponent,canActivate: [AuthGuard] },
      { path: "requested-doc", component: RequestedDocComponent,canActivate: [AuthGuard] },
      { path: "approval-list", component: ApprovalListComponent,canActivate: [AuthGuard] },
      { path: "list-request", component: ListRequestComponent,canActivate: [AuthGuard] },
      { path: "accept-request", component: AcceptRequestComponent,canActivate: [AuthGuard] },
      { path: "main-head", component: MainHeadComponent,canActivate: [AuthGuard] },
      { path: "plant", component: PlantComponent,canActivate: [AuthGuard] },
      { path: "department", component: DepartmentComponent,canActivate: [AuthGuard] },
      { path: "sub-area", component: SubAreaComponent,canActivate: [AuthGuard] },
      { path: "recent-uploaded-documents", component: LibRecentUploadedComponent,canActivate: [AuthGuard] },
      { path: "upload-documents", component: UserDocumentUpload,canActivate: [AuthGuard] },
      { path: "verify-uploaded-document", component: VerifyUploadedDocumentComponent,canActivate: [AuthGuard] },
      { path: "approved-reject-document", component: ApprovedRejectDocListComponent,canActivate: [AuthGuard] },
      { path: "statutory-doc", component: StatutoryDocComponent,canActivate: [AuthGuard] }
      
      
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
