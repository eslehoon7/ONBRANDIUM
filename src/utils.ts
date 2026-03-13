export const getDirectImageUrl = (url: string): string => {
  if (!url) return url;
  
  // Handle various Google Drive link formats
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=|uc\?export=view&id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // 모바일(Safari/Chrome)에서 drive.google.com/uc 링크가 서드파티 쿠키/리다이렉트 문제로 
    // 차단되는(CORS) 현상을 방지하기 위해 Google의 이미지 전용 CDN(lh3) 엔드포인트를 사용합니다.
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  
  return url;
};
