<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateAndSeedCategoriesTable extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name', 100)->unique();
                $table->string('slug', 100)->unique();
            });
        }

        $categories = [
            ['name' => 'Acoustic', 'slug' => 'acoustic'],
            ['name' => 'Electric', 'slug' => 'electric'],
            ['name' => 'Classic', 'slug' => 'classic'],
            ['name' => 'Phụ kiện', 'slug' => 'phu-kien'],
        ];

        foreach ($categories as $category) {
            $existing = DB::table('categories')
                ->where('slug', $category['slug'])
                ->orWhere('name', $category['name'])
                ->first();

            if ($existing) {
                DB::table('categories')->where('id', $existing->id)->update([
                    'name' => $category['name'],
                    'slug' => $category['slug'],
                ]);
            } else {
                DB::table('categories')->insert($category);
            }
        }

        if (Schema::hasTable('products')) {
            foreach ([
                'ELECTRIC' => 'Electric',
                'ACOUSTIC' => 'Acoustic',
                'CLASSIC' => 'Classic',
                'CUSTOM' => 'Classic',
                'ACCESSORIES' => 'Phụ kiện',
                'PHỤ KIỆN' => 'Phụ kiện',
            ] as $oldName => $newName) {
                DB::table('products')->where('category', $oldName)->update([
                    'category' => $newName,
                ]);
            }
        }

        DB::table('categories')
            ->whereIn(DB::raw('LOWER(slug)'), ['custom', 'custom-shop', 'accessories'])
            ->delete();
    }

    public function down()
    {
        // Categories may have existed before this migration or been added by an administrator.
    }
}
