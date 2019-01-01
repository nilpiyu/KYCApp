import { Component, OnInit,ViewContainerRef } from '@angular/core';
import {AuthorizationApiService} from '../../../services/authorization-api.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LocalStorageService } from './../../../services/local-storage.service'

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  providers:[AuthorizationApiService]
})
export class TransactionsComponent implements OnInit {

  private transactions = [];
  private countTransactions=0;
  private limit=10;
  private limitTransactions=this.limit;
  private transactionCredentials={limit:this.limit, offset:0, orderBy:"t_timestamp"};
  private userTransactionCredentials={countryCode:'all',address:'all',offset:0,limit:this.limit}
  private countriesWallets = [];
  private walletAddress;
  private userTransactions=[];
  private userCountTransaction=0;
  private transactionUserCredential={limit:this.limit, offset:0}
  private limitUserTransaction=this.limit
  private wallet=[];
  private roleName:string;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private authorizationApiService:AuthorizationApiService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef, private localStorageService:LocalStorageService) {    
  }

  ngOnInit() {
    this.getAllTransactions(this.transactionCredentials);
    this.getUserCountryWallet();
    this.getUserTransactions(this.userTransactionCredentials);
    this.roleName=this.localStorageService.getUserRole();
    console.log("---this.roleName---", this.roleName);
  }

  /*This method gets the listing of all tranactions*/
  public getAllTransactions(transactionData){
    this.blockUserInterface();
    this.authorizationApiService.getAllTransactions(transactionData).subscribe(
      success=> {
        this.transactions = success['data']['transactions'];
        for(let transactionIndex in this.transactions){
          this.transactions[transactionIndex]['amount']=this.transactions[transactionIndex]['amount']/this.localStorageService.belTokenConversion;
          this.transactions[transactionIndex]['fee']=this.transactions[transactionIndex]['fee']/this.localStorageService.belTokenConversion;
          this.transactions[transactionIndex]['date']=this.getDateByTimestamp(this.transactions[transactionIndex]['timestamp']);
          this.transactions[transactionIndex]['type']=this.authorizationApiService.transactionTypeMapping[this.transactions[transactionIndex]['type']];
        }
        this.countTransactions=success['data']['count'];
        if(this.countTransactions<this.limitTransactions){
          this.limitTransactions=this.countTransactions;
        }
        this.unblockUserInterface();
      },
      error=>{
        this.unblockUserInterface();
      }
    )
  } 

  /*It gets the wallet information*/
  public getUserCountryWallet(){
    this.blockUserInterface();
    this.authorizationApiService.getWalletAddressAndCountry().subscribe(
      success=>{
        let countries=[];
        this.countriesWallets = success['data']['countries'];
        for(let countriesWalletsIndex in this.countriesWallets){
          this.walletAddress = this.countriesWallets[countriesWalletsIndex]['wallets'];
          countries.push(this.walletAddress);
          for(let walletAddressIndex in this.walletAddress){
            this.wallet.push(this.walletAddress[walletAddressIndex]['address'])
          }
        }
        // this.userTransactionCredentials['countryCode']=undefined;
        // this.userTransactionCredentials['address']=undefined;
        this.unblockUserInterface();        
      },
      error=>{
        this.unblockUserInterface();
      }
    )
  }

  /*It gets the listing of user transaction*/
  public getUserTransactions(tranactionsData){
    this.blockUserInterface();
    this.authorizationApiService.getUserTransactions(tranactionsData).subscribe(
      success=>{
        this.unblockUserInterface();   
        let transactions=JSON.parse(success['data']);
        if(transactions && transactions['transactions']){
          this.userTransactions = transactions['transactions'];
          for(let userTransactionIndex in this.userTransactions){
            this.userTransactions[userTransactionIndex]['amount']=this.userTransactions[userTransactionIndex]['amount']/this.localStorageService.belTokenConversion;
            this.userTransactions[userTransactionIndex]['fee']=this.userTransactions[userTransactionIndex]['fee']/this.localStorageService.belTokenConversion;
            this.userTransactions[userTransactionIndex]['date']=this.getDateByTimestamp(this.userTransactions[userTransactionIndex]['timestamp']);
            this.userTransactions[userTransactionIndex]['type']=this.authorizationApiService.transactionTypeMapping[this.userTransactions[userTransactionIndex]['type']];
          }
        }
        this.userCountTransaction=transactions['count'];
        if(this.userCountTransaction<this.limitUserTransaction){
          this.limitUserTransaction=this.userCountTransaction;
        }
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      }
    )
  }
  
  public SearchByWalletAndCountry(){
    this.userTransactionCredentials['offset']=0;
    this.userTransactionCredentials['limit']=10;
    this.getUserTransactions(this.userTransactionCredentials);
  }

  public getDateByTimestamp(timestamp) { 
    let utcDate = new Date(Date.UTC(2016, 5, 27, 20, 0, 0, 0)); 
    let blockChainTimestamp = utcDate.getTime()/1000; 
    let requiredDate = new Date((timestamp + blockChainTimestamp) * 1000); 
    let month = requiredDate.getMonth() + 1; 
    let day = requiredDate.getDate(); 
    let h = requiredDate.getHours(); 
    let m = requiredDate.getMinutes(); 
    let s = requiredDate.getSeconds(); 
    let year=requiredDate.getFullYear();
    return  day+ "/" + month + "/" + year + " " + h + ":" + m + ":" + s; 
  }

  public reloadTransactions(params){
    this.transactionCredentials['offset']=params['offset'];
    this.transactionCredentials['limit']=params['limit'];
    // if(this.transactionCredentials['countryCode'] && this.transactionCredentials['address']){
      this.getAllTransactions(this.transactionCredentials);
    // }
  }

  public reloadUserTransactions(params){
    this.transactionUserCredential['offset']=params['offset'];
    this.transactionUserCredential['limit']=params['limit'];
    if(this.transactionCredentials['countryCode'] && this.transactionCredentials['address']){
      this.getUserTransactions(this.userTransactionCredentials);
    }
  }

  /* It displays success Toaster.*/
 public successMessage(success){
  this.toastsManager.success(success.message);
  }

  /* It displays error Toaster.*/
  public errorMessage(error){
    let errorJSON=this.parseError(error._body);
    this.toastsManager.error(errorJSON.message);
  }
    
  /* It parses error object.*/
  public parseError(errorString){
    return JSON.parse(errorString);
  }
  /* It blocks UI. */
  public blockUserInterface(){
    this.blockUI.start("Wait...");
  }

  /* It unblocks UI.*/
  public unblockUserInterface(){
    this.blockUI.stop();
  }
}
