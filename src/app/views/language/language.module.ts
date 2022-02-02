import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageRoutingModule } from './language-routing.module';
import { LanguageComponent } from './language.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

@NgModule({
  declarations: [LanguageComponent],
  imports: [
    CommonModule,
    LanguageRoutingModule,
    FormsModule
  ]
})
export class LanguageModule { }
