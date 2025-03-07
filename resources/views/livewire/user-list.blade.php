<div class="border h-full flex flex-row border-gray-800 dark:border-gray-200 flex flex-col py-2 px-2 my-2 rounded-md inline-block text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
    @isset($sortString)
    <span class="text-lg text-gray-700 dark:text-gray-300">Top users by {{ $sortString }}</span>
    @endisset
    <hr class="my-2">
    <div class="overflow-y-scroll">
        @isset($currentArray)
            <table class="table-fixed">
                <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Value</th>
                </tr>
                @foreach ($currentArray as $arrayEntry)
                    <tr class="text-center mx-2">
                        <td>{{ $loop->index + 1 }}</td>
                        <td>{{ $arrayEntry[0] }}</td>
                        <td>{{$arrayEntry[1]}}</td>
                    </tr>
                @endforeach
            </table>
        @endisset
    </div>
    
</div>
