<div class="w-full min-h-screen flex items-center justify-center">
    @if($showOverlay)
        <div class="flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 p-4">
            <span class="text-2xl font-bold text-gray-800 dark:text-gray-200"> 
                {{ $overlayMessage }}
            </span>
        </div>
    @else
        <div id="container" wire:key="graphContainer-key" class="h-screen w-full bg-white dark:bg-gray-900">
            <div class="absolute right-0.5 top-0.5 flex flex-row px-2 z-10"> 
                <button id="layout_fa2" class="border border-gray-800 dark:border-gray-200 p-2  my-2 rounded-l-md cursor-pointer inline-block hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"> 
                    <span class="text-gray-800 dark:text-gray-200 flex flex-row">
                        <ion-icon name="play-outline" id="fa2_start" class="text-xl translate-y-1"></ion-icon>
                        <ion-icon name="pause-outline" id="fa2_stop" class="text-xl translate-y-1 hidden"></ion-icon>
                        Force Atlas 2
                    </span>
                </button>
                <button id="layout_noverlap" class="border border-gray-800 dark:border-gray-200 p-2 mr-4 my-2 rounded-r-md cursor-pointer inline-block hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"> 
                    <span class="text-gray-800 dark:text-gray-200 flex flex-row">
                        <ion-icon name="play-outline" id="noverlap_start" class="text-xl translate-y-1"></ion-icon>
                        <ion-icon name="pause-outline" id="noverlap_stop" class="text-xl translate-y-1 hidden"></ion-icon>
                        Noverlap
                    </span>
                </button>
                <button id="layout_random" class="border border-gray-800 dark:border-gray-200 p-2 my-2 rounded-l-md cursor-pointer inline-block hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"> 
                    <span class="text-gray-800 dark:text-gray-200">
                        <ion-icon name="dice-outline" class="text-xl translate-y-1"></ion-icon>
                        Random Layout
                    </span>
                </button>
                <button id="layout_circular" class="border border-l-0 border-gray-800 dark:border-gray-200 p-2 my-2 rounded-r-md cursor-pointer inline-block hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"> 
                    <span class="text-gray-800 dark:text-gray-200">
                        <ion-icon name="ellipse-outline" class="text-xl translate-y-1"></ion-icon>
                        Circular Layout
                    </span>
                </button>
            </div>
        </div>
    @endif
</div>

<script>
    document.addEventListener('livewire:load', function () {
        // Listen for the custom event emitted by Livewire
        Livewire.on('graphDataReady', function(path) {
            console.log('Received path: ', path);
            
            // Handle Sigma graph initialization here
            let graphPromise = new Promise((resolve, reject) => {
                generateGraph(path)
                    .then(resolve)
                    .catch(reject);
            });

            graphPromise.then(
                (returnGraph) => {
                    // Ensure Sigma instance is properly set up
                    const sigmaInstance = new Sigma(new Graph({ multi: true }), document.getElementById("container"));
                    sigmaInstance.getCamera().setState({
                        angle: 0.2,
                    });

                    sigmaInstance.setGraph(returnGraph);
                    sigmaInstance.refresh();
                    
                    // Optionally call refresh again to ensure the graph renders
                    setTimeout(() => {
                        sigmaInstance.refresh();
                    }, 100); // Small delay to ensure DOM is updated

                },
                (returnError) => {
                    console.log(returnError);
                }
            );
        });
    });
</script>
