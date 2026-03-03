<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Testing Password Reset Functionality\n";
echo "=====================================\n\n";

$user = App\Models\User::first();
echo "User: {$user->email}\n";

$token = app('auth.password.broker')->createToken($user);
echo "Reset Token: {$token}\n\n";

$resetUrl = url("/reset-password/{$token}?email=" . urlencode($user->email));
echo "Reset URL:\n{$resetUrl}\n\n";

echo "✓ Password reset token generated successfully!\n";
echo "✓ Copy the URL above and paste in browser to test reset password\n";
