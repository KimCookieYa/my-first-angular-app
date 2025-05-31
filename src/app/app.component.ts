import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TaskFlow';
  
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Angular Signals 사용 - React의 useState와 유사
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;

  menuItems = [
    { label: '대시보드', icon: 'dashboard', route: '/dashboard' },
    { label: '프로젝트', icon: 'folder', route: '/projects' },
    { label: '할 일', icon: 'assignment', route: '/tasks' }
  ];

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }
}
