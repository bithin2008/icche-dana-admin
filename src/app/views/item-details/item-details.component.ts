import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
  public itemId: any;
  public itemList: any = [];
  public genreList: any = [];
  public subCategoryList: any = [];
  public languageList: any = [];
  public itemFormDetails: any = {};
  public itemFormMaterial: any = {};
  public addEditItemDetailsModalRef: any;
  public addEditItemMaterialModalRef: any;
  public isEdit: boolean = false;
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
      this.itemId = this.activatedRoute.snapshot.paramMap.get("itemid");
      this.getItemDetails();
    } else {
      this.toastr.warning('Please login', 'Warning');
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }




  getGenreList() {

    return new Promise(resolve => {
      let url = `Genre?pageNumber=1&pageSize=200`;
      this.webService.get(url).subscribe((response) => {
        //  if (response.status == 1) {
        resolve(response.genres);
        //  }
      }, (error) => {
        console.log("error ts: ", error);
      });
    });
  }

  getItemDetails() {
    // this.spinnerService.show();
    let url = `ViewItem/${this.itemId}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.viewItemDetails.length > 0) {
      this.itemList = response[0];


    }, (error) => {
      console.log('error', error);
    });
  }

  async openAddItemDetailsModal(template: TemplateRef<any>) {
    this.itemFormDetails = {
      genreId: '',
      isMultipleType: false
    };
    this.isEdit = false;
    this.genreList = await this.getGenreList();
    this.addEditItemDetailsModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  async openAddItemMaterialModal(template: TemplateRef<any>) {
    this.itemFormMaterial = {
      genreId: '',
      isMultipleType: false
    };
    this.isEdit = false;
    // this.genreList = await this.getGenreList();
    this.addEditItemMaterialModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  async openEditItemDetailsModal(template: TemplateRef<any>, obj) {
    this.itemFormDetails = { ...obj };
    this.isEdit = true;
    this.genreList = await this.getGenreList();
    this.addEditItemDetailsModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  async openEditItemMaterialModal(template: TemplateRef<any>, obj) {
    this.itemFormMaterial = { ...obj };
    this.isEdit = true;
    this.genreList = await this.getGenreList();
    this.addEditItemMaterialModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  addItemDetails() {
    if (!this.itemFormDetails.genreId) {
      this.toastr.warning('Please select Genre', 'Warning');
      return;
    }

    if (!this.itemFormDetails.time) {
      this.toastr.warning('Please enter time', 'Warning');
      return;
    }
    if (!this.itemFormDetails.imdbRating) {
      this.toastr.warning('Please enter IMDB rating', 'Warning');
      return;
    }
    if (!this.itemFormDetails.director) {
      this.toastr.warning('Please enter Director', 'Warning');
      return;
    }
    if (!this.itemFormDetails.actors) {
      this.toastr.warning('Please enter actor', 'Warning');
      return;
    }
    if (!this.itemFormDetails.maturityRating) {
      this.toastr.warning('Please enter maturity rating', 'Warning');
      return;
    }

    this.itemFormDetails.viewItemId = this.itemId;
    let url = `ViewItemDetail`;
    // this.spinnerService.show();
    this.webService.post(url, this.itemFormDetails).subscribe((response: any) => {
      this.getItemDetails();
      this.toastr.success('ItemDetails added successfully', 'Success');
      this.addEditItemDetailsModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  addItemMaterial() {
    if (!this.itemFormMaterial.sourceLink) {
      this.toastr.warning('Please enter source', 'Warning');
      return;
    }
    if (!this.itemFormMaterial.minutes) {
      this.toastr.warning('Please enter minute', 'Warning');
      return;
    }
    if (!this.itemFormMaterial.episodeNumber) {
      this.toastr.warning('Please enter episodeNumber', 'Warning');
      return;
    }

    this.itemFormMaterial.viewItemId = this.itemId;
    let url = `ViewitemMaterial`;
    // this.spinnerService.show();
    this.webService.post(url, this.itemFormMaterial).subscribe((response: any) => {
      this.getItemDetails();
      this.toastr.success('Item material added successfully', 'Success');
      this.addEditItemMaterialModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateItemDetails() {
    if (!this.itemFormDetails.genreId) {
      this.toastr.warning('Please select Genre', 'Warning');
      return;
    }

    if (!this.itemFormDetails.time) {
      this.toastr.warning('Please enter time', 'Warning');
      return;
    }
    if (!this.itemFormDetails.imdbRating) {
      this.toastr.warning('Please enter IMDB rating', 'Warning');
      return;
    }
    if (!this.itemFormDetails.director) {
      this.toastr.warning('Please enter Director', 'Warning');
      return;
    }
    if (!this.itemFormDetails.actors) {
      this.toastr.warning('Please enter actor', 'Warning');
      return;
    }
    if (!this.itemFormDetails.maturityRating) {
      this.toastr.warning('Please enter maturity rating', 'Warning');
      return;
    }

    let url = `ViewItemDetail`;
    // this.spinnerService.show();
    this.webService.put(url, this.itemFormDetails).subscribe((response: any) => {
      this.getItemDetails();
      this.toastr.success('ItemDetails updated successfully', 'Success');
      this.addEditItemDetailsModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateItemMaterial() {
    if (!this.itemFormMaterial.sourceLink) {
      this.toastr.warning('Please enter source', 'Warning');
      return;
    }
    if (!this.itemFormMaterial.minutes) {
      this.toastr.warning('Please enter minute', 'Warning');
      return;
    }
    if (!this.itemFormMaterial.episodeNumber) {
      this.toastr.warning('Please enter episodeNumber', 'Warning');
      return;
    }
    let url = `ViewitemMaterial`;
    // this.spinnerService.show();
    this.webService.put(url, this.itemFormMaterial).subscribe((response: any) => {
      this.getItemDetails();
      this.toastr.success('Item material updated successfully', 'Success');
      this.addEditItemMaterialModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteItemDetails(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete Item Details ?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `ViewItemDetail?viewItemDetailId=${obj.viewItemDetailId}&isActiveOrDeletes=true&isActiveOrDelete=Delete`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            this.getItemDetails();
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

  deleteItemMaterial(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete Item Material ?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `ViewitemMaterial?viewitemMaterialId=${obj.viewitemMaterialId}&isActiveOrDeletes=true&isActiveOrDelete=Delete`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            this.getItemDetails();
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
