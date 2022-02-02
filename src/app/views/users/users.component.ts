import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public userList: any = [];
  public userFormDetails: any = {};
  public editUserModalRef: any;
  page: number = 1;
  pageSize: number = 20;
  filterForm: any = {
    searchText: '',
  };
  constructor(private router: Router,
    private webService: WebService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private confirmationDialogService: ConfirmationDialogService,) { }


  ngOnInit(): void {
    this.getUserList();
  }


  getUserList() {
    // this.spinnerService.show();
    let url = `users?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.userList = response.user;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }

  openEditUserMdal(template: TemplateRef<any>, obj) {
    this.userFormDetails = { ...obj };
    this.editUserModalRef = this.modalService.open(template, { centered: true, backdrop: 'static' });
  }

  updateUserProfile() {
    let emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!this.userFormDetails.firstName) {
      this.toastr.warning('Please enter first name', 'Warning');
      return;
    }

    if (!this.userFormDetails.lastName) {
      this.toastr.warning('Please enter last name', 'Warning');
      return;
    }
    if (!this.userFormDetails.emailId) {
      this.toastr.warning('Please enter email', 'Warning');
      return;
    }
    if (!emailRegex.test(this.userFormDetails.emailId)) {
      this.toastr.warning('Please enter valid email', 'Warning');
      return;
    }

    if (!this.userFormDetails.mobileNumber) {
      this.toastr.warning('Please enter mobile', 'Warning');
      return;
    }
    let url = `users?id=${this.userFormDetails.id}`;
    // this.spinnerService.show();
    this.webService.put(url, this.userFormDetails).subscribe((response: any) => {
      this.getUserList();
      this.toastr.success('User updated successfully', 'Success');
      this.editUserModalRef.close();
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
