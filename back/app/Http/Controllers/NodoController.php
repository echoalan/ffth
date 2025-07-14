<?php

namespace App\Http\Controllers;

use App\Models\Nodo;
use Illuminate\Http\Request;

class NodoController extends Controller
{
    // Listar todos los nodos
    public function index()
    {
        return response()->json(Nodo::with(['conexionesOrigen.nodoDestino', 'conexionesDestino.nodoOrigen'])->get());
    }

    // Crear un nuevo nodo
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'nullable|string',
            'tipo' => 'required|in:OLT,Antena,CableMadre,Botella,Splitter1x4,Splitter1x8,Cliente',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'propiedades' => 'nullable|array',
        ]);

        $nodo = Nodo::create($data);

        return response()->json($nodo, 201);
    }

    // Mostrar un nodo específico
    public function show($id)
    {
        $nodo = Nodo::with(['conexionesOrigen.nodoDestino', 'conexionesDestino.nodoOrigen'])->findOrFail($id);
        return response()->json($nodo);
    }

    // Borrar un nodo
    public function destroy($id)
    {
        $nodo = Nodo::findOrFail($id);
        $nodo->delete();

        return response()->json(null, 204);
    }
}
