import { ListeCategoriesComponent } from './categories/liste-categories/liste-categories.component';
import { CreerCategorieComponent } from './categories/creer-categorie/creer-categorie.component';
import { ListeProduitsComponent } from './produits/liste-produits/liste-produits.component';
import { CreateCashierComponent } from './profile/create-cashier/create-cashier.component';
import { CreerProduitComponent } from './produits/creer-produit/creer-produit.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CreateShopComponent } from './profile/create-shop/create-shop.component';
import { PosteDeVenteComponent } from './poste-de-vente/poste-de-vente.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PanierComponent } from './poste-de-vente/panier/panier.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RegisterComponent } from './register/register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { registerLocaleData, DatePipe } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';
import { HeaderComponent } from './header/header.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { AdminComponent } from './admin/admin.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgModule, LOCALE_ID } from '@angular/core';
import * as fr from '@angular/common/locales/fr';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CustomFilterPipe } from './custom-filter-pipe.pipe';

@NgModule({
  declarations:
    [
      ListeCategoriesComponent,
      ConfirmPasswordComponent,
      CreerCategorieComponent,
      ListeProduitsComponent,
      CreateCashierComponent,
      ResetPasswordComponent,
      PosteDeVenteComponent,
      CreerProduitComponent,
      CreateShopComponent,
      DashboardComponent,
      RegisterComponent,
      SpinnerComponent,
      ProfileComponent,
      PanierComponent,
      HeaderComponent,
      LoginComponent,
      AdminComponent,
      AppComponent,
      CustomFilterPipe
    ],
  imports:
    [
      MatProgressSpinnerModule,
      BrowserAnimationsModule,
      NgxMatFileInputModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatDatepickerModule,
      NgxPaginationModule,
      ReactiveFormsModule,
      BsDatepickerModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatExpansionModule,
      MatSnackBarModule,
      MatCheckboxModule,
      MatToolbarModule,
      AppRoutingModule,
      HttpClientModule,
      MatSidenavModule,
      MatDividerModule,
      MatRippleModule,
      MatButtonModule,
      MatDialogModule,
      MatSelectModule,
      MatTableModule,
      MatInputModule,
      MatRadioModule,
      MatSortModule,
      MatIconModule,
      BrowserModule,
      MatListModule,
      FormsModule,
    ],
  providers:
    [
      { provide: LocationStrategy, useClass: HashLocationStrategy },
      { provide: LOCALE_ID, useValue: 'fr-FR' },
      DatePipe,
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}
