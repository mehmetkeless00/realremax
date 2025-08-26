'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/store';

type Agent = {
  name: string;
  phone?: string;
  email?: string;
  photo?: string;
};

type AgentCardProps = {
  agent: Agent;
};

export default function AgentCard({ agent }: AgentCardProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, agent: agent.name }),
      });

      if (response.ok) {
        addToast({
          type: 'success',
          message: 'Message sent successfully!',
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg mb-4">Contact Agent</h3>

      {/* Agent Info */}
      <div className="flex items-center gap-3 mb-6">
        {agent.photo && agent.photo.trim() !== '' && (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={agent.photo}
              alt={agent.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <div className="font-medium text-fg">{agent.name}</div>
          {agent.phone && (
            <div className="text-sm text-muted-foreground">{agent.phone}</div>
          )}
          {agent.email && (
            <div className="text-sm text-muted-foreground">{agent.email}</div>
          )}
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <textarea
            placeholder="Your message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
}
