<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Storage;
use App\Models\Dataset;
use Illuminate\Validation\Rules\File;
use Illuminate\Support\Facades\Validator;

class UploadForm extends Component
{
    use WithFileUploads;

    public $file;
    public $isGlobal = true; 
    public $message = null;    
    public $isUploading = false; 

    protected $rules = [
        'file' => 'required|file|mimes:json|max:10240', // Max 10MB for the uploaded file
        'isGlobal' => 'boolean', 
    ];

    // Handle form submission
    public function submit()
    {
        $this->validate();

        // Set the upload state
        $this->isUploading = true;

        $file = $this->file;
        $fileContents = file_get_contents($file->getRealPath());
        $decodedJson = json_decode($fileContents, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->message = 'JSON format invalid! ' . json_last_error_msg();
            $this->isUploading = false;
            return;
        }

        $validationResult = $this->validateJsonStructure($decodedJson);
        if (isset($validationResult['error'])) {
            $this->message = $validationResult['error'];
            $this->isUploading = false;
            return;
        }

        $privateAccountCount = $validationResult['privateAccounts'];
        $userCount = count($decodedJson['users']);
        $isAnonymous = $decodedJson['anonymous'];

        // Store the file
        $path = $file->storeAs('datasets', $file->getClientOriginalName(), 'public');

        // Save data to the database
        Dataset::query()->create([
            'user-count'    => $userCount,
            'private-count' => $privateAccountCount,
            'is-anon'       => $isAnonymous,
            'is-global'     => $this->isGlobal,
            'file-name'     => $file->getClientOriginalName(),
            'mime-type'     => $file->getClientMimeType(),
            'path'          => $path,
            'disk'          => 'local',
            'file_hash'     => hash_file('md5', storage_path('app/public/' . $path)),
            'size'          => $file->getSize(),
        ]);

        session()->flash('message', 'File uploaded successfully!');
        $this->reset();
        $this->emit('closeModal');

        $this->isUploading = false;
    }

    public function resetFields()
    {
        $this->reset(['file', 'message', 'isGlobal']); // Reset selected properties
    }

    public function render()
    {
        return view('livewire.upload-form');
    }

    /**
     * Validate JSON structure and content.
     */
    public function validateJsonStructure(array $decodedJson)
    {
        $privateAccounts = 0;

        if (!isset($decodedJson['anonymous']) || !is_bool($decodedJson['anonymous'])) {
            return ['error' => '"anonymous" must be a boolean.'];
        }
        
        if (!isset($decodedJson['fileCreated']) || !is_numeric($decodedJson['fileCreated'])) {
            return ['error' => '"fileCreated" must be a numeric timestamp.'];
        }
    
        if (!isset($decodedJson['fileUpdated']) || !is_numeric($decodedJson['fileUpdated'])) {
            return ['error' => '"fileUpdated" must be a numeric timestamp.'];
        }
    
        if (!isset($decodedJson['users']) || !is_array($decodedJson['users'])) {
            return ['error' => '"users" must be an array.'];
        }
    
        foreach ($decodedJson['users'] as $user) {
            if (!isset($user['id']) || !is_string($user['id'])) {
                return ['error' => 'User must have a valid "id" string.'];
            }
    
            if (!isset($user['username']) || !is_string($user['username'])) {
                return ['error' => 'User must have a valid "username" string.'];
            }
    
            if (!isset($user['follower_count']) || !is_int($user['follower_count'])) {
                return ['error' => 'User must have a valid "follower_count" integer.'];
            }
    
            if (!isset($user['following_count']) || !is_int($user['following_count'])) {
                return ['error' => 'User must have a valid "following_count" integer.'];
            }
    
            if (isset($user['url']) && !is_string($user['url']) && $user['url'] !== null) {
                return ['error' => 'User "url" must be a string or null.'];
            }
    
            if (!isset($user['is_private']) || !is_bool($user['is_private'])) {
                return ['error' => 'User must have a valid "is_private" boolean.'];
            }
    
            if (!isset($user['bio']) || !is_string($user['bio'])) {
                return ['error' => 'User must have a valid "bio" string.'];
            }
    
            if (!isset($user['full_name']) || !is_string($user['full_name'])) {
                return ['error' => 'User must have a valid "full_name" string.'];
            }
    
            if (!isset($user['post_count']) || !is_int($user['post_count'])) {
                return ['error' => 'User must have a valid "post_count" integer.'];
            }

            if (!isset($user['following'])) {
                $privateAccounts++;
            }
    
            if (isset($user['following']) && is_array($user['following'])) {
                foreach ($user['following'] as $following) {
                    if (!is_array($following)) {
                        return ['error' => 'Each "following" entry must be an array with a user ID and username.'];
                    }
                }
            }
        }

        return ['privateAccounts' => $privateAccounts];
    }
}
