<?php

namespace App\Livewire;

use Livewire\Component;

class DatasetListComponent extends Component
{
    public $datasetName;
    public $userCount;
    public $isAnonymous;
    public $isGlobal;
    public $privateCount;

    public function mount($dataset = null){
        $tmpName = substr($dataset['file-name'], strrpos($dataset['file-name'], '/'));
        $this->datasetName = $tmpName;
        $this->userCount = $dataset['user-count'];
        $this->privateCount = $dataset['private-count'];
        $this->isAnonymous = $dataset['is-anon'];
        $this->isGlobal = $dataset['is-global'];
    }

    public function render()
    {
        return view('livewire.dataset-list-component');
    }
}
