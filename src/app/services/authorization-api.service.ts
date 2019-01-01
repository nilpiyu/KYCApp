import { Injectable, EventEmitter } from '@angular/core';
import { RequestOptions, Headers }  from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { RequestOptionsService } from './request-options.service';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthorizationApiService {

  private url;
  private token;
  private WalletUrl;
  private bkvsToken;
  public profileImage=new EventEmitter();;
  public transactionTypeMapping={ 0:"SEND", 1:"SIGNATURE", 2:"DELEGATE", 3:"VOTE", 4:"MULTI", 5:"DAPP", 6:"IN TRANSFER", 7:"OUT TRANSFER", 15:"ENABLE KYC WALLET",
                                  16:"DISABLE KYC WALLET", 17:"WHITE LIST WALLET TRANSACTION", 18:"DOCUMENT VERIFICATION TRANSACTION", 19:"WHITE LIST MERCHANT WALLET TRANSACTION",
                                  20:"MERCHANT TRANSACTION", 21:"MERCHANT", 22:"VERIFIER"
                                }
  constructor(private localStorageService:LocalStorageService, private requestOptionsService:RequestOptionsService, private http:HttpClient) {
  }

  public getAuthenticationCredential(){
    this.url=environment.apiHost+":"+environment.apiPort+environment.apiRoutePath;
    this.token=this.localStorageService.getToken();
    this.bkvsToken=this.localStorageService.getBKVSToken();
  }

  public getServerRequest(url:string){
    return this.http.get(url, this.requestOptionsService.getRequestOptions(this.token));
  }

  public getServerBKVSRequest(url:string){
    return this.http.get(url, this.requestOptionsService.getRequestBKVSOptions(this.token, this.bkvsToken));
  }

  public postServerRequest(url:string, data:object){
    return this.http.post(url, data, this.requestOptionsService.getRequestOptions(this.token));
  }

  public postBKVSServerRequest(url:string, data:object){
    return this.http.post(url, data, this.requestOptionsService.getRequestBKVSOptions(this.token, this.bkvsToken));
  }

  public patchBKVSServerRequest(url:string, data:object){
    return this.http.patch(url, data, this.requestOptionsService.getRequestBKVSOptions(this.token, this.bkvsToken));
  }

  public patchServerRequest(url:string, data:object){
    return this.http.patch(url, data, this.requestOptionsService.getRequestOptions(this.token));
  }

  public putServerRequest(url:string, data:object){
    return this.http.put(url, data, this.requestOptionsService.getRequestOptions(this.token));
  }

  public putBKVSServerRequest(url:string, data:object){
    return this.http.put(url, data, this.requestOptionsService.getRequestBKVSOptions(this.token, this.bkvsToken));
  }

  public deleteServerRequest(url){
    return this.http.delete(url, this.requestOptionsService.getRequestBKVSOptions(this.token, this.bkvsToken));    
  }
  public getWalletAuthenticationCredential(){
    let url:string="";
    if(environment.apiWalletHost){
      url=url+environment.apiWalletHost;
    }
    if(environment.apiWalletPort){
      url=url+":"+environment.apiWalletPort;
    }
    if(environment.apiWalletRoutepath){
      url=url+environment.apiWalletRoutepath;
    }
    this.url=url;
  }

  public getWalletCount(){
    this.getAuthenticationCredential();
    let url=this.url+"wallets/count";    
    return this.getServerRequest(url);
  }

  public getDocumentChannels(documentMetaCriteria){
    this.getAuthenticationCredential();
    let url=this.url+"channelnames?pageNo="+documentMetaCriteria['pageNo']+"&pageSize="+documentMetaCriteria['pageSize']+"&count="+documentMetaCriteria['count'];    
    return this.getServerBKVSRequest(url);
  }

  public getDocumentTypes(documentTypeData){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocumenttypes?pageNo="+documentTypeData['pageNo']+"&pageSize="+documentTypeData['pageSize']+"&count="+documentTypeData['count'];    
    return this.getServerRequest(url);
  }

  public saveDocumentType(documentType){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocumenttypes";
    return this.postServerRequest(url, documentType);  
  }

  public updateDocumentTypeById(documentTypeId, documentType){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocumenttypes?kycDocumentTypeId="+documentTypeId;
    return this.patchServerRequest(url, documentType);
  }

  public getDocumentMetas(documentMetaData){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocumentmetas?pageNo="+documentMetaData['pageNo']+"&pageSize="+documentMetaData['pageSize']+"&count="+documentMetaData['count'];    
    return this.getServerRequest(url);
  }

  public saveDocumentMeta(documentMeta){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocumentmetas";
    return this.postServerRequest(url, documentMeta);  }

  public updateDocumentMetaById(documentMetaId, documentMeta){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocumentmetas?kycDocumentMetaId="+documentMetaId;
    return this.patchServerRequest(url, documentMeta);
  }

  public getCountries(){
    this.getAuthenticationCredential();
    let url=this.url+"countries";
    console.log("countries"+ url);
    return this.getServerRequest(url);
  }

  public getUserDocuments(userDocumentData){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocs?pageNo="+userDocumentData['pageNo']+"&pageSize="+userDocumentData['pageSize']+"&count="+userDocumentData['count'];        
    return this.getServerRequest(url);
  }

  public saveUserDocument(userDocument){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocs";
    return this.postBKVSServerRequest(url, userDocument);
  }

  public updateUserDocument(userDocumentId, userDocument){
    let url=this.url+"kycdocs";
    return this.patchBKVSServerRequest(url, userDocument);
  }

  public getFormFields(formFieldData){
    this.getAuthenticationCredential();
    let url=this.url+"kycdoc/forms/fields?pageNo="+formFieldData['pageNo']+"&pageSize="+formFieldData['pageSize']+"&count="+formFieldData['count'];            
    return this.getServerRequest(url);
  }

  public saveFormField(formField){
    this.getAuthenticationCredential();
    let url=this.url+"kycdoc/forms/fields";
    return this.postServerRequest(url, formField);
  }

  public updateFormFieldById(formFieldId, formField){
    this.getAuthenticationCredential();
    let url=this.url+"kycdoc/forms/fields?fieldid="+formFieldId;
    return this.patchServerRequest(url, formField);
  }

  public getFormFieldTypes(){
    this.getAuthenticationCredential();
    let url=this.url+"forms/field/types";
    return this.getServerRequest(url);
  }

  public getFormFieldPatterns(formFieldPattern){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocs/kycdocformfieldmetas/kycpatterns?pageNo="+formFieldPattern['pageNo']+"&pageSize="+formFieldPattern['pageSize']+"&count="+formFieldPattern['count'];;
    return this.getServerRequest(url);
  }

  public saveRole(role){
    this.getAuthenticationCredential();
    let url=this.url+"roles";
    return this.postServerRequest(url, role);
  }

  public updateRoleById(userRoleId, userRole){
    this.getAuthenticationCredential();
    let url=this.url+"roles?roleId="+userRoleId;
    return this.patchServerRequest(url, userRole);
  }

  public getRoles(getRoleData){
    this.getAuthenticationCredential();
    let url=this.url+"roles?pageNo="+getRoleData['pageNo']+"&pageSize="+getRoleData['pageSize']+"&count="+getRoleData['count'];
    return this.getServerRequest(url);
  }

  public getActivities(activitiesPaginationData){
    this.getAuthenticationCredential();
    let url=this.url+"activites?pageNo="+activitiesPaginationData['pageNo']+"&pageSize="+activitiesPaginationData['pageSize']+"&count="+activitiesPaginationData['count'];
    return this.getServerRequest(url);
  }

  public assignActivitiesByRoleId(activites:object){
    this.getAuthenticationCredential();
    let url=this.url+"assignactivitytorole";
    return this.postServerRequest(url, activites);
  }

  public getAssignedActivitiesByRoleId(roleId){
    this.getAuthenticationCredential();
    let url=this.url+"role/activities?roleId="+roleId;
    return this.getServerRequest(url);
  }

  public getUsers(userSeacrhCriteria){
    this.getAuthenticationCredential();
    let url=this.url+"users/search?pageNo="+userSeacrhCriteria['pageNo']+"&pageSize="+userSeacrhCriteria['pageSize']+"&count="+userSeacrhCriteria['count'];
    return this.getServerRequest(url);
  }

  public getFormFieldsMeta(formFieldMetaData){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocformfieldmetas?pageNo="+formFieldMetaData['pageNo']+"&pageSize="+formFieldMetaData['pageSize']+"&count="+formFieldMetaData['count'];    
    return this.getServerRequest(url);
  }

  public saveFormFieldMeta(formFieldMeta){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocs/kycdocformfieldmetas";
    return this.postServerRequest(url, formFieldMeta);
  }

  public deleteFormFieldMetaById(formFieldMetaId){
    this.getAuthenticationCredential();
    let url=this.url+'kycdocs/kycdocformfieldmetas/?kycdocformmetaid='+formFieldMetaId;
    return this.deleteServerRequest(url);
	}

  public updateFormFieldMetaById(formFieldMetaId, formFieldMeta){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocs/kycdocformfieldmetas?formmetaid="+formFieldMetaId;
    return this.patchServerRequest(url, formFieldMeta);
  }

 /*This service gets user profile */
  public getUserProfile(userId){
    this.getAuthenticationCredential();
    let url=this.url+'user/profile?userId='+userId;
    return this.getServerRequest(url);
  }

  /*This service edits user's profile*/
  public editUserProfile(userId,getUserProfileData){
    this.getAuthenticationCredential();
    let url = this.url+'user/profile?userId='+userId;
    return this.patchServerRequest(url,getUserProfileData);
  }

  /*This service gets kyc status of user countries*/
  public getKycStatus(){
    this.getAuthenticationCredential();
    let url = this.url+'user/countries/kyc';
    return this.getServerRequest(url);
  }

  /*This service gets document sharing request regarding user */
  public getDocumentSharingRequest(queryParams:object){
    this.getAuthenticationCredential();
    let url = this.url+'documentsharing/user/request?pageNo='+queryParams['pageNo']+"&pageSize="+queryParams['pageSize'];
    return this.getServerRequest(url);
  }

  public getKycUserDocumentStatus(queryParams:object){
    this.getAuthenticationCredential();
    let url = this.url+'kycuserdocuments/search?documentStatus='+queryParams['documentStatus'];
    return this.getServerRequest(url);
  }
  /*This service gets user uploaded document*/
  public getCountryDocument(){
    this.getAuthenticationCredential();
    let url = this.url+'users/document';
    return this.getServerRequest(url);
  }

  /*This service upload user's document*/
  public uploadDoc(id:any, data:any){
    this.getAuthenticationCredential();
    let url = this.url+'kycuserdocuments/upload';
    return this.postServerRequest(url,data);
  }
  
  /*This service gets the list of shared document*/
  public getSharedDocument(sharedDocumentData){
    this.getAuthenticationCredential();
    let url=this.url+"documentsharing/user/request?pageNo="+sharedDocumentData['pageNo']+"&pageSize="+sharedDocumentData['pageSize']+"&count="+sharedDocumentData['count'];        
    return this.getServerRequest(url)
  }

  /*This service updates the list of shared document*/
  public updateRequestedDocumentStatus(userUpdatedDocument){
    this.getAuthenticationCredential();
    let url = this.url+'documentsharing/user/request';
    return this.patchBKVSServerRequest(url,userUpdatedDocument);
  }

  // ----------------------Wallet Services starts from here---------------------------------------
  /*This service gets the wallet address corresponding to country*/
  public getWalletAddressAndCountry(){
    this.getAuthenticationCredential();
    let url = this.url+'wallets';
    return this.getServerRequest(url);
  }

  /*This service gets authentication to login the wallet form*/
  public getWalletLogin(walletLoginData){
    this.getAuthenticationCredential();
    // let WalletUrl = this.url+'accounts/open';
    let url = this.url+'wallet/country';
    return this.postServerRequest(url,walletLoginData);
  }

  /*This service gets the wallet balance*/
  public getAccountBalance(address){
    this.getAuthenticationCredential();
    let url= this.url+'balance?address='+address;
    return this.getServerRequest(url)
  }

  public generatePublicKeyBySecretKey(secretKey:object){
    this.getAuthenticationCredential();
    let url= this.url+'generatePublicKey';
    return this.postServerRequest(url, secretKey)
  }

  /*This service works on send tranaction*/
  public sendTransaction(walletLoginData){
    // this.getWalletAuthenticationCredential();
    this.getAuthenticationCredential();
    // let WalletUrl = this.url+'transactions';
    let url = this.url+'wallet/transactions';
    return this.putServerRequest(url,walletLoginData);
  }

  /*this service works on delegate registration*/
  public becomeDelegate(delegateData){
    // this.getWalletAuthenticationCredential();
    this.getAuthenticationCredential();
    let url = this.url+'delegates';
    return this.putServerRequest(url,delegateData);
  }

  /*This service gets the list of all delegates*/
  public getDelegates(paginationData:object){
    // this.getWalletAuthenticationCredential();
    this.getAuthenticationCredential();
    let url = this.url+'delegates?limit='+paginationData['limit']+"&offset="+paginationData['offset']+"&orderBy="+paginationData['orderBy'];
    return this.getServerRequest(url)
  }
  
  /*This service works on vote delegates*/
  public saveVotes(voteData){
    // this.getWalletAuthenticationCredential();
    this.getAuthenticationCredential();
    let url = this.url+'accounts/delegates';
    return this.putServerRequest(url, voteData);
  }

  /*This service gets the votes of voter's account*/
  public getMyVotes(userCountryLoggedInWallet){
    // this.getWalletAuthenticationCredential();
    this.getAuthenticationCredential();
    let url = this.url+'accounts/delegates/?address='+userCountryLoggedInWallet['address']+"&countryCode="+userCountryLoggedInWallet['countryCode'];
    return this.getServerRequest(url);
  }

  public getVerifiedAndUnverifiedUserCount(searchCriteria){
    this.getAuthenticationCredential();
    let url = this.url+'user/verified/count?startDate='+searchCriteria['startDate']+"&endDate="+searchCriteria['endDate'];
    return this.getServerRequest(url);
  }

  public getVerifiedAndUnverifiedUserCountByYear(searchCriteria){
    this.getAuthenticationCredential();
    let url = this.url+'user/year/kycstatus/?startYear='+searchCriteria['startYear']+"&endYear="+searchCriteria['endYear'];
    return this.getServerRequest(url);
  }

  public getVerifiedAndUnverifiedUserCountByCountry(searchCriteria){
    this.getAuthenticationCredential();
    let url = this.url+'user/countries/kyc/count?startDate='+searchCriteria['startDate']+"&endDate="+searchCriteria['endDate'];
    return this.getServerRequest(url);
  }

  public getUserCount(){
    this.getAuthenticationCredential();
    let url = this.url+'users/registration/history';
    return this.getServerRequest(url);
  }

  public getUserPercentageByCountry(searchCriteria){
    this.getAuthenticationCredential();
    let url = this.url+'user/country/percentage/?startDate='+searchCriteria['startDate']+"&endDate="+searchCriteria['endDate'];    
    return this.getServerRequest(url);
  }
  
  /*This service gets the latest transaction*/
  public getLatestTransaction(transactionData:object){
    // this.getWalletAuthenticationCredential();
    this.getAuthenticationCredential();
    let url = this.url+'wallet/transactions?senderId='+transactionData['address']+"&recipientId="+transactionData['address']+"&limit="+transactionData['limit']+"&offset="+transactionData['offset']+"&orderBy="+transactionData['orderBy']+":desc";
    return this.getServerRequest(url);
  }

  /*This service gets the listing of all blocks*/
  public getAllBlocks(blockData:object){
    // this.getWalletAuthenticationCredential();
    this.getAuthenticationCredential();
    let url = this.url+'blocks?limit='+blockData['limit']+"&offset="+blockData['offset']+"&orderBy="+blockData['orderBy'];
    return this.getServerRequest(url);
  }

  /*This service gets the list of all transactions*/
  public getAllTransactions(transactionData:object){
  this.getAuthenticationCredential();
  let url = this.url+'wallet/transactions?limit='+transactionData['limit']+"&offset="+transactionData['offset']+"&orderBy="+transactionData['orderBy'];
  return this.getServerRequest(url);
  }

  /* This service gets the list of my voters*/
  public getMyVoters(publicKey){
    // this.getWalletAuthenticationCredential();
    this.getAuthenticationCredential();
    let url = this.url+'delegates/voters?publicKey='+publicKey;
    return this.getServerRequest(url);
  }

  /*This service gets the list of produced blocks*/
  public getProducedBlocks(generatorPublicKey){
    // this.getWalletAuthenticationCredential();
    this.getAuthenticationCredential();
    let url = this.url+'blocks?generatorPublicKey='+generatorPublicKey;
    return this.getServerRequest(url);
  }

  public uploadProfileImage(profileImage){
    this.getAuthenticationCredential();
    let url=this.url+"users/profile/picture";
    return this.postServerRequest(url, profileImage);
  }

  public getDocumenetSchema(documentSearchCriteria){
    this.getAuthenticationCredential();
    let url=this.url+'kycdocs/kycdocformfieldmetas?kycDocumentMetaId='+documentSearchCriteria['kycDocumentMetaId']+"&kycDocumentTypeId="+documentSearchCriteria['kycDocumentTypeId']+"&countryCode="+documentSearchCriteria['countryCode'];
    return this.getServerRequest(url);
  }

  public generateSecretKey(walletAddressGenerateCriteria){
    this.getAuthenticationCredential();
    let WalletUrl = this.url+'accounts/address/generate?country_id='+walletAddressGenerateCriteria['country_id'];
    return this.postServerRequest(WalletUrl, walletAddressGenerateCriteria);
  }

  public saveUserCountry(userCountry){
    this.getAuthenticationCredential();
    let url=this.url+"users/country";
    return this.postServerRequest(url, userCountry);
  }

  public generateUserWalletByCountry(userWalletData){
    this.getAuthenticationCredential();
    let url=this.url+"transactions/wallet/generate";
    return this.putServerRequest(url, userWalletData);
  }

  public saveUserDocumentData(userDocumentData, userDocumentFormData){
    this.getAuthenticationCredential();
    // let url=this.url+"kycuserdocuments/upload?kycDocumentMetaID="+userDocumentData['kycDocumentMetaID']+"&kycDocumentTypeId="+userDocumentData['kycDocumentTypeId']+"&countryID="+userDocumentData['countryID']+"&metaData="+userDocumentData['metaData'];
    let url=this.url+"kycuserdocuments/upload";    
    return this.postBKVSServerRequest(url, userDocumentFormData);
  }
 /*-----------------------------------merchnt Services method*------------------------------------/
lo
  /*This methods gets the country of user document request*/
  public getCountry(){
    this.getAuthenticationCredential();
    let url = this.url+'countries';
    return this.getServerRequest(url);
  }

  /*This service gets the document by email and country*/
  public getDocumentByUserEmailAndCountry(userData){
  this.getAuthenticationCredential();
  let url =  this.url+'users/kycdocs?email='+userData['email']+'&countryID='+userData['countryID'];
  return this.getServerRequest(url);
  }

  /*This service saves the user request document*/
  public saveUserRequestedDocument(requestedDocuments){
    this.getAuthenticationCredential();
    let url = this.url+'documentsharing/request';
    return this.getServerRequest(url);
  }

  /*This service add kyc doc group*/
  public saveKycDocGroup(kycDocData){
    this.getAuthenticationCredential();
    let url = this.url+'kycdocgroup';
    return this.postServerRequest(url,kycDocData);
  }
  
  /*This methods gets the doc grop name and id*/
  public getDocGroup(documentGroupData){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocgroup/user?pageNo="+documentGroupData['pageNo']+"&pageSize="+documentGroupData['pageSize']+"&count="+documentGroupData['count'];            
    return this.getServerRequest(url);
  }

  /*This service updates the doc group*/
  public updateDocGroup(updateGroupData){
    this.getAuthenticationCredential();
    let url = this.url+'kycdocgroup';
    return this.patchServerRequest(url,updateGroupData);
  }

  /*This methods gets the group name*/
  public getDocGroupName(groupData){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocgroup/user?pageNo="+groupData['pageNo']+"&pageSize="+groupData['pageSize']+"&count="+groupData['count'];            
    return this.getServerRequest(url);
  }
  
  /*This service gets the kyc docs country*/
  public getKycDocsCountry(countryDocumentData){
    this.getAuthenticationCredential();
    // let url = this.url+'kycdocs/country?countryId='+countryId;
    let url = this.url+'kycdocs/country?countryCode='+countryDocumentData['countryCode']+'&countryId='+countryDocumentData['countryId']+'&pageNo='+countryDocumentData['pageNo']+'&pageSize='+countryDocumentData['pageSize']+'&count='+countryDocumentData['count'];
    return this.getServerRequest(url);
  }

  /*This method created kyc doc group mapping*/
  public createKycDocGroupMapping(createData){
    this.getAuthenticationCredential();
    let url = this.url+'kycdocgroupmapping';
    return this.postServerRequest(url,createData);
  }

  public updateKycDocGroupMapping(updateData){
    this.getAuthenticationCredential();
    let url = this.url+'kycdocgroupmapping?countryId='+updateData['countryId']+'&kycDocGroupId='+updateData['kycDocGroupId']
    return this.patchServerRequest(url,updateData);
  }

  public getKycDocGroupMapping(documentGroupMappingData){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocgroupmapping/user?pageNo="+documentGroupMappingData['pageNo']+"&pageSize="+documentGroupMappingData['pageSize']+"&count="+documentGroupMappingData['count'];        
    return this.getServerRequest(url);
  }

  public saveSocialService(socialServiceFormData){
    this.getAuthenticationCredential();
    let url = this.url+'profilemeta';
    return this.postServerRequest(url, socialServiceFormData);
  }

  public getSocialServices(profileMetaData){
    this.getAuthenticationCredential();
    let url=this.url+"profilemetas/active?pageNo="+profileMetaData['pageNo']+"&pageSize="+profileMetaData['pageSize']+"&count="+profileMetaData['count'];    
    return this.getServerRequest(url);
  }

  public getSocialServicesURLs(){
    this.getAuthenticationCredential();
    let url = this.url+'user/social/urls';
    return this.getServerRequest(url);
  }

  public saveSocialMediaPublicURLs(socialMediaPublicURLs){
    this.getAuthenticationCredential();
    let url = this.url+'user/social/url';
    return this.patchServerRequest(url, socialMediaPublicURLs);
  }

  public updateSocialService(socialServiceId, socialServiceFormData, socialService){
    this.getAuthenticationCredential();
    let url = this.url+'profilemeta?socialMetaId='+socialService['socialMetaId']+"&profileName="+socialService['profileName']+"&description="+socialService['description']+"&active="+socialService['active'];
    return this.patchServerRequest(url, socialServiceFormData);
  }

  public getUserDocumentsRequestedByMerchant(paginationData){
    this.getAuthenticationCredential();
    let url = this.url+'documentsharing/user/request?pageNo='+paginationData['pageNo']+'&pageSize='+paginationData['pageSize']+'&count='+paginationData['count'];
    return this.getServerRequest(url);
  }

  public updateDocGroupMapping(groupData){
    this.getAuthenticationCredential();
    let url = this.url+'kycdocgroupmapping?countryCode='+groupData['countryCode']+'&countryId='+groupData['countryId']+'&kycDocGroupId='+groupData['kycDocGroupId'];
    return this.patchServerRequest(url,groupData);
  }

  public getDocumentByEmailAndGroup(requestData){
    this.getAuthenticationCredential();
    let url = this.url+'kycdocgroup/kycdocs?kycDocGroupId='+requestData['kycDocGroupId']+'&recieverEmail='+requestData['recieverEmail']
    return this.getServerRequest(url);
  }

  /*This service saves the user request document*/
  public submitUserRequestedDocument(requestedDocuments){
    this.getAuthenticationCredential();
    let url = this.url+'documentsharing/request';
    return this.postServerRequest(url,requestedDocuments);
  }

  /*This service gets the document sharing objects requester by requester*/
  public getDocumentSharingRequesterRequest(sharedData){
    this.getAuthenticationCredential();
    let url = this.url+'documentsharing/requester/request?pageNo='+sharedData['pageNo']+"&pageSize="+sharedData['pageSize']+"&count="+sharedData['count'];
    return this.getServerRequest(url);
  }

  public getDocumentsAuthorisedByUser(requestedDocumentCredentials){
    this.getAuthenticationCredential();
    let url = this.url+'user/view/document';
    return this.postBKVSServerRequest(url, requestedDocumentCredentials);
  }

  public getDocumentsAuthorisedByMerchant(requestedDocumentCredentials){
    this.getAuthenticationCredential();
    let url = this.url+'requester/view/document';
    return this.postBKVSServerRequest(url, requestedDocumentCredentials);
  }

  public getUserNotification(notificationsCredentials) {
    this.getAuthenticationCredential();
    let url = this.url+'notifications/user?pageNo='+notificationsCredentials['pageNo']+"&pageSize="+notificationsCredentials['pageSize']+"&count="+notificationsCredentials['count'];
    return this.getServerRequest(url);
  }

  public updateUserNotification(updateNotification){
    this.getAuthenticationCredential();
    let url = this.url+'notifications/user';
    return this.patchServerRequest(url,updateNotification);
  }

  public getUserTransactions(userTransactionData){
    this.getAuthenticationCredential();
    let url = this.url+'user/transactions/search?countryCode='+userTransactionData['countryCode']+"&address="+userTransactionData['address']+"&offset="+userTransactionData['offset']+"&limit="+userTransactionData['limit'];
    return this.getServerRequest(url);
  }

  public getBlockTransactionById(blockTransactionData){
    this.getAuthenticationCredential();
    let url = this.url+'wallet/transactions?limit='+blockTransactionData['limit']+"&offset="+blockTransactionData['offset']+"&orderBy="+blockTransactionData['orderBy']+"&blockId="+blockTransactionData['blockId'];
    return this.getServerRequest(url);
  }

  public saveWhiteLabelWallet(walletwhitelabelmetaCredentials){
    this.getAuthenticationCredential();
    let url = this.url+'walletwhitelabelmeta';
    return this.postServerRequest(url,walletwhitelabelmetaCredentials);
  }

  public getWhiteLabelWallet(whiteLabelCredentials){
    this.getAuthenticationCredential();
    let url = this.url+'walletwhitelabelmeta?pageNo='+whiteLabelCredentials['pageNo']+"&pageSize="+whiteLabelCredentials['pageSize']+"&count="+whiteLabelCredentials['count']+"&isInactiveRequired="+whiteLabelCredentials['isInactiveRequired'];
    return this.getServerRequest(url);
  }

  public updateWhiteLabelById(walletWhiteLabelId,whiteLabelWallet){
    this.getAuthenticationCredential();
    let url=this.url+"walletwhitelabelmeta";
    return this.patchServerRequest(url, whiteLabelWallet);
  }

  public saveUserWhiteListedWallet(userWallet){
    this.getAuthenticationCredential();
    let url = this.url+"wallet/whitelabel";
    return this.postServerRequest(url,userWallet);
  }

  public getUserWhiteListedWallet(userWhiteLabelCredentials){
    this.getAuthenticationCredential();
    let url = this.url+"user/wallet/whitelabel?pageNo="+userWhiteLabelCredentials['pageNo']+"&pageSize="+userWhiteLabelCredentials['pageSize']+"&count="+userWhiteLabelCredentials['count'];
    return this.getServerRequest(url);
  }

  public updateUserWhiteListedWalletById(userWhiteLabelId,userWhiteListedWallet){
    this.getAuthenticationCredential();
    let url = this.url+"wallet/whitelabel";
    return this.patchServerRequest(url,userWhiteListedWallet);
  }


  /* BKVS verification via */
  public getDocumentGroupDocument() {
    this.getAuthenticationCredential();
    const url=this.url+'kycdocs/documents?countryCode='+
    localStorage.getItem('countryCode')+'&groupName='+localStorage.getItem('groupName');
    return this.getServerBKVSRequest(url);
  }

  public getKYCStatus(countryCode) {
    this.getAuthenticationCredential();
    const url=this.url+'user/kycstatus/countrycode?countryCode='+countryCode;
    return this.getServerBKVSRequest(url);
  }

  public grantAccessViaSocialKYCVerfication(data:any) {
   this.getAuthenticationCredential();
    const url=this.url+'document/grant/access';
    return this.http.post(url, data, this.requestOptionsService.getRequestBKVSOptions(this.token, this.bkvsToken));
  }

  public grantAccessViaSocialKYCVerficationAndPaymentInformation(data:any) {
    this.getAuthenticationCredential();
     const url=this.url+'document/payment/grant/access';
     return this.http.post(url, data, this.requestOptionsService.getRequestBKVSOptions(this.token, this.bkvsToken));
   }

  public createSecondSecret(secondSecretData){
    this.getAuthenticationCredential();
    let url = this.url+'wallet/secondsecret';
    return this.putServerRequest(url,secondSecretData);
  }

  public grantAccessViaSocialKYCVerficationForBKVSKYC(request) {
    this.getAuthenticationCredential();
    let url = this.url+'kyc/access';
    return this.postBKVSServerRequest(url,request);
  }
  public postGrantAcessKycStatusAsPerGroupName() {
    this.getAuthenticationCredential();
    let url=this.url+'social/merchant/kyc/access';
    let data= {};
    data['message']=localStorage.getItem('message');
    data['digest']=localStorage.getItem('digest');
    data['countryCode']=localStorage.getItem('countryCode');
    data['groupName']=localStorage.getItem('groupName');
    data['isPartial']=localStorage.getItem('isPartial');
    return this.http.post(url, data, this.requestOptionsService.getRequestBKVSOptions(this.token, this.bkvsToken));
  }
  
  public makePayment(data){
    this.getAuthenticationCredential();
    let url=this.url+"kycuserdocuments/payment";
    return this.putServerRequest(url, data);
  }

  public requestDocumentVerification(data){
    this.getAuthenticationCredential();
    let url=this.url+"kycuserdocuments/send/verification?kycUserDocumentID="+data['kycUserDocumentID'];
    return this.postBKVSServerRequest(url, data);
  }

  public updateDocumentChannel(data){
    this.getAuthenticationCredential();
    let url=this.url+"kycdocs/channel/information";
    return this.putBKVSServerRequest(url, data);
  }

  public documentViewPayment(data){
    this.getAuthenticationCredential();
    let url=this.url+"requester/payment";
    return this.putServerRequest(url, data);
  }

  public saveKYC(data){
    this.getAuthenticationCredential();
    let url=this.url+"transactions/enable/account";
    return this.putServerRequest(url, data);
  }

  public getUserWallet(data:object){
    this.getAuthenticationCredential();
    const url=this.url+'wallets/disable?pageNo='+data['pageNo']+"&pageSize="+data['pageSize']+"&count="+data['count'];
    return this.getServerRequest(url);
  }

  public disableUserWalletBlockchainStatus(data:object){
    this.getAuthenticationCredential();
    let url=this.url+"transactions/disable/account";
    return this.putServerRequest(url, data);
  }

  public getAuthenticatorSecret(){
    this.getAuthenticationCredential();
    let url=this.url+"google/auth/uri";
    return this.getServerRequest(url);
  }

  public saveAuthenticatorSecret(data:object){
    this.getAuthenticationCredential();
    let url =this.url+"google/auth/enable?totp="+data['totp'];
    return this.putServerRequest(url, data);
  }

  /*  Get payslips from payrolldapp for parent wallet address of the user */
  public getPayslips(data: any){
    // this.getDappAuthenticationCredential();
    console.log("data" + JSON.stringify(data));
    
    // const body = {
    //   "address": "AddressOfJohnBonda",
    //   "dappid":"9d2fed73aee0125fb8df5031964422c14e57b6f2eb320c95e3655f3c53a2a0e6"
    //  };
    // const body = {
    //      "address": data['Address'],
    //      "dappid": data['dappId']
    //     };
  //   const body = {
  //     //"address": "A3AnCM3iCLHgqKbLf6mvkJKE4ajgTowbNeIN"
  //     "address": "A7QPzFUhKPmD4phMr273zm1JGPsTYjmb3nIN"
  // };

   const body = {
         "walletAddress": data['Address'],
         "limit": data['limit'],
         "offset": data['offset']
        };
   console.log("body" + JSON.stringify(body));
   // let url = "http://18.188.23.5:9305/api/dapps/9d2fed73aee0125fb8df5031964422c14e57b6f2eb320c95e3655f3c53a2a0e6/getPayslips";
   let url =  environment.apiSuperDappHost+":"+environment.apiSuperDappPort + environment.apiSuperDappRoutepath
  // return this.http.post(url + "/" + data['dappId'] + "/getPayslips" , body,  this.requestOptionsService.getDappRequestOptions());
  return this.http.post(url + "/" + data['dappId'] + "/payslips/employee/issued" , body,  this.requestOptionsService.getDappRequestOptions());
  
  //  const headers = new Headers({ 'Content-Type': 'application/json','magic': '594fe0f3',});
  //  const options = new RequestOptions({ headers: headers, method: 'post' });
  //  return this.http.post(url, body, options);
  }

  /*  Get payslips from payrolldapp for payid */
  public getPayslipsById(data: any){
    // this.getDappAuthenticationCredential();
    console.log("data" + JSON.stringify(data));
 
   const body = {
         "pid": data['pId']       
        };
   console.log("body" + JSON.stringify(body));
   // let url = "http://18.188.23.5:9305/api/dapps/9d2fed73aee0125fb8df5031964422c14e57b6f2eb320c95e3655f3c53a2a0e6/getPayslips";
   let url =  environment.apiSuperDappHost+":"+environment.apiSuperDappPort + environment.apiSuperDappRoutepath
  // return this.http.post(url + "/" + data['dappId'] + "/getPayslips" , body,  this.requestOptionsService.getDappRequestOptions());
  return this.http.post(url + "/" + data['dappId'] + "/payslip/getPayslip" , body,  this.requestOptionsService.getDappRequestOptions());
  
  }

  /*  Get dappid from superdapp  */
  public getDappId(data: any){
   let url = environment.apiSuperDappHost+":"+environment.apiSuperDappPort+environment.apiSuperDappRoutepath;
    // this.getDappAuthenticationCredential();
    console.log("data" + JSON.stringify(data['Address']));
    
        
    const body = {
      "address":data['Address']
     // "email": data.email
  };
  
    //let url = this.url + +"/"+SDAPP_ID+"/"+"user/dappid"
    console.log("url:"+  url +"/" + environment.sDAPPID +"/"+"user/getDappsByAddress");
    console.log("urlbody"+ JSON.stringify(body));
    return this.http.post(url + "/" + environment.sDAPPID +"/"+"user/getDappsByAddress", body,  this.requestOptionsService.getDappRequestOptions());
  //  const headers = new Headers({ 'Content-Type': 'application/json','magic': '594fe0f3',});
  //  const options = new RequestOptions({ headers: headers, method: 'post' });
  //  return this.http.post(url, body, options);
  }

  /*  Share Asset   */
  public shareAsset(data: any){
    let url = environment.apiSuperDappHost+":"+environment.apiSuperDappPort+environment.apiSuperDappRoutepath;
     // this.getDappAuthenticationCredential();
    // console.log("data" + JSON.stringify(data['Address']));
     
         
     const body = {       
       "empID": data['empId'],
       "email": data['email'],
       "pids": data['payslipIDs'],
       "dappid": data['dappId']
      // "email": data.email
   };
   
     //let url = this.url + +"/"+SDAPP_ID+"/"+"user/dappid"
     console.log("url:"+  url +"/" + data['dappId'] +"/"+"sharePayslips");
     console.log("urlbody"+ JSON.stringify(body));
     return this.http.post(url + "/" + data['dappId'] +"/"+"sharePayslips", body,  this.requestOptionsService.getDappRequestOptions());
   //  const headers = new Headers({ 'Content-Type': 'application/json','magic': '594fe0f3',});
   //  const options = new RequestOptions({ headers: headers, method: 'post' });
   //  return this.http.post(url, body, options);
   }
}

