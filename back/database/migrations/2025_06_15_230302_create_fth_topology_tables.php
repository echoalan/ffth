<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFthTopologyTables extends Migration
{
    public function up()
    {
        Schema::create('nodos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->nullable();
            $table->enum('tipo', ['OLT', 'CableMadre', 'Botella', 'Splitter1x4', 'Splitter1x8']);
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->json('propiedades')->nullable();
            $table->timestamps();
        });

        Schema::create('conexiones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nodo_origen_id')->constrained('nodos')->onDelete('cascade');
            $table->foreignId('nodo_destino_id')->constrained('nodos')->onDelete('cascade');
            $table->enum('tipo_conexion', ['FibraTroncal', 'PON 1', 'PON 2', 'PON 3', 'PON 4', 'PON 5', 'PON 6', 'PON 8', 'PON 9', 'PON 10', 'Fibra'])->default('Fibra');
            $table->integer('numero_fibra')->nullable();
            $table->json('ruta')->nullable();  // array ordenado de puntos lat/lng para las esquinas
            $table->json('propiedades')->nullable();
            $table->timestamps();

            $table->unique(['nodo_origen_id', 'nodo_destino_id', 'numero_fibra']);
        });

        Schema::create('clientes', function (Blueprint $table) {
            $table->id(); // Id
            $table->string('codigo'); // Código
            $table->string('nombre'); // Cliente (nombre)
            $table->string('direccion'); // Dirección
            $table->string('plan'); // Plan
            $table->string('usuario'); // Usuario
            $table->date('fecha_inicio'); // Fecha de inicio

            // Relación con caja (Splitter1x8) que está en nodos
            $table->unsignedBigInteger('caja_id')->nullable();
            $table->foreign('caja_id')
                ->references('id')
                ->on('nodos')
                ->nullOnDelete(); // si la caja se elimina, deja null en cliente

            $table->timestamps(); // created_at y updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('clientes');
        Schema::dropIfExists('conexiones');
        Schema::dropIfExists('nodos');
    }
}
