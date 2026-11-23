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
        // 1. Add role & phone_number to users table
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('super_admin')->after('email');
            }
            if (! Schema::hasColumn('users', 'phone_number')) {
                $table->string('phone_number')->nullable()->after('role');
            }
        });

        // 2. Add extra catalog attributes to products table
        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'packaging')) {
                $table->string('packaging')->default('hardbox_emerald')->after('category');
            }
            if (! Schema::hasColumn('products', 'is_halal')) {
                $table->boolean('is_halal')->default(true)->after('packaging');
            }
            if (! Schema::hasColumn('products', 'is_featured_hero')) {
                $table->boolean('is_featured_hero')->default(false)->after('is_halal');
            }
            if (! Schema::hasColumn('products', 'visibility')) {
                $table->string('visibility')->default('published')->after('is_featured_hero');
            }
            if (! Schema::hasColumn('products', 'images')) {
                $table->json('images')->nullable()->after('image');
            }
        });

        // 3. Create hamper_components table (Mix & match catalog components)
        Schema::create('hamper_components', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->default('kudapan'); // kudapan, minuman, merchandise, kemasan, aksesoris
            $table->string('sku')->nullable();
            $table->unsignedBigInteger('unit_cost')->default(0);
            $table->string('stock_status')->default('in_stock'); // in_stock, low_stock, out_of_stock
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. Create wa_leads table (WhatsApp Lead Tracking & CRM Pipeline)
        Schema::create('wa_leads', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('company_name')->nullable();
            $table->string('wa_number');
            $table->string('source')->default('floating_wa'); // hero_customizer, catalog_corporate, catalog_personal, floating_wa, festive_banner, manual_chat
            $table->string('package_name')->nullable();
            $table->string('estimated_packages')->nullable();
            $table->string('budget_range')->nullable();
            $table->text('greeting_card_message')->nullable();
            $table->string('engraving_name')->nullable();
            $table->date('delivery_date')->nullable();
            $table->string('status')->default('chat_baru'); // chat_baru, kirim_katalog, negosiasi_custom, deal_produksi, batal
            $table->text('notes')->nullable();
            $table->timestamp('last_follow_up_at')->nullable();
            $table->timestamps();
        });

        // 5. Create wa_templates table (Quick reply scripts library)
        Schema::create('wa_templates', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category')->default('sambutan_awal'); // sambutan_awal, kirim_pricelist, desain_kartu, info_pengiriman, follow_up
            $table->text('content');
            $table->json('variables')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 6. Create production_orders table (Studio assembly Kanban workflow)
        Schema::create('production_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code')->unique();
            $table->foreignId('wa_lead_id')->nullable()->constrained('wa_leads')->nullOnDelete();
            $table->string('client_name');
            $table->string('company_name')->nullable();
            $table->string('package_name');
            $table->unsignedInteger('quantity')->default(1);
            $table->text('greeting_card_text')->nullable();
            $table->string('greeting_card_status')->default('pending'); // pending, printed
            $table->json('engraving_names')->nullable();
            $table->string('engraving_status')->default('pending'); // pending, engraved
            $table->date('target_delivery_date')->nullable();
            $table->string('stage')->default('persiapan_bahan'); // persiapan_bahan, cetak_grafir, perakitan_wax, siap_kirim
            $table->string('priority')->default('normal'); // normal, high, urgent
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 7. Create testimonials table
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->string('order_type')->nullable();
            $table->string('city')->nullable();
            $table->text('quote');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 8. Create faqs table
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->string('category')->default('pemesanan'); // pemesanan, custom_branding, pengiriman, pembayaran
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('production_orders');
        Schema::dropIfExists('wa_templates');
        Schema::dropIfExists('wa_leads');
        Schema::dropIfExists('hamper_components');

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['packaging', 'is_halal', 'is_featured_hero', 'visibility', 'images']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone_number']);
        });
    }
};
