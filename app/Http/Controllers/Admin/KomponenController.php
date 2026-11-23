<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HamperComponent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KomponenController extends Controller
{
    /**
     * Display a listing of hamper components.
     */
    public function index(Request $request): Response
    {
        $query = HamperComponent::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($stockStatus = $request->input('stock_status')) {
            $query->where('stock_status', $stockStatus);
        }

        $components = $query->orderBy('category', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        $categoryStats = [
            'kudapan' => HamperComponent::where('category', 'kudapan')->count(),
            'minuman' => HamperComponent::where('category', 'minuman')->count(),
            'merchandise' => HamperComponent::where('category', 'merchandise')->count(),
            'kemasan' => HamperComponent::where('category', 'kemasan')->count(),
            'aksesoris' => HamperComponent::where('category', 'aksesoris')->count(),
        ];

        $stockStats = [
            'in_stock' => HamperComponent::where('stock_status', 'in_stock')->count(),
            'low_stock' => HamperComponent::where('stock_status', 'low_stock')->count(),
            'out_of_stock' => HamperComponent::where('stock_status', 'out_of_stock')->count(),
        ];

        return Inertia::render('admin/komponen/index', [
            'components' => $components,
            'categoryStats' => $categoryStats,
            'stockStats' => $stockStats,
            'filters' => $request->only(['search', 'category', 'stock_status']),
        ]);
    }

    /**
     * Store a newly created component in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|in:kudapan,minuman,merchandise,kemasan,aksesoris',
            'sku' => 'nullable|string|max:100',
            'unit_cost' => 'required|numeric|min:0',
            'stock_status' => 'required|string|in:in_stock,low_stock,out_of_stock',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        HamperComponent::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'sku' => $validated['sku'] ?? null,
            'unit_cost' => (int) $validated['unit_cost'],
            'stock_status' => $validated['stock_status'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->back()->with('success', 'Komponen isian/kemasan berhasil ditambahkan.');
    }

    /**
     * Update the specified component in storage.
     */
    public function update(Request $request, HamperComponent $komponen): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|in:kudapan,minuman,merchandise,kemasan,aksesoris',
            'sku' => 'nullable|string|max:100',
            'unit_cost' => 'required|numeric|min:0',
            'stock_status' => 'required|string|in:in_stock,low_stock,out_of_stock',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $komponen->update([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'sku' => $validated['sku'] ?? null,
            'unit_cost' => (int) $validated['unit_cost'],
            'stock_status' => $validated['stock_status'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->back()->with('success', 'Komponen isian/kemasan berhasil diperbarui.');
    }

    /**
     * Quick toggle stock status.
     */
    public function updateStock(Request $request, HamperComponent $komponen): RedirectResponse
    {
        $status = $request->input('stock_status', 'in_stock');
        $komponen->update(['stock_status' => $status]);

        return redirect()->back()->with('success', "Status stok {$komponen->name} diubah menjadi {$status}.");
    }

    /**
     * Remove the specified component from storage.
     */
    public function destroy(HamperComponent $komponen): RedirectResponse
    {
        $name = $komponen->name;
        $komponen->delete();

        return redirect()->back()->with('success', "Komponen {$name} berhasil dihapus.");
    }
}
