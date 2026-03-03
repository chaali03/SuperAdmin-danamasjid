import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-emerald-500 to-teal-600 lg:flex lg:flex-col lg:justify-center lg:px-12">
        <div className="mx-auto max-w-md text-white">
          <h1 className="mb-4 text-5xl font-bold">Dana Masjid</h1>
          <p className="mb-8 text-xl text-emerald-50">
            Platform Super Admin untuk mengelola dana masjid dengan mudah dan
            transparan
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Kelola Dana Transparan</h3>
                <p className="text-sm text-emerald-50">
                  Pantau semua transaksi dana masjid secara real-time
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Laporan Lengkap</h3>
                <p className="text-sm text-emerald-50">
                  Dashboard analitik dan laporan keuangan detail
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Keamanan Terjamin</h3>
                <p className="text-sm text-emerald-50">
                  Data terenkripsi dengan standar keamanan tinggi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full items-center justify-center bg-gray-50 px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
