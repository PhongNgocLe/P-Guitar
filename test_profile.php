<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::find(3);
if (!$user) {
    echo "User 3 not found\n";
    exit;
}
echo "User: " . $user->username . "\n";

$v = validator([
    'fullname' => 'Lê Ngọc Phong',
    'email' => 'phong@gmail.com',
    'phone' => '0334090425',
    'address' => 'fds',
], [
    'fullname' => ['required', 'string', 'max:100'],
    'email' => [
        'nullable',
        'string',
        'email',
        'max:255',
        Illuminate\Validation\Rule::unique('users', 'email')->ignore($user->id),
    ],
    'phone' => ['nullable', 'string', 'max:20'],
    'address' => ['nullable', 'string', 'max:255'],
]);

if ($v->fails()) {
    echo "Validation FAILED: " . json_encode($v->errors()->all()) . "\n";
} else {
    echo "Validation PASSED!\n";
    $user->fullname = 'Lê Ngọc Phong';
    $user->email = 'phong@gmail.com';
    $user->phone = '0334090425';
    $user->address = 'fds';
    $user->save();
    echo "User saved successfully! Phone: " . $user->phone . "\n";
}
