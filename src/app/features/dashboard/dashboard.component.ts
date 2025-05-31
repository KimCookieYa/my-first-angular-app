import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>안녕하세요, {{ currentUser()?.name }}님! 👋</h1>
        <p>오늘도 생산적인 하루 되세요!</p>
      </div>

      <!-- 통계 카드들 -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon projects">folder</mat-icon>
              <div class="stat-info">
                <h3>{{ projects().length }}</h3>
                <p>진행 중인 프로젝트</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon tasks">assignment</mat-icon>
              <div class="stat-info">
                <h3>12</h3>
                <p>완료된 할 일</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon pending">schedule</mat-icon>
              <div class="stat-info">
                <h3>5</h3>
                <p>대기 중인 할 일</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon progress">trending_up</mat-icon>
              <div class="stat-info">
                <h3>85%</h3>
                <p>전체 진행률</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- 최근 프로젝트 -->
      <div class="recent-projects">
        <mat-card>
          <mat-card-header>
            <mat-card-title>최근 프로젝트</mat-card-title>
            <mat-card-subtitle>최근에 작업한 프로젝트들</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="projects-list" *ngIf="!isLoading(); else loadingTemplate">
              <div *ngFor="let project of projects()" class="project-item">
                <div class="project-info">
                  <div class="project-color" [style.background-color]="project.color"></div>
                  <div class="project-details">
                    <h4>{{ project.name }}</h4>
                    <p>{{ project.description }}</p>
                    <div class="project-meta">
                      <mat-chip>{{ project.memberIds.length }}명 참여</mat-chip>
                      <span class="project-date">{{ project.updatedAt | date:'short' }}</span>
                    </div>
                  </div>
                </div>
                <div class="project-progress">
                  <mat-progress-bar mode="determinate" [value]="75"></mat-progress-bar>
                  <span class="progress-text">75%</span>
                </div>
              </div>
            </div>

            <ng-template #loadingTemplate>
              <div class="loading-state">
                <mat-progress-bar mode="indeterminate"></mat-progress-bar>
                <p>프로젝트를 불러오는 중...</p>
              </div>
            </ng-template>
          </mat-card-content>

          <mat-card-actions align="end">
            <button mat-button color="primary">
              모든 프로젝트 보기
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- 빠른 작업 -->
      <div class="quick-actions">
        <mat-card>
          <mat-card-header>
            <mat-card-title>빠른 작업</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="actions-grid">
              <button mat-stroked-button class="action-button">
                <mat-icon>add</mat-icon>
                새 프로젝트
              </button>
              <button mat-stroked-button class="action-button">
                <mat-icon>assignment_add</mat-icon>
                할 일 추가
              </button>
              <button mat-stroked-button class="action-button">
                <mat-icon>people</mat-icon>
                팀원 초대
              </button>
              <button mat-stroked-button class="action-button">
                <mat-icon>assessment</mat-icon>
                리포트 보기
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      font-weight: 300;
      margin-bottom: 8px;
      color: #333;
    }

    .dashboard-header p {
      font-size: 1.1rem;
      color: #666;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 40px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.projects { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.tasks { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.pending { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.progress { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

    .stat-info h3 {
      font-size: 2rem;
      font-weight: 500;
      margin: 0;
      color: #333;
    }

    .stat-info p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    .recent-projects, .quick-actions {
      margin-bottom: 32px;
    }

    .projects-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .project-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      transition: border-color 0.2s ease;
    }

    .project-item:hover {
      border-color: #3f51b5;
    }

    .project-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .project-color {
      width: 12px;
      height: 48px;
      border-radius: 6px;
    }

    .project-details h4 {
      margin: 0 0 4px 0;
      font-weight: 500;
    }

    .project-details p {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .project-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .project-date {
      font-size: 0.8rem;
      color: #999;
    }

    .project-progress {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 120px;
    }

    .progress-text {
      font-size: 0.9rem;
      font-weight: 500;
      color: #333;
    }

    .loading-state {
      text-align: center;
      padding: 40px 0;
    }

    .loading-state p {
      margin-top: 16px;
      color: #666;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .action-button {
      height: 60px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .action-button mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly projectService = inject(ProjectService);

  // Angular Signals 사용
  currentUser = this.authService.currentUser;
  projects = this.projectService.projects;
  isLoading = this.projectService.isLoading;

  ngOnInit(): void {
    // 컴포넌트 초기화 시 프로젝트 데이터 로드
    this.projectService.loadProjects().subscribe();
  }
} 