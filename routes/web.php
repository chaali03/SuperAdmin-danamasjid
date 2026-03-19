<?php

use App\Http\Controllers\MasjidRegistrationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/dashboard');
    }
    return redirect('/login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Masjid Registration Management
    Route::prefix('masjid-registrations')->name('masjid-registrations.')->group(function () {
        Route::get('/', [MasjidRegistrationController::class, 'index'])->name('index');
        Route::get('/{id}', [MasjidRegistrationController::class, 'show'])->name('show');
        Route::post('/{id}/approve', [MasjidRegistrationController::class, 'approve'])->name('approve');
        Route::post('/{id}/reject', [MasjidRegistrationController::class, 'reject'])->name('reject');
    });
});
