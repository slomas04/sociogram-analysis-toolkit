<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dataset extends Model
{
    //
    protected $fillable = ['user-count', 'private-count', 'is-anon', 'is-global', 'file-name', 'mime-type', 'path', 'disk', 'file-hash', 'size'];
}
