<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogSecurityEvents
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Log failed login attempts
        if ($request->is('login') && $request->isMethod('post') && $response->getStatusCode() !== 302) {
            Log::warning('Failed login attempt', [
                'email' => $request->input('email'),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'timestamp' => now(),
            ]);
        }

        // Log successful logins
        if ($request->is('login') && $request->isMethod('post') && $response->getStatusCode() === 302) {
            Log::info('Successful login', [
                'email' => $request->input('email'),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'timestamp' => now(),
            ]);
        }

        // Log logout events
        if ($request->is('logout') && $request->isMethod('post')) {
            Log::info('User logout', [
                'user_id' => auth()->id(),
                'ip' => $request->ip(),
                'timestamp' => now(),
            ]);
        }

        return $response;
    }
}
