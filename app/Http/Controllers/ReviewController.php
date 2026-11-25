<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use App\Models\ReviewLike;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Submit a new verified review & rating.
     */
    public function store(Request $request): RedirectResponse
    {
        if (! Auth::check()) {
            return back()->with('error', 'Silakan masuk ke akun Anda terlebih dahulu untuk memberikan ulasan.');
        }

        $userId = Auth::id();

        // Verify that the user has at least one order
        $hasOrder = Order::where('user_id', $userId)->exists();
        if (! $hasOrder) {
            return back()->with('error', 'Hanya pelanggan yang telah melakukan pemesanan yang dapat memberikan ulasan dan rating produk.');
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:5', 'max:2000'],
            'customer_title' => ['nullable', 'string', 'max:100'],
            'order_id' => ['nullable', 'exists:orders,id'],
            'product_id' => ['nullable', 'exists:products,id'],
        ], [
            'rating.required' => 'Pilih bintang rating antara 1 sampai 5.',
            'comment.required' => 'Tuliskan ulasan atau pengalaman Anda.',
            'comment.min' => 'Ulasan minimal 5 karakter.',
        ]);

        $order = Order::where('user_id', $userId)->latest()->first();

        Review::create([
            'user_id' => $userId,
            'order_id' => $validated['order_id'] ?? $order?->id,
            'product_id' => $validated['product_id'] ?? null,
            'customer_name' => Auth::user()->name,
            'customer_title' => ($validated['customer_title'] ?? null) ?: ($order && $order->order_type === 'corporate' ? 'Klien Korporat' : 'Pembeli Terverifikasi'),
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'likes_count' => 0,
            'is_published' => true,
        ]);

        return back()->with('success', 'Terima kasih! Ulasan dan rating bintang Anda telah berhasil diterbitkan.');
    }

    /**
     * Interactive toggle/increment like on a review.
     */
    public function like(Request $request, Review $review): JsonResponse|RedirectResponse
    {
        $userId = Auth::id();
        $ip = $request->ip();

        // Prevent duplicate likes from the same user or IP
        $existing = ReviewLike::where('review_id', $review->id)
            ->where(function ($query) use ($userId, $ip) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('ip_address', $ip);
                }
            })
            ->first();

        if ($existing) {
            $existing->delete();
            $review->decrement('likes_count');
            $liked = false;
        } else {
            ReviewLike::create([
                'review_id' => $review->id,
                'user_id' => $userId,
                'ip_address' => $ip,
            ]);
            $review->increment('likes_count');
            $liked = true;
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'liked' => $liked,
                'likes_count' => $review->fresh()->likes_count,
            ]);
        }

        return back();
    }
}
