<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductImage;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'category',
        'tag',
        'price',
        'origPrice',
        'inStock',
        'img',
        'specs',
    ];

    protected $casts = [
        'price' => 'float',
        'origPrice' => 'float',
        'inStock' => 'boolean',
    ];

    public function getSpecsAttribute($value)
    {
        if (! is_string($value) || trim($value) === '') {
            return [];
        }

        $specs = [];

        foreach (preg_split('/[|\\r\\n]+/', $value) as $spec) {
            $parts = explode(':', $spec, 2);

            if (count($parts) === 2) {
                $specs[strtolower(trim($parts[0]))] = trim($parts[1]);
            }
        }

        return $specs;
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }
}