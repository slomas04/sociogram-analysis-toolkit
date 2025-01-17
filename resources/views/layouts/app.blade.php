<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="base_url" content="{{ URL::to('/') }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen h-full bg-gray-100 dark:bg-gray-900 w-screen overflow-hidden flex">
            <div class="min-w-64 max-w-64 w-64 bg-gray-800">
                @include('layouts.navigation-sidebar')
            </div>
            
            <div class="flex-1 min-h-screen">
                {{ $slot }}
            </div>
        </div>
    </body>
</html>
