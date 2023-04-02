import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../services.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { IndexDBService } from 'src/app/index-db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm !: FormGroup;
  monBoutiquier !: any;
  loggedIn !: boolean;
  body: any;

  constructor(private indexDBService: IndexDBService, private service: AuthService, private httpService: HttpClientService, private formBuilder: FormBuilder) {

  }

  submitted() {
    this.httpService.login(this.loginForm.value);
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', Validators.required],
        password: ['', Validators.required],
      });
    this.service.deconnecter();
  }
}
