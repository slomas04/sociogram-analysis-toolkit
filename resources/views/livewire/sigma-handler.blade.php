<div class="w-full min-h-screen flex items-center justify-center">
    @if($showOverlay)
        <div class="flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 p-4">
            <span class="text-2xl font-bold text-gray-800 dark:text-gray-200"> 
                {{ $overlayMessage }}
            </span>
        </div>
    @else
        <div id="container" class="h-screen w-full bg-white dark:bg-gray-900"></div>
        
    @endif
</div>
