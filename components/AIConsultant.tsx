
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SiteConfig } from '../types';

interface AIConsultantProps {
  config: SiteConfig;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    {role: 'ai', text: '안녕하세요! 온브랜디움의 AI 브랜드 컨설턴트입니다.\n\n브랜드의 디지털 가치를 높이는 전략이나 웹사이트 제작에 대해 궁금하신 점이 있으신가요?\n\n편하게 말씀해 주시면 상세히 안내해 드리겠습니다.'}
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // In Vite with the 'define' config, we access it globally
      const apiKey = (window as any).process?.env?.API_KEY || (process.env as any).API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `당신은 프리미엄 웹 디자인 에이전시 '온브랜디움(Onbrandium)'의 수석 브랜드 컨설턴트입니다. 

문장 구성 및 가독성 규칙을 반드시 준수하세요:
1. 전문적이고 정중하며 절제된 언어를 사용하세요.
2. 답변이 길어질 경우, 반드시 3~4문장마다 한 줄을 비워(빈 줄 삽입) 가독성을 확보하세요.
3. 목록이나 번호를 사용할 때는 줄 바꿈을 명확히 하여 좌측 정렬이 흐트러지지 않게 하세요.
4. 모든 답변은 좌측 정렬을 기준으로 작성하며, 불필요하게 문장을 잇지 말고 핵심 위주로 끊어서 답변하세요.
5. 비용 문의 시: '프로젝트의 규모와 사양에 따라 맞춤 견적을 제공해 드립니다. 상세한 상담을 원하시면 하단의 Contact 폼을 작성해 주세요.'라고 답변하세요.`,
          temperature: 0.7,
        },
      });

      const aiText = response.text || "죄송합니다. 메시지를 처리하는 중 오류가 발생했습니다.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "서버와의 연결이 원활하지 않습니다.\n\n잠시 후 다시 시도해 주시기 바랍니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      {isOpen ? (
        <div className="w-[380px] h-[550px] bg-neutral-900/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: config.accentColor }}></div>
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-50" style={{ backgroundColor: config.accentColor }}></div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xs tracking-widest text-white/90">AI CONSULTANT</span>
                <span className="text-[10px] text-white/40 uppercase tracking-tighter">Onbrandium Intelligence</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-[1.6] whitespace-pre-wrap text-left ${m.role === 'user' ? 'bg-white text-black font-semibold rounded-tr-none' : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>
          <div className="p-5 bg-black/20 border-t border-white/5">
            <div className="relative flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="브랜드에 대해 무엇이든 물어보세요..." className="flex-1 bg-neutral-800/50 border border-white/10 rounded-2xl px-5 py-3.5 text-xs outline-none focus:border-cyan-400/50 transition-all placeholder:text-white/20" />
              <button onClick={handleSendMessage} disabled={!input.trim() || isLoading} className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-20 disabled:scale-100" style={{ backgroundColor: config.accentColor }}>
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl hover:scale-110 hover:-rotate-3 active:scale-95 transition-all group relative overflow-hidden" style={{ backgroundColor: config.accentColor }}>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <div className="absolute inset-0 rounded-[1.5rem] animate-ping opacity-20 pointer-events-none" style={{ backgroundColor: config.accentColor }}></div>
          <svg className="w-8 h-8 text-black relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </div>
  );
};

export default AIConsultant;
