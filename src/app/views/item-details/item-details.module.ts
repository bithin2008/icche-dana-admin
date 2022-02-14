import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailsComponent } from './item-details.component';
import { ItemDetailsRoutingModule } from './item-details-routing.module';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [ItemDetailsComponent],
  imports: [
    CommonModule,
    ItemDetailsRoutingModule,
    FormsModule,
    NgbModule
  ]
})
export class ItemDetailsModule { }
