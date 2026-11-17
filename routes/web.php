<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\InquiryController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::post('/inquiry', [InquiryController::class, 'store'])
    ->middleware(['throttle:5,1'])
    ->name('inquiry.store');
