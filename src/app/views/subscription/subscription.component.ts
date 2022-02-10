import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  public typeList: any = [];
  public offerList: any = [];
  public subscriptionList: any = [];
  public subscriptionFormDetails: any = {};
  public addEditSubscriptionModalRef: any;
  public isEdit: boolean = false;
  public minDate: any;
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
      this.getSubscriptionList();
    } else {
      this.toastr.warning('Please login', 'Warning');
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }

  getTypeList() {
    return new Promise(resolve => {
      let url = `types?pageNumber=1&pageSize=200`;
      this.webService.get(url).subscribe((response) => {
        //  if (response.status == 1) {
        resolve(response.types);
        //  }
      }, (error) => {
        console.log("error ts: ", error);
      });
    });
  }

  getOfferList() {
    return new Promise(resolve => {
      let url = `Offer?pageNumber=1&pageSize=200`;
      this.webService.get(url).subscribe((response) => {
        //  if (response.status == 1) {
        resolve(response.offer);
        //  }
      }, (error) => {
        console.log("error ts: ", error);
      });
    });
  }



  getSubscriptionList() {
    // this.spinnerService.show();
    let url = `Subscription?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      if (response.subscriptions.length > 0) {
        this.subscriptionList = response.subscriptions;
      } else {
        this.subscriptionList = [];
      }

    }, (error) => {
      console.log('error', error);
    });
  }

  async openAddSubscriptionModal(template: TemplateRef<any>) {
    this.subscriptionFormDetails = {
      offerId: '',
      typeId: ''
    };
    this.isEdit = false;
    this.typeList = await this.getTypeList();
    this.offerList = await this.getOfferList();
    this.minDate = new Date();
    this.addEditSubscriptionModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  async openEditSubscriptionModal(template: TemplateRef<any>, obj) {
    this.subscriptionFormDetails = { ...obj };
    this.isEdit = true;
    this.typeList = await this.getTypeList();
    this.offerList = await this.getOfferList();
    this.addEditSubscriptionModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  addSubscription() {
    if (!this.subscriptionFormDetails.typeId) {
      this.toastr.warning('Please select type', 'Warning');
      return;
    }
    if (!this.subscriptionFormDetails.offerId) {
      this.toastr.warning('Please select offer', 'Warning');
      return;
    }

    if (!this.subscriptionFormDetails.typename) {
      this.toastr.warning('Please enter Subscription name', 'Warning');
      return;
    }
    if (!this.subscriptionFormDetails.subcriptionFrom) {
      this.toastr.warning('Please select Subscription form date', 'Warning');
      return;
    }
    let url = `Subscription`;
    // this.spinnerService.show();
    this.webService.post(url, this.subscriptionFormDetails).subscribe((response: any) => {
      this.getSubscriptionList();
      this.toastr.success('Subscription added successfully', 'Success');
      this.addEditSubscriptionModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateSubscription() {
    if (!this.subscriptionFormDetails.typeId) {
      this.toastr.warning('Please select type', 'Warning');
      return;
    }
    if (!this.subscriptionFormDetails.offerId) {
      this.toastr.warning('Please select offer', 'Warning');
      return;
    }

    if (!this.subscriptionFormDetails.typename) {
      this.toastr.warning('Please enter Subscription name', 'Warning');
      return;
    }
    if (!this.subscriptionFormDetails.subcriptionFrom) {
      this.toastr.warning('Please select Subscription form date', 'Warning');
      return;
    }
    let url = `Subscription?subscriptionId=${this.subscriptionFormDetails.subscriptionId}`;
    // this.spinnerService.show();
    this.webService.put(url, this.subscriptionFormDetails).subscribe((response: any) => {
      this.getSubscriptionList();
      this.toastr.success('Subscription updated successfully', 'Success');
      this.addEditSubscriptionModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteSubscription(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete Subscription  ${obj.typename}?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `Subscription?subscriptionId=${obj.subscriptionId}&isActiveOrDeletes=true&isActiveOrDelete=Delete`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            this.getSubscriptionList();
            this.toastr.success(response.message, 'Success');
            // } else {
            //   this.toastr.error(response.message, 'Error');
            // }
            // } else {
            //   this.toastr.error('Your Session expired', 'Error');
            //    this.router.navigate(['/login'], { queryParams: { return_url: `builders / ${ this.builderId } ` } });
            // }
          }, (error) => {
            console.log('error', error);
          });
        }
      })
      .catch((error) => { });
  }


  viewDetails(subscription) {
    this.router.navigate(['/subscription-details/' + subscription.subscriptionId]);
  }

}
