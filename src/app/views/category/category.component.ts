import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public categoryList: any = [];
  public categoryFormDetails: any = {};
  public editCategoryModalRef: any;
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
    this.getCategoryList();
  }


  getCategoryList() {
    // this.spinnerService.show();
    let url = `Category?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.categoryList = response.user;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }

  openEditUserMdal(template: TemplateRef<any>, obj) {
    this.categoryFormDetails = { ...obj };
    this.editCategoryModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  updateUserProfile() {
    let emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!this.categoryFormDetails.firstName) {
      this.toastr.warning('Please enter first name', 'Warning');
      return;
    }

    if (!this.categoryFormDetails.lastName) {
      this.toastr.warning('Please enter last name', 'Warning');
      return;
    }
    if (!this.categoryFormDetails.emailId) {
      this.toastr.warning('Please enter email', 'Warning');
      return;
    }
    if (!emailRegex.test(this.categoryFormDetails.emailId)) {
      this.toastr.warning('Please enter valid email', 'Warning');
      return;
    }

    if (!this.categoryFormDetails.mobileNumber) {
      this.toastr.warning('Please enter mobile', 'Warning');
      return;
    }
    let url = `users?id=${this.categoryFormDetails.id}`;
    // this.spinnerService.show();
    this.webService.put(url, this.categoryFormDetails).subscribe((response: any) => {
      this.getCategoryList();
      this.toastr.success('User updated successfully', 'Success');
      this.editCategoryModalRef.close();
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
            this.getCategoryList();
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
