// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { environment } from '@cat-fostering/ng-env';

@Component({
  selector: 'lib-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  login() {
    // Redirect to Ory Kratos login UI
    window.location.href = `${environment.kratosUrl}/self-service/login/browser`;
  }
}
