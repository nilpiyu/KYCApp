import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authorised-personnel',
  templateUrl: './authorised-personnel.component.html',
  styleUrls: ['./authorised-personnel.component.css']
})
export class AuthorisedPersonnelComponent implements OnInit {

  private authorisedPersonnelModal:boolean=false;

  constructor() { }

  ngOnInit() {
  }

  public openModal(){
    this.authorisedPersonnelModal=true;
  }

  public closeModal(){
    this.authorisedPersonnelModal=false;
  }

}
