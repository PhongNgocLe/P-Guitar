<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInventoryAndStockReceiptsTables extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedInteger('stock_quantity')->default(0);
        });

        Schema::create('stock_receipts', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('received_at');
            $table->timestamps();
        });

        Schema::create('stock_receipt_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('stock_receipt_id');
            $table->unsignedInteger('product_id')->nullable();
            $table->string('product_name');
            $table->unsignedInteger('quantity');
            $table->index('product_id');
            $table->foreign('stock_receipt_id')
                ->references('id')
                ->on('stock_receipts')
                ->onDelete('cascade');
            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('stock_receipt_items');
        Schema::dropIfExists('stock_receipts');

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('stock_quantity');
        });
    }
}
