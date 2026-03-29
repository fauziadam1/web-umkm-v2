<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::put('/user', [UserController::class, 'update']);
    Route::delete('/user', [UserController::class, 'delete']);

    Route::post('/loan', [LoanController::class, 'store']);
    Route::get('/loans', [LoanController::class, 'index']);
    Route::get('/admin/loans', [LoanController::class, 'all']);
    Route::put('/approved/loan/{loan}', [LoanController::class, 'approved']);
    Route::put('/reject/loan/{loan}', [LoanController::class, 'reject']);
    Route::put('/success/loan/{loan}', [LoanController::class, 'superApproved']);
    Route::get('/installment/{loan}', [LoanController::class, 'generateInstallments']);

    Route::get('/document/{loan}', [DocumentController::class, 'index']);
});

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::get('/document/download/{id}', [DocumentController::class, 'download']);
