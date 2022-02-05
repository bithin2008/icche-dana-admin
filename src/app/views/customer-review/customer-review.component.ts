import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.scss']
})
export class CustomerReviewComponent implements OnInit {
  public userList: any = [];
  public itemList: any = [];
  public userReviewList: any = [];
  public userReviewFormDetails: any = {
    categoryId: ''
  };
  public editUserReviewModalRef: any;
  public isEdit: boolean = false;
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
    this.checkLogin();
  }

  checkLogin() {
    if (localStorage.getItem('token') && localStorage.getItem('userid')) {
      this.getReviewList();
      // this.getUserReviewList();
    } else {
      this.toastr.warning('Please login', 'Warning');
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }

  getUserList() {
    return new Promise(resolve => {
      let url = `users?pageNumber=1&pageSize=2000`;
      this.webService.get(url).subscribe((response) => {
        //  if (response.status == 1) {
        resolve(response.user);
        //  }
      }, (error) => {
        console.log("error ts: ", error);
      });
    });
  }

  getItemList() {
    return new Promise(resolve => {
      let url = `ViewItem?pageNumber=1&pageSize=2000`;
      this.webService.get(url).subscribe((response) => {
        //  if (response.status == 1) {
        resolve(response.viewItems);
        //  }
      }, (error) => {
        console.log("error ts: ", error);
      });
    });
  }


  getReviewList() {
    // this.spinnerService.show();
    let url = `CustomerReview?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.userReviewList = response.customerReview;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }

  async openAddUserReviewModal(template: TemplateRef<any>) {
    this.userReviewFormDetails = {
      userId: '',
      viewItemId: ''
    };
    this.userList = await this.getUserList();
    this.itemList = await this.getItemList();
    this.isEdit = false;
    this.editUserReviewModalRef = this.modalService.open(template, { size: 'md', centered: true, backdrop: 'static' });
  }

  async openEditUserReviewModal(template: TemplateRef<any>, obj) {
    this.userReviewFormDetails = { ...obj };
    this.userList = await this.getUserList();
    this.itemList = await this.getItemList();
    this.isEdit = true;
    this.editUserReviewModalRef = this.modalService.open(template, { size: 'md', centered: true, backdrop: 'static' });
  }

  addUserReview() {
    if (!this.userReviewFormDetails.userId) {
      this.toastr.warning('Please select user', 'Warning');
      return;
    }
    if (!this.userReviewFormDetails.viewItemId) {
      this.toastr.warning('Please select item', 'Warning');
      return;
    }

    if (!this.userReviewFormDetails.description) {
      this.toastr.warning('Please enter your review', 'Warning');
      return;
    }

    if (!this.userReviewFormDetails.rating) {
      this.toastr.warning('Please give your Rating', 'Warning');
      return;
    }
    let url = `UserReview`;
    // this.spinnerService.show();
    this.webService.post(url, this.userReviewFormDetails).subscribe((response: any) => {
      this.getReviewList();
      this.toastr.success('Subcategory added successfully', 'Success');
      this.editUserReviewModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  onRatingChange(event) {
    this.userReviewFormDetails.rating = event.rating;
  }

  updateUserReview() {
    if (!this.userReviewFormDetails.userId) {
      this.toastr.warning('Please select user', 'Warning');
      return;
    }
    if (!this.userReviewFormDetails.viewItemId) {
      this.toastr.warning('Please select item', 'Warning');
      return;
    }

    if (!this.userReviewFormDetails.description) {
      this.toastr.warning('Please enter your review', 'Warning');
      return;
    }

    if (!this.userReviewFormDetails.rating) {
      this.toastr.warning('Please give your Rating', 'Warning');
      return;
    }
    let url = `CustomerReview?customerReviewId=${this.userReviewFormDetails.customerReviewId}`;
    // this.spinnerService.show();
    this.webService.put(url, this.userReviewFormDetails).subscribe((response: any) => {
      this.getReviewList();
      this.toastr.success('Review updated successfully', 'Success');
      this.editUserReviewModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteUserReview(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete subcategory  ${obj.userReviewName}?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `UserReview?id=${obj.id}`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            // this.getUserReviewList();
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
