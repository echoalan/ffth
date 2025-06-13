<?php
// Asegúrate de que Composer esté instalado en tu servidor
$output = null;
$resultCode = null;

// Ejecutar Composer install
exec('composer install --no-dev --optimize-autoloader', $output, $resultCode);

// Mostrar el resultado
echo '<pre>';
echo "Result Code: $resultCode\n";
echo "Output:\n";
print_r($output);
echo '</pre>';