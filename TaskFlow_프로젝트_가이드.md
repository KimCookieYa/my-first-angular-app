# TaskFlow - Angular 학습용 프로젝트 가이드 📚

## 🎯 프로젝트 개요

**TaskFlow**는 React/Next.js 개발자가 Angular의 핵심 개념들을 배우기 위한 Task Management System입니다.

### 주요 학습 목표
- ✅ **구조화된 아키텍처**: 모듈 기반 설계와 기능별 분리
- ✅ **의존성 주입**: Angular의 강력한 DI 시스템
- ✅ **양방향 데이터 바인딩**: React와 다른 데이터 흐름
- ✅ **객체지향 프로그래밍**: 클래스 기반 컴포넌트
- ✅ **Angular Material**: 현대적인 UI 컴포넌트 라이브러리

---

## 🏗️ 현재 구현된 구조

### 📁 프로젝트 구조
```
src/app/
├── core/                           # 핵심 서비스 (싱글톤)
│   ├── models/                     # 데이터 모델 인터페이스
│   │   ├── user.interface.ts       # 사용자 관련 인터페이스
│   │   ├── project.interface.ts    # 프로젝트 관련 인터페이스
│   │   └── task.interface.ts       # 태스크 관련 인터페이스
│   └── services/                   # 비즈니스 로직 서비스
│       ├── auth.service.ts         # 인증 서비스
│       └── project.service.ts      # 프로젝트 관리 서비스
├── features/                       # 기능별 모듈
│   ├── auth/                       # 인증 기능
│   │   ├── login.component.ts      # 로그인 컴포넌트
│   │   └── auth.routes.ts          # 인증 라우팅
│   ├── dashboard/                  # 대시보드
│   │   └── dashboard.component.ts  # 대시보드 컴포넌트
│   ├── projects/                   # 프로젝트 관리 (예정)
│   └── tasks/                      # 태스크 관리 (예정)
└── layout/                         # 레이아웃 컴포넌트
```

---

## 🎓 React vs Angular 주요 차이점 학습

### 1. 의존성 주입 (Dependency Injection)

**React (Context API/Props):**
```typescript
// Context 생성 및 Provider 설정
const AuthContext = createContext();
<AuthProvider value={authService}>
  <App />
</AuthProvider>

// 컴포넌트에서 사용
const authService = useContext(AuthContext);
```

**Angular (의존성 주입):**
```typescript
// 서비스 자동 등록
@Injectable({ providedIn: 'root' })
export class AuthService { }

// 컴포넌트에서 간단한 주입
private readonly authService = inject(AuthService);
```

### 2. 양방향 데이터 바인딩

**React (useState):**
```typescript
const [email, setEmail] = useState('');
<input value={email} onChange={(e) => setEmail(e.target.value)} />
```

**Angular (ngModel):**
```typescript
email = '';
<input [(ngModel)]="email" />
```

### 3. 상태 관리

**React (useState/useEffect):**
```typescript
const [users, setUsers] = useState([]);
useEffect(() => {
  fetchUsers().then(setUsers);
}, []);
```

**Angular (Signals + Services):**
```typescript
// 서비스에서
users = signal<User[]>([]);
loadUsers() { /* RxJS Observable */ }

// 컴포넌트에서
users = this.userService.users; // 자동 반응형
```

---

## 🛠️ 구현된 핵심 기능

### 1. 인증 시스템 (`AuthService`)
- ✅ 로그인/로그아웃 기능
- ✅ JWT 토큰 관리
- ✅ 로컬 스토리지 연동
- ✅ Angular Signals 활용
- ✅ RxJS Observable 패턴

**핵심 특징:**
```typescript
// Angular 19의 최신 Signals 사용
public readonly isAuthenticated = signal<boolean>(false);
public readonly currentUser = signal<AuthUser | null>(null);

// 전통적인 RxJS BehaviorSubject와 병행 사용
private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
public readonly currentUser$ = this.currentUserSubject.asObservable();
```

### 2. 프로젝트 관리 (`ProjectService`)
- ✅ CRUD 작업 (생성, 읽기, 수정, 삭제)
- ✅ 실시간 상태 업데이트
- ✅ 로딩 상태 관리
- ✅ Mock API 시뮬레이션

### 3. 라우팅 시스템
- ✅ Route Guards (인증 보호)
- ✅ Lazy Loading (성능 최적화)
- ✅ 조건부 리다이렉션

**Route Guard 예시:**
```typescript
const authGuard = () => {
  const authService = inject(AuthService);
  const isAuth = authService.isAuthenticated();
  
  if (!isAuth) {
    inject(AuthService).logout();
    return false;
  }
  return true;
};
```

### 4. Angular Material 통합
- ✅ 현대적인 Material Design UI
- ✅ 반응형 레이아웃
- ✅ 다양한 Material 컴포넌트 활용

**사용된 Material 컴포넌트:**
- `mat-toolbar` - 상단 네비게이션
- `mat-sidenav` - 사이드 메뉴
- `mat-card` - 콘텐츠 카드
- `mat-form-field` - 폼 입력
- `mat-button` - 버튼들
- `mat-icon` - 아이콘
- `mat-progress-bar` - 진행 표시

---

## 🎨 UI/UX 구현 현황

### 1. 로그인 페이지
- ✅ Material Design 스타일
- ✅ 폼 validation (이메일, 비밀번호)
- ✅ 에러 상태 표시
- ✅ 로딩 상태 관리
- ✅ 양방향 데이터 바인딩 활용

### 2. 대시보드
- ✅ 반응형 그리드 레이아웃
- ✅ 통계 카드들
- ✅ 최근 프로젝트 목록
- ✅ 빠른 작업 버튼들
- ✅ 실시간 데이터 업데이트

### 3. 메인 레이아웃
- ✅ 상단 툴바 (로고, 사용자 메뉴)
- ✅ 사이드 네비게이션
- ✅ 조건부 렌더링 (인증 상태에 따라)

---

## 🔧 기술 스택

### Core Framework
- **Angular 19** - 최신 버전
- **TypeScript** - 강력한 타입 시스템
- **RxJS** - 반응형 프로그래밍

### UI Framework
- **Angular Material 19** - Material Design 컴포넌트
- **Material Icons** - 아이콘

### 개발 도구
- **Angular CLI** - 프로젝트 관리
- **Angular DevKit** - 빌드 도구

---

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 브라우저에서 http://localhost:4200 접속
```

### 로그인 정보
- **이메일**: `demo@taskflow.com`
- **비밀번호**: 아무거나 입력 (데모용)

---

## 📋 다음 단계 구현 계획

### Phase 1: 기본 CRUD 완성
- [ ] 프로젝트 생성/수정/삭제 UI
- [ ] 태스크 관리 컴포넌트
- [ ] 프로젝트 상세 페이지

### Phase 2: 고급 기능
- [ ] 태스크 드래그 앤 드롭 (칸반 보드)
- [ ] 실시간 협업 기능
- [ ] 파일 업로드

### Phase 3: 성능 최적화
- [ ] OnPush 변경 감지 전략
- [ ] Virtual Scrolling
- [ ] PWA 변환

---

## 💡 React 개발자를 위한 학습 포인트

### 1. 생명주기 이해
```typescript
// Angular 생명주기 인터페이스
implements OnInit, OnDestroy {
  ngOnInit() {
    // 컴포넌트 초기화 (useEffect(() => {}, [])와 유사)
  }
  
  ngOnDestroy() {
    // 정리 작업 (useEffect cleanup과 유사)
  }
}
```

### 2. 템플릿 문법
```html
<!-- 조건부 렌더링 -->
<div *ngIf="isAuthenticated()">인증됨</div>

<!-- 반복 렌더링 -->
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>

<!-- 이벤트 바인딩 -->
<button (click)="onClick()">클릭</button>

<!-- 양방향 바인딩 -->
<input [(ngModel)]="value">
```

### 3. 서비스와 의존성 주입
```typescript
// 서비스는 비즈니스 로직을 담당
@Injectable({ providedIn: 'root' })
export class DataService {
  // 자동으로 싱글톤 인스턴스 생성
}

// 컴포넌트에서 주입 받아 사용
constructor(private dataService: DataService) {}
// 또는 최신 방식
private dataService = inject(DataService);
```

---

## 🔍 코드 리뷰 포인트

### 1. TypeScript 활용
- ✅ 엄격한 타입 정의 (인터페이스)
- ✅ 옵셔널 체이닝 (`?.`)
- ✅ Nullish coalescing (`??`)
- ✅ Generic 타입 활용

### 2. Angular 베스트 프랙티스
- ✅ Standalone 컴포넌트 사용
- ✅ inject() 함수 활용
- ✅ Signals와 RxJS 조합
- ✅ OnPush 전략 준비

### 3. 성능 고려사항
- ✅ Lazy loading 라우팅
- ✅ TrackBy 함수 (향후 추가)
- ✅ Pure pipes 활용 (향후 추가)

---

## 📚 참고 자료

- [Angular 공식 문서](https://angular.dev)
- [Angular Material 가이드](https://material.angular.io)
- [RxJS 공식 문서](https://rxjs.dev)
- [Angular Style Guide](https://angular.dev/style-guide)

---

## 📝 다음 작업 시작 시 참고사항

1. **현재 상태**: 기본 인증과 대시보드 완성
2. **다음 우선순위**: 프로젝트 상세 페이지 구현
3. **중요 파일들**:
   - `src/app/core/services/` - 비즈니스 로직
   - `src/app/features/` - 기능별 컴포넌트
   - `src/app/app.routes.ts` - 라우팅 설정

4. **테스트 방법**: `npm start` 후 `http://localhost:4200`에서 확인

---

*이 문서는 TaskFlow 프로젝트의 진행 상황을 기록하고, 다음 작업을 위한 가이드 역할을 합니다.* 