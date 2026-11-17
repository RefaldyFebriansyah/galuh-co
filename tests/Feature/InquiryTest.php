<?php

use App\Mail\CorporateInquiryNotification;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
});

it('saves corporate inquiry to database and queues notification email', function () {
    $payload = [
        'name' => 'Refaldy Febriansyah',
        'company_name' => 'PT Makmur Sentosa',
        'email' => 'refaldy@makmursentosa.co.id',
        'whatsapp_number' => '08123456789',
        'estimated_packages' => '50 - 100 paket',
        'budget_per_package' => 'Rp 500.000 - Rp 1.000.000',
        'needed_at' => '2026-12-20',
        'notes' => 'Custom packaging dengan logo perusahaan gold foil.',
    ];

    $response = $this->post(route('inquiry.store'), $payload);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('inquiries', [
        'name' => 'Refaldy Febriansyah',
        'company_name' => 'PT Makmur Sentosa',
        'email' => 'refaldy@makmursentosa.co.id',
        'whatsapp_number' => '08123456789',
        'estimated_packages' => '50 - 100 paket',
    ]);

    Mail::assertQueued(CorporateInquiryNotification::class, function (CorporateInquiryNotification $mail) {
        return $mail->inquiry->name === 'Refaldy Febriansyah';
    });
});

it('fails validation when required fields are missing', function () {
    $response = $this->post(route('inquiry.store'), []);

    $response->assertSessionHasErrors([
        'name',
        'email',
        'whatsapp_number',
        'estimated_packages',
    ]);

    $this->assertDatabaseCount('inquiries', 0);
    Mail::assertNothingQueued();
});

it('rejects or ignores submission when honeypot field is filled', function () {
    $payload = [
        'name' => 'Spam Bot',
        'email' => 'bot@spammer.com',
        'whatsapp_number' => '0811111111',
        'estimated_packages' => '20 - 50 paket',
        'website' => 'https://spam-link.ru', // Honeypot filled
    ];

    $response = $this->post(route('inquiry.store'), $payload);

    $this->assertDatabaseCount('inquiries', 0);
    Mail::assertNothingQueued();
});

it('throttles rapid submission requests', function () {
    $payload = [
        'name' => 'Refaldy Tester',
        'email' => 'test@example.com',
        'whatsapp_number' => '0812345678',
        'estimated_packages' => '20 - 50 paket',
    ];

    // Allowed up to 5 requests per minute
    for ($i = 0; $i < 5; $i++) {
        $this->post(route('inquiry.store'), $payload);
    }

    // 6th request should hit rate limit
    $response = $this->post(route('inquiry.store'), $payload);
    $response->assertStatus(429);
});
