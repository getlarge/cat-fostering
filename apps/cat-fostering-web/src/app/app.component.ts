import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserStateService } from '@cat-fostering/ng-user-state';

@Component({
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [],
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cat-fostering-web';

  constructor(public userState: UserStateService) {}

  logout() {
    this.userState.logout();
  }
}
