import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ClientsRoutingModule } from './header-one.module';
// import { ClientsComponent } from './clients.component';
// import { ClientsContentPageComponent } from './clients-content-page/clients-content-page.component';
// import { ClientsListComponent } from './clients-list/clients-list.component';
// import { ClientsProfileComponent } from './clients-profile/clients-profile.component';
// import { ClientsModalComponent } from './clients-modal/clients-modal.component';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderOneComponent } from './header-one/header-one.component';
import { HeaderOneRoutingModule } from './header-one-routing.module';
import { HeaderModalComponent } from './header-modal/header-modal.component';



@NgModule({
  declarations: [
    HeaderOneComponent,
    HeaderModalComponent
    // ClientsComponent,
    // ClientsContentPageComponent,
    // ClientsListComponent,
    // ClientsProfileComponent,
    // ClientsModalComponent
  ],
  imports: [
    CommonModule,
    HeaderOneRoutingModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ClientsModule { }
