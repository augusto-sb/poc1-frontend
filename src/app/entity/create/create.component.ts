import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Entity } from '../entity.type';

@Component({
  selector: 'app-create',
  imports: [ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  createForm = new FormGroup({
    Name: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
  });

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
  ) {}

  onSubmit() {
    if(confirm('¿seguro?')){
      this.httpClient.post<Entity>(`/entities`, this.createForm.value, {
        headers: {
          'content-type': 'application/json',
        }
      })
      .pipe(
        retry(3), // Retry up to 3 times
        catchError((error) => {
          console.error('Error after retries:', error);
          return throwError(() => error); // Re-throw the error
        })
      )
      .subscribe(
        body => {
          this.router.navigate(['entity', body.Id], {});
        },
        err=>{
          console.log('Error', err);
          if(err.error){
            alert(err.error)
          }else{
            alert('Error');
          }
        },
        ()=>{console.log('create Finish');},
      );
    }
  }
}
