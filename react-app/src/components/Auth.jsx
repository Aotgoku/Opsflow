import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const response = await api.post(endpoint, payload);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col items-center justify-center p-lg font-body-md text-body-md text-on-surface antialiased">
      <main className="w-full max-w-[400px]">
        {/* Brand / Logo */}
        <div className="flex flex-col items-center justify-center gap-sm mb-xl">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-fixed rounded-lg text-primary mb-sm">
            <span className="material-symbols-outlined text-2xl fill" data-icon="view_kanban">view_kanban</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-black tracking-tight">DevFlow Ops</h1>
        </div>
        
        {/* Login Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-xl">
          <div className="mb-lg text-center">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-base">{isLogin ? 'Log in to your account' : 'Create an account'}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{isLogin ? 'Enter your email and password to continue' : 'Sign up to get started with DevFlow Ops'}</p>
          </div>
          
          {error && <div className="mb-4 p-3 bg-error-container text-error rounded-md text-sm text-center">{error}</div>}
          
          <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
            {/* Name Field (Only on Sign Up) */}
            {!isLogin && (
              <div className="flex flex-col gap-base">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="name">Full Name</label>
                <input 
                  className="h-10 px-sm border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  id="name" 
                  placeholder="John Doe" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            
            {/* Email Field */}
            <div className="flex flex-col gap-base">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="email">Email address</label>
              <input 
                className="h-10 px-sm border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                id="email" 
                placeholder="name@company.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Password Field */}
            <div className="flex flex-col gap-base">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                {isLogin && <a className="font-body-sm text-body-sm text-primary hover:text-on-primary-fixed-variant hover:underline transition-colors" href="#">Forgot password?</a>}
              </div>
              <input 
                className="h-10 px-sm border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                id="password" 
                placeholder="••••••••" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {/* Remember Me */}
            <div className="flex items-center gap-sm mt-xs">
              <input 
                className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary/20 cursor-pointer" 
                id="remember" 
                type="checkbox" 
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="remember">Remember me for 30 days</label>
            </div>
            
            {/* Submit Button */}
            <button 
              className="mt-sm h-10 w-full flex items-center justify-center gap-2 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-60" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>{isLogin ? 'Logging in…' : 'Creating account…'}</>
              ) : (
                isLogin ? 'Log in' : 'Sign up'
              )}
            </button>
          </form>
        </div>
        
        {/* Switch to Signup / Login */}
        <div className="mt-lg text-center font-body-sm text-body-sm text-on-surface-variant">
          {isLogin ? (
            <>Don't have an account? <button type="button" onClick={() => {setIsLogin(false); setError('');}} className="text-primary hover:text-on-primary-fixed-variant hover:underline font-medium transition-colors">Sign up</button></>
          ) : (
            <>Already have an account? <button type="button" onClick={() => {setIsLogin(true); setError('');}} className="text-primary hover:text-on-primary-fixed-variant hover:underline font-medium transition-colors">Log in</button></>
          )}
        </div>
      </main>
    </div>
  );
}
