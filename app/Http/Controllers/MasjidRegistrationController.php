<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\MasjidRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasjidRegistrationController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'pending');
        $search = $request->get('search');

        $registrations = MasjidRegistration::when(
            in_array($status, ['pending', 'approved', 'rejected']),
            fn($q) => $q->where('status', $status)
        )
            ->when($search, fn($q) => $q->search($search))
            ->orderBy('createdAt', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('MasjidRegistrations/Index', [
            'registrations' => $registrations,
            'currentStatus' => $status,
            'search'        => $search,
            'counts' => [
                'pending'  => MasjidRegistration::pending()->count(),
                'approved' => MasjidRegistration::approved()->count(),
                'rejected' => MasjidRegistration::rejected()->count(),
            ],
        ]);
    }

    public function show(string $id)
    {
        $registration = MasjidRegistration::with('user')->findOrFail($id);

        return Inertia::render('MasjidRegistrations/Show', [
            'registration' => $registration,
        ]);
    }

    public function approve(string $id)
    {
        $registration = MasjidRegistration::findOrFail($id);

        $registration->update([
            'status'     => 'approved',
            'approvedAt' => now(),
            'approvedBy' => auth()->user()->email,
        ]);

        ActivityLog::log('approve_registration', "Approved mosque registration: {$registration->mosqueName}");

        // Kirim email notifikasi ke user
        $this->sendStatusEmail($registration, 'approved');

        return back()->with('success', "Pendaftaran {$registration->mosqueName} telah disetujui.");
    }

    public function reject(string $id, Request $request)
    {
        $request->validate([
            'reason'        => 'nullable|string|max:1000',
            'fieldFeedback' => 'nullable|string',
        ]);

        $registration = MasjidRegistration::findOrFail($id);

        $fieldFeedback = $request->fieldFeedback
            ? json_decode($request->fieldFeedback, true)
            : null;

        $registration->update([
            'status'          => 'rejected',
            'rejectionReason' => $request->reason,
            'fieldFeedback'   => $fieldFeedback,
        ]);

        ActivityLog::log('reject_registration', "Rejected mosque registration: {$registration->mosqueName}");

        // Kirim email notifikasi ke user
        $this->sendStatusEmail($registration, 'rejected', $request->reason, $fieldFeedback);

        return back()->with('success', "Pendaftaran {$registration->mosqueName} telah ditolak.");
    }

    /**
     * Kirim email status ke user via Next.js API (Resend).
     */
    private function sendStatusEmail(MasjidRegistration $reg, string $status, ?string $reason = null, ?array $fieldFeedback = null): void
    {
        $nextApiUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));

        try {
            $payload = [
                'email'         => $reg->emailPerwakilan,
                'mosqueName'    => $reg->mosqueName,
                'status'        => $status,
                'rejectionReason' => $reason,
                'fieldFeedback' => $fieldFeedback,
            ];

            \Illuminate\Support\Facades\Http::timeout(10)
                ->post("{$nextApiUrl}/api/mosque-registration-status", $payload);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Failed to send status email: {$e->getMessage()}");
        }
    }
}
