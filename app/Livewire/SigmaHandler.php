<?php

namespace App\Livewire;

use Livewire\Component;

class SigmaHandler extends Component
{
    public $showOverlay = false;
    public $overlayMessage = "Select a dataset to start";

    public function render()
    {
        return view('livewire.sigma-handler');
    }

    public function loadGraph($path)
    {
        // Dispatch an event to JavaScript with the dataset path
        $this->dispatchBrowserEvent('graphDataReady', ['path' => $path]);
    }
}

