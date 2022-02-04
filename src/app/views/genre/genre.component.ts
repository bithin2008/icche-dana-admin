import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {

  public genreList: any = [];
  public genreFormDetails: any = {};
  public addEditGenreModalRef: any;
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
      this.getGenreList();
    } else {
      this.toastr.warning('Please login', 'Warning');
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }


  getGenreList() {
    // this.spinnerService.show();
    let url = `Genre?pageNumber=${this.page}&pageSize=${this.pageSize}`;
    if (this.filterForm.searchText)
      url = url + `&searchText=${this.filterForm.searchText}`;
    this.webService.get(url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      // if (response.status == 1) {
      this.genreList = response.genres;
      // }

    }, (error) => {
      console.log('error', error);
    });
  }

  openAddGenreModal(template: TemplateRef<any>) {
    this.genreFormDetails = {};
    this.isEdit = false;
    this.addEditGenreModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  openEditGenreModal(template: TemplateRef<any>, obj) {
    this.genreFormDetails = { ...obj };
    this.isEdit = true;
    this.addEditGenreModalRef = this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  addGenre() {

    if (!this.genreFormDetails.genreName) {
      this.toastr.warning('Please enter genre name', 'Warning');
      return;
    }

    if (!this.genreFormDetails.priority) {
      this.toastr.warning('Please enter genre priority', 'Warning');
      return;
    }
    let url = `Genre`;
    // this.spinnerService.show();
    this.webService.post(url, this.genreFormDetails).subscribe((response: any) => {
      this.getGenreList();
      this.toastr.success('Genre added successfully', 'Success');
      this.addEditGenreModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  updateGenre() {

    if (!this.genreFormDetails.genreName) {
      this.toastr.warning('Please enter genre name', 'Warning');
      return;
    }

    if (!this.genreFormDetails.priority) {
      this.toastr.warning('Please enter genre priority', 'Warning');
      return;
    }
    let url = `Genre?id=${this.genreFormDetails.id}`;
    // this.spinnerService.show();
    this.webService.put(url, this.genreFormDetails).subscribe((response: any) => {
      this.getGenreList();
      this.toastr.success('Genre updated successfully', 'Success');
      this.addEditGenreModalRef.close();
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteGenre(obj) {
    this.confirmationDialogService.confirm('Delete', `Do you want to delete genre  ${obj.genreName}?`)
      .then((confirmed) => {
        if (confirmed) {
          let url = `Genre?id=${obj.id}`;
          // this.spinnerService.show();
          this.webService.delete(url).subscribe((response: any) => {
            // this.spinnerService.hide();
            //  if (response.is_valid_session) {
            //   if (response.status == 1) {
            this.getGenreList();
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
