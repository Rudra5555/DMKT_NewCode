import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderOneComponent } from './header-one.component';
import { HeaderModalComponent } from './header-modal/header-modal.component';

const routes: Routes = [
  { 
    path: '', 
    component: HeaderOneComponent,
    children: [
      { path: "header", component: HeaderOneComponent },
      // { path: "header-modal", component: HeaderModalComponent }

    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeaderOneRoutingModule { }
