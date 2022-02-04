import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  public languageList: any = [];
  public languageFormDetails: any = {};
  public addEditLanguageModalRef: any;
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
      this.getLanguageList();
    } else {
      this.toastr.warning('You are logged out. Please login again', 'Warning');
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }


  getLanguageList() {
    // this.spinnerService.show();
    let url = `Language?pageNumber=${this.page}&pageSize=${this.pageSize}`;
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

  openAddLanguageModal(template: TemplateRef<any>) {
    this.languageFormDetails = {};
    this.isEdit = false;
    this.addEditLanguageModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  openEditLanguageModal(template: TemplateRef<any>, obj) {
    this.languageFormDetails = { ...obj };
    this.isEdit = true;
    this.addEditLanguageModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  addLanguage() {
    if (!this.languageFormDetails.code) {
      this.toastr.warning('Please enter language code', 'Warning');
      return;
    }
    if (!this.languageFormDetails.languageName) {
      this.toastr.warning('Please enter language name', 'Warning');
      return;
    }

    if (!this.languageFormDetails.priority) {
      this.toastr.warning('Please enter language priority', 'Warning');
      return;
    }
    let url = `Language`;
    // this.spinnerService.show();
    this.webService.post(url, this.languageFormDetails).subscribe((response: any) => {
      this.getLanguageList();
      this.toastr.success('Language added successfully', 'Success');
      this.addEditLanguageModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateLanguage() {
    if (!this.languageFormDetails.code) {
      this.toastr.warning('Please enter language code', 'Warning');
      return;
    }
    if (!this.languageFormDetails.languageName) {
      this.toastr.warning('Please enter language name', 'Warning');
      return;
    }

    if (!this.languageFormDetails.priority) {
      this.toastr.warning('Please enter language priority', 'Warning');
      return;
    }
    let url = `Language?id=${this.languageFormDetails.id}`;
    // this.spinnerService.show();
    this.webService.put(url, this.languageFormDetails).subscribe((response: any) => {
      this.getLanguageList();
      this.toastr.success('Language updated successfully', 'Success');
      this.addEditLanguageModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteLanguage(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete language  ${obj.languageName}?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `Language?id=${obj.id}`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            this.getLanguageList();
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
