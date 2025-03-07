<div class="w-1/5 h-1/5 border flex flex-row border-gray-800 dark:border-gray-200 py-2 px-2 my-2 rounded-md inline-block text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
    @isset($sortString)
    <span class="text-lg text-gray-700 dark:text-gray-300">Top users by {{ $sortString }}</span>
    @endisset
    @isset($currentArray)
        <div>
            @foreach ($currentArray as $arrayEntry)
                <span class="text-md text-gray-700 dark:text-gray-300">{{ $loop->index }} | {{ $arrayEntry['u'] }} | {{$arrayEntry['v']}}</span>
            @endforeach
        </div>
    @endisset
</div>
