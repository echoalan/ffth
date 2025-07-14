<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Nodo extends Model
{
    protected $table = 'nodos';

    protected $fillable = [
        'nombre',
        'tipo',
        'lat',
        'lng',
        'propiedades',
    ];

    protected $casts = [
        'lat' => 'float',
        'lng' => 'float',
        'propiedades' => 'array',
    ];

    // Relaciones

    // Conexiones donde este nodo es el origen
    public function conexionesOrigen(): HasMany
    {
        return $this->hasMany(Conexion::class, 'nodo_origen_id');
    }

    // Conexiones donde este nodo es el destino
    public function conexionesDestino(): HasMany
    {
        return $this->hasMany(Conexion::class, 'nodo_destino_id');
    }

    // Clientes vinculados a esta caja (nodo tipo Splitter1x8)
    public function clientes(): HasMany
    {
        return $this->hasMany(Cliente::class, 'caja_id');
    }
}
