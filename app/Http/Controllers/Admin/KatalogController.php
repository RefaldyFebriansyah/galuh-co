<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class KatalogController extends Controller
{
    /**
     * Display a listing of hampers in the catalog.
     */
    public function index(Request $request): Response
    {
        $query = Product::query();

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        // Packaging filter
        if ($packaging = $request->input('packaging')) {
            $query->where('packaging', $packaging);
        }

        // Visibility filter
        if ($visibility = $request->input('visibility')) {
            $query->where('visibility', $visibility);
        }

        $hampers = $query->orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        $categories = [
            'Paket Lebaran',
            'Paket Kantor',
            'Natal & Tahun Baru',
            'Wedding',
            'Custom',
        ];

        $packagingTypes = [
            'hardbox_emerald' => 'Hardbox Emerald Linen',
            'anyaman_bambu' => 'Anyaman Bambu Kriya',
            'besek_natural' => 'Besek Natural Pengrajin',
            'hardbox_linen' => 'Hardbox Linen Cream',
            'rotan_eksklusif' => 'Peti Rotan Eksklusif',
        ];

        $stats = [
            'total' => Product::count(),
            'published' => Product::where('visibility', 'published')->count(),
            'featured_hero' => Product::where('is_featured_hero', true)->count(),
            'sold_out' => Product::where('visibility', 'sold_out')->count(),
        ];

        return Inertia::render('admin/katalog/index', [
            'hampers' => $hampers,
            'categories' => $categories,
            'packagingTypes' => $packagingTypes,
            'stats' => $stats,
            'filters' => $request->only(['search', 'category', 'packaging', 'visibility']),
        ]);
    }

    /**
     * Store a newly created hamper in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'packaging' => 'required|string|max:255',
            'price_from' => 'required|numeric|min:0',
            'short_description' => 'required|string',
            'contents' => 'required|array|min:1',
            'contents.*' => 'required|string',
            'image' => 'nullable|string',
            'is_halal' => 'boolean',
            'is_featured_hero' => 'boolean',
            'visibility' => 'required|string|in:published,draft,sold_out',
        ]);

        $slug = Str::slug($validated['name']);
        $uniqueSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $uniqueSlug)->exists()) {
            $uniqueSlug = "{$slug}-{$counter}";
            $counter++;
        }

        Product::create([
            'name' => $validated['name'],
            'slug' => $uniqueSlug,
            'category' => $validated['category'],
            'packaging' => $validated['packaging'],
            'price_from' => (int) $validated['price_from'],
            'short_description' => $validated['short_description'],
            'contents' => $validated['contents'],
            'image' => $validated['image'] ?: '/images/product_emerald_box.jpg',
            'is_halal' => $validated['is_halal'] ?? true,
            'is_featured_hero' => $validated['is_featured_hero'] ?? false,
            'visibility' => $validated['visibility'],
            'is_active' => $validated['visibility'] === 'published',
            'sort_order' => (Product::max('sort_order') ?? 0) + 1,
        ]);

        return redirect()->back()->with('success', 'Paket hampers berhasil ditambahkan ke katalog.');
    }

    /**
     * Update the specified hamper in storage.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'packaging' => 'required|string|max:255',
            'price_from' => 'required|numeric|min:0',
            'short_description' => 'required|string',
            'contents' => 'required|array|min:1',
            'contents.*' => 'required|string',
            'image' => 'nullable|string',
            'is_halal' => 'boolean',
            'is_featured_hero' => 'boolean',
            'visibility' => 'required|string|in:published,draft,sold_out',
        ]);

        $product->update([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'packaging' => $validated['packaging'],
            'price_from' => (int) $validated['price_from'],
            'short_description' => $validated['short_description'],
            'contents' => $validated['contents'],
            'image' => $validated['image'] ?: $product->image,
            'is_halal' => $validated['is_halal'] ?? true,
            'is_featured_hero' => $validated['is_featured_hero'] ?? false,
            'visibility' => $validated['visibility'],
            'is_active' => $validated['visibility'] === 'published',
        ]);

        return redirect()->back()->with('success', 'Paket hampers berhasil diperbarui.');
    }

    /**
     * Toggle "Featured on Hero".
     */
    public function toggleHero(Product $product): RedirectResponse
    {
        $product->update([
            'is_featured_hero' => ! $product->is_featured_hero,
        ]);

        $status = $product->is_featured_hero ? 'ditampilkan di Hero' : 'dilepas dari Hero';

        return redirect()->back()->with('success', "Paket {$product->name} kini {$status}.");
    }

    /**
     * Toggle visibility (published / draft / sold_out).
     */
    public function toggleVisibility(Request $request, Product $product): RedirectResponse
    {
        $visibility = $request->input('visibility', 'published');
        $product->update([
            'visibility' => $visibility,
            'is_active' => $visibility === 'published',
        ]);

        return redirect()->back()->with('success', "Status tayang paket diubah menjadi {$visibility}.");
    }

    /**
     * Remove the specified hamper from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $name = $product->name;
        $product->delete();

        return redirect()->back()->with('success', "Paket {$name} berhasil dihapus dari katalog.");
    }
}
