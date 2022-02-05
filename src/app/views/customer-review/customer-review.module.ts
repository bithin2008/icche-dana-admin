import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerReviewRoutingModule } from './customer-review-routing.module';
import { CustomerReviewComponent } from './customer-review.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';
@NgModule({
  declarations: [CustomerReviewComponent],
  imports: [
    CommonModule,
    CustomerReviewRoutingModule,
    FormsModule,
    StarRatingModule.forRoot()
  ]
})
export class CustomerReviewModule { }
