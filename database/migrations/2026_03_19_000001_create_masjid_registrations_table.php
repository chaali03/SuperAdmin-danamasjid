<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel ini dibuat oleh Prisma (Next.js API), migration ini hanya untuk
        // memastikan SuperAdmin (Laravel) bisa membaca/menulis ke tabel yang sama.
        // Jalankan hanya jika tabel belum ada (misal: fresh DB SuperAdmin).
        if (!Schema::hasTable('masjid_registrations')) {
            Schema::create('masjid_registrations', function (Blueprint $table) {
                $table->string('id')->primary(); // cuid dari Prisma

                // Prisma menyimpan kolom dengan camelCase (tidak ada @map di schema)
                $table->string('userId');

                // Step 1: Data Masjid
                $table->string('mosqueName');
                $table->text('mosqueAddress');
                $table->string('province');
                $table->string('regency');
                $table->string('district');
                $table->string('village');
                $table->string('rt')->default('');
                $table->string('rw')->default('');
                $table->string('mosqueImage')->nullable();

                // Step 2: Data Legalitas
                $table->string('aktaPendirian')->nullable();
                $table->string('skKemenkumham')->nullable();
                $table->string('npwpMasjid')->nullable();
                $table->string('suratPernyataan')->nullable();

                // Step 3: Data Pengurus
                $table->string('namaLengkap')->default('');
                $table->string('namaDepan');
                $table->string('namaBelakang');
                $table->string('jenisKelamin');
                $table->string('pekerjaan');
                $table->boolean('isPemilikBisnis')->default(false);
                $table->string('emailPerwakilan');
                $table->string('tanggalLahir');
                $table->string('nomorHandphone');
                $table->text('alamatTempat');
                $table->string('jenisID')->default('KTP');
                $table->string('fotoKTP')->nullable();
                $table->string('nomorKTP');
                $table->string('suratKuasa')->nullable();
                $table->boolean('kontakPersonSama')->default(true);

                // Step 4: Upload Dokumen
                $table->string('skKepengurusan')->nullable();
                $table->string('suratRekomendasiRTRW')->nullable();
                $table->string('fotoTampakDepan')->nullable();
                $table->string('fotoInterior')->nullable();
                $table->string('dokumenStatusTanah')->nullable();
                $table->string('ktpKetua')->nullable();
                $table->string('npwpDokumen')->nullable();

                // Step 5: Akun Admin
                $table->string('adminEmail');
                $table->string('adminPassword');

                // Status
                $table->string('status')->default('pending');
                $table->text('rejectionReason')->nullable();
                $table->json('fieldFeedback')->nullable(); // per-field review feedback
                $table->timestamp('approvedAt')->nullable();
                $table->string('approvedBy')->nullable();

                // Prisma timestamps
                $table->timestamp('createdAt')->useCurrent();
                $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();

                $table->index('status');
                $table->index('userId');
                $table->index('createdAt');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('masjid_registrations');
    }
};
