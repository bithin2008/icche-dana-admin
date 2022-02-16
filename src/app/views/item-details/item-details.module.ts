import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailsComponent } from './item-details.component';
import { ItemDetailsRoutingModule } from './item-details-routing.module';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
@NgModule({
  declarations: [ItemDetailsComponent],
  imports: [
    CommonModule,
    ItemDetailsRoutingModule,
    FormsModule,
    NgbModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ]
})
export class ItemDetailsModule { }
