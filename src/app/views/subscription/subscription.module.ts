import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionComponent } from './subscription.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
  declarations: [SubscriptionComponent],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class SubscriptionModule { }
