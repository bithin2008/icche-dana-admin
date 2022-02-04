import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemRoutingModule } from './item-routing.module';
import { ItemComponent } from './item.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
@NgModule({
  declarations: [ItemComponent],
  imports: [
    CommonModule,
    ItemRoutingModule,
    FormsModule
  ]
})
export class ItemModule { }
