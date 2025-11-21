<?php

namespace App\Http\Controllers;

use App\Models\Nodo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
    
    public function clientes($id)
    {
        $nodo = Nodo::findOrFail($id);

        if ($nodo->tipo !== 'Splitter1x8') {
            return response()->json(['error' => 'El nodo seleccionado no es una caja (Splitter1x8)'], 400);
        }

        $clientes = DB::table('clientes as c')
            ->leftJoin('onus as o', function($join) {
                $join->whereRaw("RIGHT(TRIM(c.usuario), 6) = RIGHT(TRIM(o.serial_number), 6)");
            })
            ->where('c.caja_id', $nodo->id) // 🔹 solo clientes de esa caja
            ->select(
                'c.id',
                'c.usuario', 
                'c.nombre', 
                'c.plan',
                'c.fecha_inicio',
                'c.direccion',
                'c.caja_id',
                'o.serial_number', 
                'o.rx_power', 
                'o.tx_power', 
                'o.temperature',
                'o.status',
                'o.distance'
            )
            ->get();

        return response()->json($clientes);
    }
    // Borrar un nodo
    public function destroy($id)
    {
        $nodo = Nodo::findOrFail($id);
        $nodo->delete();

        return response()->json(null, 204);
    }
}
