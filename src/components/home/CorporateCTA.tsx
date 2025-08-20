import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CorporateCTA() {
  const cards = [
    {
      title: 'Agents',
      desc: 'Meet experienced professionals ready to help.',
      href: '/agents',
    },
    {
      title: 'Offices',
      desc: 'Find a RE/MAX office near you.',
      href: '/offices',
    },
    {
      title: 'Developments',
      desc: 'Explore new projects and developments.',
      href: '/developments',
    },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map((c) => (
        <div
          key={c.title}
          className="rounded-2xl bg-white border shadow-sm p-6"
        >
          <h4 className="text-lg font-semibold">{c.title}</h4>
          <p className="mt-2 text-sm text-muted">{c.desc}</p>
          <div className="mt-4">
            <Button asChild>
              <Link href={c.href}>Learn more</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
