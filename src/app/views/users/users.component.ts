import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public userList: any = [];
  constructor(private router: Router,
    private webService: WebService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,) { }


  ngOnInit(): void {
    this.getUserList();
  }


  getUserList() {
    // this.spinnerService.show();
    let url = `users`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.userList = response;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }

  deleteUser(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete user  ${obj.firstName} ${obj.lastName}?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `users?id=${obj.id}`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            this.getUserList();
            this.toastr.success(response.message, 'Success');
            // } else {
            //   this.toastr.error(response.message, 'Error');
            // }
            // } else {
            //   this.toastr.error('Your Session expired', 'Error');
            //    this.router.navigate(['/login'], { queryParams: { return_url: `builders/${this.builderId}` } });
            // }
          }, (error) => {
            console.log('error', error);
          });
        }
      })
      .catch((error) => { });
  }

}
