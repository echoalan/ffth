<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
{
    /**
     * Buscar clientes por nombre (parcial, case insensitive).
     */
    public function buscarPorNombre(Request $request)
    {
        $nombre = trim($request->input('nombre'));

        if (!$nombre) {
            return response()->json([
                'success' => false,
                'error' => 'El parámetro "nombre" es requerido.'
            ], 400);
        }

        $clientes = DB::table('clientes as c')
            ->leftJoin('onus as o', function($join) {
                $join->whereRaw("RIGHT(TRIM(c.usuario), 6) = RIGHT(TRIM(o.serial_number), 6)");
            })
            ->where('c.nombre', 'LIKE', '%' . $nombre . '%')
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

        return response()->json([
            'success' => true,
            'message' => $clientes->isEmpty() 
                ? 'No se encontraron clientes con ese nombre.' 
                : 'Clientes encontrados.',
            'data' => $clientes
        ]);
    }

    public function listarClientes()
    {
        $clientes = DB::table('clientes as c')
            ->leftJoin('onus as o', function($join) {
                $join->whereRaw("RIGHT(TRIM(c.usuario), 6) = RIGHT(TRIM(o.serial_number), 6)");
            })
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
            ->orderBy('c.nombre', 'asc')
            ->paginate(20); // 👈 PAGINACIÓN

        return response()->json([
            'success' => true,
            'message' => 'Listado de clientes paginado.',
            'data' => $clientes
        ]);
    }


    public function asignarCaja(Request $request)
    {
      
        // Tomar los datos
        $clienteId = $request->input('cliente_id');
        $cajaId = $request->input('caja_id');

        // Actualizar la tabla clientes
        $updated = DB::table('clientes')
            ->where('id', $clienteId)
            ->update(['caja_id' => $cajaId]);

        if ($updated) {
            return response()->json([
                'success' => true,
                'message' => 'Caja asignada correctamente.'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo asignar la caja. Verifica el cliente.'
            ], 400);
        }
    }

    public function clientesConProblemas()
    {
        $clientes = DB::table('clientes as c')
            ->leftJoin('onus as o', function($join) {
                $join->whereRaw("RIGHT(TRIM(c.usuario), 6) = RIGHT(TRIM(o.serial_number), 6)");
            })
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
            ->where(function($q) {
                $q->where('o.status', '!=', 'Online')                      // offline
                ->orWhereRaw('CAST(o.rx_power AS DECIMAL(5,2)) < -29')   // muy bajo
                ->orWhereRaw('CAST(o.rx_power AS DECIMAL(5,2)) > -19');  // muy alto
            })
            ->orderBy('c.nombre', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Clientes con problemas en RX.',
            'data' => $clientes
        ]);
    }
}
