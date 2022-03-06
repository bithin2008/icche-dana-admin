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
  public isPosterAdded: boolean = false;
  public imageFile: any;
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
    return new Promise(resolve => {
      let url = `SubCategory?pageNumber=1&pageSize=200`;
      this.webService.get(url).subscribe((response) => {
        //  if (response.status == 1) {
        resolve(response.subCategory);
        //  }
      }, (error) => {
        console.log("error ts: ", error);
      });
    });
  }

  getLanguageList() {

    return new Promise(resolve => {
      let url = `Language?pageNumber=1&pageSize=200`;
      this.webService.get(url).subscribe((response) => {
        //  if (response.status == 1) {
        resolve(response.language);
        //  }
      }, (error) => {
        console.log("error ts: ", error);
      });
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

  async openAddItemModal(template: TemplateRef<any>) {
    this.itemFormDetails = {
      subCategoryId: '',
      languageId: ''
    };
    this.isEdit = false;
    this.isPosterAdded = false;
    this.subCategoryList = await this.getSubCategoryList();
    this.languageList = await this.getLanguageList();
    this.addEditItemModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  async openEditItemModal(template: TemplateRef<any>, obj) {
    this.itemFormDetails = { ...obj };
    if (this.itemFormDetails.viewItemPoster[0]) {
      this.itemFormDetails.poster = environment.API_ENDPOINT + this.itemFormDetails.viewItemPoster[0].posterURL.replaceAll('\\', '/');
    }
    this.isEdit = true;
    this.isPosterAdded = true;
    this.subCategoryList = await this.getSubCategoryList();
    this.languageList = await this.getLanguageList();
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
    if (!this.isPosterAdded) {
      this.toastr.warning('Please upload poster', 'Warning');
      return;
    }
    let url = `ViewItem`;
    // this.spinnerService.show();
    this.webService.post(url, this.itemFormDetails).subscribe((response: any) => {
      this.addEditItemModalRef.close();
      this.uploadPoster(response.viewItemId, false);
      this.toastr.success('Item added successfully', 'Success');
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
    if (!this.isPosterAdded) {
      this.toastr.warning('Please upload poster', 'Warning');
      return;
    }
    let url = `ViewItem?id=${this.itemFormDetails.viewItemId}`;
    // this.spinnerService.show();
    this.webService.put(url, this.itemFormDetails).subscribe((response: any) => {
      if (this.imageFile) {
        this.uploadPoster(this.itemFormDetails.viewItemId, true);
      } else {
        this.getItemList();
        this.toastr.success('Item updated successfully', 'Success');
        this.addEditItemModalRef.close();
      }

    }, (error) => {
      console.log('error', error);
    });
  }

  deleteItem(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete Item  ${obj.name}?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `ViewItem?viewItemId=${obj.viewItemId}&isActiveOrDeletes=true&isActiveOrDelete=Delete`;
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


  uploadItem(files: FileList, type: any) {
    if (type == 'poster') {
      this.itemFormDetails.poster = {};
    }
    let validation = this.validatePhotoUpload(files.item(0).name);
    if (validation) {
      this.imageFile = files.item(0);
      this.getBase64(files.item(0), type);
      // this.formDetails.logo.hasImg = true;
    } else {
      this.toastr.error("Please upload only JPG, PNG, GIF format", "Error");
    }
  }

  getBase64(file, type) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log('url', reader.result);
      this.isPosterAdded = true;
      this.itemFormDetails.poster = reader.result;

    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  uploadPoster(viewItemId, isDataUpdate) {
    let url = `Poster/ViewItemPoster`;
    var formData = new FormData();
    formData.append('image', this.imageFile);
    formData.append('ViewItemId', viewItemId);
    this.webService.fileUpload(url, formData).subscribe((response: any) => {
      this.getItemList();
      //  this.spinnerService.hide();
      //  this.addEditModalRef.close();
      this.itemFormDetails.poster = environment.API_ENDPOINT + response.posterURL.replaceAll('\\', '/');
      this.isPosterAdded = true;
      if (isDataUpdate) {
        this.getItemList();
        this.toastr.success('Item updated successfully', 'Success');
        this.addEditItemModalRef.close();
      } else {
        this.toastr.success('Poster uploaded', 'Success');
      }


    }, (error) => {
      console.log('error ts: ', error);
    });
  }


  validatePhotoUpload(fileName) {
    var allowed_extensions = new Array("jpg", "jpeg", "png", "gif");
    var file_extension = fileName.split(".").pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.
    for (var i = 0; i <= allowed_extensions.length; i++) {
      if (allowed_extensions[i] == file_extension) {
        return true; // valid file extension
      }
    }
    return false;
  }


  viewDetails(item) {
    this.router.navigate(['/item-details/' + item.viewItemId]);
  }
}
