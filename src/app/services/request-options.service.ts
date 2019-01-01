import { Injectable } from '@angular/core';
import { RequestOptions, Headers }  from '@angular/http';
import { HttpHeaders } from '@angular/common/http'

@Injectable()
export class RequestOptionsService {

  constructor() { 
  }

  public getDappRequestOptions(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'    
      })
    };
    return httpOptions;
  }

  public getRequestOptions(token){
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'belrium-token': token
      })
    };
    return httpOptions;
  }

  public getRequestBKVSOptions(token, bkvsToken){
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'belrium-token': token,
        'bkvsdm-token': bkvsToken
      })
    };
    return httpOptions;
  }
}
