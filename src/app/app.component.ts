import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { KeycloakService } from './keycloak.service';
import { version as Pversion } from '../../package.json';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public userInfo: any;
  public version: string = '1.0.0';

  constructor(public ks: KeycloakService){
    this.version = Pversion;
    this.userInfo = ks.getUserInfo();
  }

  title = 'poc1-frontend';
}
