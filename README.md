# SHOWROOMZ

## 📋 주요 기술 스택

- **Framework**: React Native 0.81.0, Expo ~54.0.20
- **Language**: TypeScript
- **State Management**: Zustand, TanStack Query
- **Styling**: NativeWind (Tailwind CSS)
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## 🔧 개발 가이드

### Git Flow

이 프로젝트는 다음과 같은 Git Flow를 따릅니다:

```
→ 작업 브랜치
→ develop PR
→ develop merge
→ develop > main PR 자동 생성
→ main merge
→ APK 빌드
→ Discord 업로드
```

#### 상세 프로세스

1. **작업 브랜치 생성 및 작업**
   - 기능 개발을 위한 작업 브랜치를 생성합니다
   - 작업 완료 후 커밋 및 푸시

2. **develop 브랜치로 PR 생성 및 머지**
   - 작업 브랜치에서 `develop` 브랜치로 Pull Request를 생성합니다
   - 리뷰 완료 후 `develop` 브랜치로 머지합니다

3. **main 브랜치로 PR 자동 생성**
   - `develop` 브랜치에 머지되면 자동으로 `main` 브랜치로 향하는 PR이 생성됩니다
   - GitHub Actions 워크플로우(`.github/workflows/gitflow.yml`)가 자동으로 처리합니다
   - **중요**: develop > main PR이 이미 생성된 상태에서 `develop` 브랜치에 추가로 머지가 발생하면, 새로운 PR이 생성되는 것이 아니라 기존 PR에 커밋 히스토리가 자동으로 업데이트됩니다

4. **main 브랜치 머지**
   - 리뷰 완료 후 `main` 브랜치로 머지합니다

5. **APK 빌드 및 Discord 업로드**
   - `main` 브랜치에 머지되면 자동으로 Android APK가 빌드됩니다
   - 빌드 완료 후 Discord 웹훅을 통해 빌드 정보가 자동으로 업로드됩니다
   - GitHub Actions 워크플로우(`.github/workflows/build-apk-dev.yml`)가 자동으로 처리합니다

### Git Hooks (Husky)

이 프로젝트는 **Husky**를 사용하여 커밋 전 자동으로 코드 품질 검사를 실행합니다.

```bash
# commit 시 자동으로 실행되는 검사:
# - Prettier로 코드 포맷팅
# - ESLint로 코드 품질 검사
# ⚠️ 린트 오류 발견 시 commit이 차단되며, 수동으로 수정 후 재시도 필요
```

## 📁 디렉토리 구조

```
├── assets/                         # 앱 레벨 정적 파일 (스플래시, 아이콘 등)
├── src/
│   │── providers/                  # 앱 전역 Provider 관리
│   ├── common/                     # 공통 영역 (도메인 독립적)
│   │   ├── assets/                 # 정적 파일
│   │   ├── components/             # 공통 UI 컴포넌트
│   │   ├── constants/              # 공통 상수
│   │   ├── hooks/                  # 공통 커스텀 훅
│   │   ├── lib/                    # 외부 라이브러리 설정
│   │   ├── router/                 # 라우팅 설정 및 타입
│   │   ├── services/               # 공통 API 서비스
│   │   ├── stores/                 # 공통 전역 상태
│   │   ├── types/                  # 공통 타입 정의
│   │   └── utils/                  # 공통 유틸 함수
│   ├── features/
│   │   └── {domain}/               # 도메인별 기능
│   │       ├── views/              # 화면(페이지) 컴포넌트
│   │       ├── components/         # 도메인 특화 컴포넌트
│   │       ├── constants/          # 도메인 특화 상수
│   │       ├── hooks/              # 도메인 특화 훅
│   │       ├── services/           # 도메인 API 서비스
│   │       ├── stores/             # 도메인 상태 관리
│   │       ├── types/              # 도메인 타입 정의
│   │       └── utils/              # 도메인 유틸 함수
│   ├── navigators/                 # 네비게이터 컴포넌트
│   └── App.tsx                     # 앱 진입점
```

### 컴포넌트 구조

```
├── components/
│   └── SomeComponent/
│       ├── SomeComponent.tsx       # 컨테이너 + 로직 + 타입 정의
│       ├── SomeHeader.tsx          # UI
│       └── SomeBody.tsx            # UI
```

### 가이드

- **`assets/`**: 앱 아이콘, 스플래시 (`app.json` 참조)
- **`providers/`**: 커스텀 Provider
- **`common/assets/`**: 공통 정적 파일
- **`common/components/`**: 범용 UI 컴포넌트
- **`common/lib/`**: TanStack Query 등 외부 라이브러리 설정
- **`common/router/`**: 라우팅 경로, 타입 정의
- **`navigators/`**: React Navigation 네비게이터 컴포넌트
- **`features/{domain}/assets/`**: 도메인 특화 정적 파일
- **`features/{domain}/components/`**: 도메인 특화 컴포넌트

## 📖 개발 컨벤션

코드 스타일, 네이밍 규칙 등 상세한 개발 컨벤션은 아래 문서를 참고해 주세요.

**[👉 개발 컨벤션 문서 보기](https://candied-surfboard-06c.notion.site/Development-Conventions-FrontEnd-263c1ade4f0380a4b4f6fab1b5220be0)**
