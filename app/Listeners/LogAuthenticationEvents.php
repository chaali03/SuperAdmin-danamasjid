<?php

namespace App\Listeners;

use App\Models\ActivityLog;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\PasswordReset;

class LogAuthenticationEvents
{
    /**
     * Handle user login events.
     */
    public function handleLogin(Login $event): void
    {
        ActivityLog::log(
            'login',
            'User logged in successfully',
            [
                'email' => $event->user->email,
                'guard' => $event->guard,
            ]
        );
    }

    /**
     * Handle user logout events.
     */
    public function handleLogout(Logout $event): void
    {
        ActivityLog::log(
            'logout',
            'User logged out',
            [
                'email' => $event->user->email ?? 'Unknown',
                'guard' => $event->guard,
            ]
        );
    }

    /**
     * Handle failed login attempts.
     */
    public function handleFailed(Failed $event): void
    {
        ActivityLog::create([
            'user_id' => null,
            'action' => 'login_failed',
            'description' => 'Failed login attempt',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'properties' => [
                'email' => $event->credentials['email'] ?? 'Unknown',
                'guard' => $event->guard,
            ],
        ]);
    }

    /**
     * Handle user registration events.
     */
    public function handleRegistered(Registered $event): void
    {
        ActivityLog::create([
            'user_id' => $event->user->id,
            'action' => 'registered',
            'description' => 'New user registered',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'properties' => [
                'email' => $event->user->email,
            ],
        ]);
    }

    /**
     * Handle password reset events.
     */
    public function handlePasswordReset(PasswordReset $event): void
    {
        ActivityLog::log(
            'password_reset',
            'User password was reset',
            [
                'email' => $event->user->email,
            ]
        );
    }

    /**
     * Register the listeners for the subscriber.
     */
    public function subscribe($events): array
    {
        return [
            Login::class => 'handleLogin',
            Logout::class => 'handleLogout',
            Failed::class => 'handleFailed',
            Registered::class => 'handleRegistered',
            PasswordReset::class => 'handlePasswordReset',
        ];
    }
}
