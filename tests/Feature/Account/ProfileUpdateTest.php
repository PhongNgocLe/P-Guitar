<?php

namespace Tests\Feature\Account;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_profile_information()
    {
        $user = User::factory()->create([
            'fullname' => 'Old Name',
            'phone' => null,
            'address' => null,
            'email' => 'old@example.com',
        ]);

        $response = $this->actingAs($user)->patch(route('account.update'), [
            'fullname' => 'Le Ngoc Phong',
            'email' => 'phong@gmail.com',
            'phone' => '0901234567',
            'address' => '123 Nguyen Trai, Q5, TP.HCM',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $user->refresh();
        $this->assertSame('Le Ngoc Phong', $user->fullname);
        $this->assertSame('phong@gmail.com', $user->email);
        $this->assertSame('0901234567', $user->phone);
        $this->assertSame('123 Nguyen Trai, Q5, TP.HCM', $user->address);
    }

    public function test_user_cannot_update_to_an_existing_email()
    {
        User::factory()->create(['email' => 'existing@example.com']);
        $user = User::factory()->create(['email' => 'my@example.com']);

        $response = $this->actingAs($user)->patch(route('account.update'), [
            'fullname' => 'Test User',
            'email' => 'existing@example.com',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_user_can_change_their_password()
    {
        $user = User::factory()->create([
            'password' => Hash::make('old-password'),
        ]);

        $response = $this->actingAs($user)->put(route('account.password.update'), [
            'current_password' => 'old-password',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

        $response->assertSessionHasNoErrors();
        $user->refresh();
        $this->assertTrue(Hash::check('new-password-123', $user->password));
    }

    public function test_user_cannot_change_password_with_incorrect_current_password()
    {
        $user = User::factory()->create([
            'password' => Hash::make('correct-password'),
        ]);

        $response = $this->actingAs($user)->put(route('account.password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

        $response->assertSessionHasErrors('current_password');
    }
}
