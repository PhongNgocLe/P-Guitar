<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Show product detail page.
     *
     * @param  \App\Models\Product  $product (Route model binding)
     * @return \Inertia\Response
     */
    public function show(Product $product)
    {
        // Load images relationship
        $product->load('images');

        // Fetch related products: same category, exclude current, limit 4
        $related = Product::where('category', $product->category)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return Inertia::render('Product/Detail', [
            'product' => $product,
            'related' => $related,
        ]);
    }
}
