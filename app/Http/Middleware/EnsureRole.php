<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request and ensure the user possesses one of the allowed roles.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route($request->is('admin*') ? 'admin.login' : 'login');
        }

        // Single 'admin' role handling with legacy compatibility
        $userRole = match ($user->role) {
            'super_admin', 'admin_marketing' => 'admin',
            default => $user->role,
        };

        $allowedRoles = array_map(function (string $r) {
            return match ($r) {
                'super_admin', 'admin_marketing' => 'admin',
                default => $r,
            };
        }, $roles);

        if (! in_array($userRole, $allowedRoles, true)) {
            abort(403, 'Akses tidak diizinkan untuk peran akun Anda.');
        }

        return $next($request);
    }
}
