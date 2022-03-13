import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
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
  public isBannerAdded: boolean = false;
  public isPosterAdded: boolean = false;
  public formDetails: any = {};
  public imageFile: any;
  public videoFile: any;
  public imageSelected: any;
  public active = 1;
  public disableBanner: boolean = true;
  public disablePoster: boolean = true;
  public disableTrailer: boolean = true;
  public disableMainVideo: boolean = true;
  public currentViewitemMaterialId: any;
  public progress: number = 0;
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
    this.active = 1;
    this.isEdit = false;
    this.disableBanner = true;
    this.disablePoster = true;
    this.disableTrailer = true;
    this.disableMainVideo = true;
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
    this.active = 1;
    this.itemFormMaterial = { ...obj };
    this.currentViewitemMaterialId = obj.viewitemMaterialId;
    if (this.itemFormMaterial.banners) {
      this.formDetails.banner = environment.API_ENDPOINT + this.itemFormMaterial.banners.bannerUrl.replaceAll('\\', '/');
      this.isBannerAdded = true;
    }
    if (this.itemFormMaterial.posters) {
      this.formDetails.poster = environment.API_ENDPOINT + this.itemFormMaterial.posters.posterURL.replaceAll('\\', '/');
      this.isPosterAdded = true;
    }

    if (this.itemFormMaterial.trailers) {
      this.formDetails.trailor = environment.API_ENDPOINT + this.itemFormMaterial.trailers.trailerUrl.replaceAll('\\', '/');
    }

    if (this.itemFormMaterial.mainVideoURL) {
      this.formDetails.mainVideoURL = environment.API_ENDPOINT + this.itemFormMaterial.mainVideoURL.replaceAll('\\', '/');
    }

    this.isEdit = true;
    this.disableBanner = false;
    this.disablePoster = false;
    this.disableTrailer = false;
    this.disableMainVideo = false;
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
      this.currentViewitemMaterialId = response.viewitemMaterialId;
      this.toastr.success('Item material added successfully', 'Success');
      setTimeout(() => {
        this.disableBanner = false;
        this.active = 2;
      }, 1000);
      // this.addEditItemMaterialModalRef.close();
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

  uploadItem(files: FileList, type: any) {
    if (type == 'banner') {
      this.formDetails.banner = {};
    }
    if (type == 'poster') {
      this.formDetails.poster = {};
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

  uploadVideo(files: FileList, type) {
    let validation = this.validateVideoUpload(files.item(0).name);
    if (validation) {
      this.videoFile = files.item(0);
      if (type === 'trailer') {
        this.uploadTrailor();
      }
      if (type === 'main') {
        this.uploadMainVideo();
      }
      // this.formDetails.logo.hasImg = true;
    } else {
      this.toastr.error("Please upload only JPG, PNG, GIF format", "Error");
    }
  }

  getBase64(file, type) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // console.log(reader.result);
      if (type == 'banner') {
        this.uploadBanner()
      }
      if (type == 'poster') {
        this.uploadPoster()
      }
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
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

  validateVideoUpload(fileName) {
    var allowed_extensions = new Array("mp4", "mpeg", "avi");
    var file_extension = fileName.split(".").pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.
    for (var i = 0; i <= allowed_extensions.length; i++) {
      if (allowed_extensions[i] == file_extension) {
        return true; // valid file extension
      }
    }
    return false;
  }

  uploadBanner() {
    let url = `Banner`;
    var formData = new FormData();
    formData.append('image', this.imageFile, this.imageFile.name.replace(/ /g, "_"));
    formData.append('viewitemMaterialId', this.currentViewitemMaterialId);
    this.webService.fileUpload(url, formData).subscribe((response: any) => {
      //  this.spinnerService.hide();
      //  this.addEditModalRef.close();
      this.formDetails.banner = environment.API_ENDPOINT + response.bannerUrl.replaceAll('\\', '/');
      this.isBannerAdded = true;
      setTimeout(() => {
        this.disablePoster = false;
        this.active = 3;
      }, 1000);
      this.toastr.success('Banner uploaded', 'Success');
    }, (error) => {
      console.log('error ts: ', error);
    });
  }


  uploadPoster() {
    let url = `Poster`;
    var formData = new FormData();
    formData.append('image', this.imageFile, this.imageFile.name.replace(/ /g, "_"));
    formData.append('viewitemMaterialId', this.currentViewitemMaterialId);
    this.webService.fileUpload(url, formData).subscribe((response: any) => {
      //  this.spinnerService.hide();
      //  this.addEditModalRef.close();
      this.formDetails.poster = environment.API_ENDPOINT + response.posterURL.replaceAll('\\', '/');
      this.isPosterAdded = true;
      setTimeout(() => {
        this.disableTrailer = false;
        this.active = 4;
      }, 1000);

      this.toastr.success('Poster uploaded', 'Success');
    }, (error) => {
      console.log('error ts: ', error);
    });
  }

  uploadTrailor() {
    let url = `Trailer`;
    var formData = new FormData();
    formData.append('video', this.videoFile, this.videoFile.name.replace(/ /g, "_"));
    formData.append('viewitemMaterialId', this.currentViewitemMaterialId);
    this.webService.fileUpload(url, formData).subscribe((response: any) => {
      //  this.spinnerService.hide();
      //  
      this.formDetails.trailor = environment.API_ENDPOINT + response.trailerUrl.replaceAll('\\', '/');
      this.isPosterAdded = true;
      setTimeout(() => {
        this.disableMainVideo = false;
        this.active = 5;
      }, 1000);
      this.toastr.success('Trailer uploaded', 'Success');
    }, (error) => {
      console.log('error ts: ', error);
    });
  }

  uploadMainVideo() {
    let url = `Video`;
    var formData = new FormData();
    formData.append('video', this.videoFile, this.videoFile.name.replace(/ /g, "_"));
    formData.append('viewitemMaterialId', this.currentViewitemMaterialId);
    this.webService.videoUpload(url, formData).subscribe((event: HttpEvent<any>) => {
      //  this.spinnerService.hide();
      //  
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          // this.formDetails.trailor = environment.API_ENDPOINT + response.trailerUrl.replaceAll('\\', '/');
          this.addEditItemMaterialModalRef.close();
          this.toastr.success('Video uploaded', 'Success');
          setTimeout(() => {
            this.progress = 0;
            this.getItemDetails();
          }, 400);
      }
    }, (error) => {
      console.log('error ts: ', error);
    });
  }
}
