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

  public ItemList: any = [];
  public ItemFormDetails: any = {};
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
      this.toastr.warning('You are logged out. Please login again', 'Warning');
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }



  getItemList() {
    // this.spinnerService.show();
    let url = `ViewItem?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.ItemList = response.viewItems;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }

  openAddItemModal(template: TemplateRef<any>) {
    this.ItemFormDetails = {};
    this.isEdit = false;
    this.addEditItemModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  openEditItemModal(template: TemplateRef<any>, obj) {
    this.ItemFormDetails = { ...obj };
    this.isEdit = true;
    this.addEditItemModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  addItem() {

    if (!this.ItemFormDetails.ItemName) {
      this.toastr.warning('Please enter Item name', 'Warning');
      return;
    }

    if (!this.ItemFormDetails.priority) {
      this.toastr.warning('Please enter Item priority', 'Warning');
      return;
    }
    let url = `ViewItem`;
    // this.spinnerService.show();
    this.webService.post(url, this.ItemFormDetails).subscribe((response: any) => {
      this.getItemList();
      this.toastr.success('Item added successfully', 'Success');
      this.addEditItemModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateItem() {

    if (!this.ItemFormDetails.ItemName) {
      this.toastr.warning('Please enter Item name', 'Warning');
      return;
    }

    if (!this.ItemFormDetails.priority) {
      this.toastr.warning('Please enter Item priority', 'Warning');
      return;
    }
    let url = `ViewItem?id=${this.ItemFormDetails.id}`;
    // this.spinnerService.show();
    this.webService.put(url, this.ItemFormDetails).subscribe((response: any) => {
      this.getItemList();
      this.toastr.success('Item updated successfully', 'Success');
      this.addEditItemModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteItem(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete Item  ${obj.ItemName}?`)
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
