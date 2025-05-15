import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
      }).subscribe(
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
