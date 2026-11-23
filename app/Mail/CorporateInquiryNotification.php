<?php

namespace App\Mail;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CorporateInquiryNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Inquiry $inquiry,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $type = $this->inquiry->order_type === 'personal' ? 'Pesanan Personal' : 'Penawaran Corporate';
        $sender = $this->inquiry->company_name
            ? "{$this->inquiry->name} ({$this->inquiry->company_name})"
            : $this->inquiry->name;

        return new Envelope(
            subject: "{$type} Baru — {$sender}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.corporate-inquiry',
            with: [
                'inquiry' => $this->inquiry,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
