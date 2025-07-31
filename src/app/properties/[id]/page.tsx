'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore, useFavoritesStore, useUIStore } from '@/lib/store';
import Link from 'next/link';
import Image from 'next/image';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  year_built?: number;
  status: string;
  agent_id?: string;
  photos?: string[];
  created_at: string;
}

interface Agent {
  id: string;
  name: string;
  phone: string;
  company: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const { user } = useUserStore();
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { addToast } = useUIStore();

  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const propertyId = params.id as string;

  const loadProperty = useCallback(async () => {
    try {
      setLoading(true);

      // Property bilgilerini al
      const propertyResponse = await fetch(`/api/properties/${propertyId}`);
      if (!propertyResponse.ok) throw new Error('Property not found');

      const propertyData = await propertyResponse.json();
      setProperty(propertyData);

      // Agent bilgilerini al
      if (propertyData.agent_id) {
        const agentResponse = await fetch(
          `/api/agents/${propertyData.agent_id}`
        );
        if (agentResponse.ok) {
          const agentData = await agentResponse.json();
          setAgent(agentData);
        }
      }
    } catch (error) {
      console.error('Load property error:', error);
      addToast({ type: 'error', message: 'Failed to load property details' });
    } finally {
      setLoading(false);
    }
  }, [propertyId, addToast]);

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId, loadProperty]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      addToast({ type: 'error', message: 'Please sign in to save favorites' });
      return;
    }

    try {
      await toggleFavorite(propertyId);
      addToast({ type: 'success', message: 'Favorite updated successfully' });
    } catch (error) {
      console.error('Favorite toggle error:', error);
      addToast({ type: 'error', message: 'Failed to update favorite' });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      addToast({ type: 'error', message: 'Please sign in to send messages' });
      return;
    }

    if (!agent?.id) {
      addToast({ type: 'error', message: 'Agent information not available' });
      return;
    }

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          agentId: agent.id,
          ...contactForm,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      addToast({ type: 'success', message: 'Inquiry submitted successfully' });
      setShowContactForm(false);
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      addToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to send message',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
            <p className="mt-2 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Property Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The property you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/properties"
              className="bg-primary-blue text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(propertyId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-primary-blue">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/properties" className="hover:text-primary-blue">
                Properties
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{property.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Images */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              {property.photos && property.photos.length > 0 ? (
                <div className="relative">
                  <Image
                    src={property.photos[0]}
                    alt={property.title}
                    width={800}
                    height={256}
                    className="w-full h-64 object-cover"
                  />
                  {property.photos.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      +{property.photos.length - 1} more photos
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <Image
                    src="/images/placeholder-property.jpg"
                    alt={property.title}
                    width={800}
                    height={256}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-dark-charcoal mb-2">
                    {property.title}
                  </h1>
                  <p className="text-gray-600 text-lg">{property.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-blue">
                    ${property.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{property.status}</p>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-blue">
                      {property.bedrooms}
                    </div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-blue">
                      {property.bathrooms}
                    </div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                )}
                {property.size && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-blue">
                      {property.size}m²
                    </div>
                    <div className="text-sm text-gray-600">Size</div>
                  </div>
                )}
                {property.year_built && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-blue">
                      {property.year_built}
                    </div>
                    <div className="text-sm text-gray-600">Year Built</div>
                  </div>
                )}
              </div>

              {/* Property Type Badge */}
              <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {property.type.charAt(0).toUpperCase() +
                    property.type.slice(1)}
                </span>
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-dark-charcoal mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Map Placeholder */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-dark-charcoal mb-2">
                  Location
                </h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-gray-500">Interactive Map Coming Soon</p>
                    <p className="text-sm text-gray-400">{property.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="space-y-3">
                <button
                  onClick={handleFavoriteToggle}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isFavorite
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isFavorite ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>

                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-primary-blue text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Contact Agent
                </button>

                <button className="w-full bg-primary-red text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Schedule Viewing
                </button>
              </div>
            </div>

            {/* Agent Information */}
            {agent && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-dark-charcoal mb-4">
                  Listed by
                </h3>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">
                      {agent.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <h4 className="font-semibold text-dark-charcoal">
                    {agent.name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">{agent.company}</p>
                  <p className="text-primary-blue font-medium">{agent.phone}</p>
                </div>
              </div>
            )}

            {/* Contact Form */}
            {showContactForm && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-dark-charcoal mb-4">
                  Contact Agent
                </h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="I'm interested in this property..."
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-blue text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
                    >
                      Send Message
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
