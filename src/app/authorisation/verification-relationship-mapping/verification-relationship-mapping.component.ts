import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verification-relationship-mapping',
  templateUrl: './verification-relationship-mapping.component.html',
  styleUrls: ['./verification-relationship-mapping.component.css']
})
export class VerificationRelationshipMappingComponent implements OnInit {

  private verifierRelationshipModal:boolean=false;

  constructor() { 
  }

  ngOnInit() {
  }

  public openModal(){
    this.verifierRelationshipModal=true;
  }

  public closeModal(){
    this.verifierRelationshipModal=false;
  }

}
