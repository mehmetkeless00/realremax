import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-lg md:text-xl font-bold text-dark-charcoal mb-6">
            Find Your Dream Home
          </h1>
          <p className="text-xs text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the perfect property with Remax Unified Platform. Browse
            thousands of listings, connect with trusted agents, and make
            informed decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-primary-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Properties
            </Link>
            <Link
              href="/agents"
              className="bg-primary-red text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Find Agents
            </Link>
          </div>

          {/* Advanced Search Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-xs font-semibold text-dark-charcoal mb-4 text-center">
                Find Your Perfect Property
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Use our advanced search to find properties that match your
                criteria
              </p>
              <div className="text-center">
                <Link
                  href="/properties"
                  className="bg-primary-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
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
                  Start Advanced Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-base font-bold text-center text-dark-charcoal mb-12">
            Why Choose Remax Unified Platform?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 md:w-10 md:h-10 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4 max-w-[60px] max-h-[40vh]">
                <svg
                  className="w-5 h-5 md:w-4 md:h-4 text-white"
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
              <h3 className="text-xs font-semibold mb-2">Advanced Search</h3>
              <p className="text-gray-600">
                Find properties with detailed filters and advanced search
                options.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 md:w-10 md:h-10 bg-primary-red rounded-full flex items-center justify-center mx-auto mb-4 max-w-[60px] max-h-[40vh]">
                <svg
                  className="w-5 h-5 md:w-4 md:h-4 text-white"
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
              <h3 className="text-xs font-semibold mb-2">Trusted Agents</h3>
              <p className="text-gray-600">
                Connect with verified and experienced real estate professionals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 max-w-[60px] max-h-[40vh]">
                <svg
                  className="w-5 h-5 md:w-4 md:h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xs font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-base font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xs text-blue-100 mb-8">
            Join thousands of satisfied customers who found their perfect home
            with us.
          </p>
          <Link
            href="/auth/signup"
            className="bg-white text-primary-blue px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
