import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { KeycloakService } from '../keycloak.service';

type Entity = {
  Id: number;
  Name: string;
  Description: string;
}

@Component({
  selector: 'app-entity',
  imports: [RouterLink],
  templateUrl: './entity.component.html',
  styleUrl: './entity.component.css'
})
export class EntityComponent {
  public entities: Entity[] = [];
  public amount: number = 0;

  constructor(
    private readonly httpClient: HttpClient,
    public ks: KeycloakService,
  ){

    let params = new HttpParams();
    //params = params.set('size', '5');

    httpClient.get<{Results: Entity[]; Count: number}>('/entities', { params }).subscribe(
      body => {/*console.log(body);*/this.entities=body.Results;this.amount=body.Count;},
      err=>{console.log('Error', err);},
      ()=>{/*console.log('Finish')*/;},
    );
  }
}
