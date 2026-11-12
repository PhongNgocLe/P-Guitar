<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatbotTest extends TestCase
{
    use RefreshDatabase;

    public function test_chatbot_answers_greetings_and_store_policy_questions()
    {
        $this->postJson('/api/chatbot', ['message' => 'Xin chào shop'])
            ->assertOk()
            ->assertJsonStructure(['answer']);

        $response = $this->postJson('/api/chatbot', ['message' => 'Chính sách bảo hành thế nào?']);

        $response->assertOk();
        $this->assertStringContainsString('phiếu bảo hành', $response->json('answer'));
        $this->assertStringContainsString('/about#warranty-policy', $response->json('answer'));
    }

    public function test_chatbot_searches_products_and_returns_price_stock_and_detail_link()
    {
        $product = Product::query()->forceCreate([
            'name' => 'Chatbot Acoustic Guitar',
            'category' => 'ACOUSTIC',
            'tag' => 'TEST',
            'price' => 1250000,
            'origPrice' => null,
            'stock_quantity' => 3,
            'inStock' => true,
            'img' => '/guitar.jpg',
            'specs' => 'Body: Mahogany',
        ]);

        $response = $this->postJson('/api/chatbot', ['message' => 'Tư vấn guitar acoustic']);

        $response->assertOk();
        $answer = $response->json('answer');
        $this->assertStringContainsString($product->name, $answer);
        $this->assertStringContainsString('1.250.000₫', $answer);
        $this->assertStringContainsString('Còn 3 sản phẩm', $answer);
        $this->assertStringContainsString('/product/' . $product->id, $answer);
    }

    public function test_chatbot_validates_empty_and_overlong_messages()
    {
        $this->postJson('/api/chatbot', ['message' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors('message');

        $this->postJson('/api/chatbot', ['message' => str_repeat('a', 501)])
            ->assertStatus(422)
            ->assertJsonValidationErrors('message');
    }
}
