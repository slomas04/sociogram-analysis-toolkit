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
        Schema::create('datasets', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user-id');
            $table->foreign('user-id')->references('id')->on('users')->onDelete('cascade');

            $table->bigInteger('user-count');
            $table->bigInteger('private-count');
            $table->boolean('is-anon');
            $table->boolean('is-global');

            $table->string('file-name')->unique();
            $table->string('mime-type');
            $table->string('path');
            $table->string('disk')->default('local');
            $table->unsignedBigInteger('size');

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('datasets');
    }
};
