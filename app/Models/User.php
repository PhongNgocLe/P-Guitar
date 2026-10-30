<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmailContract
{
    use HasFactory, MustVerifyEmailTrait, Notifiable;

    protected $table = 'users';

    public $timestamps = false;

    protected $fillable = [
        'username',
        'password',
        'role',
        'fullname',
        'email',
        'phone',
        'address',
    ];

    protected $hidden = [
        'password',
    ];

    protected $appends = ['name'];

    public function getNameAttribute($value)
    {
        return $value ?? $this->fullname ?? $this->username;
    }
}