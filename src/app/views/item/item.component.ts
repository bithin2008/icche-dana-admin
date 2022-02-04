import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  public itemList: any = [];
  public subCategoryList: any = [];
  public languageList: any = [];
  public itemFormDetails: any = {};
  public addEditItemModalRef: any;
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
      this.getItemList();
    } else {
      this.toastr.warning('Please login', 'Warning');
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }

  getSubCategoryList() {
    // this.spinnerService.show();
    let url = `SubCategory?pageNumber=1&pageSize=200`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.subCategoryList = response.subCategory;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }

  getLanguageList() {
    // this.spinnerService.show();
    let url = `Language?pageNumber=1&pageSize=200`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.languageList = response.language;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }



  getItemList() {
    // this.spinnerService.show();
    let url = `ViewItem?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      if (response.viewItems.length > 0) {
        this.itemList = response.viewItems;
      } else {
        this.itemList = [];
      }

    }, (error) => {
      console.log('error', error);
    });
  }

  openAddItemModal(template: TemplateRef<any>) {
    this.itemFormDetails = {
      subCategoryId: '',
      languageId: ''
    };
    this.isEdit = false;
    this.getSubCategoryList();
    this.getLanguageList();
    this.addEditItemModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  openEditItemModal(template: TemplateRef<any>, obj) {
    this.itemFormDetails = { ...obj };
    this.isEdit = true;
    this.getSubCategoryList();
    this.getLanguageList();
    this.addEditItemModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  addItem() {
    if (!this.itemFormDetails.subCategoryId) {
      this.toastr.warning('Please select Sub Category', 'Warning');
      return;
    }
    if (!this.itemFormDetails.languageId) {
      this.toastr.warning('Please select language', 'Warning');
      return;
    }

    if (!this.itemFormDetails.name) {
      this.toastr.warning('Please enter Item name', 'Warning');
      return;
    }
    if (!this.itemFormDetails.title) {
      this.toastr.warning('Please enter Item title', 'Warning');
      return;
    }
    let url = `ViewItem`;
    // this.spinnerService.show();
    this.webService.post(url, this.itemFormDetails).subscribe((response: any) => {
      this.getItemList();
      this.toastr.success('Item added successfully', 'Success');
      this.addEditItemModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateItem() {
    if (!this.itemFormDetails.subCategoryId) {
      this.toastr.warning('Please select Sub Category', 'Warning');
      return;
    }
    if (!this.itemFormDetails.languageId) {
      this.toastr.warning('Please select language', 'Warning');
      return;
    }

    if (!this.itemFormDetails.name) {
      this.toastr.warning('Please enter Item name', 'Warning');
      return;
    }
    if (!this.itemFormDetails.title) {
      this.toastr.warning('Please enter Item title', 'Warning');
      return;
    }
    let url = `ViewItem?id=${this.itemFormDetails.id}`;
    // this.spinnerService.show();
    this.webService.put(url, this.itemFormDetails).subscribe((response: any) => {
      this.getItemList();
      this.toastr.success('Item updated successfully', 'Success');
      this.addEditItemModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteItem(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete Item  ${obj.name}?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `ViewItem?id=${obj.id}`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            this.getItemList();
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
