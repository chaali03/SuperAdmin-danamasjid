import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface DashboardProps {
  auth: {
    user: {
      name: string;
      email: string;
    };
  };
}

export default function Dashboard({ auth }: DashboardProps) {
  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">SuperAdmin Dana Masjid</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{auth.user.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-600">
            Selamat datang, {auth.user.name}!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Masjid</CardTitle>
              <CardDescription>Jumlah masjid terdaftar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Donasi</CardTitle>
              <CardDescription>Total dana terkumpul</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">Rp 0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pengguna Aktif</CardTitle>
              <CardDescription>Jumlah pengguna aktif</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
