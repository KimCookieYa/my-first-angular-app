import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';

// Route Guard - React의 Private Route와 유사
const authGuard = () => {
  const authService = inject(AuthService);
  const isAuth = authService.isAuthenticated();
  
  if (!isAuth) {
    inject(AuthService).logout(); // 로그인 페이지로 리다이렉트
    return false;
  }
  return true;
};

const publicOnlyGuard = () => {
  const authService = inject(AuthService);
  const isAuth = authService.isAuthenticated();
  
  if (isAuth) {
    // 이미 로그인된 경우 대시보드로 리다이렉트
    return inject(AuthService).router.parseUrl('/dashboard');
  }
  return true;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [publicOnlyGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadChildren: () => import('./features/projects/projects.routes').then(m => m.projectRoutes)
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.taskRoutes)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
