<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'deskripsi',
        'waktu_tenggat',
        'prioritas',
        'selesai',
        'id_user'
    ];

    protected $casts = [
        'waktu_tenggat' => 'datetime',
        'selesai' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
