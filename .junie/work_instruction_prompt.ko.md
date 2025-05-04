# Seoul FestivMeet - 기능 구현 작업 지침

이 문서는 Seoul FestivMeet 플랫폼에 다음과 같은 새로운 기능을 구현하기 위한 포괄적인 지침을 제공합니다:

1. 실시간 채팅 기능
2. 선호도와 히스토리가 있는 사용자 프로필
3. 만남 참가자를 위한 평가 시스템
4. 인기 있는 소셜 미디어 플랫폼과의 통합
5. 사용자 선호도에 기반한 이벤트 추천
6. 모바일 애플리케이션 버전

## 1. 실시간 채팅 기능

### 요구사항
- 기존 채팅방 내에서 실시간 메시징 구현
- 텍스트 메시지, 이모지, 이미지 공유 지원
- 타이핑 표시기 및 읽음 확인 표시
- 메시지 기록 및 페이지네이션 구현
- 새 메시지에 대한 알림 제공
- 그룹 및 개인 메시징 지원

### 기술 지침
- **기술 선택**: 
  - WebSocket 연결을 위해 Supabase Realtime 사용
  - 더 고급 기능이 필요한 경우 Socket.io 또는 Firebase Realtime Database 고려
- **데이터베이스 스키마**:
  ```sql
  -- 메시지 테이블
  CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
  );
  
  -- 실시간 퍼블리케이션 생성
  BEGIN;
    DROP PUBLICATION IF EXISTS supabase_realtime;
    CREATE PUBLICATION supabase_realtime FOR TABLE messages;
  COMMIT;
  ```
- **컴포넌트 구조**:
  - `components/chat/`에 `ChatWindow` 컴포넌트 생성
  - `components/chat/`에 `MessageInput` 컴포넌트 생성
  - `components/chat/`에 `MessageList` 컴포넌트 생성
  - `components/chat/`에 `ChatNotification` 컴포넌트 생성

### 통합 지점
- 기존 `app/protected/chatting/` 경로 확장
- `app/protected/chatting/[roomId]/page.tsx`에 새 페이지 추가
- `app/api/messages/route.ts`에 새 API 엔드포인트 생성
- 실시간 구독을 지원하도록 `lib/supabase.ts`의 Supabase 클라이언트 업데이트

### 테스트 지침
- 실시간 메시지 전송 및 수신 테스트
- 다른 브라우저에서 여러 사용자로 테스트
- 오프라인 동작 및 재연결 테스트
- 다양한 메시지 유형(텍스트, 이미지) 테스트
- 채팅이 포커스되지 않았을 때 알림 테스트

## 2. 선호도와 히스토리가 있는 사용자 프로필

### 요구사항
- 개인 정보가 포함된 상세한 사용자 프로필 생성
- 사용자가 이벤트 및 모임에 대한 선호도 설정 가능
- 사용자 참여 기록 추적
- 프로필 개인 정보 설정 구현
- 프로필 사진 및 커스터마이징 지원
- 소셜 링크 및 개인 소개 추가

### 기술 지침
- **데이터베이스 스키마**:
  ```sql
  -- 사용자 프로필 테이블
  CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    privacy_setting SMALLINT DEFAULT 0
  );
  
  -- 사용자 선호도 테이블
  CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    preference_type TEXT NOT NULL,
    preference_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- 사용자 이벤트 기록 테이블
  CREATE TABLE user_event_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'attended'
  );
  ```
- **컴포넌트 구조**:
  - `components/profile/`에 `ProfileEditor` 컴포넌트 생성
  - `components/profile/`에 `PreferenceSelector` 컴포넌트 생성
  - `components/profile/`에 `EventHistory` 컴포넌트 생성
  - `components/profile/`에 `ProfileView` 컴포넌트 생성

### 통합 지점
- `app/protected/profile/`에 새 경로 추가
- `app/[username]/page.tsx`에 공개 프로필 보기 생성
- `app/api/profile/` 및 `app/api/preferences/`에 API 엔드포인트 생성
- 회원가입 시 프로필을 생성하도록 인증 흐름 업데이트

### 테스트 지침
- 프로필 생성 및 편집 테스트
- 선호도 설정 및 검색 테스트
- 개인 정보 설정 및 그 효과 테스트
- 다양한 권한 수준으로 프로필 보기 테스트
- 기록 추적 정확성 테스트

## 3. 만남 참가자를 위한 평가 시스템

### 요구사항
- 이벤트 후 사용자가 다른 참가자를 평가할 수 있도록 허용
- 숫자 평가(1-5점) 지원
- 선택적 텍스트 리뷰 허용
- 프로필에 평균 평점 계산 및 표시
- 부적절한 리뷰에 대한 신고 시스템 구현
- 관리자를 위한 중재 도구 생성

### 기술 지침
- **데이터베이스 스키마**:
  ```sql
  -- 평가 테이블
  CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rated_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(reviewer_id, rated_user_id, event_id)
  );
  
  -- 신고 테이블
  CREATE TABLE rating_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rating_id UUID REFERENCES ratings(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
  );
  ```
- **컴포넌트 구조**:
  - `components/ratings/`에 `RatingForm` 컴포넌트 생성
  - `components/ratings/`에 `RatingDisplay` 컴포넌트 생성
  - `components/ratings/`에 `RatingsSummary` 컴포넌트 생성
  - `components/ratings/`에 `ReportForm` 컴포넌트 생성

### 통합 지점
- `app/protected/events/[eventId]/rate/page.tsx`에 새 페이지 추가
- `app/api/ratings/` 및 `app/api/reports/`에 API 엔드포인트 생성
- 사용자 프로필에 평가 표시 통합
- 이벤트 완료 후 평가 프롬프트 추가

### 테스트 지침
- 평가 제출 및 유효성 검사 테스트
- 평균 평점 계산 테스트
- 신고 제출 및 처리 테스트
- 권한 테스트(참여 후에만 평가 허용)
- 중재 도구 및 조치 테스트

## 4. 인기 있는 소셜 미디어 플랫폼과의 통합

### 요구사항
- 소셜 미디어 계정으로 로그인 허용
- 소셜 미디어 플랫폼에서 이벤트 공유 가능
- 소셜 계정에서 프로필 정보 가져오기
- 소셜 미디어에 이벤트 참여 업데이트 게시
- 소셜 네트워크에서 친구를 이벤트에 초대
- 소셜 미디어 피드 위젯 구현

### 기술 지침
- **기술 선택**:
  - 소셜 인증을 위해 NextAuth.js 사용
  - 공유를 위한 소셜 미디어 SDK 구현(Facebook, Twitter, Instagram)
- **구성**:
  - 각 플랫폼에 대한 OAuth 자격 증명 설정
  - 콜백 URL 및 권한 구성
- **컴포넌트 구조**:
  - `components/auth/`에 `SocialLogin` 컴포넌트 생성
  - `components/social/`에 `SocialShare` 컴포넌트 생성
  - `components/social/`에 `SocialInvite` 컴포넌트 생성
  - `components/social/`에 `SocialFeed` 컴포넌트 생성

### 통합 지점
- 소셜 로그인을 지원하도록 `app/auth/`의 인증 흐름 업데이트
- 이벤트 페이지에 소셜 공유 버튼 추가
- 소셜 상호 작용을 위한 `app/api/social/` API 엔드포인트 생성
- 대시보드에 소셜 위젯 통합

### 테스트 지침
- 소셜 인증 흐름 테스트
- 각 플랫폼에서 공유 기능 테스트
- 권한 및 개인 정보 설정 테스트
- 소셜 초대 및 추적 테스트
- 다양한 소셜 계정 및 권한으로 테스트

## 5. 사용자 선호도에 기반한 이벤트 추천

### 요구사항
- 사용자 선호도 및 기록 분석
- 사용자 관심사에 기반한 이벤트 추천
- 추천 알고리즘 구현
- 개인화된 이벤트 제안 표시
- 사용자가 추천에 대한 피드백 제공 가능
- 추천 효과 추적

### 기술 지침
- **알고리즘 접근 방식**:
  - 추천을 위한 협업 필터링 구현
  - 이벤트 카테고리에 기반한 콘텐츠 기반 필터링 사용
  - 더 나은 결과를 위한 하이브리드 접근 방식 고려
- **데이터베이스 스키마**:
  ```sql
  -- 추천 피드백 테이블
  CREATE TABLE recommendation_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    is_relevant BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- 사용자-이벤트 상호작용 강도 테이블
  CREATE TABLE user_event_interactions (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_category TEXT NOT NULL,
    interaction_strength FLOAT DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, event_category)
  );
  ```
- **컴포넌트 구조**:
  - `lib/recommendations/`에 `RecommendationEngine` 서비스 생성
  - `components/events/`에 `RecommendedEvents` 컴포넌트 생성
  - `components/events/`에 `RecommendationFeedback` 컴포넌트 생성

### 통합 지점
- `app/protected/recommendations/page.tsx`에 새 페이지 추가
- `app/api/recommendations/`에 API 엔드포인트 생성
- 대시보드에 추천 통합
- 이벤트 브라우징 페이지에 추천 섹션 추가

### 테스트 지침
- 추천 품질 및 관련성 테스트
- 다양한 사용자 프로필 및 선호도로 테스트
- 피드백 수집 및 알고리즘 조정 테스트
- 대규모 데이터셋으로 성능 테스트
- 콜드 스타트 시나리오(신규 사용자) 테스트

## 6. 모바일 애플리케이션 버전

### 요구사항
- 반응형 모바일 인터페이스 생성
- PWA 기능을 사용하여 네이티브와 유사한 기능 구현
- 푸시 알림 지원
- 모바일 기기를 위한 성능 최적화
- 오프라인 기능 구현
- iOS 및 Android 플랫폼 모두 지원

### 기술 지침
- **기술 선택**:
  - 웹 기반 접근 방식을 위해 반응형 디자인이 있는 Next.js 사용
  - 완전한 네이티브 경험을 위해 React Native 고려
  - 웹 기반 접근 방식을 위한 PWA 기능 구현
- **모바일 특화 기능**:
  - 오프라인 지원을 위한 서비스 워커 구현
  - 푸시 알림 인프라 설정
  - 모바일에 최적화된 레이아웃 생성
- **컴포넌트 구조**:
  - `components/mobile/`에 모바일 특화 컴포넌트 생성
  - 기존 컴포넌트의 반응형 변형 구현
  - `NotificationHandler` 컴포넌트 생성

### 통합 지점
- 기존 레이아웃을 반응형으로 업데이트
- 필요한 경우 모바일 특화 경로 생성
- `public/sw.js`에 서비스 워커 구현
- 푸시 알림 등록을 위한 API 엔드포인트 생성

### 테스트 지침
- 다양한 모바일 기기 및 화면 크기에서 테스트
- 오프라인 기능 및 데이터 동기화 테스트
- 다양한 플랫폼에서 푸시 알림 테스트
- 성능 및 배터리 사용량 테스트
- 터치 상호작용 및 모바일 제스처 테스트

## 구현 우선순위

권장 구현 순서:

1. **실시간 채팅 기능** - 사용자 참여를 향상시키는 핵심 기능
2. **선호도와 히스토리가 있는 사용자 프로필** - 개인화 기능의 기반
3. **만남 참가자를 위한 평가 시스템** - 커뮤니티 신뢰 구축
4. **사용자 선호도에 기반한 이벤트 추천** - 프로필을 활용하여 사용자 경험 향상
5. **인기 있는 소셜 미디어 플랫폼과의 통합** - 도달 범위 확장 및 온보딩 간소화
6. **모바일 애플리케이션 버전** - 플랫폼 접근성 확장

## 개발 프로세스 지침

### 코드 품질 표준
- 적절한 타이핑을 통한 TypeScript 모범 사례 준수
- 모든 새 컴포넌트 및 서비스에 대한 단위 테스트 작성
- 프로젝트의 ESLint 및 Prettier 구성을 사용하여 일관된 코드 스타일 유지
- JSDoc 주석으로 모든 새 컴포넌트 및 함수 문서화
- 기존 컴포넌트 구조 및 명명 규칙 준수

### 국제화
- 모든 사용자 대면 문자열을 `messages/`의 번역 파일에 추가
- 모든 새 기능에 대해 영어와 한국어 모두 지원
- 하드코딩된 문자열 대신 번역 키 사용
- 두 언어로 모든 기능 테스트

### 성능 고려사항
- 적절한 인덱스로 데이터베이스 쿼리 최적화
- 대규모 데이터 세트에 대한 페이지네이션 구현
- 데이터 가져오기 및 캐싱을 위해 React Query 또는 SWR 사용
- 이미지 및 무거운 컴포넌트에 대한 지연 로딩 구현
- 번들 크기 모니터링 및 최적화

### 보안 지침
- 적절한 인증 및 권한 부여 검사 구현
- XSS 공격을 방지하기 위한 사용자 입력 정화
- 데이터베이스 보안을 위한 Supabase RLS 정책 사용
- API 엔드포인트에 대한 속도 제한 구현
- OWASP 보안 모범 사례 준수

## 산출물

각 기능에 대해 다음과 같은 산출물이 예상됩니다:

1. 데이터베이스 스키마 변경(SQL 스크립트)
2. 새 컴포넌트 및 페이지
3. API 엔드포인트 및 서비스
4. 단위 및 통합 테스트
5. 문서 업데이트
6. 국제화 업데이트

## 결론

이 작업 지침은 Seoul FestivMeet를 위한 여섯 가지 새로운 기능을 구현하기 위한 포괄적인 가이드를 제공합니다. 각 기능은 성공적인 구현을 보장하기 위해 상세한 요구사항, 기술 지침, 통합 지점 및 테스트 지침으로 세분화되었습니다.

사용자 경험에 대한 각 기능의 영향을 최대화하기 위해 우선순위 순서를 따르세요. 정기적인 코드 리뷰와 테스트는 코드 품질을 유지하고 기능이 요구사항을 충족하는지 확인하는 데 도움이 될 것입니다.