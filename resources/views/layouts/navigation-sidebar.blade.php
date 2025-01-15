<nav x-data="{ open: false }" class="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">

    <div class="h-full min-w-64 max-w-64 flex flex-col justify-even">

        <div class="w-full h-auto flex justify-center">
            <a href="{{ route('dashboard') }}">
                <x-application-logo class="inline-block h-16 w-auto fill-current text-gray-800 dark:text-gray-200
                                           hover:bg-gray-200 hover:dark:bg-gray-700 m-4 p-3 rounded-lg" />
            </a>
        </div>

        <div class="grow mx-2">
            <hr class="mb-2">
            <span class="font-large text-base text-gray-800 dark:text-gray-200">Available Datasets: </span>  
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