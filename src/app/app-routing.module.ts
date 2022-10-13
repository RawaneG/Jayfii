import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PosteDeVenteComponent } from './poste-de-vente/poste-de-vente.component';
import { CreerCategorieComponent } from './categories/creer-categorie/creer-categorie.component';
import { CreerProduitComponent } from './produits/creer-produit/creer-produit.component';
import { ListeCategoriesComponent } from './categories/liste-categories/liste-categories.component';
import { ListeProduitsComponent } from './produits/liste-produits/liste-produits.component';

const routes: Routes =
[
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'poc', component: PosteDeVenteComponent},
  {path: 'produits/add', component: CreerProduitComponent},
  {path: 'categories/add', component: CreerCategorieComponent},
  {path: 'produits', component: ListeProduitsComponent},
  {path: 'categories', component: ListeCategoriesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
