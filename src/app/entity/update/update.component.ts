import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Entity } from '../entity.type';

@Component({
  selector: 'app-update',
  imports: [ReactiveFormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent {
  updateForm = new FormGroup({
    Name: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
  });

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(){
    this.httpClient.get<Entity>(`/entities/${this.activatedRoute.snapshot.params['id']}`)
    .pipe(
      retry(3), // Retry up to 3 times
      catchError((error) => {
        console.error('Error after retries:', error);
        return throwError(() => error); // Re-throw the error
      })
    )
    .subscribe(
      body => {
        this.updateForm.setValue({
          Name: body.Name,
          Description: body.Description,
        });
      },
      err=>{console.log('Error', err);},
      ()=>{/*console.log('Finish')*/;},
    );
  }

  onSubmit() {
    if(confirm('¿seguro?')){
      this.httpClient.put<Entity>(`/entities/${this.activatedRoute.snapshot.params['id']}`, this.updateForm.value, {
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
          this.router.navigate(['entity', this.activatedRoute.snapshot.params['id']], {});
        },
        err=>{console.log('Error', err);alert('Error');},
        ()=>{console.log('create Finish');},
      );
    }
  }
}
