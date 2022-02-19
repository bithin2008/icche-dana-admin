import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  public categoryList: any = [];
  public subCategoryList: any = [];
  public subCategoryFormDetails: any = {
    categoryId: ''
  };
  public editSubCategoryModalRef: any;
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
      this.getCategoryList();
      this.getSubCategoryList();
    } else {
      this.toastr.warning('Please login', 'Warning');
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }

  getCategoryList() {
    return new Promise(resolve => {
      let url = `Category?pageNumber=1&pageSize=200`;
      this.webService.get(url).subscribe((response) => {
        //  if (response.status == 1) {
        resolve(response.category);
        //  }
      }, (error) => {
        console.log("error ts: ", error);
      });
    });

  }

  getSubCategoryList() {
    // this.spinnerService.show();
    let url = `SubCategory?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.subCategoryList = response.subCategory;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }

  async openAddSubCategoryModal(template: TemplateRef<any>) {
    this.subCategoryFormDetails = {
      categoryId: ''
    };
    this.categoryList = await this.getCategoryList();
    this.isEdit = false;
    this.editSubCategoryModalRef = this.modalService.open(template, { centered: true, backdrop: 'static' });
  }

  async openEditSubCategoryModal(template: TemplateRef<any>, obj) {
    this.subCategoryFormDetails = { ...obj };
    this.categoryList = await this.getCategoryList();
    // this.categoryList.forEach(element => {
    //   if (element.categoryId == this.subCategoryFormDetails.categoryId) {
    //     this.subCategoryFormDetails.categoryId = element.categoryId;
    //   }
    // });
    this.isEdit = true;
    this.editSubCategoryModalRef = this.modalService.open(template, { centered: true, backdrop: 'static' });
  }

  addSubCategory() {
    if (!this.subCategoryFormDetails.categoryId) {
      this.toastr.warning('Please select category', 'Warning');
      return;
    }
    if (!this.subCategoryFormDetails.subCategoryName) {
      this.toastr.warning('Please enter subcategory name', 'Warning');
      return;
    }

    if (!this.subCategoryFormDetails.priority) {
      this.toastr.warning('Please enter subcategory priority', 'Warning');
      return;
    }
    let url = `SubCategory`;
    // this.spinnerService.show();
    this.webService.post(url, this.subCategoryFormDetails).subscribe((response: any) => {
      this.getSubCategoryList();
      this.toastr.success('Subcategory added successfully', 'Success');
      this.editSubCategoryModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateSubCategory() {
    if (!this.subCategoryFormDetails.categoryId) {
      this.toastr.warning('Please select category', 'Warning');
      return;
    }
    if (!this.subCategoryFormDetails.subCategoryName) {
      this.toastr.warning('Please enter subcategory name', 'Warning');
      return;
    }

    if (!this.subCategoryFormDetails.priority) {
      this.toastr.warning('Please enter subcategory priority', 'Warning');
      return;
    }
    let url = `SubCategory?id=${this.subCategoryFormDetails.id}`;
    // this.spinnerService.show();
    this.webService.put(url, this.subCategoryFormDetails).subscribe((response: any) => {
      this.getSubCategoryList();
      this.toastr.success('Subcategory updated successfully', 'Success');
      this.editSubCategoryModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteSubCategory(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete subcategory  ${obj.subCategoryName}?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `SubCategory?subCategoryId=${obj.subCategoryId}&isActiveOrDeletes=true&isActiveOrDelete=Delete`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            this.getSubCategoryList();
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
