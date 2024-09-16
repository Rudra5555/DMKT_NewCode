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





const routes: Routes = [
  { 
    path: '', 
    component: PagesComponent,
    children: [
      { path: "search", component: SearchComponent },
      { path: "faq", component: FaqComponent },
      { path: "terms", component: TermsComponent },
      { path: "privacy-policy", component: PrivacyPolicyComponent },
      { path: "blank-page", component: BlankPageComponent },
      { path: "request-form", component: RequestFormComponent },
      { path: "hod", component: HodComponent },
      { path: "coming-soon", component: ComingSoonComponent },
      { path: "under-maintenance", component: UnderMaintenanceComponent },
      { path: "upload-doc", component: UploadDocComponent },
      { path: "plant-a", component: PlantAComponent },
      { path: "requested-doc", component: RequestedDocComponent },
      { path: "approval-list", component: ApprovalListComponent },
      { path: "list-request", component: ListRequestComponent },
      { path: "accept-request", component: AcceptRequestComponent },
      { path: "main-head", component: MainHeadComponent },
      { path: "plant", component: PlantComponent },
      { path: "department", component: DepartmentComponent },
      { path: "sub-area", component: SubAreaComponent },
      { path: "recent-uploaded-documents", component: LibRecentUploadedComponent },
      { path: "upload-documents", component: UserDocumentUpload },
      { path: "verify-uploaded-document", component: VerifyUploadedDocumentComponent }
      
      
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
