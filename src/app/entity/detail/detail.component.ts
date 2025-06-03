import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';

import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
    httpClient.get<Entity>(`/entities/${activatedRoute.snapshot.params['id']}`)
     .pipe(
       retry(3), // Retry up to 3 times
       catchError((error) => {
         console.error('Error after retries:', error);
         return throwError(() => error); // Re-throw the error
       })
     )
    .subscribe(
      body => {
        this.entity = body;
      },
      err=>{console.log('Error', err);alert('error');},
      ()=>{/*console.log('Finish')*/;},
    );
  }

  public delete(id: number){
    if(confirm('¿seguro?')){
      this.httpClient.delete<any>(`/entities/${id}`)
      .pipe(
        retry(3), // Retry up to 3 times
        catchError((error) => {
          console.error('Error after retries:', error);
          return throwError(() => error); // Re-throw the error
        })
      )
      .subscribe(
        body => {
          this.router.navigate(['..'], { relativeTo: this.activatedRoute });
        },
        err=>{console.log('Error', err);},
        ()=>{console.log('delete Finish');},
      );
    }
  }
}
