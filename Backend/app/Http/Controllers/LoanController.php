<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Loan;
use App\Models\Installment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        $loan = Loan::where('user_id', $request->user()->id)->with('installments')->get();

        return response()->json([
            'data' => $loan
        ]);
    }

    public function all()
    {
        $loan = Loan::with('installments')->get();

        return response()->json([
            'data' => $loan
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'      => 'required',
            'email'          => 'required|email',
            'telp'           => 'required',
            'business_name'  => 'required',
            'address'        => 'required',
            'purpose'        => 'required',
            'amount'         => 'required|integer',
            'norek'         => 'required',
            'tenor'          => 'required|',
            'ktp'            => 'required|array|min:1',
            'ktp.*'          => 'file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'npwp'           => 'required|array|min:1',
            'npwp.*'         => 'file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
        ]);

        $year = Carbon::now()->format('Y');
        $lastLoan = Loan::whereYear('created_at', $year)->latest()->first();

        $number = $lastLoan ? (int) substr($lastLoan->loan_code, -4) + 1 : 1;
        $loanCode = 'LN-' . $year . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);

        $loan = Loan::create([
            'loan_code'     => $loanCode,
            'user_id'       => $request->user()->id,
            'name'     => $request->name,
            'norek'     => $request->norek,
            'email'         => $request->email,
            'telp'          => $request->telp,
            'request_date'  => now(),
            'business_name' => $request->business_name,
            'address'       => $request->address,
            'purpose'       => $request->purpose,
            'amount'        => $request->amount,
            'tenor'         => $request->tenor,
        ]);

        $this->generateInstallments($loan);

        $uploadFiles = function ($files, $type) use ($loan) {
            foreach ($files as $file) {
                $name = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('documents', $name, 'public');

                Document::create([
                    'loan_id' => $loan->id,
                    'type'    => $type,
                    'path'    => $path,
                ]);
            }
        };

        if ($request->hasFile('ktp')) {
            $uploadFiles($request->file('ktp'), 'ktp');
        }

        if ($request->hasFile('npwp')) {
            $uploadFiles($request->file('npwp'), 'npwp');
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Loan berhasil dibuat',
            'data'    => $loan
        ], 200);
    }

    public function generateInstallments($loan)
    {
        $P = $loan->amount;      // total pinjaman
        $n = $loan->tenor;       // jumlah bulan
        $r = 0.12 / 12;          // bunga 12% per tahun → per bulan

        $A = $P * ($r * pow(1 + $r, $n)) / (pow(1 + $r, $n) - 1);

        $balance = $P;

        for ($i = 1; $i <= $n; $i++) {

            $interest = $balance * $r;
            $principal = $A - $interest;
            $balance = $balance - $principal;

            Installment::create([
                'loan_id' => $loan->id,
                'installment_number' => $i,
                'due_date' => now()->addMonths($i),
                'amount' => round($A, 2),
                'principal' => round($principal, 2),
                'interest' => round($interest, 2),
                'remaining_balance' => round(max($balance, 0), 2),
                'status' => 'pending'
            ]);
        }
    }

    public function approved(Request $request, $id)
    {
        $loan = Loan::findOrFail($id);

        $request->validate([
            'status' => "sometimes|required|string"
        ]);

        $data = $request->only([
            'status'
        ]);

        $loan->update($data);

        return response()->json([
            'status' => 'success',
            'message' => "Pinjaman disetujui",
            'data' => $loan
        ], 200);
    }

    public function superApproved(Request $request, $id)
    {
        $loan = Loan::findOrFail($id);

        $request->validate([
            'status' => "sometimes|required|string"
        ]);

        $data = $request->only([
            'status'
        ]);

        $loan->update($data);

        return response()->json([
            'status' => 'success',
            'message' => "Pinjaman berhasil",
            'data' => $loan
        ], 200);
    }

    public function reject(Request $request, $id)
    {
        $loan = Loan::findOrFail($id);

        $request->validate([
            'status' => "sometimes|required|string"
        ]);

        $data = $request->only([
            'status'
        ]);

        $loan->update($data);

        return response()->json([
            'status' => 'success',
            'message' => "Pinjaman ditolak",
            'data' => $loan
        ], 200);
    }
}
