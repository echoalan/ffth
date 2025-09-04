<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CajaController;
use App\Http\Controllers\ViviendaController;
use App\Http\Controllers\NodoController;
use App\Http\Controllers\ConexionController;
use App\Http\Controllers\ClienteController;

use Illuminate\Support\Facades\Route;

Route::middleware(['jwt.auth'])->group(function () {

   
});


 // Rutas de nodos
    Route::prefix('nodos')->group(function () {
        Route::get('/', [NodoController::class, 'index']);
        Route::post('/', [NodoController::class, 'store']);
        Route::get('/{id}', [NodoController::class, 'show']);
        Route::put('/{id}', [NodoController::class, 'update']);
        Route::delete('/{id}', [NodoController::class, 'destroy']);
        //clientes por nodo
        Route::get('/{id}/clientes', [NodoController::class, 'clientes']);
    });

    // Rutas de conexiones
    Route::prefix('conexiones')->group(function () {

        Route::get('/clientes-potencia', [ConexionController::class, 'clientesConPotencia']);

        Route::get('/', [ConexionController::class, 'index']);
        Route::post('/', [ConexionController::class, 'store']);
        Route::get('/{id}', [ConexionController::class, 'show']);
        Route::put('/{id}', [ConexionController::class, 'update']);
        Route::delete('/{id}', [ConexionController::class, 'destroy']);

      
    });

    Route::prefix('clientes')->group(function () {
        Route::post('/asignar-caja', [ClienteController::class, 'asignarCaja']);
        Route::post('/buscar', [ClienteController::class, 'buscarPorNombre']);// búsqueda por nombre
    });


// Usuarios y auth
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::get('/auth/verify', [AuthController::class, 'verifyToken']);

