import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { KeycloakService } from './keycloak.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public userInfo: any;

  constructor(public ks: KeycloakService){
    this.userInfo = ks.getUserInfo();
  }

  title = 'poc1-frontend';
}
