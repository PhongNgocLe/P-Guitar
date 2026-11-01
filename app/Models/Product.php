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
        'stock_quantity',
        'img',
        'specs',
    ];

    protected $casts = [
        'price' => 'float',
        'origPrice' => 'float',
        'inStock' => 'boolean',
        'stock_quantity' => 'integer',
    ];

    public function getInStockAttribute($value)
    {
        if (array_key_exists('stock_quantity', $this->attributes)) {
            return (int) $this->attributes['stock_quantity'] > 0;
        }

        return (bool) $value;
    }

    public function attributesToArray()
    {
        $attributes = parent::attributesToArray();

        if (array_key_exists('stock_quantity', $this->attributes)) {
            $attributes['inStock'] = (int) $this->attributes['stock_quantity'] > 0;
        }

        return $attributes;
    }

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