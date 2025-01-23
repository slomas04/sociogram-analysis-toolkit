<div id="userDispbox" class="absolute left-0.5 top-0.5 flex flex-col rounded-md w-96 max-w-96 p-2 m-4 z-10 bg-gray-200 dark:bg-gray-700"> 
    @if($privateAccount)
        <!-- TODO:: CREATE PRIVATE ACCOUNT REFERENCE 
        <span class="text-xs  text-gray-700 dark:text-gray-300">Private Account</span> -->
    @endif
    @isset($username)
        <span class="text-xs  text-gray-700 dark:text-gray-300">User</span>
        <span class="text-base ml-4 text-gray-800 dark:text-gray-200">{{ $username }}</span>
    @endisset
    @isset($fullName)
        <span class="text-xs  text-gray-700 dark:text-gray-300">Full name</span>
        <span class="text-base ml-4 text-gray-800 dark:text-gray-200">{{ $fullName }}</span>
    @endisset
    <div class="flex flex-row align-baseline justify-evenly mt-2"> 
        @isset($followerCount)
            <div class="flex flex-col justify-center align-center bg-gray-100 dark:bg-gray-800 rounded-md p-2"> 
                <span class="text-base text-gray-800 dark:text-gray-200 align-center">{{ $followerCount }}</span>
                <span class="text-xs text-gray-700 dark:text-gray-300 align-center">Followers</span>
            </div>
        @endisset
        @isset($followingCount)
            <div class="flex flex-col justify-center bg-gray-100 dark:bg-gray-800 rounded-md p-2"> 
                <span class="text-base text-gray-800 dark:text-gray-200">{{ $followingCount }}</span>
                <span class="text-xs text-gray-700 dark:text-gray-300">Following</span>
            </div>
        @endisset
        @isset($postCount)
            <div class="flex flex-col justify-centerbg-gray-100 dark:bg-gray-800 rounded-md p-2"> 
                <span class="text-base  text-gray-800 dark:text-gray-200">{{ $postCount }}</span>
                <span class="text-xs text-gray-700 dark:text-gray-300">Posts</span>
            </div>
        @endisset
    </div>
    @isset($bio)
        <span class="text-xs  text-gray-700 dark:text-gray-300">Bio</span>
        <span class="text-base ml-4 text-gray-800 dark:text-gray-200">{{ $bio}}</span>
    @endisset
    @isset($url)
        <span class="text-xs  text-gray-700 dark:text-gray-300">Url</span>
        <span class="text-base ml-4 text-gray-800 dark:text-gray-200">{{$url}}</span>
    @endisset

</div>
