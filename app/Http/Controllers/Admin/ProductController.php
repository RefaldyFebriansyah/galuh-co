<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request): Response
    {
        $query = Product::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            if ($category !== 'all') {
                $query->where('category', $category);
            }
        }

        if ($request->has('status') && $request->input('status') !== 'all') {
            $isActive = $request->input('status') === 'active';
            $query->where('is_active', $isActive);
        }

        $products = $query->orderBy('sort_order')
            ->orderBy('id', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', 'all'),
                'status' => $request->input('status', 'all'),
            ],
            'categories' => [
                'Paket Lebaran',
                'Paket Kantor',
                'Natal & Tahun Baru',
                'Wedding',
                'Custom',
            ],
        ]);
    }

    /**
     * Show form to create a new product.
     */
    public function create(): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => null,
            'categories' => [
                'Paket Lebaran',
                'Paket Kantor',
                'Natal & Tahun Baru',
                'Wedding',
                'Custom',
            ],
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:Paket Lebaran,Paket Kantor,Natal & Tahun Baru,Wedding,Custom'],
            'price_from' => ['required', 'numeric', 'min:0'],
            'short_description' => ['required', 'string', 'max:1000'],
            'contents' => ['required'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        // Process contents
        $contents = is_array($validated['contents'])
            ? $validated['contents']
            : array_filter(array_map('trim', explode("\n", (string) $validated['contents'])));

        // Process image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'product_'.time().'_'.Str::random(8).'.'.$file->getClientOriginalExtension();
            $file->move(public_path('uploads/products'), $filename);
            $imagePath = '/uploads/products/'.$filename;
        }

        // Generate unique slug
        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        Product::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'category' => $validated['category'],
            'price_from' => (int) $validated['price_from'],
            'short_description' => $validated['short_description'],
            'contents' => array_values($contents),
            'sort_order' => $validated['sort_order'] ?? (Product::max('sort_order') + 1),
            'is_active' => $request->boolean('is_active', true),
            'image' => $imagePath,
        ]);

        return redirect()->route('admin.products.index')
            ->with('success', "Produk \"{$validated['name']}\" berhasil ditambahkan.");
    }

    /**
     * Show form to edit an existing product.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => $product,
            'categories' => [
                'Paket Lebaran',
                'Paket Kantor',
                'Natal & Tahun Baru',
                'Wedding',
                'Custom',
            ],
        ]);
    }

    /**
     * Update an existing product.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:Paket Lebaran,Paket Kantor,Natal & Tahun Baru,Wedding,Custom'],
            'price_from' => ['required', 'numeric', 'min:0'],
            'short_description' => ['required', 'string', 'max:1000'],
            'contents' => ['required'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        // Process contents
        $contents = is_array($validated['contents'])
            ? $validated['contents']
            : array_filter(array_map('trim', explode("\n", (string) $validated['contents'])));

        // Process image upload
        $imagePath = $product->image;
        if ($request->hasFile('image')) {
            // Delete old uploaded image if it exists in public/uploads/products
            if ($product->image && Str::startsWith($product->image, '/uploads/products/')) {
                $oldFile = public_path(ltrim($product->image, '/'));
                if (File::exists($oldFile)) {
                    File::delete($oldFile);
                }
            }

            $file = $request->file('image');
            $filename = 'product_'.time().'_'.Str::random(8).'.'.$file->getClientOriginalExtension();
            $file->move(public_path('uploads/products'), $filename);
            $imagePath = '/uploads/products/'.$filename;
        }

        // Update slug if name changed
        $slug = $product->slug;
        if ($validated['name'] !== $product->name) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
        }

        $product->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'category' => $validated['category'],
            'price_from' => (int) $validated['price_from'],
            'short_description' => $validated['short_description'],
            'contents' => array_values($contents),
            'sort_order' => $validated['sort_order'] ?? $product->sort_order,
            'is_active' => $request->boolean('is_active'),
            'image' => $imagePath,
        ]);

        return redirect()->route('admin.products.index')
            ->with('success', "Produk \"{$product->name}\" berhasil diperbarui.");
    }

    /**
     * Delete an existing product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $name = $product->name;

        // Delete uploaded image file if present
        if ($product->image && Str::startsWith($product->image, '/uploads/products/')) {
            $filePath = public_path(ltrim($product->image, '/'));
            if (File::exists($filePath)) {
                File::delete($filePath);
            }
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', "Produk \"{$name}\" berhasil dihapus.");
    }

    /**
     * Toggle product active state.
     */
    public function toggleActive(Product $product): RedirectResponse
    {
        $product->update([
            'is_active' => ! $product->is_active,
        ]);

        $statusText = $product->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "Produk \"{$product->name}\" berhasil {$statusText}.");
    }
}
