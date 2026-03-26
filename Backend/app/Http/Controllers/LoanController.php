<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Loan;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        $loan = Loan::where('user_id', $request->user()->id)->get();

        return response()->json([
            'data' => $loan
        ]);
    }

    public function all()
    {
        $loan = Loan::all();

        return response()->json([
            'data' => $loan
        ]);
    }

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
            'amount' => 'required|integer',
            'tenor' => 'required|in:3 bulan,6 bulan,9 bulan,12 bulan,18 bulan,24 bulan',

            'ktp' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'npwp' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'business_photo.*' => 'nullable|file|mimes:jpg,jpeg,png|max:10240',
        ]);

        $year = Carbon::now()->format('Y');

        $lastLoan = Loan::whereYear('created_at', $year)->latest()->first();

        if ($lastLoan) {
            $lastNumber = (int) substr($lastLoan->loan_code, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        $loanCode = 'LN-' . $year . '-' . str_pad($newNumber, 4, '0', STR_PAD_LEFT);


        $loan = Loan::create([
            'loan_code' => $loanCode,
            'user_id' => $request->user()->id,
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
