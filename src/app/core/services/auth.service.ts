import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap, catchError, of } from 'rxjs';
import { AuthUser, LoginRequest, RegisterRequest } from '../models/user.interface';

@Injectable({
  providedIn: 'root' // 싱글톤 서비스로 등록
})
export class AuthService {
  private readonly http = inject(HttpClient);
  public readonly router = inject(Router);
  
  // React의 useState와 유사하지만, Angular Signals 사용
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();
  
  // Angular 19의 Signals 사용 (더 현대적인 방식)
  public readonly isAuthenticated = signal<boolean>(false);
  public readonly currentUser = signal<AuthUser | null>(null);

  constructor() {
    // 로컬 스토리지에서 토큰 복원
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user: AuthUser = { ...JSON.parse(userData), token };
        this.setCurrentUser(user);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthUser> {
    // 실제 환경에서는 API 호출
    return this.mockApiLogin(credentials).pipe(
      tap(user => {
        this.setCurrentUser(user);
        this.router.navigate(['/dashboard']);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthUser> {
    return this.mockApiRegister(userData).pipe(
      tap(user => {
        this.setCurrentUser(user);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  private setCurrentUser(user: AuthUser): void {
    // 두 방식 모두 업데이트 (호환성을 위해)
    this.currentUserSubject.next(user);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('auth_token', user.token);
    localStorage.setItem('user_data', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  private clearAuth(): void {
    this.currentUserSubject.next(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // 목업 API 메서드들 (실제 프로젝트에서는 실제 API로 대체)
  private mockApiLogin(credentials: LoginRequest): Observable<AuthUser> {
    return of({
      id: '1',
      email: credentials.email,
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + credentials.email,
      token: 'mock_jwt_token_' + Date.now(),
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date()
    });
  }

  private mockApiRegister(userData: RegisterRequest): Observable<AuthUser> {
    return of({
      id: Math.random().toString(36),
      email: userData.email,
      name: userData.name,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userData.email,
      token: 'mock_jwt_token_' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
} 