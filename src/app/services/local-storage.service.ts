import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

	public belTokenConversion:number=10000000000;
	public delegateFee=128;
	public transactionFee=0.001;
	public secondSecretFee=0.001;
	public voteFee=1;
	public multiSignatureFee=1;
	public blockchainFee=50;
	public sidechainInTransfer=5;
	public sidechainOutTransfer=5;
	public documentVerificationFee=0;

	constructor() { 
	}

  /* It sets last user logged in time onto local storage.*/
	public setUserLastLoggedInTime(lastLoggedInTime){
		localStorage.setItem('lastlogin', lastLoggedInTime);
	}

	/* It gets user logged in time from local storage.*/
	public getUserLastLoggedInTime(){
		return localStorage.getItem('lastlogin');
	}

	/* It sets user's email Id onto local storage.*/
	public setUserEmailId(emailId){
		localStorage.setItem('email', emailId);
	}

	/* It gets user's email Id from local storage.*/
	public getUserEmailId(){
		return localStorage.getItem('email');
	}

	/* It sets role name onto local storage.*/
	public setUserRole(roleName){
		localStorage.setItem('roleName', roleName);
	}

	/* It gets role name from local storage.*/
	public getUserRole(){
		return localStorage.getItem('roleName');
	}

	/* It sets user Id onto local storage.*/
	public setUserId(userId){
		localStorage.setItem('uid', userId); 
	}

	/* It gets user Id from local storage.*/
	public getUserId(){
		return localStorage.getItem('uid'); 
	}

	/* It sets user menus onto local storage.*/
	public setUserMenus(menus){
		localStorage.setItem('menus', JSON.stringify(menus));
	}

	/* It gets user menus from local storage.*/
	public getUserMenus(){
		return localStorage.getItem('menus');
	}

	/* It sets authorized user token onto local storage.*/
	public setToken(token){
		let convertedToken =window.btoa(token.trim());
		localStorage.setItem('token', convertedToken);
	 };
	 
	/* It gets authorized user token from local stoarge. */
	public getToken(){
		 let token = localStorage.getItem('token');
		 return window.atob(token);
	}

	public setUserProfileImage(profileImage){
		let convertedProfileImage =window.btoa(profileImage.trim());
		localStorage.setItem('profileImagePath', convertedProfileImage);
	}

	public getUserProfileImage(){
		let profileImage = localStorage.getItem('profileImagePath');
		if (profileImage == undefined) {
			return undefined;
		} else {
		return window.atob(profileImage);
		}
   }
	
	/* It clears localstorage. */
	public clearLocalStorage(){
		localStorage.clear();
	}

	/* It sets user Id onto local storage.*/
	public setWalletAddress(address){
		localStorage.setItem('address', address); 
	}

	/* It gets user Id from local storage.*/
	public getWalletAddress(){
		return localStorage.getItem('address'); 
	}

	/*It sets the bkvs token into local storage*/
	public setBKVSToken(token){
		let convertedToken =window.btoa(token);
		localStorage.setItem('bkvs_hyperledger_token', convertedToken);
	}

	/* It gets authorized user token from local stoarge. */
	public getBKVSToken(){
		let token = localStorage.getItem('bkvs_hyperledger_token');
		return window.atob(token);
	}

	/*It sets the secret key into localStorage*/
	public setBKVSSecretKey(secreyKey){
		let convertedsecreyKey =window.btoa(secreyKey);
		localStorage.setItem('secret_key', convertedsecreyKey);
	}

	/* It gets authorized user token from local stoarge. */
	public getBKVSSecretKey(){
		let token = localStorage.getItem('secret_key');
		return window.atob(token);
	}
	
	/*It sets the username into localStorage*/
	public setUserName(name){
		localStorage.setItem('name', name); 
	}

	/*It gets the username from  localStorage*/
	public getUserName(){
		return localStorage.getItem('name'); 
	}

	/*It sets the user wallet address into local storage*/
	public setUserWalletAddress(address){
		localStorage.setItem('address', address);
	}

	/*It gets the user wallet address from local storage*/
	public getUserWalletAddress(){
		return localStorage.getItem('address');
	}

	/*It sets the publickey into local storage*/
	public setUserPublicKey(publickey){
		localStorage.setItem('publicKey',publickey);
	}

	/*It gets the publickey into local storage*/
	public getUserPublicKey(){
		return localStorage.getItem('publicKey');
	}

	/*It sets the country Id into local storage*/
	public setCountryId(countryId){ 
		localStorage.setItem(countryId,countryId); 
	}

	/*It gets the country Id from local storage*/
	public getCountryId(countryId){ 
		return localStorage.getItem(countryId); 
	}

	/*It sets the country Id into local storage*/
	public setCountryCode(countryCode){ 
		localStorage.setItem("countryCode", countryCode); 
	}

	/*It gets the country Id from local storage*/
	public getCountryCode(){ 
		return localStorage.getItem("countryCode"); 
	}

	/*It sets the country Id into local storage*/
	public setUserWalletByCountry(key:string, countryWallet:object){
		localStorage.setItem(key, window.btoa(JSON.stringify(countryWallet)));
	}

	/*It gets the country Id from local storage*/
	public getUserWalletByCountry(key:string){
		let countryWallet = localStorage.getItem(key)?window.atob(localStorage.getItem(key)):null;
		return JSON.parse(countryWallet);
	}

	public setUserWalletSecretKey(secret){
		localStorage.setItem('secret', secret);
	}

	public getUserWalletSecretKey(){
		return localStorage.getItem('secret');
	}
	/* bkvs verification */
	public getRedirectExchangeUrl() {
		return localStorage.getItem('redirectUrl');
   	}

	public setCurrentState(state){
		localStorage.setItem('state', state);
	}

	public getCurrentState(){
		return localStorage.getItem('state');
	}

	public setStates(statesKey, states){
		localStorage.setItem(statesKey, states);
	}

	public getStates(statesKey){
		return localStorage.getItem(statesKey);
	}

	public setGoogle2FAStatus(google2faStatus:boolean){
		localStorage.setItem("google2fa", JSON.stringify(google2faStatus));
	}

	public getGoogle2FAStatus(){
		return JSON.parse(localStorage.getItem("google2fa"));
	}
}
