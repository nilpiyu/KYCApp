import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras} from '@angular/router';
import { LocalStorageService } from './../../services/local-storage.service';
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { SignOutComponent } from './../../authentication/sign-out/sign-out.component';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';
import { AuthorizationApiService } from './../../services/authorization-api.service';
import {BKVSVerificationComponent} from './../bkvs-verification.component';

@Component({
  selector: 'bkvs-verification-grantaccess',
  templateUrl: './bkvs-verification-grantaccess.component.html',
  styleUrls: ['./bkvs-verification-grantaccess.component.css'],
  providers: [ SignOutComponent, BKVSVerificationComponent]
})
export class BKVSVerificationGrantAccessComponent implements OnInit {

  /* Instance variable declaration section.*/

  private userDocuments = [];
  private noOfUserDocuments: Number;
  private limit: Number;
  private noOfDocumentPerPage = 5;
  private pageAbleDocument = [];
  private userDocumentCriteria = {pageNo: 1, pageSize: 1, count: -1};
  disable: Boolean = true;
  isGrantRequestPartial: Boolean = false;
  canApproveRequest: Boolean = false;
  private firstloaded: Boolean = false;
  private buttonDisable = true;
  private isloaded = false;
  private isOnlyKYCRequest: Boolean = false;
  private userKYCStatus = false;
  private isKYCResponsePartial = false;
  private type: String = '1';
  private actualKycStatus = false;
  private isPaymentRequestDisable = false;

  translations = <DataTableTranslations>{
    indexColumn: 'Index column',
    expandColumn: 'Expand column',
    selectColumn: 'Select column',
    paginationLimit: 'Max results',
    paginationRange: 'Result range'
};
/* Decorator declaration section.*/
@ViewChild('logInForm') logInForm: any;
@BlockUI() blockUI: NgBlockUI;

/* Method declaration section.*/
  constructor(private authorizationApiService: AuthorizationApiService,
    private router: Router, private activatedRoute: ActivatedRoute,
     private viewContainerRef: ViewContainerRef,
     private authenticationApiService: AuthenticationApiService,
     private localStorageService: LocalStorageService,
     private toastsManager: ToastsManager,
     private signOutComponent: SignOutComponent,
    private bKVSVerificationComponent: BKVSVerificationComponent) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
    this.type = localStorage.getItem('type');
    console.log('inside grant access component');
  }

  ngOnInit() {
 
    if ( !this.bKVSVerificationComponent.isValidSocialKycRequest()) {
      const redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorage({error : true});
      this.localStorageService.clearLocalStorage();
      const navigationExtras: NavigationExtras = { queryParams: { message: 'Invalid Social Kyc Verification Request',
      redirectUrl: redirectUrl } };
     this.router.navigate(['bkvs-verification-error'], navigationExtras);
    } else {
      this.type = localStorage.getItem('type');
      if ( this.type == '1' || this.type == '3') {
      this.isOnlyKYCRequest = localStorage.getItem('isOnlyKYCRequest') == 'true';
      if ( !this.isOnlyKYCRequest || this.type == '3') {
        this.getDocumentGroupDocument();
        } else {
          this.isloaded = true;
          this.isGrantRequestPartial = localStorage.getItem('isPartial') == 'true';
        }
      } else {
        this.getKYCStatus(localStorage.getItem('countryCode'));
      }
    this.unblockUserInterface();
  }
  }

  public getKYCStatus(countryCode: string) {
  this.blockUserInterface();
  this.authorizationApiService.getKYCStatus(countryCode).subscribe(
    success => {
          this.actualKycStatus = success['data']['KYCStatus'];
          this.isloaded = true;
    },
    error => {
        this.errorMessage(error);
        const errorJSON = this.parseError(error._body);
        setTimeout(() => {
        const redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorage({error : true,
          errormessage : errorJSON.message});
           window.location.href = redirectUrl;
          this.localStorageService.clearLocalStorage();
        } , 2000);

     }
);

  }

  public isEnable() {
           if ( !this.disable ) {
                    return false;
           } else {
               return !(this.isGrantRequestPartial && this.canApproveRequest);
           }
  }
  public showMessage() {
        if (this.disable) {
              return this.canApproveRequest && this.isGrantRequestPartial;
        } else {
          return this.disable;
        }
  }
  public shareKYCStatus() {
    this.authorizationApiService.postGrantAcessKycStatusAsPerGroupName().subscribe(
      success => {

         /* let userDocuments = success['data'];
          let count=0;
          for(let index in userDocuments){
            let object={
              "countryName":userDocuments[index]['country']['countryName'],
              "documentType":userDocuments[index]['kycDocumentType']['documentType'],
              "documentName":userDocuments[index]['kycDocumentMeta']['documentName'],
              "documentStatus":''
            };
            if(userDocuments[index]['kycUserDocument']==null){
                  object['documentStatus']='Not Uploaded';
            }
            else{
                  object['documentStatus']=userDocuments[index]['kycUserDocument']['documentStatus']
            }
            this.userDocuments.push(object);
            if(object['documentStatus']=='Approved'){
                      count++;
            }
            //////console.log(object);
      }

          //////console.log('doc group documents successfully loaded ' + this.userDocuments);

          this.noOfUserDocuments = this.userDocuments.length;


          if ( this.userDocuments.length !=0 && count==this.userDocuments.length ) {
            //////console.log('all document approved case ');
            //////console.log('isPartial case ', this.isGrantRequestPartial);
              this.userKYCStatus = true;

          }
          if ((this.userDocuments.length !=0 ) && (count > 0 && count < this.userDocuments.length) && this.isGrantRequestPartial) {
            //////console.log('inside some document approved case ');
            //////console.log('isPartial case ssss', this.isGrantRequestPartial);
            this.userKYCStatus = true;
            this.isKYCResponsePartial = true;
         }*/
         this.successMessage(success);
         console.log('inside share kyc status as per group name');
          // let acknowledgement = {
          //   message : 'Kyc status shared successfully'
          // };
          // this.successMessage(acknowledgement);
          setTimeout(() => {
            const redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorage(
              {
                 error : false,
                 data: JSON.stringify(success['data']),
                 successmessage : success['message']
              });
              this.localStorageService.clearLocalStorage();
              window.location.href = redirectUrl;
            } , 2000);


      },
      error => {
          //////console.log('error while loading docgroup documents ');
          this.errorMessage(error);
          let errorJSON = this.parseError(error._body);
          setTimeout(() => {
          let redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorage({error : true,
            errormessage : errorJSON.message});
            window.location.href = redirectUrl;
            this.localStorageService.clearLocalStorage();
          } , 2000);

       }
  );
  }
  public getDocumentGroupDocument() {
    this.blockUserInterface();
    this.authorizationApiService.getDocumentGroupDocument().subscribe(
        success => {
            this.unblockUserInterface();
            let userDocuments = success['data'];
            let count=0;
            for(let index in userDocuments){
              let object={
                "countryName":userDocuments[index]['country']['countryName'],
                "documentType":userDocuments[index]['kycDocumentType']['documentType'],
                "documentName":userDocuments[index]['kycDocumentMeta']['documentName'],
                "documentStatus":''
              };
              if(userDocuments[index]['kycUserDocument']==null){
                this.isPaymentRequestDisable=true;    
                object['documentStatus']='Not Uploaded';
              }
              else{
                    object['documentStatus']=userDocuments[index]['kycUserDocument']['documentStatus']
              }
              this.userDocuments.push(object);
              if(object['documentStatus']=='Approved'){
                        count++;
              }
        }


            this.noOfUserDocuments = this.userDocuments.length;


            if(this.userDocuments.length !=0 && count==this.userDocuments.length)
               this.disable=false;

             if (this.userDocuments.length !=0 && (count > 0 && count < this.userDocuments.length)) {
                this.canApproveRequest = true;
             }
    this.isGrantRequestPartial = localStorage.getItem('isPartial') == 'true';
     this.buttonDisable = this.isEnable();

            let pageAbleDocument=[];

            let windowLimit = ( 0 * this.noOfDocumentPerPage) + this.noOfDocumentPerPage;
            
            for (let i = 0; (i < windowLimit && i < this.userDocuments.length); i++){
              pageAbleDocument.push(this.userDocuments[i]);
            }
            this.pageAbleDocument = pageAbleDocument;
            this.isloaded = true;
        },
        error => {
          this.unblockUserInterface();
            this.errorMessage(error);
            let errorJSON = this.parseError(error._body);
            setTimeout(() => {
            let redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorage({error : true,
              errormessage : errorJSON.message});
              window.location.href = redirectUrl;
              this.localStorageService.clearLocalStorage();
            } , 2000);

         }
    );
  }

   /* It blocks UI. */
   public blockUserInterface() {
    this.blockUI.start('Wait...');
  }
    /* It unblocks UI.*/
    public unblockUserInterface() {
    this.blockUI.stop();
  }

  public successMessage(success) {
    this.toastsManager.success(success.message);
  }

  /* It displays error Toaster.*/
  public errorMessage(error) {
      let errorJSON = this.parseError(error._body);
      this.toastsManager.error(errorJSON.message);
  }
  /* It parses error object.*/
  public parseError(errorString){
      return JSON.parse(errorString);
  }



  public reloadUsers(params) {
    if ( ! this.firstloaded) {
      
      this.firstloaded = true;
    } else {
    this.blockUserInterface();
    const pageOffset = params['offset'];
    const pageSize = params['limit'];

    const windowLimit = pageOffset + pageSize;
    let pageAbleDocument = [];

    for (let i = pageOffset; (i < windowLimit && i < this.userDocuments.length) ; i++ ) {
           pageAbleDocument.push(this.userDocuments[i]);
    }
    this.pageAbleDocument = pageAbleDocument;
    this.unblockUserInterface();
  }
}
      public shareDocumentAccess() {
         const request = {
           'countryCode': localStorage.getItem('countryCode'),
           'digest' : localStorage.getItem('digest'),
           'groupName' : localStorage.getItem('groupName'),
           'message' : localStorage.getItem('message'),
           'secretKey': this.localStorageService.getBKVSSecretKey(),
           'isPartial'    : localStorage.getItem('isPartial')
         };


        if (localStorage.getItem('walletAddress') == 'null') {
          //console.log('Requesting entity does not want to assign wallet address');
       } else {
         request['walletAddress'] = localStorage.getItem('walletAddress');
       }
         this.blockUserInterface();
         this.authorizationApiService.grantAccessViaSocialKYCVerfication(request).subscribe(
        success => {
          this.unblockUserInterface();
          this.successMessage(success);
          setTimeout(() => {
            const redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorage(
              {
                 error : false,
                 data: JSON.stringify(success['data']),
          //       isPartialResponse : this.disable,
                 successmessage : success['message']
              });
              this.localStorageService.clearLocalStorage();
              window.location.href = redirectUrl;
            } , 2000);
        },
        error => {
          this.unblockUserInterface();
          this.errorMessage(error);
          let errorJSON = this.parseError(error._body);
           setTimeout(() => {
           let redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorage({error : true,
             errormessage : errorJSON.message});
             this.localStorageService.clearLocalStorage();
             window.location.href = redirectUrl;
           } , 2000);
        }
    );


     }



     public shareDocumentAccessAndPaymentInformation() {
      const request = {
        'countryCode': localStorage.getItem('countryCode'),
        'digest' : localStorage.getItem('digest'),
        'groupName' : localStorage.getItem('groupName'),
        'message' : localStorage.getItem('message'),
        'secretKey': this.localStorageService.getBKVSSecretKey()
      };

      this.blockUserInterface();
      this.authorizationApiService.grantAccessViaSocialKYCVerficationAndPaymentInformation(request).subscribe(
     success => {
       this.unblockUserInterface();
       this.successMessage(success);
       setTimeout(() => {
         const redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorage(
           {
              error : false,
              data: JSON.stringify(success["data"]),
       //       isPartialResponse : this.disable,
              successmessage : success["message"]
           });
           this.localStorageService.clearLocalStorage();
           window.location.href = redirectUrl;
         } , 2000);
     },
     error => {
       this.unblockUserInterface();
       this.errorMessage(error);
       let errorJSON = this.parseError(error._body);
        setTimeout(() => {
        let redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorage({error : true,
          errormessage : errorJSON.message});
          this.localStorageService.clearLocalStorage();
          window.location.href = redirectUrl;
        } , 2000);
     }
 );


  }

     getBKVSKYCStatus() {
      const request = {
        'countryCode': localStorage.getItem('countryCode'),
        'digest' : localStorage.getItem('digest'),
        'message' : localStorage.getItem('message'),
        'initiator': localStorage.getItem('initiator'),
        'secretKey':window.atob(localStorage.getItem('secret_key'))
        };
//console.log('walletAddress ',localStorage.getItem('walletAddress'));
     if (localStorage.getItem('walletAddress') == 'null') {
       //console.log('Requesting entity does not want to assign wallet address');
    } else {
      request['walletAddress'] = localStorage.getItem('walletAddress');
    }
    //console.log('inside share kyc status');
    //console.log('request : ', request);
      this.blockUserInterface();
      this.authorizationApiService.grantAccessViaSocialKYCVerficationForBKVSKYC(request).subscribe(
     success => {
       this.unblockUserInterface();
       this.successMessage(success);
       setTimeout(() => {
         const redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorageForType2(
           {
              error : false,
              data: JSON.stringify(success['data']),
              successmessage : success['message']
           });
           this.localStorageService.clearLocalStorage();
           window.location.href = redirectUrl;
         } , 2000);
     },
     error => {
       this.unblockUserInterface();
       this.errorMessage(error);
       let errorJSON = this.parseError(error._body);
        setTimeout(() => {
          let errorData = {error : true,
            errormessage : errorJSON.message};
         if (localStorage.getItem('walletAddress') == 'null') {
          //console.log('Requesting entity does not want to assign wallet address');
       } else {
        errorData['walletAddress'] = localStorage.getItem('walletAddress');
       }
          const redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorageForType2(errorData);
          this.localStorageService.clearLocalStorage();
          window.location.href = redirectUrl;
        } , 2000);
     }
 );
     }
     public goBackToRedirectUrl() {
       const redirectUrl = localStorage.getItem('redirectUrl');
      this.localStorageService.clearLocalStorage();
      window.location.href = redirectUrl;
      }

    }
