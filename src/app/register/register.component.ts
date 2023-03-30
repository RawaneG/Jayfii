import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../services.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit
{
  registerForm !: FormGroup;
  nouveauBoutiquier: any;
  body : any;

  constructor( private httpService : HttpClientService, private formBuilder : FormBuilder) { }

  submitted()
  {
    this.httpService.getAll(this.httpService.boutiquierUrl).subscribe(
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
          this.httpService.create(this.httpService.boutiquierUrl, this.body).subscribe(
            {
              next : () => this.httpService.openSnackBar('Inscription effectuée avec succès', 'login'),
              error : () => console.log("Erreur au niveau de la création de compte"),
              complete : () => console.log("Completed"),
            });
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
        telephone: ['', Validators.required],
        password: ['', Validators.required],
        adresse: ['', Validators.required],
        prenom: ['', Validators.required],
        email: ['', Validators.required],
        nom: ['', Validators.required],
      });
  }
}
