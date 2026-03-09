import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'eslehoon' && password === 'Rkddkwl753@@') {
      onLoginSuccess();
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onCancel}></div>
      <div className="relative w-full max-w-md bg-neutral-950 border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12">
        <h2 className="text-3xl font-black tracking-tighter mb-2 uppercase text-white">Admin Login</h2>
        <p className="text-white/50 text-sm mb-8">관리자 계정으로 로그인하세요.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all"
              placeholder="아이디를 입력하세요"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          
          {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
          
          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-white transition-all"
            >
              취소
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-black transition-all"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
