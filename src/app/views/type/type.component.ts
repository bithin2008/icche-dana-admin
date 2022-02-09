import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {

  public typeList: any = [];
  public typeFormDetails: any = {};
  public addEditTypeModalRef: any;
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
      this.getTypeList();
    } else {
      this.toastr.warning('Please login', 'Warning');
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }


  getTypeList() {
    // this.spinnerService.show();
    let url = `types?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.typeList = response.types;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }

  openAddTypeModal(template: TemplateRef<any>) {
    this.typeFormDetails = {};
    this.isEdit = false;
    this.addEditTypeModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  openEditTypeModal(template: TemplateRef<any>, obj) {
    this.typeFormDetails = { ...obj };
    this.isEdit = true;
    this.addEditTypeModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  addType() {
    if (!this.typeFormDetails.name) {
      this.toastr.warning('Please enter type name', 'Warning');
      return;
    }

    if (!this.typeFormDetails.discription) {
      this.toastr.warning('Please enter type description', 'Warning');
      return;
    }
    let url = `types`;
    // this.spinnerService.show();
    this.webService.post(url, this.typeFormDetails).subscribe((response: any) => {
      this.getTypeList();
      this.toastr.success('Type added successfully', 'Success');
      this.addEditTypeModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateType() {
    if (!this.typeFormDetails.name) {
      this.toastr.warning('Please enter type name', 'Warning');
      return;
    }

    if (!this.typeFormDetails.discription) {
      this.toastr.warning('Please enter type description', 'Warning');
      return;
    }
    let url = `types?typeId=${this.typeFormDetails.typeId}`;
    // this.spinnerService.show();
    this.webService.put(url, this.typeFormDetails).subscribe((response: any) => {
      this.getTypeList();
      this.toastr.success('Type updated successfully', 'Success');
      this.addEditTypeModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteType(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete type  ${obj.name}?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `types?typeId=${obj.typeId}&isActiveOrDeletes=true&isActiveOrDelete=Delete`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            this.getTypeList();
            this.toastr.success(`Type ${obj.name} deleted successfully`, 'Success');
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
