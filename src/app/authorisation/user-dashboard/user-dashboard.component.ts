import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import{AuthorizationApiService} from './../../services/authorization-api.service';
import{LocalStorageService} from './../../services/local-storage.service';
import { Router, ActivatedRoute , Params, NavigationEnd } from '@angular/router';
import{AuthenticationApiService} from './../../services/authentication-api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { HeaderComponent } from './../../header/header.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';
import {QRCodeComponent} from 'angular2-qrcode';
import { ClipboardService } from 'ng2-clipboard/ng2-clipboard';
import { ThankyouForRegistrationComponent } from '../../authentication/thankyou-for-registration/thankyou-for-registration.component';
// import { ConsoleReporter } from 'jasmine';
import * as jspdf from 'jspdf';  
import * as html2canvas from 'html2canvas';  

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  providers:[]
})

export class UserDashboardComponent implements OnInit {

  private loginDateAndTime;
  private isEdited = false;  
  private userCountries =[];
  private userRequests = [];
  private address:{};
  private countriesWallets = [];
  private walletLoginData:any = {};
  private profileImagePath="assets/img/profile-pic.jpg";
  private userProfileData = {address:{}, country:{}, profileImagePath:this.profileImagePath};
  private countries:any=[];
  private documentTypes=[];
  private kycDocumentTypes:any=[];
  private documentMetas= [];
  private userDocuments = []; 
  private userDocName = [];
  private kycDocumentMetass =[];
  private queryParams={};
  private sendWalletData ={};
  private walletAddress = {};
  private walletBalance = {};
  private walletBalanceAddress = {};
  private walletLoginModal=false;
  private voteCastingModal=false;
  private voteRevokingModal=false;
  private sendTransactionCredentials={};
  private receipientCredentials={};
  private delegateCredentials={};
  public delegates=[];
  public totalItems:any;
  private delegatePaginationCredentials={limit:10, offset:0, orderBy:"rank:asc"};
  private voteCredentials={limit:5, offset:1, orderBy:"timestamp"};  
  private castingVotes=[];
  private data:any ={pageNo:1, pageSize:100};
  private userRequestDocuments=[];
  private castedVoteDelegatesCredentials={};
  private castVote=false;
  private maxLengthExceeded=[];
  private userWallet={};
  private votes=[];
  private registeredSocialServices;
  // private userDocumentsRequestedByMerchantPaginationData={"pageNo":1, "pageSize":5};
  private userRequestedDocuments=[];
  private voterCredentials ={};
  private voters =[];
  private blocks =[];
  private standByDelegates=[];
  private limit=5;
  private transactionCredentials={limit:this.limit, offset:0};  
  private transactionPaginationData={limit:this.limit, offset:1, orderBy:"t_timestamp"};  
  private standByDelegatesPaginationCredentials = {limit:this.limit, offset:101,orderBy:"rank:asc"};
  private dismissModal=true;
  public countryIdArray: any = [];
  private countAndAddress={};
  private profileMetaData ={pageNo:1,pageSize:this.limit,count:-1}
  private profileMetaDataCriteria ={pageNo:0,pageSize:0,count:-1}
  private userDocumentsRequestedByMerchantPaginationData={pageNo:0, pageSize:0, count:-1};
  private countryIdCredential={};
  private countDelegates=0;
  private publicKey:string;
  private transactions = [];
  private countryIndex;
  private documentTypeIndex;
  private documentMetaIndex;
  private documentUploadModal:boolean=false;
  private documentSearchCriteria={};
  private formFields=[];
  private loginIPAddress;
  private walletAddressGenerateCriteria={};
  private countryWalletIndex;
  public countryDisable:any;
  private userCountry={isSecondaryWallet:false};
  private userCountryModal=false;
  private userCountryDocuments=[];
  private fieldsDefaultErrors:any=[];
  private fieldMetaDataValidationFlag:boolean=false;
  private fieldsInValidDataErrors:any=[];
  private fieldsMinLengthErrors:any=[];
  private fieldsMaxLengthErrors:any=[];
  private fieldsElementDataInvalidErrors:any=[];
  private documentImageFormData:FormData;
  private userDocumentData={};
  private revokingVotes=[];
  private sendTransaction=false;
  private becomeDelegateModal=false;
  private registeredSocialServicesURLs=[];
  private socialMediaModal=false;
  private socialMediaPublicURLs=[];
  private requestedDocumentImage;
  private viewRequestedDocumentImageModal=false;
  private producedBlocksCredentials ={};
  private countryId;
  private isCountry = false;
  private secret={};
  private countStandByDelegates=0;
  private countTransactions=0;
  private castedVotes=[];
  private countCastedVotes=0;
  private receivedVotes=[];
  private countReceivedVotes:number=0;
  private countBlocks:number=0;
  private limitReceivedVotes=this.limit;
  private limitCastedVotes=this.limit;
  private limitDelegates=this.limit;
  private limitStandByDelegates=this.limit;
  private limitBlocks=this.limit;
  private limitTransactions=this.limit;
  private producedBlocks=[];
  private delegateStatus;
  private receiveAddressModal= false;
  private isLoggedIn=false;
  private startIndex=0;
  private walletIndex:number=0;
  private maxDelegates=101;
  private kycIndex:string;
  private userWalletCountryWiseIndex:number;
  private baseCountry:boolean=false;
  private countryWallets=[];
  private selectedCountryWallet={};
  private baseCountryWallet={};
  private countryCode:string;
  private recepientCountries=[];
  private secondSecretStatus:boolean;
  private secondPublicKey:string;
  private secondSecret:string;
  private enteredSecondSecret:any={};
  private secondSecretModal=false;
  private baseCountryWalletLogIn:boolean=false;
  private whiteLabelMetas=[];
  private totalNoOfWalletCriteria={pageNo:0, pageSize:0, count:-1, isInactiveRequired:false};
  private noOfWalletsPerPage=10; 
  private userWalletDataCriteria={pageNo:1, pageSize:this.noOfWalletsPerPage, count:-1};
  private totalNoOfWalletDataCriteria={pageNo:0, pageSize:0, count:-1};
  private userListedWallet={};
  private userWhiteListedWallets=[];
  private userWhiteListedWalletModal=false;
  private noOfWallets;
  private wallet_Name;
  private userWhiteLabelData=[];
  public delegateFee:number=0;
	public transactionFee:number=0;
	public secondSecretFee:number=0;
	public voteFee:number=0;
	public multiSignatureFee:number=0;
  public blockchainFee:number=0;
  public documentVerificationFee:number=0; 
	public sidechainInTransfer:number=0;
  public sidechainOutTransfer:number=0;
  private selectedWalletAddress:string;
  private paymentCredentials={};
  private documentKYCPaymentModal=false;
  private documentVerificationCredentials={};
  private walletKYC={};
  private walletKYCModal=false;
  private kycDisabledWallets=[];
  private attachWhiteWalletModal:false;
  private blockchainKYCStatus:string;
  private localKYCStatus:string;
  private primaryWalletSecretModal:boolean=false;
  private newWalletModalCreationModal:boolean=false;
  private primaryWalletAddress:string;
  private userKYC:object={};
  private documentChannelData:object={};
  private belTokenConversion:number=0;
  private userNewWallet:object={};
  private kycCountryCode:string;
  private documentVerificationModal:boolean=false;
  private documentImageUploaded:boolean=false;
  private userCountryWiseWallets:object={};
  private walletAuthenticationModal:boolean=false;
  private userCountryKYCStatusModal:boolean=false;
  private walletAuthenticationMessage:string="";
  private isRedirectedToKYC:boolean=false;
  private userCountrySelectedWallet:object={};
  private userCountryLoggedInWallet:object={};
  private userRoleName:string;
  private walletSelectionModal:boolean=false;
  private userPaySlipData:object={};
  private userPaySlipList:object={};
  private userWalletData:object={};
  private userPaySlipArrData=[];
  private noOfPayslipsPerPage=this.limit;
  private noOfPayslips=1;
  private userCertificateModal=false;
  private userCertificateData:object={};
  private timestamp={};
  private dappData=[];
  private dapps={};
  private dappNames=[];
  private shareAssetModal: boolean = false;
  private userAsset={};
  private selectPayIds=[];
  private selectPayIdArr=[];
  private userPaySlipByIDData:object={};
  private payslipsPaginationCredentials={limit:this.limit, offset:0};
  private paySlipData: boolean =false;
  private isSharedisabled: boolean = true;
 // public isReload: boolean = false;
 // private isShareChecked: boolean = false;
 // private popwidth="";

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  @ViewChild('documentImage') documentImage:any;
  @ViewChild('userProfileImage') userProfileImage:any;
  @ViewChild("primaryWalletSecretForm") primaryWalletSecretForm:any;
  @ViewChild("documentForm") documentForm:any;
  @ViewChild("documentKYCPaymentForm") documentKYCPaymentForm:any;
  @ViewChild("documentVerificationForm") documentVerificationForm:any;
  @ViewChild("sendTransactionForm") sendTransactionForm:any;
  @ViewChild("becomeDelegateForm") becomeDelegateForm:any;
  @ViewChild("voteCastingForm") voteCastingForm:any;
  @ViewChild("voteRevokingForm") voteRevokingForm:any;
  @ViewChild("secondSecretForm") secondSecretForm:any;
  @ViewChild("userWhiteListedWalletForm") userWhiteListedWalletForm:any;
  @ViewChild("secretForm") secretForm:any;
  @ViewChild("userNewWalletSecondSecretForm") userNewWalletSecondSecretForm
  @ViewChild("kycSection") kycSection:ElementRef;
  @ViewChild("userAssetEmailForm") userAssetEmailForm:any; //added by priynaka
  
  constructor(private router: Router, private activatedRoute: ActivatedRoute, public vcr: ViewContainerRef, private localStorageService:LocalStorageService,private authenticationApiService:AuthenticationApiService, private authorizationApiService:AuthorizationApiService,private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef, private domSanitizer:DomSanitizer, private clipboard: ClipboardService) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
    this.userRoleName=this.localStorageService.getUserRole();
    this.setBlockchainTransactionsTypeFee();
    // this.resetUserWallet();
  }

  public setBlockchainTransactionsTypeFee(){
    this.belTokenConversion=this.localStorageService.belTokenConversion;
    this.delegateFee=this.localStorageService.delegateFee;
    this.transactionFee=this.localStorageService.transactionFee;
    this.secondSecretFee=this.localStorageService.secondSecretFee;
    this.voteFee=this.localStorageService.voteFee;
    this.multiSignatureFee=this.localStorageService.multiSignatureFee;
    this.blockchainFee=this.localStorageService.blockchainFee;
    this.sidechainInTransfer=this.localStorageService.sidechainInTransfer;
    this.sidechainOutTransfer=this.localStorageService.sidechainOutTransfer;
    this.documentVerificationFee=this.localStorageService.documentVerificationFee;
  }

  copyToClipboard = () => { 
    this.clipboard.copy(this.selectedCountryWallet['address']); 
  }

  public ngOnInit() {
    this.getUserCountriesWallet(false);
  }

  public openWalletAddressModal(){
    if(this.checkWalletSelection()){
      this.receiveAddressModal=true;
      let userCountryWalletKey=this.userCountryWiseWallets['countryCode']+"_"+this.selectedCountryWallet['address'];
      let userCountryWallet=this.localStorageService.getUserWalletByCountry(userCountryWalletKey);    
      if(userCountryWallet && userCountryWallet['address']){
        this.selectedCountryWallet['address']=userCountryWallet['address'];
      }
    } else {
      this.openWalletSelectionModal();
    }
  }

  public openSendTransactionModal(){
    if(this.checkWalletLoginAndKYCStatus()){
      this.sendTransaction=true;
      for(let key in this.receipientCredentials){
        this.receipientCredentials[key]=undefined;
      }
      this.getRecepientCountries();
    }
  }

  public closeSendTransactionModal(){
    this.sendTransaction=false;
    this.sendTransactionForm.reset();    
  }

  public openBecomeDelegateModal(){
    if(this.checkWalletLoginAndKYCStatus()){
      this.becomeDelegateForm.reset();
      this.becomeDelegateModal=true;
      this.delegateCredentials['username']=undefined;
      this.delegateCredentials['secondSecret']=undefined;
    }
  }

  public closeBecomeDelegateModal(){
    this.becomeDelegateModal=false;
  }

  public openWalletLoginModal(){
    this.secretForm.reset();
    this.walletLoginModal=true;
  }

  public closeWalletLoginModal(){
    this.walletLoginModal=false;
    if(this.userCountryLoggedInWallet['address']){
      this.selectedCountryWallet['address']=this.userCountryLoggedInWallet['address'];    
    } else if(!this.userCountryLoggedInWallet['address']){
      this.selectedCountryWallet['address']=undefined;
      this.walletLoginData['countryCode']=this.selectedCountryWallet['countryCode'];
    }
  }

  public openVoteCastingModal(){
    if(this.checkWalletLoginAndKYCStatus()){
      this.voteCastingForm.reset();
      this.voteCastingModal=true;
      this.voteCredentials['secondSecret']=undefined; 
      this.voteCasting['countryCode']=this.userCountryWiseWallets['countryCode'];
    }   
  }

  public closeVoteCastingModal(){
    this.voteCastingModal=false;   
  }

  public openVoteRevokingModal(){
    if(this.checkWalletLoginAndKYCStatus()){
      this.voteRevokingModal=true;
      this.voteCredentials['secondSecret']=undefined;
      this.voteCredentials['countryCode']=this.userCountryWiseWallets['countryCode'];
    }
  }

  public closeVoteRevokingModal(){
    this.voteRevokingModal=false;
  }
  
  public openEnableWalletKYCModal(){
    this.walletKYCModal=true;
    this.readKYCDisabledWallet();
  }

  public closeEnableWalletKYCModal(){
    this.walletKYCModal=false;
  }

  public openAddCountryModal(){
    this.userCountryModal=true;
    this.userCountry['countryCode']=undefined;
  }

  public closeAddCountryModal(){
    this.userCountryModal=false;
  }

  public OpenSocialMediaModal(){
    this.socialMediaModal=true;
    this.getSocialServices(this.profileMetaDataCriteria);
  }

  public closeSocialMediaModal(){
    this.socialMediaModal=false;
  }

  public openSecondSecretModal(){
    if(this.checkWalletLoginAndKYCStatus()){
      this.secondSecretForm.reset();
      this.secondSecretModal=true;
    }
  }

  public closeSecondSecretModal(){
    this.secondSecretModal=false;
  }

  public openUserWhiteListedWalletModal(){
    if(this.checkWalletLoginAndKYCStatus()){
      this.userWhiteListedWalletModal=true;
      for(let key in this.userListedWallet){
        this.userListedWallet[key]=undefined;
      }
      this.getUserKycStatus();
      this.getWhiteListedWallet(this.totalNoOfWalletCriteria);
    }
  }

  public closeUserWhiteListedWalletModal(){
    this.userWhiteListedWalletModal=false;
    this.userWhiteListedWalletForm.reset();    
  }

  public openDocumentUploadModal(){
    this.documentForm.reset();
    this.documentUploadModal=true;
  }

  public closeDocumentUploadModal(){
    this.documentUploadModal=false;
    this.documentImageUploaded=false;
  }

  public openDocumentKYCPaymentModal(){
    this.documentKYCPaymentForm.reset();
    this.paymentCredentials={};    
    this.documentKYCPaymentModal=true;
  }

  public closeDocumentKYCPaymentModal(){
    this.documentKYCPaymentModal=false;
  }

  public openViewUploadedDocumentModal(){
    this.viewRequestedDocumentImageModal=true;        
  }

  public closeViewUploadedDocumentModal(){
    this.viewRequestedDocumentImageModal=false;        
  }

  public openPrimaryWalletSecretModal(){
    this.primaryWalletSecretForm.reset();
    this.userKYC['secret']=undefined;
    this.primaryWalletSecretModal=true;
  }

  public closePrimaryWalletSecretModal(){
    this.primaryWalletSecretModal=false;
  }

  public openNewWalletCreationModal(){
    this.userNewWalletSecondSecretForm.reset();
    this.newWalletModalCreationModal=true;
  }

  public closeNewWalletCreationModal(){
    this.newWalletModalCreationModal=false;
  }

  public openWalletAuthenticationModal(){
    this.walletAuthenticationModal=true;
  }

  public closeWalletAuthenticationModal(){
    this.walletAuthenticationModal=false;
  }
  
  public openUserCountryKYCStatusModal(){
    this.userCountryKYCStatusModal=true;
  }

  public closeUserCountryKYCStatusModal(){
    this.userCountryKYCStatusModal=false;
  }

  public openDocumentVerificationModal(){
    this.documentVerificationForm.reset();
    this.documentVerificationCredentials={};    
    this.documentVerificationModal=true;
  }

  public closeDocumentVerificationModal(){
    this.documentVerificationModal=false;
  }

  public openWalletSelectionModal(){
    this.walletSelectionModal=true;    
  }

  public closeWalletSelectionModal(){
    this.walletSelectionModal=false;    
  }

  public redirectToWalletLoginModal(){
    this.closeWalletAuthenticationModal();
    this.openWalletLoginModal();
  }

  public redirectToKYCStatusVerification(){
    this.closeUserCountryKYCStatusModal();
    let el: HTMLElement = this.kycSection.nativeElement as HTMLElement;
    el.setAttribute("baseCountry", "true");
    el.setAttribute("countryCode", this.userCountryWiseWallets['countryCode']);   
    el.click();
  }

  public getUserCountrySelectedWalletByAddress(walletAddress:string){
    let userCountryWallets=this.userCountryWiseWallets['wallets'];
    for(let userCountryWalletIndex in userCountryWallets){
      if(userCountryWallets[userCountryWalletIndex]['address']==walletAddress){
        this.userCountrySelectedWallet=userCountryWallets[userCountryWalletIndex];
      }
    }
    console.log("----userCountrySelectedWallet----", this.userCountrySelectedWallet);
    // this.selectedCountryWallet['address']=this.userCountrySelectedWallet['address'];  
    // this.selectedWalletAddress=this.selectedCountryWallet['address'];  
  }

  public checkWalletLoginAndKYCStatus(){
    let isWalletSelected=this.checkWalletSelection();
    if(isWalletSelected){
      let isWalletLogin=this.checkUserWalletLogin();    
      if(isWalletLogin){
        let isCountryKYCStatusVerified=this.checkUserKYCStatus();    
        if(isCountryKYCStatusVerified){       
          return true;
        } else if(!isCountryKYCStatusVerified){
          this.openUserCountryKYCStatusModal();
          return false;
        }
      } else if(!isWalletLogin){
        this.openWalletAuthenticationModal();
        return false;
      }
    } else if(!isWalletSelected){
      this.openWalletSelectionModal();
    }
  }

  public checkWalletSelection(){
    if(this.selectedCountryWallet['address']){
      return true;
    } else if(!this.selectedCountryWallet['address']){
      return false;
    }
  }

  public checkUserWalletLogin(){
    let userCountryWalletKey=this.userCountryWiseWallets['countryCode']+"_"+this.selectedCountryWallet['address'];
    console.log("----userCountryWalletKey---", userCountryWalletKey);
    let userCountryWallet=this.localStorageService.getUserWalletByCountry(userCountryWalletKey);
    console.log("----userCountryWallet----", userCountryWallet);
    if(!userCountryWallet){
      return false;
    } else if(userCountryWallet){   
      console.log("----userCountryWallet----", userCountryWallet);
      this.userCountryLoggedInWallet=userCountryWallet;
      // this.walletLoginData['secret']=userCountryWallet['secret'];
      this.setWalletActionOptions();
      return true;
    }
  }

  public checkUserKYCStatus(){
    if(this.userCountryWiseWallets['kycVerificationStatus']){
      return true;
    } else if(!this.userCountryWiseWallets['kycVerificationStatus']){
      return false;
    }
  }

  public getUserProfile(){
    let userId = this.localStorageService.getUserId(); 
    this.getUserProfileById(userId);
    this.getLastLoginDateAndTime();
    this.getUserKycStatus();
    this.getSocialServicesURLs();
    this.getUserDocumentsRequestedByMerchant(this.userDocumentsRequestedByMerchantPaginationData);
  }

  public getCountries(){
    this.blockUserInterface();
    this.authorizationApiService.getCountries().subscribe(
      success=>{
        this.countries=success['data'];
        this.unblockUserInterface();
        this.openAddCountryModal();
      }, 
      error=>{
        this.unblockUserInterface();
      });
  }

  public getRecepientCountries(){
    this.blockUserInterface();
    this.authorizationApiService.getCountries().subscribe(
      success=>{
        this.unblockUserInterface();
        this.recepientCountries=success['data'];
      }, 
      error=>{
        this.unblockUserInterface();
      });
  }

  public saveAndUpdateUserCountry(){
    this.userCountryModal=false;
    this.saveUserCountry(this.userCountry);
  }

  public reloadUserWallet(){
    if(this.checkUserWalletLogin()){
      this.loginUserWallet();
    } else {
      this.openWalletSelectionModal();
    }
  }

  public saveUserCountry(userCountry){
    this.blockUserInterface();
    this.authorizationApiService.saveUserCountry(userCountry).subscribe(
      success=>{
        this.secret = success['data'];
        this.localStorageService.setUserWalletSecretKey(this.secret['wallet']['secret']);
        this.unblockUserInterface();
        this.getUserCountriesDocument();
        this.successMessage(success);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public readCountryByIndex(countryWalletIndex){
    this.resetUserWallet();
    this.getWalletsByCountry(countryWalletIndex);
    this.activateCountryTab();   
    this.getDelegates(this.delegatePaginationCredentials); 
  }

  public generatePublicKeyBySecretKey(secretKey:object){
    this.blockUserInterface();
    this.authorizationApiService.generatePublicKeyBySecretKey(secretKey).subscribe(
      success=>{
        this.unblockUserInterface();
        let userWalletKey=this.userCountryWiseWallets['countryCode']+"_"+this.userCountrySelectedWallet['address'];        
        // this.userCountryLoggedInWallet=this.localStorageService.getUserWalletByCountry(userWalletKey);
        this.userCountryLoggedInWallet['publicKey']=JSON.parse(success['data'])['publicKey'];
        this.localStorageService.setUserWalletByCountry(userWalletKey, this.userCountryLoggedInWallet); 
        Object.assign(this.transactionCredentials, this.transactionPaginationData);        
        this.getUserWallet();
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public generateSecretKey(){
    this.blockUserInterface();
    this.authorizationApiService.generateSecretKey(this.walletAddressGenerateCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.walletLoginData['secret']=success['data']['secret'];
        this.successMessage(success);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }
  
  public getLastLoginDateAndTime(){
    let currentDate = new Date();
    let loginDateAndTime=this.localStorageService.getUserLastLoggedInTime();
    let login=loginDateAndTime.split("from");
    this.loginDateAndTime=new Date(login[0]).toLocaleString() || 'NA';
    this.loginIPAddress=login[1];
  }

  /*It gets kyc status of users*/
  public getUserKycStatus(){
    this.blockUserInterface();
    this.authorizationApiService.getKycStatus().subscribe(
      success =>{
        this.userCountries = success['data'];
        this.unblockUserInterface();
      },
      error =>{ 
        this.unblockUserInterface();
        this.errorMessage(error)
      });
  }

  public loggedInUserWalletData(walletLoginData:object){
    this.userCountryLoggedInWallet['countryCode']=walletLoginData['countryCode'];
    this.userCountryLoggedInWallet['delegateStatus']=walletLoginData['delegateStatus'];
    this.userCountryLoggedInWallet['secondSecret']=walletLoginData['secondSignature'];    
    this.userCountryLoggedInWallet['address']=walletLoginData['address'];
    this.userCountryLoggedInWallet['secret']=walletLoginData['secret'];
    this.userCountryLoggedInWallet['secondPublicKey']=walletLoginData['secondPublicKey'];
  }

  public activateCountryTab(){
    for(let countryIndex in this.countriesWallets){
      this.countriesWallets[countryIndex]['active']=false;
      if(this.countriesWallets[countryIndex]['countryCode']==this.userCountryWiseWallets['countryCode']){
        this.countriesWallets[countryIndex]['active']=true;
      }
    }
  }

  /*It gets the user login to access wallet screen */
  public loginUserWallet(){
    this.walletLoginModal = false;    
    this.blockUserInterface();
    this.walletLoginData['secret']=this.trimPassphrase(this.walletLoginData['secret']);
    this.authorizationApiService.getWalletLogin(this.walletLoginData).subscribe(
      success => {
        console.log("----success----", success);
        this.unblockUserInterface();        
        let walletLoginData = JSON.parse(success['data']['data'])['account'];  
        if(walletLoginData['address']!=this.selectedCountryWallet['address']){
          this.selectedCountryWallet['address']=this.selectedWalletAddress;
          this.unblockUserInterface();
          this.toastsManager.error("Please, Enter Wallet's "+this.selectedCountryWallet['address']+" passphrase.");
          return ;
        }
        console.log("-----walletLoginData----", walletLoginData);
        walletLoginData['secret']=this.walletLoginData['secret'];
        walletLoginData['delegateStatus']=success['data']['delegateStatus'];
        walletLoginData['countryCode']=this.userCountryWiseWallets['countryCode'];
        this.loggedInUserWalletData(walletLoginData);
        this.selectedWalletAddress=this.selectedCountryWallet['address'];        
        this.generatePublicKeyBySecretKey({"secret":walletLoginData['secret']});
      },
      error =>{
        this.unblockUserInterface();
        console.log("----this.userCountrySelectedWallet----", this.userCountrySelectedWallet);
        // this.walletLoginData = {};
        if(this.userCountryLoggedInWallet['address']){
          this.selectedCountryWallet['address']=this.userCountryLoggedInWallet['address'];    
        } else if(!this.userCountryLoggedInWallet['address']){
          this.selectedCountryWallet['address']=undefined;
          this.walletLoginData['countryCode']=this.userCountryWiseWallets['countryCode'];
        }
        this.errorMessage(error);
      });
  }

  public setWalletActionOptions(){
      let publicKey=this.userCountryLoggedInWallet['publicKey'];
      let address=this.userCountryLoggedInWallet['address'];
      let secret=this.userCountryLoggedInWallet['secret'];
      // let secondSecret=this.userCountryLoggedInWallet['secondSecret'];
      let countryCode=this.userCountryLoggedInWallet['countryCode'];
      this.walletLoginData['secret']=secret;
      this.walletLoginData['countryCode']=countryCode;
      this.sendTransactionCredentials['publicKey']=publicKey;
      this.voteCredentials['publicKey']=publicKey;
      this.voteCredentials['countryCode']=countryCode;
      this.voterCredentials['publicKey']=publicKey;
      this.delegateCredentials['publicKey']=publicKey;
      this.producedBlocksCredentials['publicKey']=publicKey;
      this.sendTransactionCredentials['secret'] = secret; 
      // this.sendTransactionCredentials['secondSecret'] = secondSecret;
      this.delegateCredentials['secret']=secret;
      this.voteCredentials['secret']=secret;
      this.castedVoteDelegatesCredentials['address']=address;
      this.transactionCredentials['address']=address;
  }

  public getUserWallet(){
    this.setWalletActionOptions();
    this.getWalletAccountBalance(this.userCountryLoggedInWallet['address']);
    this.getDelegates(this.delegatePaginationCredentials);
    this.getTranasctions(this.transactionCredentials);  
    if(this.userCountryLoggedInWallet['delegateStatus']=='CONFIRMED'){
      this.getVoters(this.voterCredentials['publicKey']);
      this.getProducedBlocks(this.voterCredentials['publicKey']);
    }
  }

  public delegatesManipulation(){
    for(let delegateIndex in this.delegates){
      for(let voteIndex in this.votes){
        if(this.delegates[delegateIndex]['address']==this.votes[voteIndex]['address']){
          this.delegates[delegateIndex]['isVoted']=true;
        }
      }
    }
  }

  public standByDelegatesManipulation(){
    for(let standByDelegateIndex in this.standByDelegates){
      for(let voteIndex in this.votes){
        if(this.standByDelegates[standByDelegateIndex]['address']==this.votes[voteIndex]['address']){
          this.standByDelegates[standByDelegateIndex]['isVoted']=true;
        }
      }
    }
  }

  /*It  reads the wallet transaction*/
  public readWalletTransaction(){
    this.sendTransactionCredentials['amount'] = parseFloat(this.receipientCredentials['amount'])*this.localStorageService.belTokenConversion;
    this.sendTransactionCredentials['recipientId'] = this.receipientCredentials['recipientId'];
    this.sendTransactionCredentials['secondSecret'] = this.receipientCredentials['secondSecret'];
    if(this.sendTransactionCredentials['secondSecret']){
      this.sendTransactionCredentials['secondSecret'] = this.trimPassphrase(this.receipientCredentials['secondSecret']); 
    }
    this.sendTransactionCredentials['recepientCountryCode'] = this.receipientCredentials['recipientCountryCode'];
    this.sendTransactionCredentials['senderCountryCode'] = this.userCountryWiseWallets['countryCode']; 
    this.sendWalletTransaction(this.sendTransactionCredentials);
    this.sendTransactionForm.reset();        
  }

  /* This function sends the transaction*/
  public sendWalletTransaction(walletLoginData){
    this.sendTransaction=false;
    this.blockUserInterface();
    this.authorizationApiService.sendTransaction(walletLoginData).subscribe(success=>{
      this.getUserWallet();
      this.unblockUserInterface();
      this.walletLoginModal=false;
      if(success['error']){
        success['message']=success['error'];
      } else {
        success['message']="Send Transaction Successfully.";
      }
      this.successMessage(success);
    },
    error=> {
      this.unblockUserInterface();
      this.errorMessage(error);
    });
  }
  
    /*It  reads the delegate registration*/
    public readBecomeDelegate(){
      this.delegateCredentials['countryCode']=this.userCountryWiseWallets['countryCode'];
      if(this.delegateCredentials['secondSecret']){
        this.delegateCredentials['secondSecret']=this.trimPassphrase(this.delegateCredentials['secondSecret']);
      }
      this.becomeDelegate(this.delegateCredentials);
    }

    /*This function works on delegate registration */
    public becomeDelegate(delegateData){
      this.becomeDelegateModal=false;
      this.blockUserInterface();
      this.authorizationApiService.becomeDelegate(delegateData).subscribe(
        success=>{
          let delegateData = success;
          if(success['error']){
            success['message']=success['error'];
          } else {
            success['message']="Delegate Successfully.";
          }
          this.loginUserWallet();
          this.successMessage(success);
          this.unblockUserInterface();
        },
        error =>{
          this.unblockUserInterface();
          this.errorMessage(error);
        });
    }

  // ----------------------profile work-----------------------
  /* update user profile by Id called from html.*/
  public updateUserProfile(updateUserProfileForm) {
    let userId = this.localStorageService.getUserId();
    this.updateUserProfileById(userId);
  }

  /* It gets user profile data for editing.*/
  public editUserProfile() {
    this.isEdited= true;
    let userId=this.localStorageService.getUserId();
    this.getUserProfileById(userId);
  }

    /* update user profile by Id.*/
    public updateUserProfileById(userId){
      console.log("====this.userProfileData in updateUserProfileById===", this.userProfileData);
      this.blockUserInterface();
      this.authorizationApiService.editUserProfile(userId, this.userProfileData).subscribe(
        success => {
          this.unblockUserInterface();
          this.isEdited = false;
          this.successMessage(success);
        },
        error => {
          this.unblockUserInterface();
          this.errorMessage(error);
        });
    }

    /* It gets user profile data by Id.*/
    public getUserProfileById(userId) {
      this.blockUserInterface();
      this.authorizationApiService.getUserProfile(userId).subscribe(
        success => {
          this.unblockUserInterface();
          this.userProfileData = success['data'];
          let userProfile = success['data']['address'];
          if(!userProfile.phone && !userProfile.pincode && !userProfile.addressLine1 && !userProfile.city && !userProfile.state){
            this.isEdited = true;
          }
          this.localStorageService.setCountryCode(this.userProfileData['country']['countryCode']);
          this.localStorageService.setUserName(this.userProfileData['name']);
          if(this.userProfileData && this.userProfileData['profileImagePath']){
            this.localStorageService.setUserProfileImage(this.userProfileData['profileImagePath']);
          } else{
            this.userProfileData['profileImagePath']=this.profileImagePath;
            this.localStorageService.setUserProfileImage(this.userProfileData['profileImagePath']);           
          }
          // this.headerComponent.getUserProfile();
          this.userProfileData.address = this.userProfileData.address || {};
          this.router.navigate([this.router.url]);
        },
        error => {
          this.unblockUserInterface();
          this.errorMessage(error);
        });
    }

  /* It gets country docuemnt.*/
  public getUserCountriesDocument(){
    this.secondSecretStatus=false;
    this.blockUserInterface();
    this.authorizationApiService.getCountryDocument().subscribe(success=>{
      this.unblockUserInterface();
      this.countries=success['data']['countries'];
      for(let countriesIndex in this.countries){
        if(this.countries[countriesIndex] && this.countries[countriesIndex]['kycDocumentTypes']){
          for(let documentTypeIndex in this.countries[countriesIndex]['kycDocumentTypes']){
            if(this.countries[countriesIndex]['kycDocumentTypes'][documentTypeIndex] && this.countries[countriesIndex]['kycDocumentTypes'][documentTypeIndex]['kycDocumentMetas']){
              for(let documentMetaIndex in this.countries[countriesIndex]['kycDocumentTypes'][documentTypeIndex]['kycDocumentMetas']){
                this.countries[countriesIndex]['kycDocumentTypes'][documentTypeIndex]['isMandatory']= this.countries[countriesIndex]['kycDocumentTypes'][documentTypeIndex]['kycDocumentMetas'][documentMetaIndex]['isMandatory'];
                if(this.countries[countriesIndex]['kycDocumentTypes'][documentTypeIndex]['isMandatory']){
                  break;
                }
              }
            }
          }
        }
      }
      for(let countryIndex in this.countries){
        if(this.countries[countryIndex] && this.countries[countryIndex]['kycDocumentTypes']){
          for(let kycDocumentTypeIndex in this.countries[countryIndex]['kycDocumentTypes']){
            if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex] && this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas']){
              for(let kycDocumentMetaIndex in this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas']){
                this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['uploadStatus']=undefined;
                this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['documentStatus']=undefined;                                
                this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['paymentStatus']=undefined;
                this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['verificationStatus']=undefined;
                if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex] && this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['channelData']){
                  this.documentChannelData=JSON.parse(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['channelData']);
                }                  
                if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex] && this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']){
                  if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['uploadedAt']){
                    let uploadedDate=this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['uploadedAt'];
                    this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['uploadedAt']=new Date(uploadedDate).toLocaleString();
                  }
                  if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['documentStatus']){
                    this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['documentStatus']=this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['documentStatus']; 
                    this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['uploadStatus']=true;                  
                  }
                  if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['paymentTransaction'] && this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['paymentTransaction']['transactionStatus']){
                    this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['paymentStatus']=this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['paymentTransaction']['transactionStatus'];
                  }
                  if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['verificationTransaction'] && this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['verificationTransaction']['transactionStatus']){
                    this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['verificationStatus']=this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['verificationTransaction']['transactionStatus'];
                  }
                }
              }
            }
          }
        }
      }
      this.userCountryDocuments=success['data']['countries'];
      let el: HTMLElement = this.kycSection.nativeElement as HTMLElement;
      console.log("-----kycSection-----", el.getAttribute("baseCountry"));
      let baseCountry=JSON.parse(el.getAttribute("baseCountry"));
      let countryCode;
      if(!baseCountry){
        countryCode=this.localStorageService.getCountryCode();
      } else if(baseCountry){
        countryCode=el.getAttribute("countryCode");
        el.setAttribute("baseCountry", "false");
      }
      for(let kycIndex in this.userCountryDocuments){
        this.userCountryDocuments[kycIndex]['active']=false;
        if(this.userCountryDocuments[kycIndex]['countryCode']==countryCode){
          this.userCountryDocuments[kycIndex]['active']=true;
          this.kycIndex=kycIndex;
        }
        // for (let userCountryDocumentsIndex in this.userCountryDocuments){
        //   // let types = this.userCountryDocuments[userCountryDocumentsIndex]['kycDocumentTypes'];
        //   // console.log('kycDocumentTypes---------',types);
        //   // for(let typesIndex in types){
        //   //   let typees= types[typesIndex]['kycDocumentMetas'][typesIndex]['isMandatory'];
        //   //   console.log('kyc document metas----', typees);
        //   // }
        //   if(this.userCountryDocuments && this.userCountryDocuments[userCountryDocumentsIndex]['kycDocumentTypes']){
        //     for()
        //   }
        // }
      }
      this.getDcoumentTypesByCountryIndex(this.kycIndex)
    }, error=>{
      this.unblockUserInterface();
      this.errorMessage(error);
    });
  }

  public getUserDocumentByCountry(countryIndex1){
    this.blockUserInterface();
    this.authorizationApiService.getCountryDocument().subscribe(success=>{
      this.unblockUserInterface();
      this.countries=success['data']['countries'];
      for(let countryIndex in this.countries){
        if(this.countries[countryIndex] && this.countries[countryIndex]['kycDocumentTypes']){
          for(let kycDocumentTypeIndex in this.countries[countryIndex]['kycDocumentTypes']){
            if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex] && this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas']){
              for(let kycDocumentMetaIndex in this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas']){
                this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['uploadStatus']=undefined;
                this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['documentStatus']=undefined;                                
                this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['paymentStatus']=undefined;
                this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['verificationStatus']=undefined;
                if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex] && this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['channelData']){
                  this.documentChannelData=JSON.parse(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['channelData']);
                  console.log("-----documentChannelData---------", this.documentChannelData);
                } 
                if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex] && this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']){
                  if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['uploadedAt']){
                    let uploadedDate=this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['uploadedAt'];
                    this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['uploadedAt']=new Date(uploadedDate).toLocaleString();
                  }
                  if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['documentStatus']){
                    this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['documentStatus']=this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['documentStatus'];        
                    this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['uploadStatus']=true;           
                  }
                  if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['paymentTransaction'] && this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['paymentTransaction']['transactionStatus']){
                    this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['paymentStatus']=this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['paymentTransaction']['transactionStatus'];
                  }
                  if(this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['verificationTransaction'] && this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['verificationTransaction']['transactionStatus']){
                    this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['verificationStatus']=this.countries[countryIndex]['kycDocumentTypes'][kycDocumentTypeIndex]['kycDocumentMetas'][kycDocumentMetaIndex]['kycUserDocument']['verificationTransaction']['transactionStatus'];
                  }
                }
              }
            }
          }
        }
      }
      console.log("--------this.countries--------", this.countries);
    }, error=>{
      this.unblockUserInterface();
      this.errorMessage(error);
    });
  }

  public getDcoumentTypesByCountryIndex(countryLoopIndex){ 
    this.kycCountryCode=this.userCountryDocuments[countryLoopIndex]['countryCode'];
    console.log("=====kycCountryCode=======", this.kycCountryCode);
    this.getUserDocumentByCountry(countryLoopIndex);
    this.countryIndex=countryLoopIndex;
    for(let kycIndex in this.userCountryDocuments){
      this.userCountryDocuments[kycIndex]['active']=false;
    }
    console.log('------this.userCountryDocuments[countryLoopIndex]------', this.userCountryDocuments[countryLoopIndex]);
    this.blockchainKYCStatus=this.userCountryDocuments[countryLoopIndex]['blockchainStatus'];
    this.localKYCStatus=this.userCountryDocuments[countryLoopIndex]['status'];
    this.primaryWalletAddress=this.userCountryDocuments[countryLoopIndex]['address'];
    this.userKYC['countryCode']=this.userCountryDocuments[countryLoopIndex]['countryCode'];
    this.userCountryDocuments[countryLoopIndex]['active']=true;
    this.documentSearchCriteria['countryCode']=this.userCountryDocuments[this.countryIndex]['countryCode'];
    this.documentTypeIndex=undefined;
    this.documentMetaIndex=undefined;
  }

  public getDocumentMetasByDocumentTypeIndex(documentTypeLoopIndex){
    this.documentTypeIndex=documentTypeLoopIndex;
    this.documentSearchCriteria['kycDocumentTypeId']=this.userCountryDocuments[this.countryIndex]['kycDocumentTypes'][this.documentTypeIndex]['kycDocumentTypeId'];
  }

  public getDocumentByDocumentMetaIndex(documentTypeLoopIndex, documentMetaLoopIndex){
    this.documentSearchCriteria['kycDocumentTypeId']=this.userCountryDocuments[this.countryIndex]['kycDocumentTypes'][documentTypeLoopIndex]['kycDocumentTypeId'];
    this.documentSearchCriteria['kycDocumentMetaId']=this.userCountryDocuments[this.countryIndex]['kycDocumentTypes'][documentTypeLoopIndex]['kycDocumentMetas'][documentMetaLoopIndex]['kycDocumentMetaId'];
  // alert(this.documentSearchCriteria['kycDocumentTypeId'] +":" + this.documentSearchCriteria['kycDocumentMetaId']);
    this.getSelectedDocumentSchema(this.documentSearchCriteria);
  }

  public getSelectedDocumentSchema(documentSearchCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getDocumenetSchema(documentSearchCriteria).subscribe(
      success=>{
        this.formFields=success['data']['formproperties'];
        this.unblockUserInterface();
        this.openDocumentUploadModal();
        this.documentImageUploaded=false;
        this.documentImage.nativeElement.value="";        
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public resetUserWallet(){
    this.resetUserCountryWallet();    
    this.resetDataTableCount(0);    
    this.resetDataTableLimit(5);
  }

  public resetUserCountryWallet(){
    this.delegates=[];
    this.standByDelegates=[];
    this.voters=[];
    this.votes=[];
    this.transactions=[];
    this.revokingVotes=[];
    this.castingVotes=[];  
    this.userWallet={}; 
    this.selectedCountryWallet={};
    this.userCountryLoggedInWallet={};
  }

  public resetDataTableCount(count:number){
    this.countDelegates=count;    
    this.countStandByDelegates=count;
    this.countCastedVotes=count;
    this.countBlocks=count;
    this.countDelegates=count;
    this.countReceivedVotes=count;
    this.countTransactions=count;
  }

  public resetDataTableLimit(limit){
    this.limitReceivedVotes=limit;
    this.limitCastedVotes=limit;
    this.limitDelegates=limit;
    this.limitStandByDelegates=limit;
    this.limitBlocks=limit;
    this.limitTransactions=limit;
  }

  public getWalletsByCountry(countryIndex){
    this.countriesWallets[countryIndex]['active']=true;
    this.userCountryWiseWallets=this.countriesWallets[countryIndex];
    this.countryWallets=this.userCountryWiseWallets['wallets'];
    this.walletLoginData =  {
                              'countryId':this.countryId,
                              'countryCode':this.userCountryWiseWallets['countryCode']
                            }
    for(let walletIndex in this.countryWallets){
      if(this.countryWallets[walletIndex]['attached']=="belrium_primary"){
        if(this.countryWallets.length==1){
          this.selectedCountryWallet['address']=this.countryWallets[0]['address'];
          if(this.checkUserWalletLogin()){
            this.loginUserWallet();
          }
        }
        this.getUserCountrySelectedWalletByAddress(this.countryWallets[walletIndex]['address']);
      }
    }
  }

  /*It gets wallet address corresponding country*/
  public getUserCountriesWallet(selectedCountryStatus:boolean){
    this.blockUserInterface();
    this.authorizationApiService.getWalletAddressAndCountry().subscribe(
      success => {
        this.unblockUserInterface();        
        this.resetUserWallet();    
        this.countriesWallets = success['data']['countries'];
        console.log("---countriesWallets---", this.countriesWallets);
        let countryCode;
        if(selectedCountryStatus){
          countryCode=this.userCountrySelectedWallet['countryCode'];
        } else if(!selectedCountryStatus){
          countryCode=this.localStorageService.getCountryCode();
        }
        for(let countryWalletsIndex=0;countryWalletsIndex<this.countriesWallets.length;countryWalletsIndex++) {
          if(this.countriesWallets[countryWalletsIndex]['countryCode']==countryCode){
            this.getWalletsByCountry(countryWalletsIndex);                 
          }
        }
        this.activateCountryTab();
        this.getDelegates(this.delegatePaginationCredentials);    
      },
      error =>{
        this.unblockUserInterface();
      });
  }

  /*It gets the wallet balance of user*/
  public getWalletAccountBalance(address){
    // let address= this.walletBalanceAddress;
    this.blockUserInterface();      
    this.authorizationApiService.getAccountBalance(address).subscribe(
      success => {
        let userWallet=JSON.parse(success['data']);
        this.userWallet['balance'] = (userWallet['unconfirmedBalance']/this.localStorageService.belTokenConversion);
        this.userWallet['unconfirmedBalance'] = userWallet['unconfirmedBalance'];
        this.unblockUserInterface();
      },
      error =>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getDelegates(paginationData) {
      this.limitDelegates=this.limit;
      this.blockUserInterface();
      this.authorizationApiService.getDelegates(paginationData).subscribe(
      success => {
        this.limitDelegates=this.limit;
        let delegates=JSON.parse(success['data']);
        this.delegates = delegates['delegates'];
        for(let delegateIndex in this.delegates){
          this.delegates[delegateIndex]['balance']=this.delegates[delegateIndex]['balance']/this.localStorageService.belTokenConversion;
        }
        this.countDelegates = delegates['totalCount'];
        if(this.countDelegates>this.maxDelegates){
          this.countDelegates=this.maxDelegates;
        }
        for(let indx in this.delegates){
          this.delegates[indx]['status']=false;
          this.delegates[indx]['isVoted']=false;
        }
        this.getStandByDelegates(this.standByDelegatesPaginationCredentials);        
        this.unblockUserInterface();
      },
      error => {
        this.unblockUserInterface();
        this.errorMessage(error);
       });
  }

  /*This method reads the public key and username of delegate*/
  public readVoteCastingDelegatePublicKey(delegate, userVoteStatus){
    if(userVoteStatus.value){
      this.castingVotes[this.castingVotes.length]={"username":delegate['username'], "publicKey":delegate['publicKey']};
    } else if(!userVoteStatus.value){
      for(let indx in this.castingVotes){
        if(delegate['publicKey']==this.castingVotes[indx]['publicKey']){
          this.castingVotes.splice(parseInt(indx), 1);
        }
      }
    }
  }

  /*This method works on casting the vote*/
  public voteCasting(){
    let voteCastingOption={};
    let publicKey=[];
    for(let castingVoteDelegate of this.castingVotes){
      publicKey.push("+"+castingVoteDelegate['publicKey']);
    }
    voteCastingOption['delegates']=publicKey;
    voteCastingOption['secret']=this.voteCredentials['secret'];
    if(this.voteCredentials['secondSecret']){
      voteCastingOption['secondSecret']=this.trimPassphrase(this.voteCredentials['secondSecret']);
    }
    voteCastingOption['publicKey']=this.voteCredentials['publicKey'];
    voteCastingOption['countryCode']=this.voteCredentials['countryCode'];
    this.saveCastedVotes(voteCastingOption);
  }

  public saveCastedVotes(voteCastingOption){
    this.voteCastingModal=false;
    this.blockUserInterface();
    this.authorizationApiService.saveVotes(voteCastingOption).subscribe(
      success =>{
        if(success['error']){
          success['message']=success['error'];
        } else {
          success['message']="Vote Casted Successfully.";
        }
        this.castingVotes=[];
        this.getUserWallet();
        this.unblockUserInterface();
        this.successMessage(success);
      },
      error =>{
        this.castingVotes=[];
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public readVoteRevokingDelegatePublicKey(vote, userVoteStatus){
    if(userVoteStatus.value){
      this.revokingVotes[this.revokingVotes.length]={"username":vote['username'], "publicKey":vote['publicKey']};
    } else if(!userVoteStatus.value){
      for(let indx in this.revokingVotes){
        if(vote['publicKey']==this.revokingVotes[indx]['publicKey']){
          this.revokingVotes.splice(parseInt(indx), 1);
        }
      }
    }
  }

  /*This method works on casting the vote*/
  public voteRevoking(){
    let voteRevokingOption={};
    let publicKey=[];
    for(let revokingVote of this.revokingVotes){
      publicKey.push("-"+revokingVote['publicKey']);
    }
    voteRevokingOption['delegates']=publicKey;
    voteRevokingOption['secret']=this.voteCredentials['secret'];
    if(this.voteCredentials['secondSecret']){
      voteRevokingOption['secondSecret']=this.trimPassphrase(this.voteCredentials['secondSecret']);
    }
    voteRevokingOption['publicKey']=this.voteCredentials['publicKey'];
    voteRevokingOption['countryCode']=this.userCountryWiseWallets['countryCode'];
    this.saveRevokedVotes(voteRevokingOption);
  }

  public saveRevokedVotes(voteCastingOption){
    this.voteRevokingModal=false;
    this.blockUserInterface();
    this.authorizationApiService.saveVotes(voteCastingOption).subscribe(
      success =>{
        if(success['error']){
          success['message']=success['error'];
        } else {
          success['message']="Vote Revoked Successfully.";
        }
        this.revokingVotes=[];
        this.getUserWallet();
        this.unblockUserInterface();
        this.successMessage(success);
      },
      error =>{
        this.revokingVotes=[];
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  /*This method gets the votes of user's account*/
  public getVotes(userCountryLoggedInWallet:object){
    this.blockUserInterface();
    this.authorizationApiService.getMyVotes(userCountryLoggedInWallet).subscribe(
      success =>{
        this.limitCastedVotes=this.limit;
        this.castedVotes=[];   
        let votes=JSON.parse(success['data']);    
        this.votes = votes['delegates'];
        this.countCastedVotes=this.votes.length;
        if(!this.countCastedVotes){
          this.limitCastedVotes=0;
        } 
        if(this.countCastedVotes<this.limitCastedVotes){
          this.limitCastedVotes=this.countCastedVotes;
        }
        for(let index=0;index<this.limitCastedVotes;index++){
          if(this.votes[index]){
            this.castedVotes[this.castedVotes.length]=this.votes[index];
          }
        }
        this.delegatesManipulation(); 
        this.standByDelegatesManipulation();       
        this.unblockUserInterface();
      },
      error =>{
        this.unblockUserInterface();
        // this.errorMessage(error);
      });
  }

  /*This methods gets the list of standBy Delegates*/
  public getStandByDelegates(standByDelegatesPaginationCredentials){
    this.blockUserInterface();
    this.authorizationApiService.getDelegates(standByDelegatesPaginationCredentials).subscribe(
      success => {
        this.unblockUserInterface();
        this.limitStandByDelegates=this.limit;
        this.standByDelegates = JSON.parse(success['data'])['delegates'];
        for(let standByDelegatesIndex in this.standByDelegates){
          this.standByDelegates[standByDelegatesIndex]['balance']=this.standByDelegates[standByDelegatesIndex]['balance']/this.localStorageService.belTokenConversion;
        }
        this.countStandByDelegates=JSON.parse(success['data'])['totalCount']-this.maxDelegates;
        // this.countStandByDelegates=this.standByDelegates.length;        
        if(this.countStandByDelegates<this.limitStandByDelegates){
          this.limitStandByDelegates=this.countStandByDelegates;
        }
        if(this.checkUserWalletLogin()){
          console.log("----userCountryLoggedInWallet----", this.userCountryLoggedInWallet);
          this.getVotes(this.userCountryLoggedInWallet);     
        }           
      },
      error => {
        this.unblockUserInterface();
      });
  }

  public saveAndUpdateSocialMediaPublicURLs(){
    this.socialMediaModal=false;
    this.socialMediaPublicURLs=[];
    for(let registeredSocialService of this.registeredSocialServices){
      if(registeredSocialService['publicUrl']){
        this.socialMediaPublicURLs[this.socialMediaPublicURLs.length]={"socialMetaId":registeredSocialService['socialMetaId']+"", "publicUrl":registeredSocialService['publicUrl']};
      }
    }
    let socialMediaPublicURLs={"payload":this.socialMediaPublicURLs};
    this.saveSocialMediaPublicURLs(socialMediaPublicURLs);
  }

  public saveSocialMediaPublicURLs(socialMediaPublicURLs){
    this.blockUserInterface();
    this.authorizationApiService.saveSocialMediaPublicURLs(socialMediaPublicURLs).subscribe(
      success=>{
        this.unblockUserInterface();
        this.getSocialServicesURLs();
        this.successMessage(success);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getSocialServices(profileMetaData){
    this.blockUserInterface();
    this.authorizationApiService.getSocialServices(profileMetaData).subscribe(
      success=>{
        this.registeredSocialServices=success['data']['socialProfileMetas'];
        console.log('service profile data on user dashboard-----',this.registeredSocialServices)
        this.getSocialServicesURLs();
        this.socialServiceDataManipilation();
        this.unblockUserInterface();
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public socialServiceDataManipilation(){
    for(let registeredSocialServicesURLIndex in this.registeredSocialServicesURLs){
      for(let registeredSocialServiceIndex in this.registeredSocialServices){
        if(this.registeredSocialServicesURLs[registeredSocialServicesURLIndex]['socialMetaId']==this.registeredSocialServices[registeredSocialServiceIndex]['socialMetaId']){
          this.registeredSocialServices[registeredSocialServiceIndex]['publicUrl']=this.registeredSocialServicesURLs[registeredSocialServicesURLIndex]['value'];
        }
      }
    }
  }

  public getSocialServicesURLs(){
    this.blockUserInterface();
    this.authorizationApiService.getSocialServicesURLs().subscribe(
      success=>{
        this.registeredSocialServicesURLs=success['data'];
        console.log('register service url',this.registeredSocialServicesURLs);
        this.unblockUserInterface();
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
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

  public closeViewRequestedDocumentImageModal(){
    this.viewRequestedDocumentImageModal=false;
  }

  public closeQRCodeModal(){
    this.receiveAddressModal=false;
  }

  /*This methods gets the latest transaction*/
  public getTranasctions(transactionData){
    this.blockUserInterface();
    this.authorizationApiService.getLatestTransaction(transactionData).subscribe(
      success =>{
        this.limitTransactions=this.limit;
        this.transactions = success['data']['transactions'];
        console.log('my transa---',this.transactions)
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
      error =>{
        this.unblockUserInterface();
      });
  }

  /*This method gets the list of my voters*/
  public getVoters(voterData){
    this.blockUserInterface();
    this.authorizationApiService.getMyVoters(voterData).subscribe(
      success => {
        this.voters = success['data']['accounts'];
        // this.voters=this.myVoters;
        this.countReceivedVotes=this.voters.length;
        if(!this.countReceivedVotes){
          this.limitReceivedVotes=0;
        }
        this.receivedVotes=[];
        if(this.voters.length){
          if(this.countReceivedVotes<this.limitCastedVotes){
            this.limitReceivedVotes=this.countReceivedVotes;
          }
          for(let index=0;index<this.limitReceivedVotes;index++){
            if(this.voters[index]){
              this.receivedVotes[this.receivedVotes.length]=this.voters[index];
            }
          }
        } 
        this.unblockUserInterface();
      },
      error =>{
        this.unblockUserInterface();
      });
  }

  public readKYCDisabledWallet(){
    for(let index in this.countryWallets){
      this.kycDisabledWallets[index]=this.countryWallets[index];    
    }
  }

  public saveAndUpdateWalletKYC(){
    this.walletKYCModal=false;
    console.log("--------country Code-------", this.countryCode, this.walletKYC);
    this.walletKYC['countryCode']=this.countryCode;
    this.saveWalletKYC(this.walletKYC);
  }

  public saveWalletKYC(walletKYC){
    this.blockUserInterface();
    this.authorizationApiService.saveKYC(walletKYC).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  /*This method gets the list of produced blocks*/
  public getProducedBlocks(publicKey){
    this.authorizationApiService.getProducedBlocks(publicKey).subscribe(
      success =>{
        this.blocks = success['data']['blocks'];
        for(let blocksIndex in this.blocks){
          this.blocks[blocksIndex]['totalAmount']=this.blocks[blocksIndex]['totalAmount']/this.localStorageService.belTokenConversion;
          this.blocks[blocksIndex]['totalFee']=this.blocks[blocksIndex]['totalFee']/this.localStorageService.belTokenConversion;
          this.blocks[blocksIndex]['reward']=this.blocks[blocksIndex]['reward']/this.localStorageService.belTokenConversion;
          this.blocks[blocksIndex]['date']=this.getDateByTimestamp(this.blocks[blocksIndex]['timestamp']);
        }
        this.countBlocks=this.blocks.length;
        if(!this.countBlocks){
          this.limitBlocks=0;
        }
        this.producedBlocks=[];
        if(this.blocks.length){
          if(this.countBlocks<this.limitBlocks){
            this.limitBlocks=this.countBlocks;
          }
          for(let index=0;index<this.limitBlocks;index++){
            if(this.blocks[index]){
              this.producedBlocks[this.producedBlocks.length]=this.blocks[index];
            }
          }
        } 
      },
      error =>{

      });
  }

  public saveProfileImage(event){
    let profileImagePath={"file":event.target.files[0]};
    let profileImageFile: File = event.target.files[0];
    let profileImageFormData: FormData = new FormData();
    profileImageFormData.append('file', profileImageFile);
    this.uploadProfileImage(profileImageFormData);
  }

  public uploadProfileImage(profileImageFormData){
    this.blockUserInterface();
    this.authorizationApiService.uploadProfileImage(profileImageFormData).subscribe(
      success=>{
        this.userProfileData['profileImagePath']=success['data']['profile'];
        this.localStorageService.setUserProfileImage(this.userProfileData['profileImagePath']);
        this.authorizationApiService.profileImage.emit(this.userProfileData['profileImagePath']);        
        this.unblockUserInterface();
        this.successMessage(success);
        this.userProfileImage.nativeElement.value="";
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
        this.userProfileImage.nativeElement.value="";
      });
  } 

  public uploadDocumentImage(event){
    console.log("--event--", event);
    // console.log("====documentImage====", this.documentImage);
    this.documentImageUploaded=true;
    let documentImagePath={"file":event.target.files[0]};
    let documentImageFile: File = event.target.files[0];
    this.documentImageFormData = new FormData();
    this.documentImageFormData.append('file', documentImageFile, documentImageFile.name);
    // this.documentImageFormData.append("file", documentImageFile);
    this.documentImageFormData.append("countryCode", this.documentSearchCriteria['countryCode']);
    this.documentImageFormData.append("kycDocumentMetaId", this.documentSearchCriteria['kycDocumentMetaId']);
    this.documentImageFormData.append("kycDocumentTypeId", this.documentSearchCriteria['kycDocumentTypeId']);
  }

  public readUploadedDocumentData(){
    this.userDocumentData['countryCode']=this.documentSearchCriteria['countryCode'];
    this.userDocumentData['kycDocumentMetaId']=this.documentSearchCriteria['kycDocumentMetaId'];
    this.userDocumentData['kycDocumentTypeId']=this.documentSearchCriteria['kycDocumentTypeId'];
    let metaData={};

    for(let index in this.formFields){
      metaData[this.formFields[index]['name']]=this.formFields[index]['value'];
    }
    this.userDocumentData['metaData']=JSON.stringify(metaData);
    this.documentImageFormData.append("metaData", JSON.stringify(metaData));
  }

  public saveAndUpdateUserDocument(){
    this.readUploadedDocumentData();
    this.documentUploadModal=false;
    this.saveUserDocument(this.userDocumentData, this.documentImageFormData);
  }

  public saveUserDocument(userDocumentData, userDocumentFormData){
    this.blockUserInterface();
    this.authorizationApiService.saveUserDocumentData(userDocumentData, userDocumentFormData).subscribe(
      success=>{
        this.unblockUserInterface();
        this.getUserCountriesDocument();
        this.successMessage(success);
        this.documentImage.nativeElement.value="";
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getUserDocumentsRequestedByMerchant(userDocumentsRequestedByMerchantPaginationData){
    this.blockUserInterface();
    this.authorizationApiService.getUserDocumentsRequestedByMerchant(userDocumentsRequestedByMerchantPaginationData).subscribe(
      success=>{
        this.userRequestedDocuments=success['data']['requests'];
        this.unblockUserInterface();
      }, 
      error=>{
        this.unblockUserInterface();
      });
  }

  public viewUploadedUserDocumentImage(documentTypeLoopIndex, documentMetaLoopIndex){
    let selectedUserDocument=this.userCountryDocuments[this.countryIndex]['kycDocumentTypes'][documentTypeLoopIndex]['kycDocumentMetas'][documentMetaLoopIndex];
    console.log("-----selectedUserDocument-------", selectedUserDocument);
    let viewUploadedUserDocumentImageCredentials={
                                                  "kycUserDocumentID":selectedUserDocument['kycUserDocument']['kycUserDocumentID'],
                                                  "secretKey":this.localStorageService.getBKVSSecretKey()
                                                };
    this.getDocumentsAuthorisedByUser(viewUploadedUserDocumentImageCredentials);
  }

  public getDocumentsAuthorisedByUser(requestedDocumentCredentials){
    this.blockUserInterface();
    this.authorizationApiService.getDocumentsAuthorisedByUser(requestedDocumentCredentials).subscribe(
      success=>{
        this.requestedDocumentImage=this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+success['data']['encodedDocumentString']);
        this.unblockUserInterface();
        this.openViewUploadedDocumentModal();    
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public fieldMetaDataValidation(currentField){
    let minLength=5;
    let maxLength=10;
    this.fieldMetaDataValidationFlag=false;
    let value=currentField.value;
    if(currentField.invalid){
        this.fieldsDefaultErrors[currentField.name]=false;
        this.fieldsMinLengthErrors[currentField.name]=false;
        this.fieldsInValidDataErrors[currentField.name]=true;
        this.fieldsMaxLengthErrors[currentField.name]=false;
        this.fieldMetaDataValidationFlag=true;
    } 
    if(currentField.valid){
        this.fieldsDefaultErrors[currentField.name]=false;
        this.fieldsMinLengthErrors[currentField.name]=false;
        this.fieldsInValidDataErrors[currentField.name]=false;
        this.fieldsMaxLengthErrors[currentField.name]=false;
        this.fieldMetaDataValidationFlag=true;
    } 
    if(currentField.value.length==0){
        this.fieldsDefaultErrors[currentField.name]=true;
        this.fieldsMinLengthErrors[currentField.name]=false;
        this.fieldsInValidDataErrors[currentField.name]=false;
        this.fieldsMaxLengthErrors[currentField.name]=false;
        this.fieldMetaDataValidationFlag=true;
    } 
    if(value.length<minLength && !this.fieldsInValidDataErrors[currentField.name] && !this.fieldsDefaultErrors[currentField.name]){
        this.fieldsDefaultErrors[currentField.name]=false;
        this.fieldsMinLengthErrors[currentField.name]=true;
        this.fieldsInValidDataErrors[currentField.name]=false;
        this.fieldsMaxLengthErrors[currentField.name]=false;
        this.fieldMetaDataValidationFlag=true;
    } 
    if(value.length>maxLength && !this.fieldsInValidDataErrors[currentField.name]){
        this.fieldsDefaultErrors[currentField.name]=false;
        this.fieldsInValidDataErrors[currentField.name]=false;
        this.fieldsMinLengthErrors[currentField.name]=false;
        this.fieldsMaxLengthErrors[currentField.name]=true;
        this.fieldMetaDataValidationFlag=true;
    }
    if(!this.fieldsDefaultErrors[currentField.name] && !this.fieldsInValidDataErrors[currentField.name] && !this.fieldsMinLengthErrors[currentField.name] && !this.fieldsMaxLengthErrors[currentField.name]){
      this.fieldsElementDataInvalidErrors[currentField.name]=true;
      this.fieldMetaDataValidationFlag=false;
    }
    if(this.fieldsDefaultErrors[currentField.name] || this.fieldsInValidDataErrors[currentField.name] || this.fieldsMinLengthErrors[currentField.name] || this.fieldsMaxLengthErrors[currentField.name]){
      this.fieldMetaDataValidationFlag=true;
    }
  }

    /* It checks maximum length for input field.*/
    public checkMaxLength(fieldName, maxLength){
      console.log("--userProfileData---", this.userProfileData);
      if(fieldName.value.length==maxLength){
          this.maxLengthExceeded[fieldName.name]=true;
      } else if(fieldName.value.length<maxLength){
          this.maxLengthExceeded[fieldName.name]=false;
      }
    }

    /* It gets user on demand.*/
    public reloadDelegates(params) {
      this.delegatePaginationCredentials['offset']=params['offset'];
      this.delegatePaginationCredentials['limit']=params['limit'];
      let exceededOffset=params['offset']+params['limit'];
      if(params['offset']<101){
        this.limitDelegates=this.limit;
      }
      if(exceededOffset>this.maxDelegates){
        this.delegatePaginationCredentials['limit']=this.maxDelegates-params['offset'];
      }
      this.getDelegates(this.delegatePaginationCredentials);
    }

    public reloadStandByDelegates(params){
      this.standByDelegatesPaginationCredentials['offset']=this.maxDelegates+params['offset'];
      this.standByDelegatesPaginationCredentials['limit']=params['limit'];
      this.getStandByDelegates(this.standByDelegatesPaginationCredentials);
    }

    public reloadTransactions(params){
      this.transactionCredentials['offset']=params['offset'];
      this.transactionCredentials['limit']=params['limit'];
      if(this.checkUserWalletLogin()){
        this.getTranasctions(this.transactionCredentials);
      }
    }

    public reloadCastedVotes(params){
      this.castedVotes=[];      
      let startIndex=params['offset'];
      this.startIndex=startIndex;
      let endIndex=startIndex+params['limit'];
      this.countCastedVotes=this.votes.length;
      if(this.countCastedVotes){
        // if(this.countCastedVotes<endIndex){
        //   this.limitCastedVotes=this.countCastedVotes-startIndex;
        //   endIndex=this.countCastedVotes;
        // }
        for(;startIndex<endIndex;startIndex++){
          if(this.votes[startIndex]){
            this.castedVotes[this.castedVotes.length]=this.votes[startIndex];
          }
        }
      }
    }

    public reloadReceivedVotes(params){
      let startIndex=params['offset'];
      let endIndex=startIndex+params['limit'];
      this.receivedVotes=[];
      if(this.voters.length){
        for(;startIndex<endIndex;startIndex++){
          if(this.voters[startIndex]){
            this.receivedVotes[this.receivedVotes.length]=this.voters[startIndex];
          }
        }
        if(this.receivedVotes.length<this.limitReceivedVotes){
          this.limitReceivedVotes=this.receivedVotes.length;
        } else if(this.receivedVotes.length==this.limit){
          this.limitReceivedVotes=this.limit;
        }
      }
    }

    public reloadBlocksProducedByDelegate(params){
      let startIndex=params['offset'];
      let endIndex=startIndex+params['limit'];
      this.producedBlocks=[];
      if(this.blocks.length){
        for(;startIndex<endIndex;startIndex++){
          if(this.blocks[startIndex]){
            this.producedBlocks[this.receivedVotes.length]=this.blocks[startIndex];
          }
        }
      }
    }
  
    public cellColor(car) {
      return 'rgb(255, 255,' + (155 + Math.floor(100 - ((car.rating - 8.7)/1.3)*100)) + ')';
    };
  
    /* special params */
    translations = <DataTableTranslations>{
        indexColumn: 'Index column',
        expandColumn: 'Expand column',
        selectColumn: 'Select column',
        paginationLimit: 'Max results',
        paginationRange: 'Result range'
    };

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

    public resetWallet(){
      this.resetDataTableLimit(1);
      this.resetDataTableCount(0);
      this.resetDataTableData();
    }

    public resetDataTableData(){
      this.walletLoginData={};
      this.userWallet={};
      this.votes=[];
      this.voters=[];
      this.delegates=[];
      this.standByDelegates=[];
      this.blocks=[];
      this.transactions=[];
    }

    public createWalletByCountry(){
      if(this.checkWalletLoginAndKYCStatus()){
        let secret=this.localStorageService.getUserWalletByCountry(this.userCountryWiseWallets['countryCode']+"_"+this.selectedCountryWallet['address'])['secret'];
        this.userNewWallet={"secret":secret, "countryCode":this.userCountryWiseWallets['countryCode']};
        if(this.userCountryLoggedInWallet['secondSecret']){
          this.openNewWalletCreationModal();
        } else {
          this.saveAndUpdateUserNewWallet();
        }
      }
    }

    public saveAndUpdateUserNewWallet(){
      this.closeNewWalletCreationModal();
      if(this.userNewWallet['secondSecret']){
        this.userNewWallet['secondSecret']=this.trimPassphrase(this.userNewWallet['secondSecret']);
      }
      this.generateUserNewWallet(this.userNewWallet);
    }

    public generateUserNewWallet(userNewWallet){
      this.blockUserInterface();
      this.authorizationApiService.generateUserWalletByCountry(userNewWallet).subscribe(
        success=>{
          this.secret = success['data'];
          this.unblockUserInterface();
          this.selectedCountryWallet['address']=undefined;
          this.getUserCountriesWallet(true);
          this.successMessage(success);
        }, 
        error=>{
          this.unblockUserInterface();
          this.errorMessage(error);
        });
    }

    public readRecipientWalletAddress(){
      let recipientId=this.receipientCredentials['recipientId'];
      if(recipientId){
        // let countryCode=recipientId.substring(recipientId.length-2);
        this.receipientCredentials['recipientCountryCode']=recipientId.substring(recipientId.length-2);
      }
    }

    public loginInSelectedCountryWallet(){
      this.getUserCountrySelectedWalletByAddress(this.selectedCountryWallet['address']);
      let isWalletLoggedIn=this.checkUserWalletLogin();
      if(isWalletLoggedIn){
        this.resetDataTableLimit(5);
        Object.assign(this.transactionCredentials, this.transactionPaginationData); 
        this.loginUserWallet();        
      } else if(!isWalletLoggedIn){
        this.openWalletLoginModal();
      }
    }

    public checkSecondSecret(){
      let walletKey=this.countryCode+"_"+this.address;
      let countryWallet=this.localStorageService.getUserWalletByCountry(walletKey);
      return countryWallet['secondSecretStatus'];
    }

    public generateSecondSecret(){
      this.secondSecretModal=false;      
      this.enteredSecondSecret['secret']=this.userCountryLoggedInWallet['secret'];
      this.enteredSecondSecret['publicKey']=this.userCountryLoggedInWallet['publicKey'];
      this.enteredSecondSecret['countryCode']=this.userCountryWiseWallets['countryCode'];
      this.enteredSecondSecret['secondSecret']=this.trimPassphrase(this.enteredSecondSecret['secondSecret']);
      this.createSecondSecret(this.enteredSecondSecret);
    }

    public createSecondSecret(secondSecretData){
      this.blockUserInterface();
      this.authorizationApiService.createSecondSecret(secondSecretData).subscribe(
        success=>{
          let walletKey=this.userCountryWiseWallets['countryCode']+"_"+this.userCountrySelectedWallet['address'];
          let userCountryLoggedInWallet=this.localStorageService.getUserWalletByCountry(walletKey);
          userCountryLoggedInWallet['secondSecret']=true;
          this.localStorageService.setUserWalletByCountry(walletKey, this.userCountryLoggedInWallet);
          this.unblockUserInterface();
          this.successMessage(success);
        },
        error=>{
          this.unblockUserInterface();
          this.errorMessage(error);
        });
    }

    public getWhiteLabelUserWallet(){
      this.userCountries=[];
      this.getUserWhiteListedWallet(this.userWalletDataCriteria);
    }

    public getWhiteListedWallet(whiteLabelData){
      this.blockUserInterface();
      this.authorizationApiService.getWhiteLabelWallet(whiteLabelData).subscribe(
        success=>{
          this.whiteLabelMetas=success['data']['socialProfileMetas'];
          this.unblockUserInterface();
          
        },  
        error=>{
          this.unblockUserInterface();
          this.errorMessage(error);
        });
    }

    public saveUserWhiteListedWallet(userLabelWallet){
      this.blockUserInterface();
      this.authorizationApiService.saveUserWhiteListedWallet(userLabelWallet).subscribe(
        success=>{
          this.unblockUserInterface();
          this.userWhiteListedWalletModal=false
          let walletId = success['data']['walletId'];
          this.successMessage(success);
          this.getUserWhiteListedWallet(this.userWalletDataCriteria);
        },
        error=>{
          this.unblockUserInterface();
          this.userWhiteListedWalletModal=false;
          this.errorMessage(error);
        });
    }

    public getUserWhiteListedWallet(userWhiteLabelData){
      this.blockUserInterface();
      this.authorizationApiService.getUserWhiteListedWallet(userWhiteLabelData).subscribe(
        success=>{
          this.userWhiteLabelData=[]
          this.userWhiteListedWallets=success['data']['whiteLabelWallets'];
          this.noOfWallets=success['data']['pagination']['count'];
          for(let userWhiteListedWalletsIndex in this.userWhiteListedWallets){
            this.userWhiteLabelData.push(
                                          {
                                            "address":this.userWhiteListedWallets[userWhiteListedWalletsIndex]['address'],
                                            "walletName":this.userWhiteListedWallets[userWhiteListedWalletsIndex]['walletWhiteLabelMeta']['walletName'],
                                            "walletSymbol":this.userWhiteListedWallets[userWhiteListedWalletsIndex]['walletWhiteLabelMeta']['walletSymbol'],
                                            "walletId":this.userWhiteListedWallets[userWhiteListedWalletsIndex]['walletId'],
                                            "walletWhiteLabelId":this.userWhiteListedWallets[userWhiteListedWalletsIndex]['walletWhiteLabelMeta']['walletWhiteLabelId']
                                          }
            )
          }
          this.unblockUserInterface();
        },
        error=>{
          this.unblockUserInterface();
        });
    }

    public editUserWhiteWalletById(userLabelWallet){
      for(let key in userLabelWallet){
        this.userListedWallet[key]=userLabelWallet[key];
      }
      this.userWhiteListedWalletModal=true;      
    }
    
    public updateUserWhiteListedWallet(walletId,userLabelWallet){
      this.blockUserInterface();
      this.authorizationApiService.updateUserWhiteListedWalletById(walletId,userLabelWallet).subscribe(
        success=>{
          this.unblockUserInterface();
          this.userWhiteListedWalletModal=false;
          let walletId = userLabelWallet['walletId'];
          this.successMessage(success);
          this.getUserWhiteListedWallet(this.userWalletDataCriteria);
        },
        error=>{
          this.unblockUserInterface();
          this.userWhiteListedWalletModal=false;
          this.errorMessage(error);
        }
      )
    }

    public checkSecondSecretBySecret(){
      this.userProfileData['secondSecretStatus']=false;
      this.blockUserInterface();
      this.userListedWallet['countryCode']=this.userCountryWiseWallets['countryCode'];
      this.userListedWallet['secret']=this.userCountryLoggedInWallet['secret'];
      this.authorizationApiService.getWalletLogin(this.userListedWallet).subscribe(
        success=>{
          console.log("--success----in checkSecondSecretBySecret---", success);
          let data=JSON.parse(success['data']['data']);
          if(data['account'] && data['account']['secondSignature']){
            this.userProfileData['secondSecretStatus']=true;          
          } else if(data['account'] && !data['account']['secondSignature']){
            this.saveAndUpdateUserWhiteListedWallet();
          }
        },
        error=>{
          console.log("--error----in checkSecondSecretBySecret---", error);
          this.unblockUserInterface();
          this.userWhiteListedWalletModal=false;
          this.errorMessage(error);
        });
    }

    public saveAndUpdateUserWhiteListedWallet(){
      this.userListedWallet['countryCode']=this.userCountryWiseWallets['countryCode'];
      this.userListedWallet['secret']=this.userCountryLoggedInWallet['secret'];
      this.userWhiteListedWalletModal=false;      
      if(this.userListedWallet['secondSecret']){
        this.userListedWallet['secondSecret']=this.trimPassphrase(this.userListedWallet['secondSecret']);
      }
      if(!this.userListedWallet['walletId']){
        this.saveUserWhiteListedWallet(this.userListedWallet);
      } else if(this.userListedWallet['walletId']){
        this.updateUserWhiteListedWallet(this.userListedWallet['walletId'], this.userListedWallet);
      }
      this.userWhiteListedWalletForm.reset();    
    }

    /* It gets user on demand.*/
	public reloadWallets(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.userWalletDataCriteria['pageNo']=pageNo;
		this.userWalletDataCriteria['pageSize']=pageSize;
    this.getUserWhiteListedWallet(this.userWalletDataCriteria);
  }

  public doumentKYCPayment(documentTypeLoopIndex, documentMetaLoopIndex){
    this.openDocumentKYCPaymentModal();    
    this.secondSecretStatus=false;
    console.log("--------documentTypeLoopIndex---------", documentTypeLoopIndex, "-----documentMetaLoopIndex-----", documentMetaLoopIndex);
    console.log("---------selectedUserDocument----------", this.userCountryDocuments[this.countryIndex]);    
    this.paymentCredentials['kycUserDocumentID']=this.userCountryDocuments[this.countryIndex]['kycDocumentTypes'][documentTypeLoopIndex]['kycDocumentMetas'][documentMetaLoopIndex]['kycUserDocument']['kycUserDocumentID'];    
    this.paymentCredentials['senderCountryCode']=this.userCountryDocuments[this.countryIndex]['countryCode'];
    this.paymentCredentials['countryCode']=this.userCountryDocuments[this.countryIndex]['countryCode'];
    console.log("========paymentCredentials=========", this.paymentCredentials);
  }

  public checkPaymentSecondSecretBySecret(){
    this.blockUserInterface();
    console.log("----this.paymentCredentials----", this.paymentCredentials);
    this.authorizationApiService.getWalletLogin(this.paymentCredentials).subscribe(
      success=>{
        console.log("----success-----", success);
        this.secondSecretStatus=JSON.parse(success['data']['data'])['account']['secondSignature'];
        console.log("----secondSecretStatus-----", this.secondSecretStatus);
        if(!this.secondSecretStatus){
          this.saveAndUpdateDocumentKYCPayment();
        }
        this.unblockUserInterface();
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
        this.closeDocumentKYCPaymentModal();
      });
  }

  public saveAndUpdateDocumentKYCPayment(){
    this.closeDocumentKYCPaymentModal();    
    this.blockUserInterface();
    this.authorizationApiService.makePayment(this.paymentCredentials).subscribe(
      success=>{
        console.log("=======success========", success);
        this.getUserDocumentByCountry(this.countryIndex);
        this.unblockUserInterface();
        this.successMessage(success);
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }
  
  public requestDocumentVerification(documentTypeLoopIndex, documentMetaLoopIndex){
    // this.secondSecretStatus=false;
    // this.openDocumentVerificationModal();    
    this.documentVerificationCredentials['kycUserDocumentID']=this.userCountryDocuments[this.countryIndex]['kycDocumentTypes'][documentTypeLoopIndex]['kycDocumentMetas'][documentMetaLoopIndex]['kycUserDocument']['kycUserDocumentID'];    
    console.log("======documentVerificationCredentials=======", this.documentVerificationCredentials);
    this.documentVerificationCredentials['countryCode']=this.userCountryDocuments[this.countryIndex]['countryCode'];    
    this.requestDocumentVerificationByUser();
  }

  public checkDocumentVerificationSecondSecretBySecret(){
    this.blockUserInterface();
    console.log("----this.documentVerificationCredentials----", this.documentVerificationCredentials);
    this.authorizationApiService.getWalletLogin(this.documentVerificationCredentials).subscribe(
      success=>{
        console.log("----success-----", success);
        this.secondSecretStatus=JSON.parse(success['data']['data'])['account']['secondSignature'];
        console.log("----secondSecretStatus-----", this.secondSecretStatus);
        if(!this.secondSecretStatus){
          this.requestDocumentVerificationByUser();
        }
        this.unblockUserInterface();
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public requestDocumentVerificationByUser(){
    // this.closeDocumentVerificationModal();
    this.blockUserInterface();
    this.authorizationApiService.requestDocumentVerification(this.documentVerificationCredentials).subscribe(
      success=>{
        console.log("=======success========", success);
        this.getUserDocumentByCountry(this.countryIndex);
        this.unblockUserInterface();
        this.successMessage(success);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public saveAndUpdateUserKYCByCountry(){
    this.closePrimaryWalletSecretModal();
    console.log("=====userKYC=====", this.userKYC);
    this.userKYC['countryCode']=this.kycCountryCode;
    this.saveUserKYCByCountry(this.userKYC);
  }

  public saveUserKYCByCountry(userKYC){
    this.blockUserInterface();
    this.authorizationApiService.saveKYC(userKYC).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public trimPassphrase(passphrase:string){
    return passphrase.trim();
  }

  /* code added by priyanka starts here*/

  public getDappId(){
    this.blockUserInterface();
   // this.dappData["email"] =   this.localStorageService.getUserEmailId()
   this.dappData["address"] = this.localStorageService.getWalletAddress();
   let userCountryWalletKey=this.userCountryWiseWallets['countryCode']+"_"+this.selectedCountryWallet['address'];
   let userCountryWallet=this.localStorageService.getUserWalletByCountry(userCountryWalletKey);    
   if(userCountryWallet && userCountryWallet['address']){
     this.selectedCountryWallet['address']=userCountryWallet['address'];
   }
   console.log("addressnew", this.selectedCountryWallet['address']);
   this.dappNames=[];
 
if(this.selectedCountryWallet['address']){
  this.dappData["Address"]=this.selectedCountryWallet['address'];
}else{
  this.dappData["Address"]="";
}
  
//this.dappData["Address"] ="A92TGtCSZ6R7ogquZ996wTgXXVQXBxYY71IN";

   console.log("dappaddress", JSON.stringify( this.dappData["Address"]));
    this.authorizationApiService.getDappId(this.dappData).subscribe(
      success=>{
        console.log("----success-----", JSON.stringify(success));
        this.dapps = success;
        let limit=this.limit;
        let offset = 0;
    
         //alert("success");
         for(let userdappIndex in this.dapps){
          
          if(this.dapps !== []){
           console.log("companyName" + JSON.stringify(this.dapps[userdappIndex]));
         //this.dappNames.push(this.dapps[userdappIndex]);
         let isActive: boolean= false;
         console.log("dappindex"+ userdappIndex);
         if(userdappIndex === "0"){
          isActive = true;
         }

         this.dappNames.push({"dappid":this.dapps[userdappIndex].dappid,"company":this.dapps[userdappIndex].company,"active":isActive});
         }

         console.log("dapps"+ JSON.stringify(this.dappNames));
          this.getPayslips(this.dapps[0]['dappid'], limit , offset, 0, false);
        }
        this.unblockUserInterface();
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }
  /* It gets user certifcates by primary wallet address.*/
  
  public getPayslips(dappID, limit, offset, dappNamesLoopIndex, isReload) {
 
    let userCountryWalletKey=this.userCountryWiseWallets['countryCode']+"_"+this.selectedCountryWallet['address'];
    let userCountryWallet=this.localStorageService.getUserWalletByCountry(userCountryWalletKey);    
    if(userCountryWallet && userCountryWallet['address']){
      this.selectedCountryWallet['address']=userCountryWallet['address'];
    }
    if(!isReload){
    this.selectPayIdArr=[];
    this.selectPayIds=[];
    }

  ////  console.log("address", this.selectedCountryWallet['address']);
    console.log("dappid", dappID);
    
    for(let dappIndex in  this.dappNames){
      this.dappNames[dappIndex]['active'] =false;
    }

   
      this.dappNames[dappNamesLoopIndex]['active'] =true;
    
  if(this.selectedCountryWallet['address']){
    this.userPaySlipData["Address"]= this.selectedCountryWallet['address'];
  }else{
   this.userPaySlipData["Address"]="";
  }
  // this.userPaySlipData["Address"]="A92TGtCSZ6R7ogquZ996wTgXXVQXBxYY71IN";

    this.userPaySlipData["dappId"]=dappID;
    this.userPaySlipData["limit"]=limit;
    this.userPaySlipData["offset"]=offset;
    this.userAsset['dappId']=dappID
    this.userPaySlipArrData =[];
    this.blockUserInterface();
    
    this.authorizationApiService.getPayslips(this.userPaySlipData).subscribe(
      success => {
        this.unblockUserInterface();
       if(success){
        this.userPaySlipList = success["issuedPayslips"];
      
        let noData = [] || {};
        if(success["issuedPayslips"].length > 0){
      
          this.paySlipData = true;

          var dappname="belfrics";
          var empId: string = this.userPaySlipList[0].empid;
      
          
          this.userAsset['empId']=  empId;
          this.noOfPayslips = success["issuedPayslips"].length;
 console.log("payslips" + this.noOfPayslips);
        if(this.noOfPayslips < this.noOfPayslipsPerPage){
          this.noOfPayslipsPerPage = this.noOfPayslips;
        }
          
              for(let userPayslipIndex in this.userPaySlipList){
            
              this.userPaySlipArrData.push(
                                                {
                                                  "dappid":dappID,
                                                  "id":this.userPaySlipList[userPayslipIndex].pid,
                                                  "transactionid":this.userPaySlipList[userPayslipIndex].transactionId,
                                                  "timestamp":this.userPaySlipList[userPayslipIndex].timestampp,
                                                  "publickey":this.userPaySlipList[userPayslipIndex].publickey,
                                                  "signature":this.userPaySlipList[userPayslipIndex].sign,
                                                  // "isSuccess":this.userPaySlipList[userPayslipIndex].isSuccess,                                                
                                                  "empid": this.userPaySlipList[userPayslipIndex].empid,                                                  
                                                  "month": this.getMonth(this.userPaySlipList[userPayslipIndex].month),
                                                  "year": this.userPaySlipList[userPayslipIndex].year,
                                                
                                                  
                                                }
                  )

                  
              // console.log("data2",JSON.stringify(this.userPaySlipList[userPayslipIndex].args.split(",")[3]));
              // console.log("data3",JSON.stringify(this.userPaySlipList[userPayslipIndex].args.split(",")[5]));
              // console.log("data4",JSON.stringify(this.userPaySlipList[userPayslipIndex].args.split(",")[6]));
              }
            }
            }
            this.unblockUserInterface();
          },
         
      error => {
        this.unblockUserInterface();
        this.errorMessage(error);
      });
      
    // code comment end test-- //
  }

 

    public reloadPayslips(params){
     // alert("reloadpay");
      this.getPayslips(this.userAsset['dappId'], params['limit'], params['offset'],0,true)
      // this.getStandByDelegates(this.standByDelegatesPaginationCredentials);
    }
  
  public selectAsset(item){
    console.log("item", item);

    if(item.isShareChecked){
    //  alert("checked");
    this.selectPayIdArr.push(item)  
    this.selectPayIds.push(item.id);
    }
   
  }

  public noneselected1(){
    return !this.selectPayIdArr.some(item => item.isShareChecked);
  }
  public noneShareSelected(){
    if(this.selectPayIds){
      if(this.selectPayIds.length > 0){
        //return false;
       // alert("false");
        this.isSharedisabled = false;
      }else{
      //return true; 
      this.isSharedisabled = true; 

    }
    //return true;
    this.isSharedisabled = true;
  }

  }
  public viewPayslipById(userLabelWallet){
    let groups=[];

    console.log("payslipr1" + JSON.stringify(this.userPaySlipArrData));
    console.log("payslipr" + JSON.stringify(userLabelWallet));
    let key = userLabelWallet.id
    //this.userPaySlipArrData[key];
    console.log("paysliprkey" + key);
    console.log("paysliprnew" + JSON.stringify(this.userPaySlipArrData[key]));
    this.userPaySlipByIDData['dappId']= this.userAsset['dappId'];
    this.userPaySlipByIDData['pId']=key;
    this.authorizationApiService.getPayslipsById(this.userPaySlipByIDData).subscribe(
      success=>{
        console.log("----successpayslip-----", success);
       // this.dapps = success;
       // this.getPayslips(success[0]);
       if(success["isSuccess"]){
        console.log("----successpayslipresult-----", success['result']);
       // groups.push(userLabelWallet.timestamp, success['name'],userLabelWallet.publicKey, userLabelWallet.signature,'true',)
       this.userCertificateModal=true;  
     this.userCertificateData['timestamp'] = userLabelWallet.timestamp;
     this.userCertificateData['name'] = success['result']['name'];
     this.userCertificateData['publlickey'] = userLabelWallet.publickey;
     this.userCertificateData['signature'] = userLabelWallet.signature;
     this.userCertificateData['isSuccess'] = 'true';
     this.userCertificateData['email'] = success['result']['email'];
     this.userCertificateData['empid'] = success['result']['empid'];
     this.userCertificateData['employer'] = success['result']['employer'];
     //this.timestamp = JSON.stringify(groups[0].timestamp);
     this.userCertificateData['month'] = userLabelWallet.month;
     this.userCertificateData['year'] = success['result']['year'];
     this.userCertificateData['designation'] = success['result']['designation'];
     this.userCertificateData['bank'] =success['result']['bank'];
     this.userCertificateData['accountnumber'] = success['result']['accountNumber'];
     this.userCertificateData['pan'] = success['result']['pan'];
     this.userCertificateData['basicpay'] = success['result']['basicPay'];
     this.userCertificateData['hra'] =success['result']['hra'];
     this.userCertificateData['lta'] = success['result']['lta'];
     this.userCertificateData['ma'] = success['result']['ma'];
     this.userCertificateData['providentFund'] = success['result']['providentFund'];
     this.userCertificateData['professionalTax'] = success['result']['professionalTax'];
     this.userCertificateData['grossSalary'] = success['result']['grossSalary'];
     this.userCertificateData['totalDeductions'] =success['result']['totalDeductions'];
      this.userCertificateData['netSalary'] = success['result']['netSalary'];
       }
        this.unblockUserInterface();
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
      
    //let groups= this.userPaySlipArrData.filter(data => data.id === key);
    console.log("payslipsel" + JSON.stringify(groups));
   
  //  this.userCertificateModal = true;
    // for(let key in userLabelWallet){
    //   this.userListedWallet[key]=userLabelWallet[key];
    // }
     

  }
  
  public closeUserCertificateModal(){
    this.userCertificateModal=false;    
  }

  public openShareAssetModal(){
    this.shareAssetModal=true;    
  }

  public closeShareAssetModal(){
    this.shareAssetModal=false;    
  }

  public shareAssets(){

    this.closeShareAssetModal();
    console.log("shareAsset:" + this.userAsset['email'] + "," +  JSON.stringify(this.selectPayIds));
    this.userAsset['payslipIDs']= this.selectPayIds;
    this.authorizationApiService.shareAsset(this.userAsset).subscribe(
      success=>{
        console.log("----success-----", success);
       // this.dapps = success;
       // this.getPayslips(success[0]);
        this.unblockUserInterface();
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public download(empname, month, year)  
  {  
   // alert("download");
    var data = document.getElementById('contentToConvert');  
    //alert("d" + data);
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
     // alert("content" +contentDataURL);
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save(empname + '_' + month + '_' + year +'.pdf'); // Generated PDF   
    });  
  }  

  public captureScreen()
  {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208; 
      var pageHeight = 295;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF 
    });
  }

  public getMonth(monthNumber){

    var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December' ];
        return monthNames[monthNumber - 1];
    // let monthName="may";
    // alert("month")
    // return monthName;
  }
  /* code added by priyanka ends here */
}
