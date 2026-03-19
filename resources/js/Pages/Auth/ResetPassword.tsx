import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
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

interface ResetPasswordProps {
  email: string;
  token: string;
}

export default function ResetPassword({ email, token }: ResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.post(
      '/reset-password',
      {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      },
      {
        onError: (errors) => setErrors(errors),
      },
    );
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <div className="absolute left-0 top-0 h-full w-1/2 bg-blue-600"></div>
      <div className="absolute right-0 top-0 h-full w-1/2 bg-[#FFC107]"></div>

      <div className="relative z-10 w-full max-w-xl px-6 py-8">
        <Card className="border-0 bg-white shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mb-2 flex justify-center">
              <img src="/logo.webp" alt="DanaMasjid" className="h-16 w-auto" />
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900">Reset Password</CardTitle>
            <CardDescription className="text-base">Masukkan password baru Anda</CardDescription>
          </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password Baru</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">
                Konfirmasi Password Baru
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="h-12 w-full bg-gray-900 text-base font-semibold text-white hover:bg-gray-800">
              Reset Password
            </Button>
          </CardFooter>
        </form>
      </Card>
      </div>
    </div>
  );
}
