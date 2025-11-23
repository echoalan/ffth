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



    public function crearCliente(Request $request)
    {
        // Validación mínima
        $request->validate([
            'nombre'  => 'required|string|max:255',
            'usuario' => 'required|string|max:255'
        ]);

        // Crear cliente con valores mínimos
        $cliente = Cliente::create([
            'codigo'        => '',          // vacío
            'nombre'        => $request->nombre,
            'direccion'     => '',          // vacío
            'plan'          => '',          // vacío
            'usuario'       => $request->usuario,
            'fecha_inicio'  => now(),       // algo tiene que guardar, o Laravel se queja
            'caja_id'       => null         // sin caja por default
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cliente creado correctamente.',
            'data'    => $cliente
        ], 201);
    }


public function listarClientes()
{
    $clientes = DB::table('clientes as c')
        ->leftJoin('onus as o', function($join) {
            $join->on(DB::raw("RIGHT(TRIM(c.usuario), 6)"), '=', DB::raw("RIGHT(TRIM(o.serial_number), 6)"));
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
        ->paginate(20);

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

        public function clientesRxAlLimite()
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
                ->whereRaw("CAST(o.rx_power AS DECIMAL(5,3)) <= -27")
                ->orderBy('o.rx_power', 'desc')
                ->paginate(10);  

            return response()->json([
                'success' => true,
                'message' => 'Clientes con RX al límite (-28 dBm o peor).',
                'data' => $clientes
            ]);
        }
}
