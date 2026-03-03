import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.post(
      '/login',
      { email, password, remember },
      {
        onError: (errors) => setErrors(errors),
      },
    );
  };

  return (
    <AuthLayout>
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Selamat Datang</CardTitle>
          <CardDescription className="text-base">
            Masukkan kredensial Anda untuk mengakses dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <Label htmlFor="remember" className="font-normal">
                  Ingat saya
                </Label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Lupa password?
              </a>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="h-11 w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Login
            </Button>
            <div className="text-center text-sm text-gray-600">
              Belum punya akun?{' '}
              <a
                href="/register"
                className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Daftar sekarang
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </AuthLayout>
  );
}
