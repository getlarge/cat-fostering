import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@cat-fostering/ng-components';
import { UserStateService } from '@cat-fostering/ng-user-state';

@Component({
  standalone: true,
  imports: [CommonModule, HeaderComponent, HttpClientModule, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [],
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cat-fostering-web';

  private readonly userState = inject(UserStateService);
  readonly isAuthenticated$ = this.userState.isAuthenticated$;

  logout() {
    this.userState.logout();
  }

  login() {
    this.userState.login();
  }
}
