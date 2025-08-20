# Services Sayfası Dokümantasyonu

## Genel Bakış

Services sayfası, emlak hizmetlerini listeleyen ve kullanıcıların bu hizmetleri talep etmesini sağlayan bir sayfadır. Bu sayfa modern, responsive bir tasarıma sahiptir ve kategori filtreleme özelliği içerir.

## Özellikler

### 1. Hizmet Listesi

- Tüm hizmetleri grid layout'ta gösterir
- Her hizmet için kart tasarımı
- Hizmet bilgileri: isim, açıklama, kategori, fiyat, süre
- Özellik listesi ve ikonlar

### 2. Kategori Filtreleme

- Hizmetleri kategoriye göre filtreleme
- Dinamik kategori butonları
- "All" seçeneği ile tüm hizmetleri görüntüleme

### 3. Hizmet Talep Sistemi

- Modal form ile hizmet talebi
- Kullanıcı bilgileri otomatik doldurma
- Form validasyonu
- Toast bildirimleri

### 4. Responsive Tasarım

- Mobile, tablet, desktop uyumlu
- Grid layout responsive breakpoint'ler
- Modal responsive tasarım

## API Endpoints

### GET /api/services

Tüm hizmetleri getirir.

**Query Parameters:**

- `category` (optional): Kategori filtresi
- `active` (optional): Aktif hizmetler filtresi

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Property Valuation",
    "description": "Professional property valuation service",
    "category": "Valuation",
    "price": 299.99,
    "duration": "2-3 days",
    "icon": "calculator",
    "features": ["Detailed market analysis", "Professional report"],
    "is_active": true,
    "sort_order": 1
  }
]
```

### POST /api/services

Yeni hizmet oluşturur (admin only).

**Request Body:**

```json
{
  "name": "Service Name",
  "description": "Service description",
  "category": "Category",
  "price": 299.99,
  "duration": "2-3 days",
  "icon": "calculator",
  "features": ["Feature 1", "Feature 2"],
  "is_active": true,
  "sort_order": 1
}
```

### GET /api/services/requests

Hizmet taleplerini getirir.

**Query Parameters:**

- `role` (optional): "agent" veya "user"

**Response:**

```json
{
  "requests": [
    {
      "id": "uuid",
      "service_id": "uuid",
      "user_id": "uuid",
      "agent_id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+90 555 123 4567",
      "message": "Service request message",
      "property_address": "123 Main St",
      "preferred_date": "2024-01-15",
      "status": "pending",
      "services": {
        "id": "uuid",
        "name": "Property Valuation",
        "category": "Valuation"
      }
    }
  ]
}
```

### POST /api/services/requests

Hizmet talebi oluşturur.

**Request Body:**

```json
{
  "serviceId": "uuid",
  "agentId": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+90 555 123 4567",
  "message": "Service request message",
  "propertyAddress": "123 Main St",
  "preferredDate": "2024-01-15"
}
```

## Veritabanı Şeması

### Services Tablosu

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2),
  duration VARCHAR(50),
  icon VARCHAR(100),
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Service Requests Tablosu

```sql
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  property_address VARCHAR(255),
  preferred_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Kullanım

### Ana Sayfa

```tsx
// src/app/services/page.tsx
import ServicesPage from './services/page';

// Sayfa otomatik olarak hizmetleri yükler ve gösterir
```

### Hizmet Talep Formu

```tsx
// Modal form component
const handleRequestService = (service: Service) => {
  setSelectedService(service);
  setShowRequestForm(true);
};
```

## Responsive Tasarım

- **Mobile**: 1 sütun grid
- **Tablet**: 2 sütun grid
- **Desktop**: 3 sütun grid

## Test Dosyaları

- `__tests__/responsive/ServicesPage.responsive.test.tsx` - Responsive testler
- Hizmet kartları, kategori filtreleme ve talep formu test edilir

## Stil Sınıfları

### Ana Container

```css
.min-h-screen.bg-gray-50.py-8
```

### Hizmet Kartları

```css
.grid.grid-cols-1.md:grid-cols-2.lg:grid-cols-3.gap-6
```

### Modal Form

```css
.fixed.inset-0.bg-black.bg-opacity-50.flex.items-center.justify-center
```

## Mevcut Hizmetler

1. **Property Valuation** (Emlak Değerleme)
   - Fiyat: $299.99
   - Süre: 2-3 gün
   - Kategori: Valuation

2. **Property Management** (Emlak Yönetimi)
   - Fiyat: $199.99
   - Süre: Aylık
   - Kategori: Management

3. **Legal Services** (Hukuki Hizmetler)
   - Fiyat: $150.00
   - Süre: 1-2 gün
   - Kategori: Legal

4. **Mortgage Services** (Kredi Hizmetleri)
   - Fiyat: Ücretsiz
   - Süre: Değişken
   - Kategori: Financial

5. **Insurance Services** (Sigorta Hizmetleri)
   - Fiyat: Ücretsiz
   - Süre: 1 gün
   - Kategori: Insurance

6. **Moving Services** (Taşınma Hizmetleri)
   - Fiyat: $499.99
   - Süre: 1 gün
   - Kategori: Relocation

## Gelecek Özellikler

1. **Hizmet Detay Sayfası**: Her hizmet için detaylı sayfa
2. **Fiyat Hesaplayıcı**: Dinamik fiyat hesaplama
3. **Takvim Entegrasyonu**: Randevu sistemi
4. **Ödeme Sistemi**: Online ödeme entegrasyonu
5. **Değerlendirme Sistemi**: Hizmet puanlama ve yorumlar

## Teknik Detaylar

### State Yönetimi

- `useState` ile local state yönetimi
- `useUIStore` ile toast bildirimleri
- `useUserStore` ile kullanıcı bilgileri

### Error Handling

- API hatalarında kullanıcı dostu mesajlar
- Loading states
- Form validation

### Performance

- Lazy loading (gelecekte)
- Image optimization
- Debounced search (gelecekte)

## Güvenlik

- RLS (Row Level Security) politikaları
- Form validation
- XSS koruması
- CSRF koruması

## Deployment

Services sayfası production'a deploy edildiğinde:

1. API endpoint'leri aktif olacak
2. Veritabanı tabloları oluşturulacak
3. Örnek hizmet verileri yüklenecek
4. Responsive tasarım tüm cihazlarda çalışacak
5. Hizmet talep sistemi aktif olacak
