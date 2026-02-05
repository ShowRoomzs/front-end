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

## 🏗️ API 아키텍처 패턴

프로젝트는 `apiInstance → service → hook` 3계층 구조를 따릅니다.

### 계층별 역할

```
apiInstance (axios)  →  service (API 호출)  →  hook (TanStack Query)
```

#### 1. apiInstance

- `axios` 인스턴스 생성 및 설정
- 인증 토큰 자동 주입 (request interceptor)
- 토큰 갱신 처리 (response interceptor)
- 위치: `src/common/lib/apiInstance.ts`

```typescript
// src/common/lib/apiInstance.ts
export const apiInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_PROTOCOL}://${process.env.EXPO_PUBLIC_API_HOST}/v1`,
});
```

#### 2. service

- API 엔드포인트별 호출 함수 정의
- `apiInstance`를 사용하여 HTTP 요청 수행
- 응답 데이터 반환
- 위치: `src/features/{domain}/services/{domain}Service.ts`

```typescript
// src/features/mypage/services/addressService.ts
export const addressService = {
  getAddresses: async () => {
    const { data: response } = await apiInstance.get<Array<Address>>("/user/delivery-addresses");

    return response;
  },
  addAddress: async (address: AddressRequest) => {
    const { data: response } = await apiInstance.post<Address>("/user/delivery-addresses", address);

    return response;
  },
};
```

#### 3. hook

- TanStack Query의 `useQuery` 또는 `useMutation`으로 래핑
- 컴포넌트에서 사용할 수 있는 인터페이스 제공
- 위치: `src/features/{domain}/hooks/use{Action}.ts`

##### Query 예시

```typescript
// src/features/mypage/hooks/useGetAddressList.ts
export function useGetAddressList() {
  return useQuery({
    queryKey: [MYPAGE_QUERY_KEY.ADDRESS_LIST],
    queryFn: addressService.getAddresses,
  });
}
```

##### Mutation 예시

```typescript
// src/features/mypage/hooks/useAddressMutation/useAddAddressMutation.ts
export function useAddAddressMutation() {
  return useMutation({
    mutationFn: addressService.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MYPAGE_QUERY_KEY.ADDRESS_LIST] });
    },
  });
}
```

### ⚠️ Mutation onSuccess 규칙

**mutation의 `onSuccess`에서는 비즈니스 로직을 처리하지 않습니다.**

- ✅ **허용**: 쿼리 캐시 초기화 (`queryClient.invalidateQueries`)
- ❌ **금지**: 페이지 이동, 토스트 표시, 상태 업데이트 등 비즈니스 로직

**이유**: 비즈니스 로직은 컴포넌트에서 관리하여 관심사를 명확히 분리하고, 훅의 재사용성을 높입니다.

```typescript
// ❌ 나쁜 예: onSuccess에서 비즈니스 로직 처리
export function useAddAddressMutation() {
  return useMutation({
    mutationFn: addressService.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MYPAGE_QUERY_KEY.ADDRESS_LIST] });
      router.back(); // ❌ 페이지 이동 로직
      toast.success("주소가 추가되었습니다"); // ❌ UI 로직
    },
  });
}

// ✅ 좋은 예: 컴포넌트에서 비즈니스 로직 처리
function AddressForm() {
  const { mutateAsync } = useAddAddressMutation();

  const handleSubmit = async data => {
    await mutateAsync(data);
    toast.success("주소가 추가되었습니다");
  };
}
```

### 🔄 복잡한 비즈니스 로직 래퍼 훅 패턴

**여러 query/mutation과 복잡한 비즈니스 로직을 결합**해야 하는 경우, 별도의 래퍼 훅으로 캡슐화합니다.

#### 언제 사용하는가?

- 여러 query와 mutation을 조합하여 사용
- 로컬 상태와 서버 상태를 동기화
- 로그인/비로그인 등 조건부 로직 분기
- 복잡한 데이터 병합 및 가공

#### 예시: 최근 검색어 (useRecentSearch)

로그인 상태에 따라 서버/로컬 저장소를 분기 처리하고, 데이터를 병합하는 복잡한 로직을 훅으로 캡슐화

```typescript
// src/features/search/hooks/useRecentSearch.ts
export function useRecentSearch() {
  const { user } = useUserStore();
  const storage = useAsyncStorage(ASYNC_STORAGE.RECENT_SEARCH);

  // 1. 여러 query/mutation 사용
  const { data: recentSearches } = useGetRecentSearch(params, !!user);
  const { mutateAsync: createMutateAsync } = useCreateRecentSearchMutation();
  const { mutateAsync: deleteMutateAsync } = useDeleteRecentSearchMutation();
  const { mutateAsync: syncMutateAsync } = useSyncRecentSearchMutation();

  // 2. 로컬 상태 관리
  const [localRecentSearches, setLocalRecentSearches] = useState<Array<LocalRecentSearchItem>>([]);

  // 3. 서버 데이터 + 로컬 데이터 병합
  const data = useMemo(() => {
    const server = recentSearches?.content ?? [];
    const merged = [...server, ...localRecentSearches];
    return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [recentSearches?.content, localRecentSearches]);

  // 4. 로컬 저장소 관리
  const createLocalRecentSearch = useCallback(
    async (keyword: string) => {
      const data: LocalRecentSearchItem = {
        createdAt: new Date().toISOString(),
        term: keyword,
        id: randomUUID(),
      };
      const newItems = [...localRecentSearches, data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLocalRecentSearches(newItems);
      await storage.setItem(JSON.stringify(newItems));
    },
    [localRecentSearches, storage]
  );

  // 5. 조건부 분기 로직 (로그인 여부)
  const create = useCallback(
    async (keyword: string) => {
      if (user) {
        await createMutateAsync(keyword); // 서버에 저장
        return;
      }
      await createLocalRecentSearch(keyword); // 로컬에 저장
    },
    [createLocalRecentSearch, createMutateAsync, user]
  );

  const remove = useCallback(
    async (id: string | number) => {
      if (user) {
        await deleteMutateAsync(id as number);
        return;
      }
      await deleteLocalRecentSearch(id as string);
    },
    [deleteLocalRecentSearch, deleteMutateAsync, user]
  );

  // 6. 동기화 로직
  const sync = useCallback(async () => {
    if (user && localRecentSearches.length > 0) {
      const data = localRecentSearches.map(item => ({
        keyword: item.term,
        createdAt: item.createdAt,
      }));
      setLocalRecentSearches([]);
      await storage.setItem(JSON.stringify([]));
      await syncMutateAsync({ keywords: data });
    }
  }, [localRecentSearches, storage, syncMutateAsync, user]);

  return { data, create, remove, sync };
}
```

#### 컴포넌트에서 사용

```typescript
// 복잡한 로직이 훅으로 캡슐화되어 컴포넌트는 간결해짐
function SearchScreen() {
  const { data, create, remove } = useRecentSearch();

  return (
    <View>
      {data.map(item => (
        <SearchItem
          key={item.id}
          term={item.term}
          onPress={() => create(item.term)}
          onDelete={() => remove(item.id)}
        />
      ))}
    </View>
  );
}
```

#### 패턴 요약

```
기본 query/mutation들  →  복잡한 비즈니스 로직 래퍼 훅  →  컴포넌트
```

- **기본 query/mutation**: 단순 API 호출 + 캐시 초기화만
- **래퍼 훅**: 여러 query/mutation 조합 + 로컬 상태 + 조건부 로직 + 데이터 가공
- **컴포넌트**: 간단한 인터페이스로 사용
