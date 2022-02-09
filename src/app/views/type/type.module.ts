import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeRoutingModule } from './type-routing.module';
import { TypeComponent } from './type.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

@NgModule({
  declarations: [TypeComponent],
  imports: [
    CommonModule,
    TypeRoutingModule,
    FormsModule
  ]
})
export class TypeModule { }
