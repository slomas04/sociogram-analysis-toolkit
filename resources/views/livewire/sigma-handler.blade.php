<div class="w-full min-h-screen flex items-center justify-center">
    @if($showOverlay)
        <div class="flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 p-4">
            <span class="text-2xl font-bold text-gray-800 dark:text-gray-200"> 
                {{ $overlayMessage }}
            </span>
        </div>
    @else
        <div id="container" wire:key="graphContainer-key" class="h-screen w-full bg-white dark:bg-gray-900"></div>
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
