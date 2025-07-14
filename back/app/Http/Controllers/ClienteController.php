<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * Buscar clientes por nombre (parcial, case insensitive).
     */
    public function buscarPorNombre(Request $request)
    {
        // Obtener y limpiar el nombre del body JSON
        $nombre = trim($request->input('nombre'));

        // Validar que se haya enviado y no sea vacío
        if (!$nombre) {
            return response()->json([
                'success' => false,
                'error' => 'El parámetro "nombre" es requerido.'
            ], 400);
        }

        // Buscar clientes que contengan el nombre (insensible a mayúsculas/minúsculas)
        $clientes = Cliente::where('nombre', 'LIKE', '%' . $nombre . '%')->get();

        // Responder con resultados, aunque sea un array vacío
        return response()->json([
            'success' => true,
            'message' => $clientes->isEmpty() 
                ? 'No se encontraron clientes con ese nombre.' 
                : 'Clientes encontrados.',
            'data' => $clientes
        ]);
    }
}
