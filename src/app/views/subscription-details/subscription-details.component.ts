import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent implements OnInit {
  public subscriptionid: any;
  public subscriptionDetailList: any = [];
  public genreList: any = [];
  public subCategoryList: any = [];
  public languageList: any = [];
  public subscriptionFormDetails: any = {};
  public itemFormMaterial: any = {};
  public addEditSubscriptionDetailsModalRef: any;
  public addEditItemMaterialModalRef: any;
  public isEdit: boolean = false;
  public typeList: any = [];
  public offerList: any = [];
  public minDate: any;
  page: number = 1;
  pageSize: number = 20;
  filterForm: any = {
    searchText: '',
  };
  constructor(private router: Router,
    public activatedRoute: ActivatedRoute,
    private webService: WebService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private confirmationDialogService: ConfirmationDialogService,) { }

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin() {
    if (localStorage.getItem('token') && localStorage.getItem('userid')) {
      this.subscriptionid = this.activatedRoute.snapshot.paramMap.get("subscriptionid");
      this.getSubscriptionDetails();
    } else {
      this.toastr.warning('Please login', 'Warning');
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }



  getSubscriptionDetails() {
    // this.spinnerService.show();
    let url = `SubscriptionDetail?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.viewSubscriptionDetails.length > 0) {
      this.subscriptionDetailList = response.subscriptionDetail;
    }, (error) => {
      console.log('error', error);
    });
  }

  async openAddSubscriptionDetailsModal(template: TemplateRef<any>) {
    this.subscriptionFormDetails = {
      offerId: '',
      typeId: ''
    };
    this.isEdit = false;
    this.minDate = new Date();
    this.addEditSubscriptionDetailsModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }


  async openEditSubscriptionDetailsModal(template: TemplateRef<any>, obj) {
    this.subscriptionFormDetails = { ...obj };
    this.isEdit = true;
    this.addEditSubscriptionDetailsModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  addSubscriptionDetails() {
    if (!this.subscriptionFormDetails.noOfdayes) {
      this.toastr.warning('Please enter number Of days', 'Warning');
      return;
    }

    if (!this.subscriptionFormDetails.rate) {
      this.toastr.warning('Please enter rate', 'Warning');
      return;
    }
    if (!this.subscriptionFormDetails.offerRate) {
      this.toastr.warning('Please enter offer rate', 'Warning');
      return;
    }
    if (!this.subscriptionFormDetails.offerFrom) {
      this.toastr.warning('Please enter offer start from', 'Warning');
      return;
    }
    if (!this.subscriptionFormDetails.offerTo) {
      this.toastr.warning('Please enter offer end', 'Warning');
      return;
    }

    this.subscriptionFormDetails.subscriptionId = this.subscriptionid;
    let url = `SubscriptionDetail`;
    // this.spinnerService.show();
    this.webService.post(url, this.subscriptionFormDetails).subscribe((response: any) => {
      this.getSubscriptionDetails();
      this.toastr.success('SubscriptionDetails added successfully', 'Success');
      this.addEditSubscriptionDetailsModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateSubscriptionDetails() {
    if (!this.subscriptionFormDetails.noOfdayes) {
      this.toastr.warning('Please enter number Of days', 'Warning');
      return;
    }

    if (!this.subscriptionFormDetails.rate) {
      this.toastr.warning('Please enter rate', 'Warning');
      return;
    }
    if (!this.subscriptionFormDetails.offerRate) {
      this.toastr.warning('Please enter offer rate', 'Warning');
      return;
    }
    if (!this.subscriptionFormDetails.offerFrom) {
      this.toastr.warning('Please enter offer start from', 'Warning');
      return;
    }
    if (!this.subscriptionFormDetails.offerTo) {
      this.toastr.warning('Please enter offer end', 'Warning');
      return;
    }

    let url = `SubscriptionDetail`;
    // this.spinnerService.show();
    this.webService.put(url, this.subscriptionFormDetails).subscribe((response: any) => {
      this.getSubscriptionDetails();
      this.toastr.success('SubscriptionDetails updated successfully', 'Success');
      this.addEditSubscriptionDetailsModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }


  deleteSubscriptionDetails(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete Subscription Details ?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `SubscriptionDetail?subscriptionDetailId=${obj.subscriptionDetailId}&isActiveOrDeletes=true&isActiveOrDelete=Delete`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            this.getSubscriptionDetails();
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
