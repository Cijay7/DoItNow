<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        // Get todos directly via where clause
        $todos = Todo::where('id_user', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

        return response()->json($todos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'waktu_tenggat' => 'required|date',
            'prioritas' => 'required|in:Rendah,Sedang,Tinggi',
        ]);

        $user = Auth::user();
        $validated['id_user'] = $user->id;
        $todo = Todo::create($validated);

        return response()->json($todo, 201);
    }

    public function update(Request $request, Todo $todo)
    {
        $user = Auth::user();

        // Manual authorization check
        if ($user->id !== $todo->id_user) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'waktu_tenggat' => 'required|date',
            'prioritas' => 'required|in:Rendah,Sedang,Tinggi',
            'selesai' => 'boolean',
        ]);

        $todo->update($validated);
        return response()->json($todo);
    }

    public function destroy(Todo $todo)
    {
        $user = Auth::user();

        // Manual authorization check
        if ($user->id !== $todo->id_user) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $todo->delete();
        return response()->noContent();
    }
}
