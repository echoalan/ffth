<?php


use App\Http\Controllers\AuthController;
use App\Http\Controllers\MovementsController;
use Illuminate\Support\Facades\Route;



Route::middleware(['jwt.auth'])->group(function () {

   

});


//usuarios y auth

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::get('/auth/verify', [AuthController::class, 'verifyToken']);