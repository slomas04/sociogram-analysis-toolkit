<div class="rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-gray-300 hover:dark:bg-gray-700 p-3 m-2 flex flex-col align-center hover:cursor-pointer" 
wire:click="broadcastClickGraph">

    <span class="font-large text-base text-gray-800 dark:text-gray-200 text-center inline-block">{{ $datasetName }}</span>
    
    <div class="flex flex-row justify-evenly mt-3">

        <div class="rounded-lg bg-gray-200 dark:bg-gray-800 p-2">
            <ion-icon wire:ignore name="person-outline" class="font-large text-base text-gray-800 dark:text-gray-200 mr-1 translate-y-0.5"></ion-icon>
            <span class="font-large text-base text-gray-800 dark:text-gray-200">{{ $userCount }}</span>
        </div>

        <div class="rounded-lg bg-gray-200 dark:bg-gray-800 p-2">
            <ion-icon wire:ignore name="lock-closed-outline" class="font-large text-base text-gray-800 dark:text-gray-200 mr-1 translate-y-0.5"></ion-icon>
            <span class="font-large text-base text-gray-800 dark:text-gray-200">{{ $privateCount }}</span>
        </div>

        @if($isGlobal)
        <div class="rounded-lg bg-gray-200 dark:bg-gray-800 p-2">
            <ion-icon wire:ignore name="earth-outline" class="font-large text-base text-gray-800 dark:text-gray-200 translate-y-0.5"></ion-icon>
        </div>
        @endif

        @if($isAnonymous)
        <div class="rounded-lg bg-gray-200 dark:bg-gray-800 p-2">
            <ion-icon wire:ignore name="shield-outline" class="font-large text-base text-gray-800 dark:text-gray-200 translate-y-0.5"></ion-icon>
        </div>
        @endif
    </div>
</div>
