<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddVnpayFieldsToOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                if (! Schema::hasColumn('orders', 'payment_status')) {
                    $table->string('payment_status', 50)->default('unpaid')->after('payment_method');
                }
                if (! Schema::hasColumn('orders', 'vnp_transaction_no')) {
                    $table->string('vnp_transaction_no', 100)->nullable()->after('payment_status');
                }
                if (! Schema::hasColumn('orders', 'vnp_bank_code')) {
                    $table->string('vnp_bank_code', 50)->nullable()->after('vnp_transaction_no');
                }
                if (! Schema::hasColumn('orders', 'paid_at')) {
                    $table->dateTime('paid_at')->nullable()->after('vnp_bank_code');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                $columns = ['payment_status', 'vnp_transaction_no', 'vnp_bank_code', 'paid_at'];
                foreach ($columns as $column) {
                    if (Schema::hasColumn('orders', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }
    }
}
