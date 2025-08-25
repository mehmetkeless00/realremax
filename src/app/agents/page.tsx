import { Metadata } from 'next';
import { getAgents } from '@/server/data/agents';
import AgentsList from '@/components/agents/AgentsList';

export const metadata: Metadata = {
  title: 'Real Estate Agents',
  description:
    'Connect with experienced and licensed real estate professionals who can help you find your perfect property or sell your current home.',
  keywords: [
    'real estate agents',
    'property agents',
    'licensed agents',
    'real estate professionals',
    'property consultants',
  ],
  openGraph: {
    title: 'Real Estate Agents - Remax Unified Platform',
    description:
      'Connect with experienced and licensed real estate professionals.',
    url: '/agents',
    type: 'website',
  },
  twitter: {
    title: 'Real Estate Agents - Remax Unified Platform',
    description:
      'Connect with experienced and licensed real estate professionals.',
  },
  alternates: {
    canonical: '/agents',
  },
};

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fg mb-4">
            Our Trusted Real Estate Agents
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            Connect with experienced and licensed real estate professionals who
            can help you find your perfect property or sell your current home.
          </p>
        </div>

        {/* Agents List */}
        <AgentsList initialAgents={agents} />
      </div>
    </div>
  );
}
