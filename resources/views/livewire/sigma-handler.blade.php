<div class="w-full min-h-screen flex items-center justify-center">
    @if($showOverlay)
        <div class="flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 p-4">
            <span class="text-2xl font-bold text-gray-800 dark:text-gray-200"> 
                {{ $overlayMessage }}
            </span>
        </div>
    @else
        <div id="container" wire:key="graphContainer-key" class="h-screen w-full bg-white relative dark:bg-gray-900">
            @livewire('user-display-box', [], key("user-display-box"))
            
            <!-- Container For Layout options, top right -->
            <div class="absolute right-0.5 top-0.5 flex flex-row px-2 z-10"> 
                <button id="layout_fa2" class="border border-gray-800 dark:border-gray-200 p-2  my-2 rounded-l-md cursor-pointer inline-block hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"> 
                    <span class="text-gray-800 dark:text-gray-200 flex flex-row">
                        <ion-icon name="play-outline" id="fa2_start" class="text-xl translate-y-1"></ion-icon>
                        <ion-icon name="pause-outline" id="fa2_stop" class="text-xl translate-y-1 hidden"></ion-icon>
                        Force Atlas 2
                    </span>
                </button>
                <button id="layout_noverlap" class="border border-l-0 border-gray-800 dark:border-gray-200 p-2 mr-4 my-2 rounded-r-md cursor-pointer inline-block hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"> 
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

            <div class="absolute w-72 right-0.5 top-16 flex flex-col px-2 z-10"> 
                <input id="searchbox" placeholder="Search for a node..." class="rounded-md text-gray-800 dark:text-gray-200 border border-2-0 border-gray-800 dark:border-gray-200 bg-white dark:bg-gray-900">
            </div>

            <!-- Container for node size metrics, bottom left (vertical) -->
            <div class="absolute left-0.5 bottom-0.5 flex flex-col px-2 z-10">
                <button id="metric_indegree" class="group/1 w-fit border flex flex-row border-gray-800 dark:border-gray-200 py-2 px-2 my-2 rounded-md cursor-pointer inline-block hover:bg-gray-100 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 bg-white dark:bg-gray-900">
                    <ion-icon name="arrow-back-outline" class="text-lg group-hover/1:translate-y-1"></ion-icon>
                    <span class="ml-2 text-md hidden group-hover/1:block">in-degree</span>
                </button>

                <button id="metric_outdegree" class="group/2 w-fit border flex flex-row border-gray-800 dark:border-gray-200 py-2 px-2 my-2 rounded-md cursor-pointer inline-block hover:bg-gray-100 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 bg-white dark:bg-gray-900">
                    <ion-icon name="arrow-forward-outline" class="text-lg group-hover/2:translate-y-1"></ion-icon>
                    <span class="ml-2 text-md hidden group-hover/2:block">out-degree</span>
                </button>

                <button id="metric_between" class="group/3 w-fit border flex flex-row border-gray-800 dark:border-gray-200 py-2 px-2 my-2 rounded-md cursor-pointer inline-block hover:bg-gray-100 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 bg-white dark:bg-gray-900">
                    <ion-icon name="chevron-collapse-outline" class="text-lg group-hover/3:translate-y-1"></ion-icon>
                    <span class="ml-2 text-md hidden group-hover/3:block">betweenness centrality</span>
                </button>

                <button id="metric_close" class="group/4 w-fit border flex flex-row border-gray-800 dark:border-gray-200 py-2 px-2 my-2 rounded-md cursor-pointer inline-block hover:bg-gray-100 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 bg-white dark:bg-gray-900">
                    <ion-icon name="code-outline" class="text-lg group-hover/4:translate-y-1"></ion-icon>
                    <span class="ml-2 text-md hidden group-hover/4:block">closeness centrality</span>
                </button>

                <button id="metric_degree" class="group/5 w-fit border flex flex-row border-gray-800 dark:border-gray-200 py-2 px-2 my-2 rounded-md cursor-pointer inline-block hover:bg-gray-100 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 bg-white dark:bg-gray-900">
                    <ion-icon name="thermometer-outline" class="text-lg group-hover/5:translate-y-1"></ion-icon>
                    <span class="ml-2 text-md hidden group-hover/5:block">degree centrality</span>
                </button>

                <button id="metric_eigen" class="group/6 w-fit border flex flex-row border-gray-800 dark:border-gray-200 py-2 px-2 my-2 rounded-md cursor-pointer inline-block hover:bg-gray-100 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 bg-white dark:bg-gray-900">
                    <ion-icon name="stats-chart-outline" class="text-lg group-hover/6:translate-y-1"></ion-icon>
                    <span class="ml-2 text-md hidden group-hover/6:block">eigenvector centrality</span>
                </button>

                <button id="metric_pagerank" class="group/7 w-fit border flex flex-row border-gray-800 dark:border-gray-200 py-2 px-2 my-2 rounded-md cursor-pointer inline-block hover:bg-gray-100 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 bg-white dark:bg-gray-900">
                    <ion-icon name="trending-up-outline" class="text-lg group-hover/7:translate-y-1"></ion-icon>
                    <span class="ml-2 text-md hidden group-hover/7:block">pagerank</span>
                </button>
            </div>
        </div>
    @endif
</div>

