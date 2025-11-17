# Global Happiness Explorer (글로벌 행복 탐색기)

World Happiness Report 데이터(2015-2023)를 활용하여 사용자가 개인의 가치관에 따라 행복을 재정의할 수 있는 인터랙티브 데이터 시각화 대시보드입니다.

## 🎯 프로젝트 개요

이 프로젝트는 행복을 획일적인 기준으로 측정할 수 있다는 개념에 도전합니다. 대신, 사용자가 다음을 할 수 있도록 합니다:

- **행복 기준 커스터마이징** - 6가지 핵심 요인의 가중치를 조정
- **국가별 순위 탐색** - 개인의 우선순위에 따라 변화하는 순위 확인
- **관계 시각화** - GDP, 행복, 기타 요인 간의 관계 파악
- **시간별 변화 추적** - 2015년부터 2023년까지의 변화 관찰

## 📊 주요 기능

### 1. 인터랙티브 세계지도 (2D/3D)
- **2D 지도 (WorldMap)**: Mercator 투영 기반 평면 지도, D3.js 렌더링
- **3D 지구본 (Globe3D)**: WebGL 기반 회전 가능한 지구본, Three.js 렌더링
- 행복 점수에 따른 국가별 색상 코딩 (그라데이션)
- 호버 시 국가명 + 점수 표시 툴팁
- 클릭하여 국가 상세 정보 패널 열기
- 연도 변경 시 부드러운 색상 전환 애니메이션

### 2. 가중치 조절 패널
- 6가지 행복 요인 조정 (0-100%):
  - GDP per Capita (1인당 GDP)
  - Social Support (사회적 지지)
  - Healthy Life Expectancy (건강 수명)
  - Freedom (자유)
  - Generosity (관대함)
  - Corruption Perception (부패 인식)
- 3가지 프리셋 구성 (동일 가중치, 자유 중시, 건강 중시)
- 실시간 시각적 피드백

### 3. 타임라인 컨트롤
- 연도 슬라이더 (2015-2023)
- 재생/일시정지 애니메이션
- 0.9초 간격의 부드러운 연도 전환

### 4. 국가 상세 패널
- 시간에 따른 행복 추세를 보여주는 라인 차트
- 요인별 분포를 표시하는 레이더 차트
- 전년 대비 변화 지표
- 원본 점수와 개인화된 점수 비교

### 5. 다중 뷰 시스템
- **Region 뷰**: 2D/3D 전환 가능한 지리적 시각화 (WorldMap + Globe3D)
- **Scatter 뷰**: GDP vs 행복 산점도 - 부와 행복의 상관관계 탐색
- **Trends 뷰**: 시간별 행복 추세 라인 차트 - 국가별 비교 분석
- **Distribution 뷰**: 전체 국가의 행복 점수 분포 히스토그램
- **Rankings 사이드바**: 변화 지표가 포함된 정렬 가능한 실시간 순위표

### 6. 개인화된 점수 계산
**실시간 가중치 기반 점수 재계산 시스템:**

- **동적 점수 계산**: 슬라이더 조정 시 모든 국가의 점수를 즉시 재계산
- **가중치 반영**: 사용자가 설정한 가중치(GDP 40%, 자유 20% 등)로 개인화된 순위 생성
- **실시간 업데이트**: 가중치 변경 즉시 지도/순위/차트 모두 동기화 업데이트
- **원본 점수 비교**: 국가 상세 패널에서 원본 vs 개인화 점수 비교 가능

## 🚀 시작하기

### 필수 요구사항
- Node.js (v16 이상)
- npm

### 설치 방법

```bash
# 의존성 패키지 설치
npm install

# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 빌드 미리보기
npm run preview
```

애플리케이션은 `http://localhost:5174/`에서 실행됩니다.

## 📁 프로젝트 구조

```
proj1/
├── public/
│   └── data.csv                  # World Happiness Report 데이터 (2015-2023)
├── src/
│   ├── components/
│   │   ├── WorldMap.jsx          # 2D 인터랙티브 세계지도 (D3.js + TopoJSON)
│   │   ├── Globe3D.jsx           # 3D 지구본 시각화 (Three.js + React Three Fiber)
│   │   ├── WeightControls.jsx    # 6가지 행복 요인 가중치 슬라이더
│   │   ├── Timeline.jsx          # 연도 슬라이더 + 재생/일시정지 컨트롤
│   │   ├── CountryDrawer.jsx     # 국가 상세 정보 사이드 패널
│   │   ├── TrendsChart.jsx       # 시간별 행복 추세 라인 차트 (Recharts)
│   │   ├── DistributionChart.jsx # 요인별 분포 레이더 차트 (Recharts)
│   │   ├── RankingTable.jsx      # 국가 순위 테이블 (정렬, 변화 지표)
│   │   └── ScatterPlot.jsx       # GDP vs 행복 산점도 (Recharts)
│   ├── utils/
│   │   ├── dataLoader.js         # CSV 파싱 및 데이터 로딩 (D3 DSV)
│   │   └── scoreCalculator.js    # 개인화된 행복 점수 계산 로직
│   ├── App.jsx                   # 메인 애플리케이션 + 상태 관리
│   ├── main.jsx                  # React 진입점
│   └── index.css                 # 글로벌 스타일
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🧮 작동 원리

### 개인화된 점수 계산

1. **정규화**: 각 요인을 0-1 범위로 정규화
   ```
   normalized_value = (value - min) / (max - min)
   ```

2. **가중합**: 사용자 정의 가중치 적용
   ```
   weighted_sum = Σ(normalized_value_i × weight_i)
   ```

3. **스케일링**: 0-10 범위로 변환
   ```
   personalized_score = (weighted_sum / total_weight) × 10
   ```

### 데이터 구조

데이터셋은 전 세계 약 150개국의 9년간(2015-2023) 데이터를 포함하며, 다음과 같은 주요 필드가 있습니다:

- `Country`: 국가명
- `Year`: 연도 (2015-2023)
- `Happiness_Score`: 원본 행복 점수 (0-10)
- `GDP_per_Capita`: 경제적 번영 지표
- `Social_Support`: 커뮤니티 지원 척도
- `Healthy_Life_Expectancy`: 건강과 장수
- `Freedom`: 개인의 자유 지수
- `Generosity`: 자선 기부 척도
- `Corruption_Perception`: 기관에 대한 신뢰

## 🎨 디자인 원칙

1. **사용자 중심**: 모든 인터랙션이 사용자의 이해를 우선시
2. **실시간 피드백**: 입력 변경에 대한 즉각적인 시각적 반응
3. **부드러운 애니메이션**: 더 나은 UX를 위한 400-600ms 전환 효과
4. **반응형 레이아웃**: 콘텐츠에 맞춰 조정되는 그리드 기반 레이아웃
5. **접근성**: 명확한 레이블, 툴팁, 색상 대비

## 🔍 탐색할 수 있는 주요 인사이트

1. **가치 트레이드오프**: 자유와 GDP 중 무엇을 우선시하느냐에 따라 순위가 어떻게 변하는가?
2. **GDP 역설**: 어떤 국가들이 적당한 GDP로 높은 행복을 달성하는가?
3. **시간적 추세**: 2015-2023년간 글로벌 행복은 어떻게 진화했는가?
4. **요인 간 상관관계**: 어떤 요인이 행복과 가장 강한 상관관계를 보이는가?

## 🛠️ 기술 스택

### 프레임워크 & 빌드 도구
- **React 18.2** - UI 라이브러리, 컴포넌트 기반 아키텍처
- **Vite 5.0** - 빠른 개발 서버 및 빌드 도구 (ESM 기반)

### 데이터 시각화
- **D3.js 7.8** - 2D 세계지도 렌더링, CSV 파싱, 지리 데이터 프로젝션
- **D3-Geo** - Mercator 프로젝션, 지리 좌표 변환
- **TopoJSON Client 3.1** - 경량화된 세계지도 지리 데이터
- **Recharts 2.10** - 선언적 차트 라이브러리 (라인, 레이더, 산점도)

### 3D 렌더링
- **Three.js 0.181** - WebGL 기반 3D 그래픽 엔진
- **React Three Fiber 8.18** - React용 Three.js 렌더러
- **React Three Drei 10.7** - Three.js용 유틸리티 컴포넌트 (카메라, 조명, 컨트롤)
- **Earcut 3.0** - 폴리곤 삼각 분할 (3D 지형 생성)

### 애니메이션 & UX
- **Framer Motion 10.16** - 부드러운 전환 효과 및 애니메이션 (400-600ms)

### 유틸리티
- **Lodash** - 데이터 변환 및 유틸리티 함수
- **Clsx** - 조건부 CSS 클래스 관리

## 🏗️ 아키텍처 설계

### 컴포넌트 구조
```
상태 관리 (App.jsx)
    ├── 지도 뷰 레이어
    │   ├── WorldMap (2D) - D3.js + TopoJSON
    │   └── Globe3D (3D) - Three.js + R3F
    ├── 컨트롤 레이어
    │   ├── WeightControls - 6가지 요인 슬라이더
    │   └── Timeline - 연도 + 재생 컨트롤
    ├── 분석 뷰 레이어
    │   ├── RankingTable - 국가 순위
    │   └── ScatterPlot - GDP vs 행복
    └── 상세 정보 레이어
        └── CountryDrawer
            ├── TrendsChart - 시간별 추세
            └── DistributionChart - 요인별 분포
```

### 데이터 흐름
```
CSV 로딩 → 파싱 (D3 DSV) → 정규화 → 상태 저장
                                      ↓
사용자 입력 (가중치/연도) → 재계산 → 리렌더링
                                      ↓
컴포넌트별 최적화된 데이터 구조 전달
```

### 성능 최적화
- **메모이제이션**: 점수 계산 결과 캐싱
- **지연 로딩**: 3D 지구본 선택 시 동적 렌더링
- **애니메이션 최적화**: 400-600ms 부드러운 전환
- **TopoJSON 경량화**: GeoJSON 대비 ~80% 용량 절감

---

**참고**: 데이터는 World Happiness Report에서 가져온 실제 데이터를 기반으로 합니다.
