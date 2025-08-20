'use client';

import { useState, useEffect } from 'react';
import { useUIStore, useUserStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number | null;
  duration: string;
  icon: string;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

interface ServiceRequestForm {
  serviceId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyAddress: string;
  preferredDate: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [requestForm, setRequestForm] = useState<ServiceRequestForm>({
    serviceId: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyAddress: '',
    preferredDate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useUIStore();
  const { user } = useUserStore();

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        console.log('Loading services...');
        const response = await fetch('/api/services');
        console.log('Response status:', response.status);
        if (!response.ok) throw new Error('Failed to load services');
        const data = await response.json();
        console.log('Services data:', data);
        setServices(data);
      } catch (error) {
        console.error('Load services error:', error);
        // Don't use addToast for now to avoid store issues
        console.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const filteredServices = services.filter(
    (service) =>
      selectedCategory === 'all' || service.category === selectedCategory
  );

  const categories = ['all', ...new Set(services.map((s) => s.category))];

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      calculator: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      home: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      scale: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
      ),
      'credit-card': (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      'shield-check': (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      truck: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
          />
        </svg>
      ),
    };

    return (
      iconMap[iconName] || (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      )
    );
  };

  const handleRequestService = (service: Service) => {
    setSelectedService(service);
    setRequestForm((prev) => ({
      ...prev,
      serviceId: service.id,
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
    }));
    setShowRequestForm(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      addToast({
        type: 'error',
        message: 'Please sign in to request services',
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/services/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }

      addToast({
        type: 'success',
        message: 'Service request submitted successfully',
      });
      setShowRequestForm(false);
      setSelectedService(null);
      setRequestForm({
        serviceId: '',
        name: '',
        email: '',
        phone: '',
        message: '',
        propertyAddress: '',
        preferredDate: '',
      });
    } catch (error) {
      console.error('Submit request error:', error);
      addToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to submit request',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
            <p className="mt-2 text-muted">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fg mb-4">
            Our Real Estate Services
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            Professional real estate services to help you buy, sell, and manage
            your properties with confidence.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-fg mb-1">
                    {service.name}
                  </h3>
                  <Badge variant="outline" className="text-xs mb-2">
                    {service.category}
                  </Badge>
                  <p className="text-sm text-muted mb-3">
                    {service.description}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0">
                  {getIconComponent(service.icon)}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {service.price !== null && (
                  <div className="flex items-center text-sm">
                    <span className="font-semibold text-primary-blue">
                      ${service.price}
                    </span>
                    {service.duration && (
                      <span className="text-muted ml-2">
                        • {service.duration}
                      </span>
                    )}
                  </div>
                )}

                {service.features && service.features.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-fg">Features:</p>
                    <ul className="text-xs text-muted space-y-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg
                            className="w-3 h-3 text-green-500 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button
                onClick={() => handleRequestService(service)}
                variant="primary"
                size="sm"
                className="w-full"
              >
                Request Service
              </Button>
            </Card>
          ))}
        </div>

        {/* Service Request Modal */}
        {showRequestForm && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-fg">
                    Request {selectedService.name}
                  </h3>
                  <button
                    onClick={() => setShowRequestForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={requestForm.name}
                      onChange={(e) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={requestForm.email}
                      onChange={(e) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={requestForm.phone}
                      onChange={(e) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">
                      Property Address
                    </label>
                    <input
                      type="text"
                      value={requestForm.propertyAddress}
                      onChange={(e) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          propertyAddress: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={requestForm.preferredDate}
                      onChange={(e) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          preferredDate: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      value={requestForm.message}
                      onChange={(e) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      placeholder="Tell us more about your needs..."
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowRequestForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
