
import { PortfolioItem, SiteConfig } from './types';

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    title: '삼성전자 글로벌 쇼케이스',
    category: '랜딩홈페이지',
    imageUrl: 'https://picsum.photos/seed/samsung/1200/800',
    description: '최첨단 기술력을 직관적이고 미학적인 인터페이스로 구현한 글로벌 통합 웹 플랫폼',
    fullImageUrl: '',
    mobileImageUrl: ''
  },
  {
    id: '2',
    title: '루시엔 럭셔리 쥬얼리',
    category: '랜딩홈페이지',
    imageUrl: 'https://picsum.photos/seed/jewelry/1200/800',
    description: '고급스러운 텍스처와 절제된 여백미를 강조한 하이엔드 온라인 부티크',
    fullImageUrl: '',
    mobileImageUrl: ''
  },
  {
    id: '3',
    title: '넥스트 테크 허브',
    category: '자동화기록',
    imageUrl: 'https://picsum.photos/seed/tech/1200/800',
    description: '복잡한 데이터를 시각화하여 비즈니스 통찰력을 제공하는 엔터프라이즈 플랫폼',
    fullImageUrl: '',
    mobileImageUrl: ''
  },
  {
    id: '4',
    title: '아틀리에 미학 웹진',
    category: '자동화알림',
    imageUrl: 'https://picsum.photos/seed/magazine/1200/800',
    description: '타이포그래피의 변주와 역동적인 레이아웃으로 예술적 가치를 전달하는 웹진',
    fullImageUrl: '',
    mobileImageUrl: ''
  },
  {
    id: '5',
    title: '플랜피아',
    category: '자동화알림',
    imageUrl: 'https://picsum.photos/seed/planpia/1200/800',
    description: '비즈니스의 모든 접점을 유기적으로 연결하는 정교한 자동화 알고리즘으로, 효율 그 이상의 가치를 디자인한 플랜피아의 인텔리전트 알림 솔루션입니다.',
    fullImageUrl: '',
    mobileImageUrl: ''
  }
];

export const DEFAULT_CONFIG: SiteConfig = {
  siteTitle: '온브랜디움 | 프리미엄 디지털 에이전시',
  heroMainText: '브랜드, 이제 움직일 차례입니다.',
  heroSubText: '우리는 평범함을 거부하고, 감각적인 비주얼과 압도적인 기술력으로 당신의 비즈니스를 새로운 차원으로 이끕니다.',
  primaryColor: '#000000',
  accentColor: '#00E5FF',
  fontFamily: 'Pretendard',
  companyName: 'ONBRANDIUM',
  contactEmail: 'sinanoapple@naver.com',
  instagramUrl: 'https://instagram.com',
  kakaoUrl: 'https://kakao.com',
  logoUrl: 'https://lh3.googleusercontent.com/d/1l6FzOa7qIbnjz9M2-tmSPPjwvPKadIFE'
};
