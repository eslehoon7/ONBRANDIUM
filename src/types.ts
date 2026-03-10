export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  fullImageUrl?: string;
  mobileImageUrl?: string;
}

export interface SiteConfig {
  siteTitle: string;
  heroMainText: string;
  heroSubText: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  companyName: string;
  contactEmail: string;
  instagramUrl: string;
  kakaoUrl: string;
  logoUrl: string;
}
