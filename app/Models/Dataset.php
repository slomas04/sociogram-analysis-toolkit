<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dataset extends Model
{
    //
    protected $fillable = ['user-id', 'user-count', 'private-count', 'is-anon', 'is-global', 'file-name', 'mime-type', 'path', 'disk', 'size'];

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }
}
