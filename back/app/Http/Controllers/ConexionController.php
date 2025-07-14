<?php

namespace App\Http\Controllers;

use App\Models\Conexion;
use Illuminate\Http\Request;

class ConexionController extends Controller
{
    // Listar conexiones
    public function index()
    {
        return response()->json(Conexion::with(['nodoOrigen', 'nodoDestino'])->get());
    }

    // Crear conexión
    public function store(Request $request)
    {
        $data = $request->validate([
            'nodo_origen_id' => 'required|exists:nodos,id',
            'nodo_destino_id' => 'required|exists:nodos,id',
            'tipo_conexion' => 'required|in:FibraTroncal,Empalme,SplitterSalida,Cliente,CableMadre,PON 3,PON 4,PON 5,PON 6,Fibra',
            'numero_fibra' => 'nullable|integer',
            'ruta' => 'nullable|array',
            'propiedades' => 'nullable',
        ]);

        $conexion = Conexion::create($data);

        return response()->json($conexion, 201);
    }

    // Mostrar conexión específica
    public function show($id)
    {
        $conexion = Conexion::with(['nodoOrigen', 'nodoDestino'])->findOrFail($id);
        return response()->json($conexion);
    }

    // Borrar conexión
    public function destroy($id)
    {
        $conexion = Conexion::findOrFail($id);
        $conexion->delete();

        return response()->json(null, 204);
    }
}
