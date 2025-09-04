<?php

namespace App\Http\Controllers;

use App\Models\Conexion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            'tipo_conexion' => 'required|in:FibraTroncal,Empalme,SplitterSalida,Cliente,CableMadre,FIBRA PON 3,FIBRA PON 4,FIBRA PON 5,FIBRA PON 6,Fibra',
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

    public function clientesConPotencia()
    {
        $result = DB::table('clientes as c')
            ->join('onus as o', function($join) {
                $join->whereRaw("RIGHT(TRIM(c.usuario), 6) = RIGHT(TRIM(o.serial_number), 6)");
            })
            ->select('c.usuario', 'o.rx_power', 'o.tx_power', 'o.status')
            ->get();

        $count = $result->count(); // Número de coincidencias

        return response()->json([
            'coincidencias' => $count,
            'datos' => $result
        ]);
    }


}
