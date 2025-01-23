<?php

namespace App\Livewire;

use Livewire\Attributes\On;
use Livewire\Component;

class UserDisplayBox extends Component
{

    public $username;
    public $bio;
    public $followerCount;
    public $followingCount;
    public $postCount;
    public $fullName;
    public $url;
    public $privateAccount;

    public function mount($username = null, 
                          $bio = null,
                          $followerCount = null,
                          $followingCount = null,
                          $postCount = null,
                          $fullName = null,
                          $url = null,
                          $privateAccount = null ){
        $this->username = $username;
        $this->bio = $bio;
        $this->followerCount = $followerCount;
        $this->followingCount = $followingCount;
        $this->postCount = $postCount;
        $this->fullName = $fullName;
        $this->url = $url;
        $this->privateAccount = $privateAccount;
    }

    public function render()
    {
        return view('livewire.user-display-box');
    }

    #[On('update-userbox')]
    public function updateData($label = null, 
                                $bio = null, 
                                $follower_count = null, 
                                $following_count = null, 
                                $post_count = null, 
                                $full_name = null, 
                                $url = null){
        $this->username = $label;
        $this->bio = $bio;
        $this->followerCount = $follower_count;
        $this->followingCount = $following_count;
        $this->postCount = $post_count;
        $this->fullName = $full_name;
        $this->url = $url;
        $this->privateAccount = !isset($post_count);
    }
}
