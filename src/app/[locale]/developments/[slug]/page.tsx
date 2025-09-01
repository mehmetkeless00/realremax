import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Development - Not Found',
    description: 'Development details are not yet implemented.',
  };
}

export default async function DevelopmentPage() {
  // TODO: Implement development data access when development table is ready
  notFound();
}
