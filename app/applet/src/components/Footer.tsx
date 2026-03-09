import React from 'react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
  viewMode: 'public' | 'admin';
  onToggleViewMode: () => void;
}

export default function Footer({ config, viewMode, onToggleViewMode }: FooterProps) {
  return (
    <footer className="bg-black text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">{config.companyName}</h2>
          <p className="text-gray-400 mb-2">프리미엄 디지털 에이전시</p>
          <p className="text-gray-400">서울특별시 강남구 테헤란로</p>
          <button 
            onClick={onToggleViewMode}
            className="mt-4 text-gray-400 hover:text-white transition-colors text-sm"
          >
            {viewMode === 'public' ? '관리자 모드' : '퍼블릭 모드'}
          </button>
        </div>
        <div className="md:text-right">
          <h3 className="text-lg font-semibold mb-4">Inquiries</h3>
          <p className="text-gray-400 mb-4">{config.contactEmail}</p>
          <div className="flex md:justify-end gap-4">
            <a href={config.instagramUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
              Instagram
            </a>
            <a href={config.kakaoUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
              Kakao
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} {config.companyName}. All rights reserved.
      </div>
    </footer>
  );
}
