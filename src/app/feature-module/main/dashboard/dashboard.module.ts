import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HodDashboardComponent } from './hod-dashboard/hod-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DealsDashboardComponent } from './deals-dashboard/deals-dashboard.component';
import { LeadsDashboardComponent } from './leads-dashboard/leads-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IgxLegendModule, IgxDataChartCoreModule, IgxDataChartCategoryModule, IgxDataChartCategoryCoreModule, IgxDataChartInteractivityModule, IgxDataChartVerticalCategoryModule, IgxDataChartVerticalCategoryCoreModule, IgxDataChartScatterCoreModule, IgxDataChartScatterModule } from 'igniteui-angular-charts';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { AppComponent } from 'src/app/app.component';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { DashboardModalComponent } from './dashboard-modal/dashboard-modal.component'
import { FooterComponent } from '../../common/footer/footer/footer.component';









@NgModule({
  declarations: [
    DashboardModalComponent,

  ],
  imports: [
    BrowserModule,
    IgxDataChartCoreModule,
    IgxDataChartCategoryModule,
    IgxDataChartCategoryCoreModule,
    IgxDataChartInteractivityModule,
    IgxDataChartVerticalCategoryModule,
    IgxDataChartVerticalCategoryCoreModule,
    IgxDataChartScatterCoreModule,
    CanvasJSAngularChartsModule,
    IgxDataChartScatterModule,

    NgChartsModule


  ],
  providers: [],

})
export class AppModule { }

@NgModule({
  declarations: [
    DashboardComponent,
    AdminDashboardComponent,
    HodDashboardComponent,
    UserDashboardComponent,
    DealsDashboardComponent,
    LeadsDashboardComponent,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgApexchartsModule,

    SharedModule,
  ],
})
export class DashboardModule { }
