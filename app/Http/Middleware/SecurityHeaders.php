<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevent clickjacking attacks
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Enable XSS protection
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions Policy
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        // Only apply strict security headers in production
        if (app()->environment('production')) {
            // Strict Transport Security (HTTPS only)
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

            // Content Security Policy - strict for production
            $csp = "default-src 'self'; ";
            $csp .= "script-src 'self' 'unsafe-inline' 'unsafe-eval'; ";
            $csp .= "style-src 'self' 'unsafe-inline'; ";
            $csp .= "img-src 'self' data: https: blob:; ";
            $csp .= "font-src 'self' data:; ";
            $csp .= "connect-src 'self'; ";
            $csp .= "frame-ancestors 'self';";

            $response->headers->set('Content-Security-Policy', $csp);
        }
        // In development, don't set CSP to avoid blocking Vite dev server
        // CSP will be enforced in production only

        return $response;
    }
}
