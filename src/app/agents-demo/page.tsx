'use client';

import { useState } from 'react';
import { useUIStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  phone: string;
  company: string;
  license_number: string;
  created_at: string;
}

// Demo agent data
const demoAgents: Agent[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    phone: '+90 555 123 4567',
    company: 'Remax Istanbul',
    license_number: 'TR123456',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Fatma Demir',
    phone: '+90 555 987 6543',
    company: 'Remax Ankara',
    license_number: 'TR789012',
    created_at: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    phone: '+90 555 456 7890',
    company: 'Remax Izmir',
    license_number: 'TR345678',
    created_at: '2024-03-10T09:15:00Z',
  },
  {
    id: '4',
    name: 'Ayşe Özkan',
    phone: '+90 555 321 0987',
    company: 'Remax Bursa',
    license_number: 'TR901234',
    created_at: '2024-01-25T16:45:00Z',
  },
  {
    id: '5',
    name: 'Mustafa Çelik',
    phone: '+90 555 654 3210',
    company: 'Remax Antalya',
    license_number: 'TR567890',
    created_at: '2024-02-05T11:20:00Z',
  },
  {
    id: '6',
    name: 'Zeynep Arslan',
    phone: '+90 555 789 0123',
    company: 'Remax Istanbul',
    license_number: 'TR234567',
    created_at: '2024-03-15T13:30:00Z',
  },
];

export default function AgentsDemoPage() {
  const [agents] = useState<Agent[]>(demoAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useUIStore();

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleContactClick = (agent: Agent) => {
    navigator.clipboard.writeText(agent.phone);
    addToast({
      type: 'success',
      message: `${agent.name} telefon numarası panoya kopyalandı`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fg mb-4">
            Demo: Emlak Acenteleri
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            Bu demo sayfası, agent sayfasının nasıl görüneceğini gösterir.
            Gerçek veriler API&apos;den gelecektir.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Agent adı veya şirket adı ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Agents Grid */}
        {filteredAgents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-fg mb-2">
              Agent bulunamadı
            </h3>
            <p className="text-muted">
              {searchTerm
                ? 'Arama terimlerinizi değiştirmeyi deneyin.'
                : 'Şu anda agent bulunmuyor.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-fg mb-1">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-muted mb-2">{agent.company}</p>
                    <Badge variant="outline" className="text-xs">
                      Lisans: {agent.license_number}
                    </Badge>
                  </div>
                  <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-fg">{agent.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-muted">
                      Üye olma tarihi: {formatDate(agent.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    asChild
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    <Link href={`/properties?agent=${agent.id}`}>
                      İlanları Gör
                    </Link>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleContactClick(agent)}
                  >
                    İletişim
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-blue mb-1">
                {agents.length}
              </div>
              <div className="text-sm text-muted">Toplam Agent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-red mb-1">
                {new Set(agents.map((a) => a.company)).size}
              </div>
              <div className="text-sm text-muted">Şirket</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
              <div className="text-sm text-muted">Lisanslı</div>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Demo Bilgisi
          </h3>
          <p className="text-sm text-blue-700">
            Bu sayfa demo verilerle çalışmaktadır. Gerçek uygulamada veriler
            veritabanından gelecektir. Agent&apos;ların ilanlarını görmek için
            &ldquo;İlanları Gör&rdquo; butonuna tıklayabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
