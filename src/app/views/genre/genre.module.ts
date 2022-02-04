import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenreRoutingModule } from './genre-routing.module';
import { GenreComponent } from './genre.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
@NgModule({
  declarations: [GenreComponent],
  imports: [
    CommonModule,
    GenreRoutingModule,
    FormsModule
  ]
})
export class GenreModule { }
