import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PosteDeVenteComponent } from './poste-de-vente/poste-de-vente.component';
import { HeaderComponent } from './header/header.component';
import { ListeCategoriesComponent } from './categories/liste-categories/liste-categories.component';
import { ListeProduitsComponent } from './produits/liste-produits/liste-produits.component';
import { CreerProduitComponent } from './produits/creer-produit/creer-produit.component';
import { CreerCategorieComponent } from './categories/creer-categorie/creer-categorie.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    PosteDeVenteComponent,
    HeaderComponent,
    ListeCategoriesComponent,
    ListeProduitsComponent,
    CreerProduitComponent,
    CreerCategorieComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
