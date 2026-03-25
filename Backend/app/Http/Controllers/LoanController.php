<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Loan;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email',
            'telp' => 'required|string',
            'business_name' => 'required|string',
            'address' => 'required|string',
            'purpose' => 'required|string',
            'amount' => 'required|string',
            'tenor' => 'required|in:3 bulan,6 bulan,9 bulan,12 bulan,18 bulan,24 bulan',
            'revenue' => 'required|in:Rp 300 Juta - 499 Juta per bulan,Rp 500 Juta - 1 Miliar per bulan,Rp 2 - 5 Miliar per bulan,> 5 Miliar per bulan',

            'ktp' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'npwp' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'business_photo.*' => 'nullable|file|mimes:jpg,jpeg,png|max:10240',
        ]);

        $loan = Loan::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'telp' => $request->telp,
            'request_date' => now(),
            'business_name' => $request->business_name,
            'address' => $request->address,
            'purpose' => $request->purpose,
            'amount' => $request->amount,
            'tenor' => $request->tenor,
            'revenue' => $request->revenue,
        ]);

        if ($request->hasFile('ktp')) {
            $path = $request->file('ktp')->store('documents', 'public');

            Document::create([
                'loan_id' => $loan->id,
                'type' => 'ktp',
                'path' => $path
            ]);
        }

        if ($request->hasFile('npwp')) {
            $path = $request->file('npwp')->store('documents', 'public');

            Document::create([
                'loan_id' => $loan->id,
                'type' => 'npwp',
                'path' => $path
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Loan created',
            'data' => $loan
        ], 200);
    }
}
