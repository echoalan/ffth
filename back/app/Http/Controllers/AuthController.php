<?php

namespace App\Http\Controllers;
use Illuminate\Validation\ValidationException;

use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Errores de validación',
                'errors' => $e->errors()
            ], 422);
        }
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
    
        return response()->json([
            'message' => 'Usuario creado con éxito',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {

        // Validar los datos de entrada
        $credentials = $request->only('email', 'password');
        $validator = \Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Errores de validación',
                'errors' => $validator->errors()
            ], 422);
        }
        // Intentar generar el token JWT
        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Credenciales inválidas'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'No se pudo crear el token'], 500);
        }
        // Retornar el token JWT
        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'token' => $token
        ], 200);

    }

    public function verifyToken()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['error' => 'Token inválido'], 401);
            }

            return response()->json(['message' => 'Token válido'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token inválido o expirado'], 401);
        }
    }
}
