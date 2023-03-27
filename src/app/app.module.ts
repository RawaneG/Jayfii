import * as fr from '@angular/common/locales/fr';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { PanierComponent } from './poste-de-vente/panier/panier.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { registerLocaleData, DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ProfileComponent } from './profile/profile.component';
import { CreateShopComponent } from './profile/create-shop/create-shop.component';
import { ListShopsComponent } from './profile/list-shops/list-shops.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { MatRippleModule } from '@angular/material/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CreateCashierComponent } from './profile/create-cashier/create-cashier.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations:
  [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    PosteDeVenteComponent,
    HeaderComponent,
    ListeCategoriesComponent,
    ListeProduitsComponent,
    CreerProduitComponent,
    CreerCategorieComponent,
    PanierComponent,
    ProfileComponent,
    CreateShopComponent,
    ListShopsComponent,
    ResetPasswordComponent,
    AdminComponent,
    CreateCashierComponent,
    SpinnerComponent,
    ConfirmPasswordComponent,
  ],
  imports:
  [
    BsDatepickerModule,
    MatRippleModule,
    FormsModule,
    MatSnackBarModule,
    Ng2SearchPipeModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NgxPaginationModule,
    MatToolbarModule,
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    NgxMatFileInputModule,
    MatDialogModule
  ],
  providers:
  [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'fr-FR'},
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule
{
  constructor()
  {
    registerLocaleData(fr.default);
  }
 }
