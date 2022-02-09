import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {

  public offerList: any = [];
  public typeList: any = [];
  public offerFormDetails: any = {};
  public addEditOfferModalRef: any;
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
      this.getOfferList();
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
    // this.spinnerService.show();
    let url = `Offer?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.offerList = response.offer;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }

  async openAddOfferModal(template: TemplateRef<any>) {
    this.offerFormDetails = {
      typeId: ''
    };
    this.isEdit = false;
    this.typeList = await this.getTypeList();
    this.addEditOfferModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  async openEditOfferModal(template: TemplateRef<any>, obj) {
    this.offerFormDetails = { ...obj };
    this.isEdit = true;
    this.typeList = await this.getTypeList();
    this.addEditOfferModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  addOffer() {
    if (!this.offerFormDetails.name) {
      this.toastr.warning('Please enter offer name', 'Warning');
      return;
    }
    if (!this.offerFormDetails.discription) {
      this.toastr.warning('Please enter offer description', 'Warning');
      return;
    }
    let url = `Offer`;
    // this.spinnerService.show();
    this.webService.post(url, this.offerFormDetails).subscribe((response: any) => {
      this.getOfferList();
      this.toastr.success('Offer added successfully', 'Success');
      this.addEditOfferModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateOffer() {
    if (!this.offerFormDetails.name) {
      this.toastr.warning('Please enter offer name', 'Warning');
      return;
    }

    if (!this.offerFormDetails.discription) {
      this.toastr.warning('Please enter offer description', 'Warning');
      return;
    }
    let url = `Offer?offerId=${this.offerFormDetails.offerId}`;
    // this.spinnerService.show();
    this.webService.put(url, this.offerFormDetails).subscribe((response: any) => {
      this.getOfferList();
      this.toastr.success('Offer updated successfully', 'Success');
      this.addEditOfferModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteOffer(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete offer  ${obj.name}?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `Offer?offerId=${obj.offerId}&isActiveOrDeletes=true&isActiveOrDelete=Delete`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            this.getOfferList();
            this.toastr.success(`Offer ${obj.name} deleted successfully`, 'Success');
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
