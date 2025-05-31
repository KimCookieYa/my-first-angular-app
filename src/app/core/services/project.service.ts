import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, delay, map } from 'rxjs';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../models/project.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // 프로젝트 목록 상태 관리
  private readonly projectsSubject = new BehaviorSubject<Project[]>([]);
  public readonly projects$ = this.projectsSubject.asObservable();
  
  // Angular Signals 사용
  public readonly projects = signal<Project[]>([]);
  public readonly isLoading = signal<boolean>(false);

  constructor() {
    this.loadProjects();
  }

  loadProjects(): Observable<Project[]> {
    this.isLoading.set(true);
    
    return this.mockApiGetProjects().pipe(
      map(projects => {
        this.projectsSubject.next(projects);
        this.projects.set(projects);
        this.isLoading.set(false);
        return projects;
      })
    );
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return this.projects$.pipe(
      map(projects => projects.find(p => p.id === id))
    );
  }

  createProject(projectData: CreateProjectRequest): Observable<Project> {
    this.isLoading.set(true);
    
    return this.mockApiCreateProject(projectData).pipe(
      map(newProject => {
        const currentProjects = this.projects();
        const updatedProjects = [...currentProjects, newProject];
        
        this.projectsSubject.next(updatedProjects);
        this.projects.set(updatedProjects);
        this.isLoading.set(false);
        
        return newProject;
      })
    );
  }

  updateProject(projectData: UpdateProjectRequest): Observable<Project> {
    this.isLoading.set(true);
    
    return this.mockApiUpdateProject(projectData).pipe(
      map(updatedProject => {
        const currentProjects = this.projects();
        const updatedProjects = currentProjects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        );
        
        this.projectsSubject.next(updatedProjects);
        this.projects.set(updatedProjects);
        this.isLoading.set(false);
        
        return updatedProject;
      })
    );
  }

  deleteProject(id: string): Observable<boolean> {
    this.isLoading.set(true);
    
    return this.mockApiDeleteProject(id).pipe(
      map(() => {
        const currentProjects = this.projects();
        const updatedProjects = currentProjects.filter(p => p.id !== id);
        
        this.projectsSubject.next(updatedProjects);
        this.projects.set(updatedProjects);
        this.isLoading.set(false);
        
        return true;
      })
    );
  }

  // Mock API 메서드들
  private mockApiGetProjects(): Observable<Project[]> {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'TaskFlow 개발',
        description: 'Angular로 구현하는 태스크 관리 시스템',
        color: '#1976d2',
        ownerId: '1',
        memberIds: ['1'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        isCompleted: false
      },
      {
        id: '2',
        name: '디자인 시스템',
        description: 'Angular Material 기반 디자인 시스템 구축',
        color: '#388e3c',
        ownerId: '1',
        memberIds: ['1'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        isCompleted: false
      }
    ];

    return of(mockProjects).pipe(delay(500)); // 네트워크 지연 시뮬레이션
  }

  private mockApiCreateProject(projectData: CreateProjectRequest): Observable<Project> {
    const currentUser = this.authService.currentUser();
    
    const newProject: Project = {
      id: Math.random().toString(36),
      ...projectData,
      ownerId: currentUser?.id || '1',
      memberIds: [currentUser?.id || '1'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isCompleted: false
    };

    return of(newProject).pipe(delay(300));
  }

  private mockApiUpdateProject(projectData: UpdateProjectRequest): Observable<Project> {
    const currentProjects = this.projects();
    const existingProject = currentProjects.find(p => p.id === projectData.id);
    
    if (!existingProject) {
      throw new Error('Project not found');
    }

    const updatedProject: Project = {
      ...existingProject,
      ...projectData,
      updatedAt: new Date()
    };

    return of(updatedProject).pipe(delay(300));
  }

  private mockApiDeleteProject(id: string): Observable<void> {
    return of(void 0).pipe(delay(300));
  }
} 