import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebService } from '../../services/web.service';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  token: any;
  queryParams: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private webService: WebService,
    private toastr: ToastrService,
    //  private spinnerService: Ng4LoadingSpinnerService
  ) {
  }
  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log(params);
        this.queryParams = params;
      });
    //  this.checkLogin();
    this.loginForm = this.formBuilder.group({
      // email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get f() { return this.loginForm.controls; }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    let url = 'admin/authenticate';
    let data = {
      username: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
      "ipAdress": "10.23.20",
      "deviceName": "Addroid 100"
    }
    //  this.spinnerService.show();
    this.webService.login(data, url).subscribe((response: any) => {
      //  this.spinnerService.hide();
      if (response.statusCode === 400) {
        this.toastr.error(response.message, 'Warning');
      } else {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userid", response.id);
        let firstName = response.firstName;
        let lastName = response.lastName;
        let username = firstName + ' ' + lastName;
        localStorage.setItem("username", username);
        this.toastr.success('Login Successfully', 'Success');
        if (this.queryParams.return_url)
          this.router.navigate([`/${this.queryParams.return_url}`]);
        else
          setTimeout(() => {
            this.router.navigate([`/users`]);
          }, 2000);
      }
      //  if (response.result) {



      // } else {
      //   this.toastr.error(response.results.error, 'Error');
      // }
      // } else {
      //   this.toastr.error(response.message, 'Error');
      // }
    }, (error) => {
      console.log("error ts: ", error);
      this.toastr.error(error);
    })
  }
}

