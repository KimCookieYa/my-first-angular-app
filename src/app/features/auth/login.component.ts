import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>TaskFlow에 로그인</mat-card-title>
          <mat-card-subtitle>할 일 관리를 시작하세요</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>이메일</mat-label>
              <input matInput 
                     type="email" 
                     [(ngModel)]="loginData.email"
                     name="email"
                     required
                     email
                     #email="ngModel">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="email.invalid && email.touched">
                올바른 이메일을 입력해주세요
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>비밀번호</mat-label>
              <input matInput 
                     [type]="hidePassword ? 'password' : 'text'"
                     [(ngModel)]="loginData.password"
                     name="password"
                     required
                     minlength="6"
                     #password="ngModel">
              <button mat-icon-button 
                      matSuffix 
                      type="button"
                      (click)="hidePassword = !hidePassword">
                <mat-icon>{{hidePassword ? 'visibility' : 'visibility_off'}}</mat-icon>
              </button>
              <mat-error *ngIf="password.invalid && password.touched">
                비밀번호는 최소 6자 이상이어야 합니다
              </mat-error>
            </mat-form-field>

            <button mat-raised-button 
                    color="primary" 
                    type="submit"
                    class="full-width login-button"
                    [disabled]="loginForm.invalid || isLoading">
              <mat-icon *ngIf="isLoading">hourglass_empty</mat-icon>
              {{ isLoading ? '로그인 중...' : '로그인' }}
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions>
          <p class="demo-info">
            <strong>데모용 계정:</strong><br>
            이메일: demo&#64;taskflow.com<br>
            비밀번호: 아무거나 입력하세요
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .login-button {
      margin-top: 16px;
      height: 48px;
    }

    .demo-info {
      text-align: center;
      color: #666;
      font-size: 14px;
      margin: 16px 0 0 0;
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 20px;
    }
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  // 양방향 데이터 바인딩을 위한 모델
  loginData: LoginRequest = {
    email: 'demo@taskflow.com',
    password: ''
  };

  hidePassword = true;
  isLoading = false;

  onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    
    this.authService.login(this.loginData).subscribe({
      next: (user) => {
        this.snackBar.open(`환영합니다, ${user.name}님!`, '닫기', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('로그인에 실패했습니다.', '닫기', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }
} 