<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Dataset;
use Illuminate\Support\Facades\Auth;
use phpDocumentor\Reflection\Types\True_;


class DatasetList extends Component
{
    public function render()
    {
        $userDatasets = Dataset::whereNot('is-global', true)->where('user-id', Auth::id())->get();
        $globalDatasets = Dataset::where('is-global', true)->get();


        return view('livewire.dataset-list', ['userDatasets' => $userDatasets, 'globalDatasets' => $globalDatasets]);
    }

    protected $listeners = [
        'dataset-created' => '$refresh',
        'dataset-deleted' => '$refresh'
    ];
}
