<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBoxRequest extends FormRequest
{
    public function authorize()
    {
        return true;  // Aquí puedes agregar lógica para determinar si el usuario tiene permisos para actualizar
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'weight' => 'required|numeric',
            'dimensions' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => "El nombre del empaque es requerido",
            'name.string' => "El nombre del empaque debe ser una cadena de texto",
            'name.max' => "El nombre del empaque no debe exceder los 255 caracteres",
            'weight.required' => "El peso del empaque es requerido",
            'weight.numeric' => "El peso del empaque debe ser un número",
            'dimensions.required' => "Las dimensiones del empaque son requeridas",
            'dimensions.string' => "Las dimensiones del empaque deben ser una cadena de texto",
            'dimensions.max' => "Las dimensiones del empaque no deben exceder los 255 caracteres",
        ];
    }
}
