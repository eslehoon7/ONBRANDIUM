import React, { useState } from 'react';
import { SiteConfig } from '../types';

interface ContactFormProps {
  config: SiteConfig;
}

const ContactForm: React.FC<ContactFormProps> = ({ config }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // n8n Webhook URL — 아래 주소를 실제 n8n Webhook URL로 교체하세요
  const N8N_WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL';

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '');
    setName(filteredValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    let formattedValue = onlyNums;
    if (onlyNums.length <= 3) {
      formattedValue = onlyNums;
    } else if (onlyNums.length <= 7) {
      formattedValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    } else {
      formattedValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    }
    setPhone(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    setIsSubmitting(true);

    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
          submittedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
        })
      });
    } catch (err) {
      console.error('전송 오류:', err);
    }

    setIsSubmitting(false);
    setShowModal(true);
    setIsSuccess(true);
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto bg-neutral-900/30 p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block ml-1">성명</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                required
                placeholder="홍길동"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-cyan-400 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block ml-1">연락처</label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                required
                maxLength={13}
                placeholder="010-0000-0000"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-cyan-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block ml-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@onbrandium.com"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-cyan-400 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block ml-1">프로젝트 내용</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="제작하시려는 웹사이트의 목적과 상세 내용을 입력해주세요."
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-cyan-400 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full py-5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2
              ${isSuccess ? 'bg-[#1DB978] text-white cursor-default text-lg' : 'hover:scale-[1.02] active:scale-[0.98] text-lg font-black'}`}
            style={!isSuccess ? { backgroundColor: config.accentColor, color: '#000' } : {
              boxShadow: '0 10px 30px -10px rgba(29, 185, 120, 0.5)'
            }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                보내는중...
              </>
            ) : isSuccess ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                접수 완료되었습니다. 감사합니다.
              </>
            ) : (
              '문의 보내기'
            )}
          </button>
        </form>
      </div>

      {/* 접수 완료 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-cyan-400/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">접수 완료</h3>
            <p className="text-white/60 text-sm mb-8">문의가 성공적으로 접수되었습니다.</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-xl font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactForm;
