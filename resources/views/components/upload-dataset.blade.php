<div class="justify-center full-width">

    <x-button-cheap x-data="" x-on:click.prevent="$dispatch('open-modal', 'upload-file-modal')">
        <ion-icon name="cloud-upload-outline" class="font-large text-base text-gray-800 dark:text-gray-200 mr-1"></ion-icon>
        <span class="font-medium text-base text-gray-800 dark:text-gray-200" >Upload Dataset</span></button>
    </x-button-cheap>
    
    <x-modal name="upload-file-modal" focusable>
        <form method="post" action="{{ route('database.store') }}" class="p-6">
            @csrf
            @method('post')

            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ __('Are you sure you want to delete your account?') }}
            </h2>

            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ __('Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.') }}
            </p>

            <div class="mt-6 flex justify-end">
                <x-button-cheap x-on:click="$dispatch('close')">
                    <ion-icon name="close-outline" class="font-large text-base text-gray-800 dark:text-gray-200 mr-1"></ion-icon>
                    <span class="font-medium text-base text-gray-800 dark:text-gray-200" >Close</span></button>
                </x-button-cheap>

                <x-button-cheap type='submit'>
                    <ion-icon name="cloud-upload-outline" class="font-large text-base text-gray-800 dark:text-gray-200 mr-1"></ion-icon>
                    <span class="font-medium text-base text-gray-800 dark:text-gray-200" >Upload</span></button>
                </x-button-cheap>
            </div>
        </form>
    </x-modal>
</div>
