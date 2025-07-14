<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cliente extends Model
{
    protected $table = 'clientes';

    protected $fillable = [
        'codigo',
        'nombre',
        'direccion',
        'plan',
        'usuario',
        'fecha_inicio',
        'caja_id',
    ];

    protected $dates = [
        'fecha_inicio',
        'created_at',
        'updated_at',
    ];

    // Relación con la caja (nodo tipo Splitter1x8)
    public function caja(): BelongsTo
    {
        return $this->belongsTo(Nodo::class, 'caja_id');
    }
}
