# SHOWROOMZ

## 📋 주요 기술 스택

- **Framework**: React Native 0.81.0, Expo ~54.0.20
- **Language**: TypeScript
- **State Management**: Zustand, TanStack Query
- **Styling**: NativeWind (Tailwind CSS)
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## 🔧 개발 가이드

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
│   │   ├── assets/                 # 공통 정적 파일
│   │   ├── components/             # 공통 UI 컴포넌트
│   │   ├── constants/              # 공통 상수
│   │   ├── hooks/                  # 공통 커스텀 훅
│   │   ├── services/               # 공통 API 서비스
│   │   ├── stores/                 # 공통 전역 상태
│   │   ├── types/                  # 공통 타입 정의
│   │   └── utils/                  # 공통 유틸 함수
│   ├── features/
│   │   └── {domain}/               # 도메인별 기능
│   │       ├── views/              # 화면(페이지) 컴포넌트
│   │       ├── assets/             # 도메인 특화 정적파일
│   │       ├── components/         # 도메인 특화 컴포넌트
│   │       ├── constants/          # 도메인 특화 상수
│   │       ├── hooks/              # 도메인 특화 훅
│   │       ├── services/           # 도메인 API 서비스
│   │       ├── stores/             # 도메인 상태 관리
│   │       ├── types/              # 도메인 타입 정의
│   │       └── utils/              # 도메인 유틸 함수
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
- **`providers/`**: 전역 Provider (QueryClient, Theme 등)
- **`common/assets/`**: 공통 정적 파일
- **`common/components/`**: 범용 UI 컴포넌트
- **`features/{domain}/assets/`**: 도메인 특화 정적 파일
- **`features/{domain}/components/`**: 도메인 특화 컴포넌트

## 📖 개발 컨벤션

코드 스타일, 네이밍 규칙 등 상세한 개발 컨벤션은 아래 문서를 참고해 주세요.

**[👉 개발 컨벤션 문서 보기](https://candied-surfboard-06c.notion.site/Development-Conventions-FrontEnd-263c1ade4f0380a4b4f6fab1b5220be0)**
