<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered()
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen()
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'username' => $user->username,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/');
    }

    public function test_admin_is_redirected_to_dashboard_after_login()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->get('/account');

        $response = $this->post('/login', [
            'username' => $admin->username,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('admin.dashboard'));
    }

    public function test_users_can_not_authenticate_with_invalid_password()
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'username' => $user->username,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_authenticated_users_can_view_their_account()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/account');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Account/Show')
            ->where('auth.user.username', $user->username)
        );
    }

    public function test_users_can_log_out()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
