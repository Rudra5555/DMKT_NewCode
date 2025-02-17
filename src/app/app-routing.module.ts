import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermsComponent } from './feature-module/page/pages/terms/terms.component';
import { PrivacyPolicyComponent } from './feature-module/page/pages/privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature-module/feature-module.module').then(
        (m) => m.FeatureModuleModule
      ),
  },
  { path: 'terms-and-conditions', component: TermsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
