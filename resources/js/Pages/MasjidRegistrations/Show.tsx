import DashboardLayout from '@/Layouts/DashboardLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
  CheckCircle2, XCircle, AlertCircle, Eye, X,
  Building2, FileText, Users, ShieldCheck, ChevronDown, ChevronUp, Trash2
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FieldFeedback {
  status: 'ok' | 'rejected';
  reason?: string;
  imageUrl?: string; // base64 preview
  imageFile?: File;
}

interface Registration {
  id: string;
  mosqueName: string; mosqueAddress: string; province: string; regency: string;
  district: string; village: string; rt: string; rw: string; mosqueImage: string | null;
  aktaPendirian: string | null; skKemenkumham: string | null; npwpMasjid: string | null;
  suratPernyataan: string | null;
  namaLengkap: string; namaDepan: string; namaBelakang: string; jenisKelamin: string; pekerjaan: string;
  emailPerwakilan: string; tanggalLahir: string; nomorHandphone: string;
  alamatTempat: string; nomorKTP: string; fotoKTP: string | null; imageKTP: string | null; jenisID: string;
  skKepengurusan: string | null; suratRekomendasiRTRW: string | null;
  fotoTampakDepan: string | null; fotoInterior: string | null;
  dokumenStatusTanah: string | null; ktpKetua: string | null; npwpDokumen: string | null;
  adminEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null; fieldFeedback: Record<string, FieldFeedback> | null;
  approvedAt: string | null; approvedBy: string | null; createdAt: string;
}

interface Props {
  auth: { user: { name: string; email: string } };
  registration: Registration;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return map[s] ?? 'bg-gray-100 text-gray-800';
};

const isImageUrl = (url: string | null) =>
  url && /^https?:\/\//i.test(url) && /\.(jpg|jpeg|png|webp|gif)$/i.test(url);

// Also handle internal /api/files/[id] URLs served from Next.js
const isViewableFile = (url: string | null) =>
  url && (isImageUrl(url) || /\/api\/files\/[a-f0-9-]+$/i.test(url));

// ─── Sub-components ───────────────────────────────────────────────────────────

// Resolve /api/files/[id] URLs to the Next.js app origin
const NEXTJS_URL = (import.meta as any).env?.VITE_NEXTJS_URL || 'http://localhost:3000'
const resolveFileUrl = (url: string) =>
  url.startsWith('/api/files/') ? `${NEXTJS_URL}${url}` : url

function ImagePreviewModal({ url, onClose }: { url: string; onClose: () => void }) {
  const src = resolveFileUrl(url)
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <button className="absolute right-4 top-4 rounded-full bg-white/20 p-2 hover:bg-white/30" onClick={onClose}>
        <X className="h-5 w-5 text-white" />
      </button>
      <img src={src} alt="preview" className="max-h-[90vh] max-w-full rounded-lg object-contain" onClick={e => e.stopPropagation()} />
    </div>
  );
}

function SectionCard({ title, icon: Icon, color, children, defaultOpen = true }: {
  title: string; icon: React.ElementType; color: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-gray-900">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="divide-y divide-gray-100 px-5 pb-5">{children}</div>}
    </div>
  );
}

// ─── FieldRow ─────────────────────────────────────────────────────────────────

function FieldRow({
  fieldKey, label, value, isFile, feedback, onChange, readonly,
}: {
  fieldKey: string; label: string; value: string | null | undefined;
  isFile?: boolean; feedback: FieldFeedback | undefined;
  onChange: (key: string, fb: FieldFeedback | undefined) => void;
  readonly: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [reason, setReason] = useState(feedback?.reason ?? '');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [feedbackImage, setFeedbackImage] = useState<string | null>(feedback?.imageUrl ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  const status = feedback?.status;

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setFeedbackImage(url);
      onChange(fieldKey, { status: 'rejected', reason, imageUrl: url, imageFile: file });
    };
    reader.readAsDataURL(file);
  };

  const markOk = () => {
    onChange(fieldKey, { status: 'ok' });
    setExpanded(false);
  };

  const markReject = () => {
    setExpanded(true);
  };

  const saveReject = () => {
    onChange(fieldKey, { status: 'rejected', reason, imageUrl: feedbackImage ?? undefined });
    setExpanded(false);
  };

  const clearFeedback = () => {
    onChange(fieldKey, undefined);
    setReason('');
    setFeedbackImage(null);
    setExpanded(false);
  };

  return (
    <div className="py-3">
      <div className="flex items-start justify-between gap-3">
        {/* Label + value */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500">{label}</p>
          {isFile ? (
            value ? (
              <div className="mt-0.5 flex items-center gap-2">
                <span className="truncate text-sm text-gray-900">{value.split('/').pop()}</span>
                {isViewableFile(value) && (
                  <button type="button" onClick={() => setPreviewUrl(value)} className="shrink-0 rounded p-0.5 hover:bg-gray-100">
                    <Eye className="h-4 w-4 text-blue-500" />
                  </button>
                )}
              </div>
            ) : <p className="mt-0.5 text-sm text-gray-400 italic">Tidak diupload</p>
          ) : (
            <p className="mt-0.5 text-sm text-gray-900">{value || <span className="italic text-gray-400">-</span>}</p>
          )}
        </div>

        {/* Status indicator + actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {status === 'ok' && (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              <CheckCircle2 className="h-3 w-3" /> OK
            </span>
          )}
          {status === 'rejected' && (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              <XCircle className="h-3 w-3" /> Ditolak
            </span>
          )}

          {!readonly && (
            <>
              {status !== 'ok' && (
                <button type="button" onClick={markOk} title="Tandai OK"
                  className="rounded-lg p-1.5 text-green-600 hover:bg-green-50">
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
              {status !== 'rejected' && (
                <button type="button" onClick={markReject} title="Tandai Bermasalah"
                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                  <XCircle className="h-4 w-4" />
                </button>
              )}
              {status && (
                <button type="button" onClick={clearFeedback} title="Hapus feedback"
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Existing rejection detail (readonly) */}
      {status === 'rejected' && !expanded && (feedback?.reason || feedback?.imageUrl) && (
        <div className="mt-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 space-y-1.5">
          {feedback.reason && <p>{feedback.reason}</p>}
          {feedback.imageUrl && (
            <button type="button" onClick={() => setPreviewUrl(feedback.imageUrl!)}
              className="flex items-center gap-1 font-medium underline">
              <Eye className="h-3 w-3" /> Lihat gambar bukti
            </button>
          )}
        </div>
      )}

      {/* Rejection form */}
      {expanded && (
        <div className="mt-2 space-y-2 rounded-xl border border-red-200 bg-red-50 p-3">
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={2}
            placeholder="Jelaskan masalah pada field ini..."
            className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          {/* Image upload */}
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
            {feedbackImage ? (
              <div className="relative inline-block">
                <img src={feedbackImage} alt="bukti" className="h-24 rounded-lg object-cover cursor-pointer" onClick={() => setPreviewUrl(feedbackImage)} />
                <button type="button" onClick={() => setFeedbackImage(null)}
                  className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5 text-white">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-red-300 px-3 py-2 text-xs text-red-600 hover:bg-red-100">
                <Eye className="h-3.5 w-3.5" /> Upload gambar bukti (opsional)
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={saveReject}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">
              Simpan
            </button>
            <button type="button" onClick={() => setExpanded(false)}
              className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50">
              Batal
            </button>
          </div>
        </div>
      )}

      {previewUrl && <ImagePreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Show({ auth, registration }: Props) {
  const readonly = registration.status !== 'pending';

  // Per-field feedback state
  const [fieldFeedback, setFieldFeedback] = useState<Record<string, FieldFeedback>>(
    registration.fieldFeedback ?? {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [globalReason, setGlobalReason] = useState(registration.rejectionReason ?? '');

  const updateField = (key: string, fb: FieldFeedback | undefined) => {
    setFieldFeedback(prev => {
      const next = { ...prev };
      if (fb === undefined) delete next[key];
      else next[key] = fb;
      return next;
    });
  };

  const hasRejectedFields = Object.values(fieldFeedback).some(f => f.status === 'rejected');

  const handleApprove = () => {
    if (!confirm(`Setujui pendaftaran ${registration.mosqueName}?`)) return;
    router.post(`/masjid-registrations/${registration.id}/approve`);
  };

  const handleReject = () => {
    setSubmitting(true);
    // Serialize feedback (strip File objects — only send base64 imageUrl + reason)
    const payload: Record<string, { status: string; reason?: string; imageUrl?: string }> = {};
    Object.entries(fieldFeedback).forEach(([k, v]) => {
      payload[k] = { status: v.status, reason: v.reason, imageUrl: v.imageUrl };
    });
    router.post(`/masjid-registrations/${registration.id}/reject`, {
      reason: globalReason,
      fieldFeedback: JSON.stringify(payload),
    }, { onFinish: () => { setSubmitting(false); setShowRejectConfirm(false); } });
  };

  const handleDelete = () => {
    router.delete(`/masjid-registrations/${registration.id}`, {
      onFinish: () => setShowDeleteConfirm(false),
    });
  };

  const fieldProps = (key: string, label: string, value: string | null | undefined, isFile = false) => ({
    fieldKey: key, label, value, isFile, feedback: fieldFeedback[key], onChange: updateField, readonly,
  });

  return (
    <DashboardLayout auth={auth}>
      <div className="mx-auto max-w-4xl space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/masjid-registrations" className="text-sm text-blue-600 hover:underline">
              ← Kembali
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">{registration.mosqueName}</h1>
            <p className="text-sm text-gray-500">
              Didaftarkan {new Date(registration.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusBadge(registration.status)}`}>
              {registration.status}
            </span>
            <div className="flex gap-2">
              {!readonly && (
                <>
                  <button onClick={handleApprove}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                    Setujui
                  </button>
                  <button onClick={() => setShowRejectConfirm(true)}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                    Tolak
                  </button>
                </>
              )}
              {readonly && (
                <button onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" /> Hapus
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Hint ── */}
        {!readonly && (
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Klik <strong>✓</strong> untuk menandai field OK, atau <strong>✗</strong> untuk menandai bermasalah dan tambahkan alasan + gambar bukti. Setelah selesai, klik <strong>Tolak</strong> untuk mengirim feedback.</span>
          </div>
        )}

        {/* ── Existing rejection feedback ── */}
        {registration.status === 'rejected' && registration.rejectionReason && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-800">Alasan Penolakan Global:</p>
            <p className="mt-1 text-sm text-red-700">{registration.rejectionReason}</p>
          </div>
        )}

        {/* ── Data Masjid ── */}
        <SectionCard title="Data Masjid" icon={Building2} color="bg-blue-600">
          <FieldRow {...fieldProps('mosqueName', 'Nama Masjid', registration.mosqueName)} />
          <FieldRow {...fieldProps('mosqueImage', 'Foto Masjid', registration.mosqueImage, true)} />
          <FieldRow {...fieldProps('mosqueAddress', 'Alamat Lengkap', registration.mosqueAddress)} />
          <FieldRow {...fieldProps('province', 'Provinsi', registration.province)} />
          <FieldRow {...fieldProps('regency', 'Kota/Kabupaten', registration.regency)} />
          <FieldRow {...fieldProps('district', 'Kecamatan', registration.district)} />
          <FieldRow {...fieldProps('village', 'Kelurahan/Desa', registration.village)} />
          <FieldRow {...fieldProps('rt', 'RT', registration.rt)} />
          <FieldRow {...fieldProps('rw', 'RW', registration.rw)} />
        </SectionCard>

        {/* ── Data Legalitas ── */}
        <SectionCard title="Data Legalitas" icon={FileText} color="bg-emerald-600">
          <FieldRow {...fieldProps('aktaPendirian', 'Akta Pendirian', registration.aktaPendirian, true)} />
          <FieldRow {...fieldProps('skKemenkumham', 'SK Kemenkumham', registration.skKemenkumham, true)} />
          <FieldRow {...fieldProps('npwpDokumen', 'Dokumen NPWP', registration.npwpDokumen, true)} />
          <FieldRow {...fieldProps('suratPernyataan', 'Surat Pernyataan Pendirian', registration.suratPernyataan, true)} />
        </SectionCard>

        {/* ── Perwakilan Resmi ── */}
        <SectionCard title="Perwakilan Resmi" icon={Users} color="bg-purple-600">
          <FieldRow {...fieldProps('jenisID', 'Jenis ID', registration.jenisID ?? 'KTP')} />
          <FieldRow {...fieldProps('fotoKTP', `Foto ${registration.jenisID ?? 'KTP'}`, registration.fotoKTP, true)} />
          <FieldRow {...fieldProps('imageKTP', `Selfie memegang ${registration.jenisID ?? 'KTP'}`, registration.imageKTP, true)} />
          <FieldRow {...fieldProps('namaLengkap', 'Nama Lengkap', registration.namaLengkap || `${registration.namaDepan} ${registration.namaBelakang}`.trim())} />
          <FieldRow {...fieldProps('jenisKelamin', 'Jenis Kelamin', registration.jenisKelamin)} />
          <FieldRow {...fieldProps('pekerjaan', 'Pekerjaan', registration.pekerjaan)} />
          <FieldRow {...fieldProps('emailPerwakilan', 'Email', registration.emailPerwakilan)} />
          <FieldRow {...fieldProps('tanggalLahir', 'Tanggal Lahir', registration.tanggalLahir)} />
          <FieldRow {...fieldProps('nomorHandphone', 'Nomor Handphone', registration.nomorHandphone)} />
          <FieldRow {...fieldProps('alamatTempat', 'Alamat Tempat Tinggal', registration.alamatTempat)} />
        </SectionCard>

        {/* ── Akun Admin ── */}
        <SectionCard title="Akun Admin" icon={ShieldCheck} color="bg-gray-700">
          <FieldRow {...fieldProps('adminEmail', 'Email Admin', registration.adminEmail)} />
          {registration.approvedBy && (
            <div className="py-3">
              <p className="text-xs font-medium text-gray-500">Disetujui oleh</p>
              <p className="mt-0.5 text-sm text-gray-900">{registration.approvedBy}</p>
            </div>
          )}
        </SectionCard>

        {/* ── Delete confirm modal ── */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Hapus Pendaftaran</h3>
              </div>
              <p className="text-sm text-gray-600">
                Apakah Anda yakin ingin menghapus pendaftaran <strong>{registration.mosqueName}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="mt-5 flex gap-2">
                <button onClick={handleDelete}
                  className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700">
                  Ya, Hapus
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-lg border py-2 text-sm hover:bg-gray-50">
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Reject confirm modal ── */}
        {showRejectConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900">Konfirmasi Penolakan</h3>
              <p className="mt-1 text-sm text-gray-500">
                {hasRejectedFields
                  ? `${Object.values(fieldFeedback).filter(f => f.status === 'rejected').length} field ditandai bermasalah.`
                  : 'Tidak ada field yang ditandai bermasalah.'}
              </p>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">Alasan penolakan global (opsional)</label>
                <textarea
                  value={globalReason}
                  onChange={e => setGlobalReason(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="Ringkasan alasan penolakan..."
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={handleReject} disabled={submitting}
                  className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                  {submitting ? 'Memproses...' : 'Tolak Pendaftaran'}
                </button>
                <button onClick={() => setShowRejectConfirm(false)}
                  className="flex-1 rounded-lg border py-2 text-sm hover:bg-gray-50">
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
