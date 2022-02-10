import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionDetailsRoutingModule } from './subscription-details-routing.module';
import { SubscriptionDetailsComponent } from './subscription-details.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
  declarations: [SubscriptionDetailsComponent],
  imports: [
    CommonModule,
    SubscriptionDetailsRoutingModule,
    FormsModule,
    BsDatepickerModule.forRoot()

  ]
})
export class SubscriptionDetailsModule { }
