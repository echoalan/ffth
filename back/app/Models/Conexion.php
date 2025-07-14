<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Conexion extends Model
{
    protected $table = 'conexiones';

    protected $fillable = [
        'nodo_origen_id',
        'nodo_destino_id',
        'tipo_conexion',
        'numero_fibra',
        'ruta',
        'propiedades',
    ];

    protected $casts = [
        'ruta' => 'array',
        'propiedades' => 'array',
    ];

    // Relaciones

    public function nodoOrigen(): BelongsTo
    {
        return $this->belongsTo(Nodo::class, 'nodo_origen_id');
    }

    public function nodoDestino(): BelongsTo
    {
        return $this->belongsTo(Nodo::class, 'nodo_destino_id');
    }
}
