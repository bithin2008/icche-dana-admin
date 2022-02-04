import { navItems } from '../../_nav';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../../../app/views/confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public userName: any = '';
  public navItems = navItems;
  constructor(private router: Router,
    private webService: WebService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private confirmationDialogService: ConfirmationDialogService) {
    this.userName = localStorage.getItem('username');
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logOut(event) {
    event.preventDefault();
    this.confirmationDialogService.confirm('Warning', `Do you want to logout?`)
      .then((confirmed) => {
        if (confirmed) {
          let userId = localStorage.getItem('userid')
          // this.spinnerService.show();
          let url = `users/logout?id=${userId}`;
          // this.spinnerService.show();
          this.webService.post(url, {}).subscribe((response: any) => {
            this.toastr.success('Logout successfully', 'Success');
            this.router.navigate(['/login']);
            localStorage.clear();
          }, (error) => {
            console.log('error', error);
          });
        }
      })
      .catch((error) => { });
  }
}
