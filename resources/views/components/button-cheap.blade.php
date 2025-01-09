<button {{ $attributes->merge(['class' => "h-12 w-4/5 block text-decoration-none rounded-lg hover:bg-gray-200 hover:dark:bg-gray-700 p-4 m-4 align-baseline inline-flex items-center border-gray-200 dark:border-gray-700 border"]) }}>
    {{ $slot }}
</button>