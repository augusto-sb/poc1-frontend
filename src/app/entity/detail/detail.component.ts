import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';

import { Entity } from '../entity.type';
import { KeycloakService } from '../../keycloak.service';

@Component({
  selector: 'app-detail',
  imports: [RouterLink],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {
  public entity: Entity | null = null;

  constructor(
    public ks: KeycloakService,
    private readonly httpClient: HttpClient,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ){
    httpClient.get<Entity>(`/entities/${activatedRoute.snapshot.params['id']}`).subscribe(
      body => {
        this.entity = body;
      },
      err=>{console.log('Error', err);},
      ()=>{/*console.log('Finish')*/;},
    );
  }

  public delete(id: number){
    if(confirm('¿seguro?')){
      this.httpClient.delete<any>(`/entities/${id}`).subscribe(
        body => {
          this.router.navigate(['..'], { relativeTo: this.activatedRoute });
        },
        err=>{console.log('Error', err);},
        ()=>{console.log('delete Finish');},
      );
    }
  }
}
