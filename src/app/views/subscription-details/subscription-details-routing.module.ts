import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SubscriptionDetailsComponent } from './subscription-details.component';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionDetailsRoutingModule { }
