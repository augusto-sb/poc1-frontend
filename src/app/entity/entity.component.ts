import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Entity } from './entity.type';
import { KeycloakService } from '../keycloak.service';

@Component({
  selector: 'app-entity',
  imports: [RouterLink],
  templateUrl: './entity.component.html',
  styleUrl: './entity.component.css'
})
export class EntityComponent {
  public entities: Entity[] = [];
  public amount: number = 0;
  public page: number = 0;
  private size: number = 2;
  public pages: number = 1;

  ngOnInit() {
    //console.log(this.route.snapshot.queryParams);
  }

  constructor(
    private readonly httpClient: HttpClient,
    private readonly route: ActivatedRoute,
    public readonly ks: KeycloakService,
  ) {
    route.queryParams.subscribe(params => {
      if(params['page'] && !isNaN(params['page']) && Number(params['page']) >= 0){
        this.page = Number(params['page']);
      }
      if(params['size'] && !isNaN(params['size']) && Number(params['size']) >= 1){
        this.size = Number(params['size']);
      }
      //sort

      let reqParams = new HttpParams();
      reqParams = reqParams.set('size', this.size);
      reqParams = reqParams.set('page', this.page);
      //sort

      httpClient.get<{Results: Entity[]; Count: number}>('/entities', { params: reqParams }).subscribe(
        body => {
          this.entities = body.Results;
          this.amount = body.Count;
          this.pages = Math.floor(1 + ((this.amount - 1) / this.size));
        },
        err=>{console.log('Error', err);},
        ()=>{/*console.log('Finish')*/;},
      );
    });
  }

  public delete(id: number){
    if(confirm('¿seguro?')){
      this.httpClient.delete<any>(`/entities/${id}`).subscribe(
        body => {
          window.location.reload();
        },
        err=>{console.log('Error', err);},
        ()=>{console.log('delete Finish');},
      );
    }
  }
}
