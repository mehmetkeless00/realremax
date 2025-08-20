import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';

type PriceBarProps = {
  price: number;
  currency: string;
  operation: 'buy' | 'rent';
};

export default function PriceBar({
  price,
  currency,
  operation,
}: PriceBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border shadow-sm">
      <div>
        <div className="text-2xl font-bold text-fg">
          {formatPrice(price, currency)}
        </div>
        <div className="text-sm text-muted-foreground capitalize">
          {operation === 'buy' ? 'For Sale' : 'For Rent'}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg">
          Contact Agent
        </Button>
        <Button size="lg">Schedule Visit</Button>
      </div>
    </div>
  );
}
