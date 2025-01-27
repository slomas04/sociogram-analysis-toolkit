<nav x-data="{ open: false }" class="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">

    <div class="h-full flex flex-col justify-even">

        <div class="flex flex-row justify-between align-center">
            <div class="w-full h-auto flex justify-center">
                <a href="{{ route('dashboard') }}">
                    <x-application-logo class="inline-block h-16 w-auto fill-current text-gray-800 dark:text-gray-200
                                               hover:bg-gray-200 hover:dark:bg-gray-700 m-4 p-3 rounded-lg" />
                </a>
            </div>
        </div>

        <div class="items-baseline cursor-pointer m-4 absolute top-0 left-0">
            <button id='toggle-theme' type="button" class="items-baseline text-white bg-gray-600 hover:text-gray-600 hover:bg-gray-500 dark:text-white dark:bg-gray-900 dark:hover:text-gray-900 dark:hover:bg-gray-700 rounded-lg p-2.5">
                <ion-icon name="moon-outline" id="theme-toggle-dark-icon" class="text-xl translate-y-1 hidden" fill="currentColor"></ion-icon>
                <ion-icon name="sunny-outline" id="theme-toggle-light-icon" class="text-xl translate-y-1 hidden" fill="currentColor"></ion-icon>
            </button>
        </div>

        <div class="grow mx-2">
            <hr class="mb-2">
            <span class="font-large text-base text-gray-800 dark:text-gray-200">Available Datasets: </span> 
            <livewire:dataset-list/>
        </div>

        <livewire:upload-form/>

        <div class="w-full h-12 flex flex-row align-bottom justify-between rounded-t-lg "> 
            <a href="{{ route('profile.edit') }}" class="h-12 w-4/5 block text-decoration-none rounded-tr-lg hover:bg-gray-200 hover:dark:bg-gray-700 p-4 align-baseline 
                                                    inline-flex items-center border-gray-200 dark:border-gray-700 border">
                <ion-icon name="person-outline" class="font-large text-base text-gray-800 dark:text-gray-200 mr-1"></ion-icon>
                <span class="font-medium text-base text-gray-800 dark:text-gray-200" >{{ Auth::user()->name }}</span>
            </a>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <ion-icon name="log-out-outline" class="font-large text-base text-gray-800 dark:text-gray-200 ml-2
                                                        p-4 hover:bg-gray-200 hover:dark:bg-gray-700 rounded-tl-lg hover:cursor-pointer
                                                        border-gray-200 dark:border-gray-700 border"
                    :href="route('logout')" onclick="event.preventDefault(); this.closest('form').submit();"></ion-icon>
            </form>
        </div>

    </div>

</nav>