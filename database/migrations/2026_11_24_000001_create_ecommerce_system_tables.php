<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Update users table role default
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user')->change();
            } else {
                $table->string('role')->default('user')->after('email');
            }
            if (! Schema::hasColumn('users', 'phone_number')) {
                $table->string('phone_number')->nullable()->after('role');
            }
            if (! Schema::hasColumn('users', 'google_id')) {
                $table->string('google_id')->nullable()->after('phone_number')->index();
            }
        });

        // 2. Add corporate_price and event_tag to products table
        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'corporate_price')) {
                $table->unsignedBigInteger('corporate_price')->nullable()->after('price_from');
            }
            if (! Schema::hasColumn('products', 'event_tag')) {
                $table->string('event_tag')->nullable()->after('corporate_price')->index();
            }
        });

        // 3. Create orders table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('order_type')->default('personal'); // personal, corporate
            $table->string('company_name')->nullable();
            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->text('shipping_address');
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->date('needed_at')->nullable();
            $table->text('greeting_card_text')->nullable();
            $table->string('engraving_name')->nullable();
            $table->unsignedInteger('total_quantity')->default(1);
            $table->unsignedBigInteger('subtotal')->default(0);
            $table->unsignedBigInteger('shipping_cost')->default(0);
            $table->unsignedBigInteger('total_amount')->default(0);
            $table->string('payment_status')->default('paid'); // unpaid, paid
            $table->string('status')->default('processing'); // pending, processing, completed, cancelled
            $table->string('tracking_number')->nullable()->index(); // Nomor Resi
            $table->string('shipping_courier')->nullable(); // JNE, SiCepat, Kurir Khusus Galuh Atelier
            $table->string('shipping_status')->default('studio_processing'); // studio_processing, quality_check, in_delivery, delivered
            $table->text('customer_notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });

        // 4. Create order_items table
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('product_name');
            $table->unsignedBigInteger('unit_price')->default(0);
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedBigInteger('subtotal')->default(0);
            $table->timestamps();
        });

        // 5. Create tracking_logs table
        Schema::create('tracking_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('stage'); // studio_processing, quality_check, in_delivery, delivered
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->timestamp('logged_at');
            $table->timestamps();
        });

        // 6. Create reviews table
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_title')->nullable(); // e.g. Pelanggan Terverifikasi, HRD PT Adhi Kencana
            $table->unsignedTinyInteger('rating')->default(5); // 1-5
            $table->text('comment');
            $table->unsignedInteger('likes_count')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // 7. Create review_likes table
        Schema::create('review_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->constrained('reviews')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index(['review_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_likes');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('tracking_logs');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');

        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'event_tag')) {
                $table->dropColumn('event_tag');
            }
            if (Schema::hasColumn('products', 'corporate_price')) {
                $table->dropColumn('corporate_price');
            }
        });
    }
};
