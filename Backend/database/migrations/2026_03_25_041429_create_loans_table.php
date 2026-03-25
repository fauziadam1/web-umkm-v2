<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->string('firstname', 255);
            $table->string('lastname', 255);
            $table->string('telp', 20);
            $table->string('email');
            $table->date('request_date');
            $table->string('business_name');
            $table->text('address');
            $table->text('purpose');
            $table->string('amount');
            $table->enum('tenor', ['3 bulan', '6 bulan', '9 bulan', '12 bulan', '18 bulan', '24 bulan']);
            $table->enum('revenue', ['Rp 300 Juta - 499 Juta per bulan', 'Rp 500 Juta - 1 Miliar per bulan', 'Rp 2 - 5 Miliar per bulan ', '> 5 Miliar per bulan']);
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
