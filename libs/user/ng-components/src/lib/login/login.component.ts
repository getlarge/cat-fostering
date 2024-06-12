// src/app/login/login.component.ts
import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { environment } from '@cat-fostering/ng-env';

@Component({
  selector: 'lib-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly document = inject(DOCUMENT);

  login() {
    // Redirect to Ory Kratos login UI
    this.document.location.href = `${environment.kratosUrl}/self-service/login/browser`;
  }
}
