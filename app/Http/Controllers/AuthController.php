<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    /**
     * Show the login page.
     */
    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return $this->redirectBasedOnRole(Auth::user());
        }

        return Inertia::render('auth/login', [
            'status' => session('status'),
            'canResetPassword' => false,
        ]);
    }

    /**
     * Handle user login.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            /** @var User $user */
            $user = Auth::user();

            return $this->redirectBasedOnRole($user)
                ->with('success', 'Selamat datang kembali, '.$user->name.'!');
        }

        return back()->withErrors([
            'email' => 'Email atau password yang Anda masukkan tidak sesuai.',
        ])->onlyInput('email');
    }

    /**
     * Show the registration page.
     */
    public function showRegister(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('home');
        }

        return Inertia::render('auth/register');
    }

    /**
     * Handle user registration.
     */
    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone_number' => ['required', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'role' => 'user',
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('home'))
            ->with('success', 'Pendaftaran akun berhasil! Anda kini dapat melakukan pemesanan hampers.');
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')
            ->with('success', 'Anda telah berhasil keluar.');
    }

    /**
     * Redirect user based on their role.
     */
    private function redirectBasedOnRole(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(route('home'));
    }

    /**
     * Redirect to Google OAuth for login / registration.
     */
    public function redirectToGoogle(): \Symfony\Component\HttpFoundation\RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback.
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            /** @var \Laravel\Socialite\Two\User $googleUser */
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if (! $user) {
                $user = User::create([
                    'name' => $googleUser->getName() ?: 'Pelanggan Galuh',
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'role' => 'user',
                    'phone_number' => '08123456789',
                    'password' => Hash::make(Str::random(24)),
                ]);
            } else {
                if (! $user->google_id) {
                    $user->update(['google_id' => $googleUser->getId()]);
                }
            }

            Auth::login($user);
            request()->session()->regenerate();

            return $this->redirectBasedOnRole($user)
                ->with('success', 'Selamat datang, '.$user->name.'!');
        } catch (\Throwable $e) {
            return redirect()->route('login')
                ->withErrors(['email' => 'Gagal masuk dengan Google. Silakan coba kembali atau gunakan login email.']);
        }
    }
}
