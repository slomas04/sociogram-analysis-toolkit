<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;


class DatabaseController extends Controller
{
    public function store(): RedirectResponse{

        return Redirect::to('/');
    }
}
