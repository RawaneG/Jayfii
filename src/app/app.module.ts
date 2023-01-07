import * as fr from '@angular/common/locales/fr';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { MatRippleModule } from '@angular/material/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CreateCashierComponent } from './profile/create-cashier/create-cashier.component';
import { MonIntercepteurInterceptor } from './mon-intercepteur.interceptor';
import { SpinnerComponent } from './spinner/spinner.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

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
    SocialLoginModule,
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
    NgxMatFileInputModule
  ],
  providers:
  [
    { provide: LOCALE_ID, useValue: 'fr-FR'},
    DatePipe,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '50262491662-7rmnq8d035t9pofletlkp5dsn6maqldn.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ]
      } as SocialAuthServiceConfig,
    },
    { provide: HTTP_INTERCEPTORS, useClass: MonIntercepteurInterceptor, multi:true },
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
