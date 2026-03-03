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

export default function ForgotPassword({ status }: { status?: string }) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.post(
      '/forgot-password',
      { email },
      {
        onError: (errors) => setErrors(errors),
      },
    );
  };

  return (
    <AuthLayout>
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Lupa Password?</CardTitle>
          <CardDescription className="text-base">
            Masukkan email Anda dan kami akan mengirimkan link untuk reset
            password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {status && (
              <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
                {status}
              </div>
            )}
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="h-11 w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Kirim Link Reset Password
            </Button>
            <div className="text-center text-sm text-gray-600">
              <a
                href="/login"
                className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Kembali ke login
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </AuthLayout>
  );
}
