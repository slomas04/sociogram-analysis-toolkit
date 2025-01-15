<div class="overflow-y-scroll overflow-x-hidden max-h-[calc(99vh-250px)] pr-2">
    <span class="inline-block font-large text-base text-gray-800 dark:text-gray-200 float-right px-3 py-1 my-1 rounded-lg bg-gray-300 dark:bg-gray-700">Your Datasets </span> 
    <div class="flex flex-col clear-both">
        @forelse($userDatasets as $userDataset)
            @livewire('dataset-list-component', ['dataset' => $userDataset], key($userDataset->id))
        @empty
            <span class="font-large text-base text-gray-800 dark:text-gray-200">You have no datasets!</span> 
        @endforelse
    </div>
    <span class="inline-block font-large text-base text-gray-800 dark:text-gray-200 float-right text-right px-3 py-1 my-1 rounded-lg bg-gray-300 dark:bg-gray-700">Global Datasets </span> 
    <div class="flex flex-col clear-both">
        @forelse($globalDatasets as $globalDataset)
        @livewire('dataset-list-component', ['dataset' => $globalDataset], key($globalDataset->id))
        @empty
            <span class="font-large text-base text-gray-800 dark:text-gray-200">No global datasets!</span> 
        @endforelse
    </div>
</div>
