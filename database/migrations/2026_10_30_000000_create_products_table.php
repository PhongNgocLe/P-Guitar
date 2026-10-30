<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('category', 100);
            $table->string('tag', 100)->nullable();
            $table->decimal('price', 12, 2);
            $table->decimal('origPrice', 12, 2)->nullable();
            $table->boolean('inStock')->default(true);
            $table->string('img', 500);
            $table->text('specs')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}
