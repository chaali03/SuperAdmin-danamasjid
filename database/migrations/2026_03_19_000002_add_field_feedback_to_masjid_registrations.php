<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('masjid_registrations') && !Schema::hasColumn('masjid_registrations', 'fieldFeedback')) {
            Schema::table('masjid_registrations', function (Blueprint $table) {
                $table->jsonb('fieldFeedback')->nullable()->after('rejectionReason');
            });
        }
    }

    public function down(): void
    {
        Schema::table('masjid_registrations', function (Blueprint $table) {
            $table->dropColumn('fieldFeedback');
        });
    }
};
