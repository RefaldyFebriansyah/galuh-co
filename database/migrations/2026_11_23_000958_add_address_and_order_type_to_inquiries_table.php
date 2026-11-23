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
        Schema::table('inquiries', function (Blueprint $table) {
            if (! Schema::hasColumn('inquiries', 'address')) {
                $table->text('address')->nullable()->after('whatsapp_number');
            }
            if (! Schema::hasColumn('inquiries', 'order_type')) {
                $table->string('order_type')->default('corporate')->after('status');
            }
        });

        if (Schema::hasTable('wa_leads')) {
            Schema::table('wa_leads', function (Blueprint $table) {
                if (! Schema::hasColumn('wa_leads', 'address')) {
                    $table->text('address')->nullable()->after('wa_number');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            if (Schema::hasColumn('inquiries', 'address')) {
                $table->dropColumn('address');
            }
            if (Schema::hasColumn('inquiries', 'order_type')) {
                $table->dropColumn('order_type');
            }
        });

        if (Schema::hasTable('wa_leads')) {
            Schema::table('wa_leads', function (Blueprint $table) {
                if (Schema::hasColumn('wa_leads', 'address')) {
                    $table->dropColumn('address');
                }
            });
        }
    }
};
