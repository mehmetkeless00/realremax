import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CorporateCTA() {
  const cards = [
    {
      title: 'Agents',
      desc: 'Meet experienced professionals ready to help.',
      href: '/agents',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
      {cards.map((c) => (
        <div
          key={c.title}
          className="rounded-2xl bg-white border shadow-sm p-6"
        >
          <h4 className="text-lg font-semibold">{c.title}</h4>
          <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
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
