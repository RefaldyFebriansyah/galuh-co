<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
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

        return Inertia::render('admin/settings/index', [
            'settings' => $groupedSettings,
        ]);
    }

    /**
     * Update site settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Contact
            'whatsapp_number' => ['nullable', 'string', 'max:50'],
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

        // Clean WhatsApp number (remove non-digits)
        if (! empty($validated['whatsapp_number'])) {
            $cleanWa = preg_replace('/[^0-9]/', '', (string) $validated['whatsapp_number']);
            // Convert leading 08 to 628
            if (Str::startsWith($cleanWa, '0')) {
                $cleanWa = '62'.substr($cleanWa, 1);
            }
            Setting::set('whatsapp_number', $cleanWa, 'contact', 'string', 'Nomor WhatsApp Pemesanan');
        }

        if (isset($validated['contact_phone'])) {
            Setting::set('contact_phone', $validated['contact_phone'], 'contact', 'string', 'Nomor Telepon Display');
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

        // Hero
        if (isset($validated['hero_badge'])) {
            Setting::set('hero_badge', $validated['hero_badge'], 'hero', 'string', 'Teks Badge Hero');
        }

        if (isset($validated['hero_title_prefix'])) {
            Setting::set('hero_title_prefix', $validated['hero_title_prefix'], 'hero', 'string', 'Judul Awalan Hero');
        }

        if (isset($validated['hero_description'])) {
            Setting::set('hero_description', $validated['hero_description'], 'hero', 'text', 'Deskripsi Hero Section');
        }

        // Social
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

            // Delete old uploaded logo if exists
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

            // Delete old uploaded logo if exists
            $oldLogo = Setting::get('logo_white');
            if ($oldLogo && Str::startsWith($oldLogo, '/uploads/branding/')) {
                $oldPath = public_path(ltrim($oldLogo, '/'));
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            Setting::set('logo_white', '/uploads/branding/'.$filename, 'branding', 'image', 'Logo Brand (White)');
        }

        return back()->with('success', 'Pengaturan situs berhasil disimpan.');
    }
}
