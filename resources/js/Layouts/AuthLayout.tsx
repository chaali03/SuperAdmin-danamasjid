import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background biru di kiri */}
      <div className="absolute left-0 top-0 h-full w-1/2 bg-blue-600"></div>
      
      {/* Background kuning cerah di kanan */}
      <div className="absolute right-0 top-0 h-full w-1/2 bg-[#FFC107]"></div>

      {/* Card putih di tengah */}
      <div className="relative z-10 w-full max-w-xl px-6 py-8">
        {children}
      </div>
    </div>
  );
}
