<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
use App\Models\Product;
$first = Product::first();
if ($first) {
    echo $first->id; // output id
} else {
    echo 'no-product';
}
?>
