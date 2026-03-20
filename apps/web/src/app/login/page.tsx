"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login({ email, password });
      if (response && response.success) {
        router.push(response.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
      } else {
        setError('Invalid institutional credentials.');
      }
    } catch (err) {
      setError('System authentication failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -z-10 -top-12 -left-12 w-48 h-48 bg-primary-container/5 blur-3xl rounded-full"></div>
      <div className="absolute -z-10 -bottom-12 -right-12 w-64 h-64 bg-tertiary/5 blur-3xl rounded-full"></div>

      <main className="w-full max-w-md relative">
        {/* Brand Identity */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-black tracking-tighter text-tertiary mb-2 cursor-pointer">GrievanceGrid</h1>
          </Link>
          <p className="text-sm font-medium uppercase tracking-widest text-on-surface-variant opacity-70">Institutional Suite</p>
        </div>

        {/* Authentication Modal Card */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/15 shadow-2xl overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-outline-variant/10">
            <button className="flex-1 py-4 text-sm font-bold tracking-tight text-tertiary border-b-2 border-primary-container bg-surface-container transition-all">
              LOG IN
            </button>
            <button className="flex-1 py-4 text-sm font-medium tracking-tight text-on-surface-variant opacity-60 hover:opacity-100 transition-all">
              SIGN UP
            </button>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-on-surface tracking-tight">Welcome Back</h2>
              <p className="text-sm text-on-surface-variant mt-1">Please enter your credentials to access the grid.</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              {error && (
                <div className="bg-error-container/10 border border-error/20 p-3 rounded-lg text-error text-[11px] font-bold uppercase tracking-wider text-center">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-tertiary opacity-80 px-1">Institutional Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm group-focus-within:text-primary-container transition-colors">alternate_email</span>
                  <input 
                    className="w-full bg-surface-container-highest border-0 border-b border-outline-variant/30 px-10 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 focus:border-primary-container transition-all rounded-t-lg outline-none" 
                    placeholder="name@grievancegrid.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary opacity-80">Access Key</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm group-focus-within:text-primary-container transition-colors">lock</span>
                  <input 
                    className="w-full bg-surface-container-highest border-0 border-b border-outline-variant/30 px-10 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 focus:border-primary-container transition-all rounded-t-lg outline-none" 
                    placeholder="••••••••••••" 
                    type="password"
                    value={password}
                     onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm cursor-pointer hover:text-on-surface">visibility</span>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                className="w-full primary-gradient text-on-primary font-bold py-3.5 rounded-lg shadow-lg shadow-primary-container/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50" 
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}</span>
                <span className="material-symbols-outlined text-lg">login</span>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="h-px flex-1 bg-outline-variant/20"></div>
              <span className="text-[10px] font-black tracking-widest text-on-surface-variant opacity-40 uppercase">Or Continue With</span>
              <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
            </div>

            {/* SSO Integration */}
            <div className="space-y-3">
              <button className="w-full bg-surface-container border border-outline-variant/15 text-on-surface font-semibold py-3 rounded-lg hover:bg-surface-container-high transition-all flex items-center justify-center gap-3 active:translate-y-px">
                <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuANm2kMd1VicAdF-VQL74-s4tuNxLYOQQY5n62M3CzeknpQQW0M8frV7SgmCvpoZhNzEJ0kP7ngLIxFd6r3dVktT7bGbZhajCh56cyK8FAmvQyr3BFLeG1bmjnCaHcvvb7T0zjX5Tr4XYXF2IgqXy4hnFQ7nOWSzo88FPzzeoYFhXdDAGG80ZgjTnY9oWwoNF4wvUntzhRpHDpXwJJaYbR0prsrIXxJR-HhU36tWi13M2hRT_gJSnQQv2PCfaOhK_ISlxt0Hn6DpQ70" alt="Google" className="w-full h-full object-contain" />
                </div>
                <span className="text-sm tracking-tight">Sign in with Google Workspace</span>
              </button>
            </div>
          </div>

          {/* Footer Section */}
          <div className="px-8 py-5 bg-surface-container-lowest/50 border-t border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-60">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Secure Tier III</span>
            </div>
            <div className="flex gap-4">
              <a className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant hover:text-tertiary transition-colors" href="#">Privacy</a>
              <a className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant hover:text-tertiary transition-colors" href="#">Help</a>
            </div>
          </div>
        </div>

        {/* System Message */}
        <div className="mt-8 text-center px-4">
          <p className="text-[11px] font-medium leading-relaxed text-on-surface-variant/50 max-w-xs mx-auto">
            Authorized personnel only. All access attempts are logged and monitored by the GrievanceGrid internal security protocol.
          </p>
        </div>
      </main>
    </div>
  );
}
