<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'firstname',
        'lastname',
        'telp',
        'email',
        'request_date',
        'business_name',
        'address',
        'purpose',
        'amount',
        'tenor',
        'revenue',
        'status'
    ];
}
