import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService } from '../services.service';
import { IndexDBService } from '../index-db.service';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-poste-de-vente',
  templateUrl: './poste-de-vente.component.html',
  styleUrls: ['./poste-de-vente.component.scss']
})
export class PosteDeVenteComponent implements OnInit
{
  items$ !: Observable<any[]>;
  data !: any[];
  id = 0;
  spin: boolean = true;
  maQuantite: any;
  ajoutee: any;
  monPanier: any[] = [];
  mesProduits: any[] = [];
  monTotal: number = 0;
  form !: FormGroup;
  nomProduit = new FormControl('');
  montant !: number;
  reste: number = 0;
  confirmer: boolean = false;
  body: any;
  tabCommandes: any = [];
  intermediaire: any = [];
  tabEntier: any = [];
  produit !: { quantiteEnStock: any; };
  receipt: any = [];
  currentStore: any;
  currentShop: any;
  currentUser: any;
  currentCashier: any;
  currentSeller: any;
  product: any;
  search: any = '';
  category: any;
  mesCategories: any;
  unfilteredProd: any;
  monProduit: any[] = [];
  mesCommandes: any[] = [];
  public messaged !: string;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpClientService,
    private serviceAuth: AuthService,
    public location: Location,
    private indexDBService: IndexDBService,
  )
  {

  }

  recherche()
  {
    this.mesProduits = [];
    this.search = this.nomProduit.value;
    this.unfilteredProd = this.currentShop.filter((item: any) => item.nom.toLowerCase().includes(this.search.toLowerCase()));
    this.unfilteredProd.forEach((element: any) =>
    {
      element.etat == false ? this.mesProduits?.push(element) : null;
    });
  }
  open() {
    document.querySelector('.first-popup')?.classList.remove('hidden');
  }
  ouvre() {
    document.querySelector(".second-popup")?.classList.remove('cache');
  }
  ferme() {
    document.querySelector('.first-popup')?.classList.add('hidden');
  }
  close() {
    document.querySelector('.second-popup')?.classList.add('cache');
  }
  messageRecu(event: any) {
    this.monTotal = event;
  }
  getProduct()
  {
    this.monPanier.forEach((element: any) =>
    {
      this.intermediaire =
      {
        "quantite": element.quantite,
        "prix": element.prix,
        "produit":
        {
          "id": element.id,
          "nom": element.nom
        }
      }
      this.tabEntier.push(this.intermediaire);
    });
    return this.tabEntier;
  }
  confirmerPaiement()
  {
    if (this.monTotal == 0)
    {
      this.httpService.alert("Veuillez selectionner au moins un produit");
    }
    else
    {
      if (this.currentCashier == undefined)
      {
        this.body =
        {
          "prixCommande": this.monTotal,
          "montant": this.montant,
          "reste": this.reste,
          "methodePaiement":
          {
            "id": 1
          },
          "boutiquier":
          {
            "id": this.currentUser
          },
          "ligneDeCommandes": this.getProduct(),
          "shop":
          {
            "id": this.currentStore
          }
        }
      }
      // else
      // {
      //   this.body =
      //   {
      //     "prixCommande": this.monTotal,
      //     "montant": this.montant,
      //     "reste": this.reste,
      //     "methodePaiement":
      //     {
      //       "id": 1
      //     },
      //     "boutiquier":
      //     {
      //       "id": this.currentCashier?.boutiquier?.id
      //     },
      //     "ligneDeCommandes": this.getProduct(),
      //     "shop":
      //     {
      //       "id": this.currentCashier?.shop?.id
      //     },
      //     "caissier":
      //     {
      //       "id": this.currentCashier?.id
      //     }
      //   }
      // }
      this.httpService.postUrl(this.httpService.commandeUrl, this.body);
      this.httpService.getUrl(this.httpService.commandeUrl).subscribe(
        (data) =>
        {
          data.forEach((element : any) =>
          {
            element.boutiquier.id === this.currentUser ? this.mesCommandes.push(element) : null;
          });
          this.indexDBService.putData({ id : this.id, commandes : this.mesCommandes } , 'currentSellings').subscribe();
          this.closeAll();
        }
        );
      this.ferme();
      this.mesProduits.forEach((element: any) =>
      {
        this.produit =
        {
          "quantiteEnStock": element.quantiteEnStock
        }
        this.httpService.putUrl(this.httpService.produitUrl + '/' + element.id, this.produit);
      })
      this.httpService.openSnackBar('Vente effectuée avec succès');
    }
  }
  ecriture() {
    this.montant = +this.form.controls['montant'].value;
    if (this.montant >= this.monTotal && !isNaN(this.montant)) {
      this.reste = this.montant - this.monTotal;
      this.confirmer = true;
    }
    else {
      this.reste = 0;
      this.confirmer = false;
    }
  }
  closeAll()
  {
    this.monTotal = 0;
    this.indexDBService.clearData('panier');
    this.indexDBService.getData('panier').subscribe((data) =>
    {
      this.spin = true;
      this.monPanier = data;
      this.httpService.openSnackBar('panier vidé avec succès');
    });
  }
  panier(produit: any)
  {
    this.httpService.addToCart(produit)
    this.indexDBService.getData('panier').subscribe((data) =>
    {
      this.monPanier = data[0].panier;
      this.monTotal += this.monPanier ? this.monPanier[this.monPanier.length - 1].prix : 0;
    });
  }
  selectCategorie(event: any)
  {
    this.category = event.nom;
  }
  ngOnInit(): void
  {
    this.spin = false;
    this.indexDBService.getData('currentUser').subscribe(
      (data) =>
      {
        this.currentUser = data.length > 0 ? data[0].user.id : [];
      },
      (error) =>
      {
        console.log("Erreur au niveau de l'obtention de l'utilisateur")
      }
    )
    this.indexDBService.getData('currentShop').subscribe(
      (data) =>
      {
        this.currentStore = data.length > 0 ? data[0].boutique.id : [];
        this.currentShop = data.length > 0 ? data[0].boutique.produit : [];
        this.mesCategories = data.length > 0 ? data[0].boutique.categories : [];
        this.currentShop.forEach((element: any) =>
        {
          element.etat == false ? this.mesProduits?.push(element) : null;
        });
      },
      (error) =>
      {
        console.log("Erreur au niveau de l'obtention de la boutique " + error)
      });
    this.indexDBService.getData('panier').subscribe(
      (data) =>
      {
        this.monTotal = 0;
        this.monPanier = data.length > 0 ? data[0].panier : [];
        this.monPanier.forEach((panier) =>
        {
          this.monTotal += panier.prix;
        })
      },
      (error) =>
      {
        console.log("Vous n'avez pas encore de panier " + error)
      }
    )
    this.form = this.formBuilder.group(
    {
      montant: [""]
    });
    // -- Liste des produits du caissier
    // this.currentUser = JSON.parse(localStorage.getItem('ACCESS_TOKEN') || '[]');
    // if(this.currentUser.roles[0] == 'ROLE_CAISSIER')
    // {
    //   this.httpService.getUrl(this.httpService.cashierUrl).subscribe(
    //   (caissier) =>
    //   {
    //     this.currentCashier = caissier.find((param : any) => param.email === this.currentUser.email);
    //     this?.currentCashier?.shop?.produit.forEach((element : any) =>
    //     {
    //       if(element.etat == false)
    //       {
    //         this.mesProduits?.push(element);
    //       }
    //     });
    //   this.spin = false;
    //   })
    // }
  }
}
