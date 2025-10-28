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
├── assets
├── common
│   ├── components
│   │   ├── base
│   │   └── composite
│   ├── constants
│   ├── hooks
│   ├── services
│   ├── stores
│   ├── types
│   └── utils
├── features
│   └── {domain}
│       ├── components
│       │   ├── base
│       │   └── composite
│       ├── hooks
│       ├── views
│       ├── services
│       ├── stores
│       ├── types
│       └── utils
└── App.tsx
```

- `features/{domain}/components/base` : 기본 단일 컴포넌트
- `features/{domain}/components/composite` : base를 조합해서 만든 컴포넌트
- `features/{domain}/constants` : 상수
- `features/{domain}/views` : components를 조합해서 만든 View단
- `features/{domain}/services` : api 및 데이터 조작 관련 코드(restapi)
- `features/{domain}/hooks` : hook
- `features/{domain}/utils` : 유틸함수
- `features/{domain}/stores` : zustand store
- `features/{domain}/types` : 타입 및 인터페이스 정의
- `common` : 공통 영역. 하위 디렉토리는 위와 동일함 (components, services, hooks, stores, utils, types ...)
- `assets` : image, svg 등 정적파일
