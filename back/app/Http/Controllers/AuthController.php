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
                'password' => 'required|string|min:6|confirmed',
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

   // Validar los datos recibidos
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6'
        ]);


        $credentials = [
            'email' => $validatedData['email'],
            'password' => $validatedData['password']
        ];

        try{
            if(!$token = JWTAuth::attempt($credentials)){
                return response()->json(['error' => 'algo mal']);
            }
        }catch(JWTException){
            return response()->json(['error' => 'no se pudo generar el token'], 500);
        }

        return response()->json(['token' => $token]);

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
