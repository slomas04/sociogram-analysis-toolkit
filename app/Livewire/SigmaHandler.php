<?php

namespace App\Livewire;

use Livewire\Attributes\On;
use Livewire\Component;

class SigmaHandler extends Component
{
    public $showOverlay = false;
    public $overlayMessage = "Select a dataset to start";

    public function render()
    {
        return view('livewire.sigma-handler');
    }

    #[On('showDataset')]
    public function loadGraph($path){
        /*
        $this->overlayMessage = "Loading dataset...";
        $this->showOverlay = true;

        sleep(3);

        $this->showOverlay = false;
        $this->overlayMessage = "Select a dataset to start";
        */
        
    }
}
