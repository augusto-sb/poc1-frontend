import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

type Entity = {
  Id: number;
  Name: string;
  Description: string;
}

@Component({
  selector: 'app-entity',
  imports: [],
  templateUrl: './entity.component.html',
  styleUrl: './entity.component.css'
})
export class EntityComponent {
  public entities: Entity[] = [];

  constructor(private readonly httpClient: HttpClient){

    let params = new HttpParams();
    //params = params.set('size', '5');

    httpClient.get<Entity[]>('/entities', { params }).subscribe(
      body => {this.entities=body},
      err=>{console.log('Error', err);},
      ()=>{/*console.log('Finish')*/;},
    );
  }
}
