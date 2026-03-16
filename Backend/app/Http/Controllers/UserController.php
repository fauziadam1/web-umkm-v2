<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'data' => $user
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|max:6|confirmed'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'Success',
            'message' => 'Register Success',
            'token' => $token,
            'data' => $user
        ], 200);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'message' => ['The provided credentials are incorrect.']
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'Success',
            'message' => 'Login Success',
            'token' => $token,
            'data' => $user
        ], 200);
    }

    public function update(Request $request)
    {
        $user = $request->user()->id;

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users',
        ]);

        $user->update(['name', 'email']);

        return response()->json([
            'status' => 'Success',
            'message' => 'Update Success',
            'data' => $user
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'Success',
            'message' => 'Logout Success'
        ], 200);
    }

    public function delete(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'password' => 'required|string'
        ]);

        if (!$request->password !== $user->password) {
            return response()->json([
                'message' => 'Password incorrect'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'status' => 'Success',
            'message' => 'Account deleted'
        ], 200);
    }
}
