<?php

namespace App\Livewire;

use Livewire\Attributes\On;
use Livewire\Component;

class UserList extends Component
{

    public $sortString;
    public $currentArray;

    public function render()
    {
        return view('livewire.user-list');
    }

    #[On('update-toptable')]
    public function renderNewData($sortString = null, $currentArray = null){
        if($sortString === null || $currentArray === null){
            return;
        }
        $this->sortString = $sortString;
        $this->currentArray = $currentArray;
    }
}
