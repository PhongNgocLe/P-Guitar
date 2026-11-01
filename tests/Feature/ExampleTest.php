<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_example()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_homepage_receives_products_from_the_database()
    {
        $product = Product::query()->forceCreate([
            'name' => 'Database guitar',
            'category' => 'ELECTRIC',
            'tag' => 'TEST',
            'price' => 1000000,
            'origPrice' => null,
            'stock_quantity' => 3,
            'inStock' => true,
            'img' => 'https://example.com/guitar.jpg',
            'specs' => 'Body: Mahogany',
        ]);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
            ->has('categories', 4)
            ->where('products.0.id', $product->id)
            ->where('products.0.name', 'Database guitar')
        );
    }
}
