import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClientService } from '../services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit
{
  registerForm !: FormGroup;
  body : any;
  nouveauBoutiquier: any;

  constructor(
    private httpService : HttpClientService,
    private serviceAuth : AuthService,
    private formBuilder : FormBuilder,
    private route : Router
    ) { }

  submitted()
  {
    this.httpService.getUrl(this.httpService.boutiquierUrl).subscribe(
      boutiquier =>
      {
        this.nouveauBoutiquier = boutiquier.find((user : any) => user.email == this.registerForm.value.email);
        if(this.nouveauBoutiquier == undefined)
        {
          this.body =
          {
            "email" : this.registerForm.value.email ,
            "password" : this.registerForm.value.password,
            "nomComplet" : this.registerForm.value.prenom + ' ' + this.registerForm.value.nom,
            "telephone" : +this.registerForm.value.telephone,
            "adresse" : this.registerForm.value.adresse
          }
          this.httpService.postUrl(this.httpService.boutiquierUrl, this.body);
          this.httpService.openSnackBar('Inscription effectuée avec succès', 'login');
        }
        else
        {
          this.httpService.openSnackBar('Cet email existe déjà, Veuillez vous connecter');
        }
      }
    );
  }

  ngOnInit(): void
  {
    this.registerForm  =  this.formBuilder.group(
      {
        email: ['', Validators.required],
        password: ['', Validators.required],
        prenom: ['', Validators.required],
        nom: ['', Validators.required],
        telephone: ['', Validators.required],
        adresse: ['', Validators.required]
      });
  }
}
