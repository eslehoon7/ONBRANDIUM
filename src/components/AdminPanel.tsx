import React, { useState } from 'react';
import { PortfolioItem, SiteConfig } from '../types';
import { GoogleGenAI } from '@google/genai';
import { db, storage } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Upload, Plus, Trash2, Edit2, X, Sparkles } from 'lucide-react';

interface AdminPanelProps {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  portfolio: PortfolioItem[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
  onClose: () => void;
}

export default function AdminPanel({ config, setConfig, portfolio, setPortfolio, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'portfolio'>('config');
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPortfolio = async () => {
    const newItem: Omit<PortfolioItem, 'id'> = {
      title: '새 프로젝트',
      category: '랜딩홈페이지',
      imageUrl: 'https://picsum.photos/seed/new/1200/800',
      description: '프로젝트 설명을 입력하세요.',
    };

    try {
      const docRef = await addDoc(collection(db, 'portfolio'), newItem);
      const itemWithId = { ...newItem, id: docRef.id };
      setPortfolio((prev) => [...prev, itemWithId]);
      setEditingItem(itemWithId);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("포트폴리오 추가 중 오류가 발생했습니다.");
    }
  };

  const handleUpdatePortfolioItem = async (updatedItem: PortfolioItem) => {
    try {
      const itemRef = doc(db, 'portfolio', updatedItem.id);
      await updateDoc(itemRef, {
        title: updatedItem.title,
        category: updatedItem.category,
        imageUrl: updatedItem.imageUrl,
        description: updatedItem.description,
      });
      setPortfolio((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("포트폴리오 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'portfolio', id));
        setPortfolio((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("포트폴리오 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, item: PortfolioItem) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setEditingItem({ ...item, imageUrl: downloadURL });
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingImage(false);
    }
  };

  const generateAiDescription = async (item: PortfolioItem) => {
    if (!process.env.GEMINI_API_KEY) {
      alert('Gemini API 키가 설정되지 않았습니다.');
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `다음 프로젝트에 대한 매력적이고 전문적인 설명을 1~2문장으로 작성해주세요.
      프로젝트 이름: ${item.title}
      카테고리: ${item.category}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      if (response.text) {
        setEditingItem({ ...item, description: response.text.trim() });
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert('설명 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">관리자 패널</h1>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            홈페이지로 돌아가기
          </button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeTab === 'config' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            기본 설정
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeTab === 'portfolio' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            포트폴리오 관리
          </button>
        </div>

        {activeTab === 'config' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">기본 정보</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사이트 제목</label>
                <input
                  type="text"
                  name="siteTitle"
                  value={config.siteTitle}
                  onChange={handleConfigChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
                <input
                  type="text"
                  name="companyName"
                  value={config.companyName}
                  onChange={handleConfigChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처 이메일</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={config.contactEmail}
                  onChange={handleConfigChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">메인 섹션 (Hero)</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">메인 텍스트</label>
                <input
                  type="text"
                  name="heroMainText"
                  value={config.heroMainText}
                  onChange={handleConfigChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">서브 텍스트</label>
                <textarea
                  name="heroSubText"
                  value={config.heroSubText}
                  onChange={handleConfigChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">프로젝트 목록</h2>
              <button
                onClick={handleAddPortfolio}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={18} />
                새 프로젝트 추가
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden group">
                  <div className="aspect-video relative bg-gray-100">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeletePortfolio(item.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-medium text-gray-500 mb-1">{item.category}</div>
                    <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">프로젝트 편집</h3>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트명</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  >
                    <option value="랜딩홈페이지">랜딩홈페이지</option>
                    <option value="자동화기록">자동화기록</option>
                    <option value="자동화알림">자동화알림</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지</label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={editingItem.imageUrl}
                        onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none mb-2"
                        placeholder="이미지 URL 입력 또는 파일 업로드"
                      />
                      <label className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <Upload size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {uploadingImage ? '업로드 중...' : '이미지 파일 업로드'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, editingItem)}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                    {editingItem.imageUrl && (
                      <div className="w-32 aspect-video bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                        <img src={editingItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">프로젝트 설명</label>
                    <button
                      onClick={() => generateAiDescription(editingItem)}
                      disabled={isGenerating}
                      className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                    >
                      <Sparkles size={14} />
                      {isGenerating ? '생성 중...' : 'AI로 설명 생성'}
                    </button>
                  </div>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => handleUpdatePortfolioItem(editingItem)}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    저장하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
