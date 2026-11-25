<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display settings manager.
     */
    public function index(): Response
    {
        $groupedSettings = Setting::getAllGrouped();
        $team = User::select(['id', 'name', 'email', 'role', 'phone_number', 'created_at'])
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('admin/settings/index', [
            'settings' => $groupedSettings,
            'team' => $team,
        ]);
    }

    /**
     * Update site & concierge settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Concierge & Contact
            'whatsapp_number' => ['nullable', 'string', 'max:50'],
            'whatsapp_backup_number' => ['nullable', 'string', 'max:50'],
            'whatsapp_default_message' => ['nullable', 'string', 'max:500'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email', 'max:100'],
            'company_address' => ['nullable', 'string', 'max:500'],
            'operational_hours' => ['nullable', 'string', 'max:100'],

            // Hero
            'hero_badge' => ['nullable', 'string', 'max:150'],
            'hero_title_prefix' => ['nullable', 'string', 'max:100'],
            'hero_description' => ['nullable', 'string', 'max:1000'],

            // Social
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'string', 'max:255'],

            // Branding Files
            'logo_gold_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,svg,webp', 'max:3072'],
            'logo_white_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,svg,webp', 'max:3072'],
        ]);

        if (! empty($validated['whatsapp_number'])) {
            $cleanWa = preg_replace('/[^0-9]/', '', (string) $validated['whatsapp_number']);
            if (Str::startsWith($cleanWa, '0')) {
                $cleanWa = '62'.substr($cleanWa, 1);
            } elseif (! Str::startsWith($cleanWa, '62')) {
                $cleanWa = '62'.$cleanWa;
            }
            Setting::set('whatsapp_number', $cleanWa, 'contact', 'string', 'Nomor WhatsApp Utama');
        }

        if (! empty($validated['whatsapp_backup_number'])) {
            $cleanBackup = preg_replace('/[^0-9]/', '', (string) $validated['whatsapp_backup_number']);
            if (Str::startsWith($cleanBackup, '0')) {
                $cleanBackup = '62'.substr($cleanBackup, 1);
            } elseif (! Str::startsWith($cleanBackup, '62')) {
                $cleanBackup = '62'.$cleanBackup;
            }
            Setting::set('whatsapp_backup_number', $cleanBackup, 'contact', 'string', 'Nomor WhatsApp Cadangan');
        }

        if (isset($validated['whatsapp_default_message'])) {
            Setting::set('whatsapp_default_message', $validated['whatsapp_default_message'], 'contact', 'text', 'Pesan Default WhatsApp');
        }

        if (isset($validated['contact_phone'])) {
            $rawPhone = preg_replace('/[^0-9]/', '', (string) $validated['contact_phone']);
            if (Str::startsWith($rawPhone, '62')) {
                $digits = substr($rawPhone, 2);
            } elseif (Str::startsWith($rawPhone, '0')) {
                $digits = substr($rawPhone, 1);
            } else {
                $digits = $rawPhone;
            }
            $formattedPhone = $digits !== '' ? '+62 '.substr($digits, 0, 3).'-'.substr($digits, 3, 4).'-'.substr($digits, 7) : '';
            Setting::set('contact_phone', $formattedPhone, 'contact', 'string', 'Nomor Telepon Display');
        }

        if (isset($validated['contact_email'])) {
            Setting::set('contact_email', $validated['contact_email'], 'contact', 'string', 'Alamat Email Resmi');
        }

        if (isset($validated['company_address'])) {
            Setting::set('company_address', $validated['company_address'], 'contact', 'text', 'Alamat Workshop / Gallery');
        }

        if (isset($validated['operational_hours'])) {
            Setting::set('operational_hours', $validated['operational_hours'], 'contact', 'string', 'Jam Operasional');
        }

        if (isset($validated['hero_badge'])) {
            Setting::set('hero_badge', $validated['hero_badge'], 'hero', 'string', 'Teks Badge Hero');
        }

        if (isset($validated['hero_title_prefix'])) {
            Setting::set('hero_title_prefix', $validated['hero_title_prefix'], 'hero', 'string', 'Judul Awalan Hero');
        }

        if (isset($validated['hero_description'])) {
            Setting::set('hero_description', $validated['hero_description'], 'hero', 'text', 'Deskripsi Hero Section');
        }

        if (isset($validated['instagram_url'])) {
            Setting::set('instagram_url', $validated['instagram_url'], 'social', 'string', 'Tautan Instagram');
        }

        if (isset($validated['tiktok_url'])) {
            Setting::set('tiktok_url', $validated['tiktok_url'], 'social', 'string', 'Tautan TikTok');
        }

        if (isset($validated['linkedin_url'])) {
            Setting::set('linkedin_url', $validated['linkedin_url'], 'social', 'string', 'Tautan LinkedIn');
        }

        // Branding File Uploads
        if ($request->hasFile('logo_gold_file')) {
            $file = $request->file('logo_gold_file');
            $filename = 'logo_gold_'.time().'.'.$file->getClientOriginalExtension();
            $file->move(public_path('uploads/branding'), $filename);

            $oldLogo = Setting::get('logo_gold');
            if ($oldLogo && Str::startsWith($oldLogo, '/uploads/branding/')) {
                $oldPath = public_path(ltrim($oldLogo, '/'));
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            Setting::set('logo_gold', '/uploads/branding/'.$filename, 'branding', 'image', 'Logo Brand (Gold)');
        }

        if ($request->hasFile('logo_white_file')) {
            $file = $request->file('logo_white_file');
            $filename = 'logo_white_'.time().'.'.$file->getClientOriginalExtension();
            $file->move(public_path('uploads/branding'), $filename);

            $oldLogo = Setting::get('logo_white');
            if ($oldLogo && Str::startsWith($oldLogo, '/uploads/branding/')) {
                $oldPath = public_path(ltrim($oldLogo, '/'));
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            Setting::set('logo_white', '/uploads/branding/'.$filename, 'branding', 'image', 'Logo Brand (White)');
        }

        return back()->with('success', 'Pengaturan atelier & Concierge berhasil disimpan.');
    }

    /**
     * Add new staff user.
     */
    public function storeUser(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'nullable|string',
            'phone_number' => 'nullable|string|max:50',
            'password' => 'required|string|min:6',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => 'admin',
            'phone_number' => $validated['phone_number'] ?? null,
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', "Akun tim {$validated['name']} berhasil dibuat.");
    }

    /**
     * Update existing staff user.
     */
    public function updateUser(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'role' => 'nullable|string',
            'phone_number' => 'nullable|string|max:50',
            'password' => 'nullable|string|min:6',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => 'admin',
            'phone_number' => $validated['phone_number'] ?? null,
        ];

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return back()->with('success', "Data akun {$user->name} berhasil diperbarui.");
    }

    /**
     * Remove staff user.
     */
    public function destroyUser(User $user): RedirectResponse
    {
        if (User::count() <= 1) {
            return back()->with('error', 'Tidak dapat menghapus satu-satunya akun administrator.');
        }

        $name = $user->name;
        $user->delete();

        return back()->with('success', "Akun {$name} berhasil dihapus.");
    }

    /**
     * Display Profil & Lokasi Studio setting page.
     * Manages footer bio, +62 hotline, email, operational hours, and Google Maps embed.
     */
    public function profilIndex(): Response
    {
        $companyAddress = (string) Setting::get('company_address', 'Jl. Ir. H. Juanda No. 146, Ciamis, Jawa Barat 46211');
        $studioGmaps = (string) Setting::get('studio_gmaps_embed', '');
        if (trim($studioGmaps) === '') {
            $studioGmaps = 'https://maps.google.com/maps?q='.urlencode($companyAddress).'&output=embed';
        }

        $profileSettings = [
            'footer_bio' => (string) Setting::get(
                'footer_bio',
                'Atelier kriya bingkisan premium dan corporate gifting artisanal yang memadukan kehangatan tradisi anyaman bambu Nusantara dengan kemewahan hardbox linen berstempel wax.'
            ),
            'contact_phone' => (string) Setting::get('contact_phone', '+62 823-2177-3434'),
            'whatsapp_number' => (string) Setting::get('whatsapp_number', '6282321773434'),
            'contact_email' => (string) Setting::get('contact_email', 'halo@galuh.co'),
            'operational_hours' => (string) Setting::get('operational_hours', 'Senin - Sabtu: 08.00 - 18.00 WIB'),
            'company_address' => $companyAddress,
            'studio_gmaps_embed' => $studioGmaps,
        ];

        return Inertia::render('admin/settings/profil', [
            'profileSettings' => $profileSettings,
        ]);
    }

    /**
     * Update Profil & Lokasi Studio settings (instantly syncs to landing page map & footer).
     */
    public function updateProfil(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'footer_bio' => ['required', 'string', 'max:500'],
            'contact_phone' => ['required', 'string', 'max:50'],
            'contact_email' => ['required', 'email', 'max:100'],
            'operational_hours' => ['required', 'string', 'max:100'],
            'company_address' => ['required', 'string', 'max:500'],
            'studio_gmaps_embed' => ['nullable', 'string', 'max:1000'],
        ]);

        // Clean & standardize Indonesian phone number with +62
        $rawPhone = preg_replace('/[^0-9]/', '', (string) $validated['contact_phone']);
        if (str_starts_with($rawPhone, '62')) {
            $digits = substr($rawPhone, 2);
        } elseif (str_starts_with($rawPhone, '0')) {
            $digits = substr($rawPhone, 1);
        } else {
            $digits = $rawPhone;
        }

        $formattedPhone = '+62 '.substr($digits, 0, 3).'-'.substr($digits, 3, 4).'-'.substr($digits, 7);
        $waNumber = '62'.$digits;

        Setting::set('footer_bio', $validated['footer_bio']);
        Setting::set('contact_phone', $formattedPhone);
        Setting::set('whatsapp_number', $waNumber);
        Setting::set('contact_email', $validated['contact_email']);
        Setting::set('operational_hours', $validated['operational_hours']);
        Setting::set('company_address', $validated['company_address']);

        $gmapsEmbed = trim((string) ($validated['studio_gmaps_embed'] ?? ''));
        if ($gmapsEmbed === '') {
            $gmapsEmbed = 'https://maps.google.com/maps?q='.urlencode($validated['company_address']).'&output=embed';
        }

        Setting::set('studio_gmaps_embed', $gmapsEmbed);

        Cache::forget('landing_page_settings');

        return back()->with('success', 'Profil & Lokasi Studio berhasil diperbarui. Data peta dan footer landing page telah diperbarui.');
    }

    /**
     * Display Akun & Keamanan page for logged-in Administrator.
     */
    public function keamananIndex(): Response
    {
        $user = auth()->user();

        return Inertia::render('admin/settings/keamanan', [
            'adminUser' => [
                'id' => $user?->id,
                'name' => $user?->name,
                'email' => $user?->email,
                'phone_number' => $user?->phone_number,
                'role' => $user?->role,
            ],
        ]);
    }

    /**
     * Update Administrator Profile & Password.
     */
    public function updateKeamanan(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = auth()->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,'.$user->id],
            'phone_number' => ['nullable', 'string', 'max:50'],
            'current_password' => ['nullable', 'required_with:new_password', 'current_password'],
            'new_password' => ['nullable', 'string', 'min:6', 'confirmed'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'] ?? $user->phone_number,
        ];

        if (! empty($validated['new_password'])) {
            $updateData['password'] = Hash::make($validated['new_password']);
        }

        $user->update($updateData);

        return back()->with('success', 'Profil Administrator & Keamanan berhasil diperbarui.');
    }
}
