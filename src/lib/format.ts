export function formatPrice(price: number, currency: string = 'EUR'): string {
  if (currency === 'EUR') {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
  return `${currency} ${price.toLocaleString()}`;
}

export function formatArea(area: number): string {
  return `${area} m²`;
}

export function formatAreaRange(min: number, max: number): string {
  return `${min}-${max} m²`;
}

export function formatYear(year: number): string {
  return year.toString();
}

export function formatEnergyRating(rating: string): string {
  return rating;
}

export function formatPhone(phone: string): string {
  return phone;
}

export function formatAddress(location: {
  address: string;
  city: string;
  district?: string;
}): string {
  const parts = [location.address, location.city];
  if (location.district) {
    parts.push(location.district);
  }
  return parts.join(', ');
}
