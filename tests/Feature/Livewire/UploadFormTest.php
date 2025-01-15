<?php

namespace Tests\Feature\Livewire;

use App\Livewire\UploadForm;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Livewire\Livewire;
use Tests\TestCase;

class UploadFormTest extends TestCase
{
    /** @test */
    public function renders_successfully()
    {
        Livewire::test(UploadForm::class)
            ->assertStatus(200);
    }
}
