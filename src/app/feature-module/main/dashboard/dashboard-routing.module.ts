import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { HodDashboardComponent } from "./hod-dashboard/hod-dashboard.component";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { DealsDashboardComponent } from "./deals-dashboard/deals-dashboard.component";
import { LeadsDashboardComponent } from "./leads-dashboard/leads-dashboard.component";
import { FileManagerComponent } from "../apps/file-manager/file-manager.component";



const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      { path: "admin", component: AdminDashboardComponent },
      { path: "hod", component: HodDashboardComponent },
      { path: "user", component: UserDashboardComponent },
      { path: "deals", component: DealsDashboardComponent },
      { path: "librarian", component: LeadsDashboardComponent },
      { path: "fileManagement", component: FileManagerComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
