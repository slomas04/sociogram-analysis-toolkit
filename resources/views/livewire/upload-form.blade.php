<div class="justify-center full-width">
    <x-button-cheap x-data="" x-on:click.prevent="$dispatch('open-modal', 'upload-file-modal')">
        <ion-icon wire:ignore name="cloud-upload-outline" class="font-large text-base text-gray-800 dark:text-gray-200 mr-1"></ion-icon>
        <span class="font-medium text-base text-gray-800 dark:text-gray-200">Upload Dataset</span>
    </x-button-cheap>

    <x-modal name="upload-file-modal" focusable>
        <form wire:submit.prevent="submit" class="p-6">
            @csrf
            @method('post')

            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ __('Upload a .json database file') }}
            </h2>

            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ __('Database file must be acquired from the companion scraping tool.') }}
            </p>

            <div class="mt-4">
                <input type="file" wire:model="file" class="form-input mt-1 block w-full">
                @error('file') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
            </div>

            <div class="mt-4 flex items-center">
                <input type="checkbox" wire:model="isGlobal" id="isGlobal" class="mr-2">
                <label for="isGlobal" class="text-sm text-gray-600 dark:text-gray-400">Make this dataset global</label>
            </div>

            @isset($message)
            <div class="text-red-500 mt-4">
                {{ $message }}
            </div>
            @endisset

            @if (session()->has('message'))
                <div class="text-green-500 mt-4">
                    {{ session('message') }}
                </div>
            @endif

            @if ($isUploading)
                <div class="mt-4 text-gray-500">Uploading...</div>
            @endif

            <div class="mt-6 flex justify-end">
                <x-button-cheap x-on:click="$dispatch('close')">
                    <ion-icon wire:ignore name="close-outline" class="font-large text-base text-gray-800 dark:text-gray-200 mr-1"></ion-icon>
                    <span class="font-medium text-base text-gray-800 dark:text-gray-200">Close</span>
                </x-button-cheap>

                <x-button-cheap type="submit" wire:loading.attr="disabled">
                    <ion-icon wire:ignore name="cloud-upload-outline" class="font-large text-base text-gray-800 dark:text-gray-200 mr-1"></ion-icon>
                    <span class="font-medium text-base text-gray-800 dark:text-gray-200">Upload</span>
                </x-button-cheap>
            </div>
        </form>
    </x-modal>
</div>
