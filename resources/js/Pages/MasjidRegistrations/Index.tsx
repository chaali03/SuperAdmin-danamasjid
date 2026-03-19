import DashboardLayout from '@/Layouts/DashboardLayout';
import { Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface Registration {
  id: string;
  mosqueName: string;
  province: string;
  regency: string;
  emailPerwakilan: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Props {
  auth: { user: { name: string; email: string } };
  registrations: {
    data: Registration[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
  currentStatus: string;
  search?: string;
  counts: { pending: number; approved: number; rejected: number };
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending:  'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return map[status] ?? 'bg-gray-100 text-gray-800';
};

export default function Index({ auth, registrations, currentStatus, counts, search = '' }: Props) {
  const [searchVal, setSearchVal] = useState(search);

  const tabs = [
    { key: 'pending',  label: 'Menunggu',  count: counts.pending },
    { key: 'approved', label: 'Disetujui', count: counts.approved },
    { key: 'rejected', label: 'Ditolak',   count: counts.rejected },
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.get('/masjid-registrations', { status: currentStatus, search: searchVal });
  };

  return (
    <DashboardLayout auth={auth}>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pendaftaran Masjid</h1>
            <p className="mt-1 text-gray-500">Kelola pengajuan pendaftaran masjid baru</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="search"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Cari nama masjid, email..."
              className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Cari
            </button>
          </form>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => router.get('/masjid-registrations', { status: tab.key })}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                currentStatus === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {tabs.find(t => t.key === currentStatus)?.label ?? 'Semua'} ({registrations.data.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {registrations.data.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                Tidak ada data pendaftaran
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Nama Masjid</th>
                      <th className="px-4 py-3 text-left">Lokasi</th>
                      <th className="px-4 py-3 text-left">Email Perwakilan</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Tanggal</th>
                      <th className="px-4 py-3 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registrations.data.map(reg => (
                      <tr key={reg.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{reg.mosqueName}</td>
                        <td className="px-4 py-3 text-gray-500">{reg.regency}, {reg.province}</td>
                        <td className="px-4 py-3 text-gray-500">{reg.emailPerwakilan}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusBadge(reg.status)}`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(reg.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/masjid-registrations/${reg.id}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {registrations.last_page > 1 && (
          <div className="flex justify-center gap-2">
            {registrations.prev_page_url && (
              <button
                onClick={() => router.get(registrations.prev_page_url!)}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              >
                ← Sebelumnya
              </button>
            )}
            <span className="flex items-center px-4 text-sm text-gray-500">
              Halaman {registrations.current_page} / {registrations.last_page}
            </span>
            {registrations.next_page_url && (
              <button
                onClick={() => router.get(registrations.next_page_url!)}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Berikutnya →
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
