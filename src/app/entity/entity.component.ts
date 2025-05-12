import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';

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
  public readonly sizes: number[] = [1,2,3,4];
  private readonly defaultSize: number = this.sizes[1];
  public size: number = this.sizes[1];
  private readonly defaultPage: number = 0;
  public page: number = 0;
  public pages: number = 1;
  //public sort: {direction: boolean; key: keyof Entity} | null = null;
  public sort: {direction: boolean; key: keyof Entity} | null = null;
  private readonly defaultSort = null;
  public readonly entityProps: (keyof Entity)[] = ['Id', 'Name', 'Description'];

  ngOnInit() {
    //listen to changes
    //console.log(this.route.snapshot.queryParams);
    this.route.queryParams.subscribe(params => {
      if(params['page'] && !isNaN(params['page']) && Number(params['page']) >= 0){
        this.page = Number(params['page']);
      }else{
        this.page = this.defaultPage;
      }
      if(params['size'] && !isNaN(params['size']) && Number(params['size']) >= 1){
        this.size = Number(params['size']);
      }else{
        this.size = this.defaultSize;
      }
      if(params['sort.direction'] && params['sort.key']){
        this.sort = {
          key: params['sort.key'],
          direction: params['sort.direction'] === 'true', // Boolean('false') da true!
        };
      }else{
        this.sort = this.defaultSort;
      }

      let reqParams = new HttpParams();
      reqParams = reqParams.set('size', this.size);
      reqParams = reqParams.set('page', this.page);
      if(this.sort){
        reqParams = reqParams.set('sort.direction', this.sort.direction);
        reqParams = reqParams.set('sort.key', this.sort.key);
      }
      //console.log(reqParams);

      this.httpClient.get<{Results: Entity[]; Count: number}>('/entities', { params: reqParams }).subscribe(
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

  constructor(
    private readonly httpClient: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly ks: KeycloakService,
  ) {
    //en ngOnInit?
    //console.log(Object.getOwnPropertyNames(new Entity()))
    // Entity better with class or type?
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

  public navigate(e: Event, k?: keyof Entity){
    if(e.type === "change"){
      let newval = (e.target as HTMLInputElement).value;
      if(Number(newval)){
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            size: newval,
            page: 0,
          },
          queryParamsHandling: 'merge',
          // preserve the existing query params in the route
          //skipLocationChange: true,
          // do not trigger navigation
       });
      }
    }
    if(e.type === "click"){
      if(k){
        //logica: si no esta o es distinta a la actual se agrega, si esta y es la misma cambia el sentido, si ya se cambio el sentido se limpia el filtro
        let target = this.sort ? {...this.sort} : null;
        if(target && target.key === k){
          if(target.direction === true){
            target.direction = false;
          }else{
            target = null;
          }
        }else{
          target = {key: k, direction: true};
        }
        this.router.navigate([], {
         relativeTo: this.route,
         queryParams: {
           'sort.key': target ? target.key : null,
           'sort.direction': target ? target.direction : null,
         },
         queryParamsHandling: 'merge',
       });
      }
    }
  }
}
