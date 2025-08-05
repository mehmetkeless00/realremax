'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore, useFavoritesStore, useUIStore } from '@/lib/store';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import {
  PropertyStructuredData,
  BreadcrumbStructuredData,
} from '@/components/StructuredData';

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

export default function PropertyDetailClient() {
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
    } catch {
      addToast({ type: 'error', message: 'Failed to load property details' });
    } finally {
      setLoading(false);
    }
  }, [propertyId, addToast]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      addToast({ type: 'error', message: 'Please sign in to save favorites' });
      return;
    }

    if (!property) return;

    try {
      await toggleFavorite(property.id);
      addToast({
        type: 'success',
        message: favorites.includes(property.id)
          ? 'Removed from favorites'
          : 'Added to favorites',
      });
    } catch {
      addToast({ type: 'error', message: 'Failed to update favorites' });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: property.id,
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message,
        }),
      });

      if (response.ok) {
        addToast({ type: 'success', message: 'Inquiry sent successfully!' });
        setShowContactForm(false);
        setContactForm({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error('Failed to send inquiry');
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to send inquiry' });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"
          aria-label="Loading property details"
        ></div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The property you are looking for could not be found.
          </p>
          <Link
            href="/properties"
            className="text-primary-blue hover:text-blue-500 font-medium"
          >
            Back to Properties
          </Link>
        </div>
      </main>
    );
  }

  const isFavorite = favorites.includes(property.id);

  return (
    <main className="min-h-screen bg-gray-50">
      <BreadcrumbStructuredData
        data={{
          items: [
            { name: 'Home', url: '/' },
            { name: 'Properties', url: '/properties' },
            { name: property.title, url: `/properties/${property.id}` },
          ],
        }}
      />

      <PropertyStructuredData
        data={{
          id: property.id,
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          type: property.type,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          size: property.size,
          yearBuilt: property.year_built,
          images: property.photos,
          address: property.location,
          city: property.location.split(',')[0],
          country: 'Netherlands',
          listingType: 'sale' as 'rent' | 'sale',
        }}
      />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-blue"
                >
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Link
                    href="/properties"
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-primary-blue md:ml-2"
                  >
                    Properties
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {property.title}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Property Images */}
            <div className="relative h-96 bg-gray-200">
              {property.photos && property.photos.length > 0 ? (
                <OptimizedImage
                  src={property.photos[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  width={800}
                  height={600}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={handleFavoriteToggle}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                aria-label={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <svg
                  className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Property Details */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {property.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-blue">
                    €{property.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Price</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {property.bedrooms}
                    </p>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {property.bathrooms}
                    </p>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                  </div>
                )}
                {property.size && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {property.size}m²
                    </p>
                    <p className="text-sm text-gray-500">Size</p>
                  </div>
                )}
                {property.year_built && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {property.year_built}
                    </p>
                    <p className="text-sm text-gray-500">Year Built</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Agent Information */}
              {agent && (
                <div className="border-t pt-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Listed by
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {agent.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {agent.name}
                      </h3>
                      <p className="text-gray-600">{agent.company}</p>
                      <p className="text-gray-600">{agent.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Form */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Interested in this property?
                </h2>

                {!showContactForm ? (
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="bg-primary-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Contact Agent
                  </button>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
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
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
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
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
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
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        placeholder="Tell us more about your interest in this property..."
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-primary-blue text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Send Message
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
