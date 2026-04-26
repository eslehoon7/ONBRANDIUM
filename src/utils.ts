export const getDirectImageUrl = (url: string): string => {
  if (!url) return url;
  
  // Handle various Google Drive link formats
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=|uc\?export=view&id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // Google Drive 링크를 이미지 태그에 직접 사용할 수 있는 형태로 변환합니다.
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  
  return url;
};
