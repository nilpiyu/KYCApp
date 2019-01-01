import { Injectable } from '@angular/core';
import { RequestOptions, Headers }  from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { RequestOptionsService } from './request-options.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationApiService {

  private url;
  private token;
  private userRole;

  constructor(private http:HttpClient, private localStorageService:LocalStorageService, private requestOptionsService:RequestOptionsService) { 
    this.getAuthenticationCredential();
  }

  public getAuthenticationCredential(){
    this.url=environment.apiHost+":"+environment.apiPort+environment.apiRoutePath;
    this.token=this.localStorageService.getToken();
    this.userRole=this.localStorageService.getUserRole();
  }

  public userLogin(userLoginData){
    let url=this.url+'login';
    return this.postServerRequest(url, userLoginData);
  }

  public secretKeyLogin(secretData){
    this.getAuthenticationCredential();
    let url=this.url+"hyperledger/login";
    return this.http.post(url, secretData, this.requestOptionsService.getRequestOptions(this.token));
  }

  public getMenus(){
    this.getAuthenticationCredential();
    let url=this.url+'role/menujson?roleName='+this.userRole;
    return this.getServerRequest(url);
  }

  public getUsers(){
    let url=this.url+'users/registration/history';
    return this.getServerRequest(url);
  }

  public userSignOut(){
    this.getAuthenticationCredential();
    let url=this.url+'logout';
    return this.deleteServerRequest(url);
  }

  public changePassword(userCredebtials){
    this.getAuthenticationCredential();
    let url=this.url+'users/password';
    return this.patchServerRequest(url, userCredebtials);
  }

  public saveUser(userRegistration:object){
    let url=this.url+'signup';
    return this.postServerRequest(url, userRegistration);
  }

  public userEmailVerification(userVerificationToken){
    let url=this.url+'users/email/verify?token='+userVerificationToken;
    return this.patchServerRequest(url, userVerificationToken);
  }

  public sendPasswordResetLink(userCredentials){
    let url=this.url+'users/email/reset';
    return this.patchServerRequest(url, userCredentials);
  }

  public resetPassword(userCredentials){
    let url=this.url+'users/reset/password?token='+userCredentials['token'];
    return this.patchServerRequest(url, userCredentials);
  }

  public getServerRequest(url:string){
    return this.http.get(url, this.requestOptionsService.getRequestOptions(this.token));
  }

  public postServerRequest(url:string, data:object){
    return this.http.post(url, data);
  }

  public patchServerRequest(url:string, data:object){
    return this.http.patch(url, data, this.requestOptionsService.getRequestOptions(this.token));
  }

  public putServerRequest(){

  }

  public deleteServerRequest(url){
    return this.http.delete(url, this.requestOptionsService.getRequestOptions(this.token));
  }

  public isUserExist(email){
    let url=this.url + 'user/exist?email=' + email;
    return this.getServerRequest(url);
  }
}
