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
    } else {
      this.toastr.warning('Please login', 'Warning');
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }


  getCategoryList() {
    // this.spinnerService.show();
    let url = `Category?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.categoryList = response.category;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }

  openAddCategoryModal(template: TemplateRef<any>) {
    this.categoryFormDetails = {};
    this.isEdit = false;
    this.editCategoryModalRef = this.modalService.open(template, { centered: true, backdrop: 'static' });
  }

  openEditCategoryModal(template: TemplateRef<any>, obj) {
    this.categoryFormDetails = { ...obj };
    this.isEdit = true;
    this.editCategoryModalRef = this.modalService.open(template, { centered: true, backdrop: 'static' });
  }

  addCategory() {
    if (!this.categoryFormDetails.categoryName) {
      this.toastr.warning('Please enter category name', 'Warning');
      return;
    }

    if (!this.categoryFormDetails.priority) {
      this.toastr.warning('Please enter category priority', 'Warning');
      return;
    }
    let url = `Category`;
    // this.spinnerService.show();
    this.webService.post(url, this.categoryFormDetails).subscribe((response: any) => {
      this.getCategoryList();
      this.toastr.success('Category added successfully', 'Success');
      this.editCategoryModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateCategory() {
    if (!this.categoryFormDetails.categoryName) {
      this.toastr.warning('Please enter category name', 'Warning');
      return;
    }

    if (!this.categoryFormDetails.priority) {
      this.toastr.warning('Please enter category priority', 'Warning');
      return;
    }
    let url = `Category?id=${this.categoryFormDetails.id}`;
    // this.spinnerService.show();
    this.webService.put(url, this.categoryFormDetails).subscribe((response: any) => {
      this.getCategoryList();
      this.toastr.success('Category updated successfully', 'Success');
      this.editCategoryModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteCategory(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete user  ${obj.categoryName}?`)
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
