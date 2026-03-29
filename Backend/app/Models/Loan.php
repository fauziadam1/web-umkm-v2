<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'loan_code',
        'user_id',
        'name',
        'norek',
        'telp',
        'email',
        'request_date',
        'business_name',
        'address',
        'purpose',
        'amount',
        'tenor',
        'status'
    ];

    public function installments()
    {
        return $this->hasMany(Installment::class);
    }
}
