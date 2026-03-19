<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasjidRegistration extends Model
{
    // Tabel ini di-share dengan Next.js API (Prisma)
    // Prisma menyimpan kolom dengan camelCase di PostgreSQL
    protected $table = 'masjid_registrations';

    public $incrementing = false;
    protected $keyType = 'string';

    // Timestamps pakai nama Prisma (camelCase)
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $casts = [
        'isPemilikBisnis'  => 'boolean',
        'kontakPersonSama' => 'boolean',
        'fieldFeedback'    => 'array',
        'approvedAt'       => 'datetime',
        'createdAt'        => 'datetime',
        'updatedAt'        => 'datetime',
    ];

    protected $fillable = [
        'userId', 'mosqueName', 'mosqueAddress', 'province', 'regency',
        'district', 'village', 'postalCode', 'mosqueImage',
        'aktaPendirian', 'skKemenkumham', 'npwpMasjid',
        'namaDepan', 'namaBelakang', 'jenisKelamin', 'pekerjaan',
        'isPemilikBisnis', 'emailPerwakilan', 'tanggalLahir', 'nomorHandphone',
        'alamatTempat', 'jenisID', 'fotoKTP', 'nomorKTP', 'suratKuasa',
        'kontakPersonSama', 'skKepengurusan', 'suratRekomendasiRTRW',
        'fotoTampakDepan', 'fotoInterior', 'dokumenStatusTanah', 'ktpKetua',
        'npwpDokumen', 'adminEmail', 'adminPassword', 'status',
        'rejectionReason', 'fieldFeedback', 'approvedAt', 'approvedBy',
    ];

    protected $hidden = ['adminPassword'];

    // ─── Eloquent ORM: Relationships ────────────────────────────────────────

    /**
     * Relasi ke tabel users (shared dengan Next.js).
     * Foreign key pakai camelCase sesuai Prisma.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userId', 'id');
    }

    // ─── Accessors ──────────────────────────────────────────────────────────

    /** Nama lengkap perwakilan */
    public function getNamaLengkapAttribute(): string
    {
        return trim("{$this->namaDepan} {$this->namaBelakang}");
    }

    /** Alamat lengkap (kecamatan, kota, provinsi) */
    public function getAlamatLengkapAttribute(): string
    {
        return implode(', ', array_filter([
            $this->village,
            "Kec. {$this->district}",
            $this->regency,
            $this->province,
        ]));
    }

    // ─── Query Scopes ────────────────────────────────────────────────────────

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', 'rejected');
    }

    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->where(function (Builder $q) use ($term) {
            $q->where('mosqueName', 'ilike', "%{$term}%")
              ->orWhere('emailPerwakilan', 'ilike', "%{$term}%")
              ->orWhere('province', 'ilike', "%{$term}%")
              ->orWhere('regency', 'ilike', "%{$term}%");
        });
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    public function isPending(): bool   { return $this->status === 'pending'; }
    public function isApproved(): bool  { return $this->status === 'approved'; }
    public function isRejected(): bool  { return $this->status === 'rejected'; }
}
