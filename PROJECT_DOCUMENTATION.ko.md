# Seoul FestivMeet

Seoul FestivMeet는 서울의 축제나 이벤트에서 모임과 만남을 조직하기 위한 플랫폼입니다. 이 애플리케이션은 사용자가 특정 매개변수를 가진 채팅방을 만들어 함께 이벤트에 참여할 수 있는 조건이 맞는 동반자를 찾을 수 있게 해줍니다.

## 프로젝트 개요

이 애플리케이션은 사용자가 다음과 같은 활동을 할 수 있는 소셜 플랫폼으로 기능합니다:
- 서울의 다가오는 축제와 이벤트 탐색
- 상세한 매개변수를 가진 특정 이벤트를 위한 채팅방 생성
- 자신의 선호도에 따라 기존 채팅방 참여
- 잠재적인 만남 동반자와 소통

## 기술 스택

- **프론트엔드 프레임워크**: [Next.js](https://nextjs.org/) (App Router)
- **인증 및 데이터베이스**: [Supabase](https://supabase.com/)
- **스타일링**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 컴포넌트**: [shadcn/ui](https://ui.shadcn.com/)
- **국제화**: [next-intl](https://next-intl-docs.vercel.app/)
- **언어**: [TypeScript](https://www.typescriptlang.org/)

## 기능

### 이벤트 탐색
- 서울의 다가오는 축제와 이벤트 보기
- 날짜, 설명, 이미지를 포함한 이벤트 세부 정보 확인

### 채팅방 생성
- 다음과 같은 상세한 매개변수를 가진 특정 이벤트를 위한 채팅방 생성:
  - 이벤트 날짜 선택 (이벤트 날짜와 휴일을 고려한 캘린더)
  - 그룹 크기 지정
  - 채팅방 이름 지정
  - 연령 제한 (최소/최대 또는 제한 없음)
  - 성별 선호도 (남성, 여성, 또는 둘 다)

### 사용자 인증
- Supabase를 통한 회원가입 및 로그인 기능
- 인증된 사용자를 위한 보호된 경로

### 국제화
- 다국어 지원 (현재 영어와 한국어)
- 언어 간 쉬운 전환

## 애플리케이션 구조

```
seoul-festivmeet/
├── app/                    # Next.js App Router 페이지
│   ├── protected/          # 보호된 라우트 (인증 필요)
│   │   ├── events/         # 이벤트 관련 페이지
│   │   └── chatting/       # 채팅 관련 페이지
├── components/             # 재사용 가능한 UI 컴포넌트
│   ├── ui/                 # shadcn/ui 컴포넌트
│   └── ...                 # 기타 컴포넌트
├── i18n/                   # 국제화 설정
├── messages/               # 번역 메시지
│   ├── en.json            # 영어 번역
│   └── kor.json           # 한국어 번역
├── lib/                    # 유틸리티 함수 및 라이브러리
├── public/                 # 정적 자산
└── ...                     # 설정 파일
```

## 설치 및 설정

1. 저장소 복제:
   ```bash
   git clone https://github.com/yourusername/seoul-festivmeet.git
   cd seoul-festivmeet
   ```

2. 의존성 설치:
   ```bash
   npm install
   ```

3. Supabase 설정:
   - [https://app.supabase.com/](https://app.supabase.com/)에서 Supabase 프로젝트 생성
   - Supabase URL과 익명 키 복사
   - 루트 디렉토리에 다음 내용으로 `.env.local` 파일 생성:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

4. 개발 서버 실행:
   ```bash
   npm run dev
   ```

5. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인합니다.

## 사용 예시

### 채팅방 생성

1. 이벤트 페이지로 이동
2. "방 생성" 버튼 클릭
3. 필요한 세부 정보 입력:
   - 이벤트 날짜 선택
   - 참가자 수 지정
   - 채팅방 이름 지정
   - 연령 제한 설정 (또는 제한 없음 선택)
   - 성별 선호도 선택
4. "생성" 버튼을 클릭하여 채팅방 생성

## 국제화

이 애플리케이션은 다국어를 지원합니다. 현재 영어와 한국어가 구현되어 있습니다.

번역 파일은 `messages/` 디렉토리에 위치해 있습니다:
- `en.json` - 영어
- `kor.json` - 한국어

추가 언어 지원을 위해 `messages/` 디렉토리에 적절한 언어 코드로 새 JSON 파일을 생성하세요.

## 개발 가이드라인

### 코드 스타일
- TypeScript 코딩 표준 준수
- React 훅을 사용한 함수형 컴포넌트 사용
- 적절한 오류 처리 구현
- 복잡한 로직에 의미 있는 주석 작성

### 컴포넌트 구조
- 컴포넌트를 작게 유지하고 단일 책임에 집중
- 복잡한 UI를 구축하기 위해 컴포지션 사용
- 적절한 prop 유효성 검사 구현

### 상태 관리
- 간단한 상태에는 React의 내장 상태 관리(useState, useContext) 사용
- 복잡한 상태에는 더 강력한 상태 관리 솔루션 고려

### 국제화
- 하드코딩된 문자열 대신 항상 번역 키 사용
- 번역 파일을 체계적으로 유지하고 최신 상태로 유지

## 향후 개선 사항

향후 개발을 위한 잠재적 기능:
- 실시간 채팅 기능
- 선호도와 히스토리가 있는 사용자 프로필
- 만남 참가자를 위한 평가 시스템
- 인기 있는 소셜 미디어 플랫폼과의 통합
- 사용자 선호도에 기반한 이벤트 추천
- 모바일 애플리케이션 버전

## 기여

기여는 환영합니다! Pull Request를 자유롭게 제출해 주세요.

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다 - 자세한 내용은 LICENSE 파일을 참조하세요.