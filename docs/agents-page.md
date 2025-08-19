# Agent Sayfası Dokümantasyonu

## Genel Bakış

Agent sayfası, emlak acentelerini listeleyen ve kullanıcıların agent'larla iletişim kurmasını sağlayan bir sayfadır. Bu sayfa modern, responsive bir tasarıma sahiptir ve arama özelliği içerir.

## Özellikler

### 1. Agent Listesi

- Tüm agent'ları grid layout'ta gösterir
- Her agent için kart tasarımı
- Agent bilgileri: isim, şirket, telefon, lisans numarası
- Üye olma tarihi

### 2. Arama Fonksiyonu

- Agent adı veya şirket adı ile arama
- Gerçek zamanlı filtreleme
- Responsive arama kutusu

### 3. İletişim Özellikleri

- Telefon numarasını panoya kopyalama
- Agent'ın ilanlarını görüntüleme
- Toast bildirimleri

### 4. İstatistikler

- Toplam agent sayısı
- Şirket sayısı
- Lisanslı agent oranı

## API Endpoints

### GET /api/agents

Tüm agent'ları getirir.

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Agent Name",
    "phone": "+90 555 123 4567",
    "company": "Remax Istanbul",
    "license_number": "TR123456",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

### GET /api/agents/[id]

Belirli bir agent'ın detaylarını getirir.

**Response:**

```json
{
  "id": "uuid",
  "name": "Agent Name",
  "phone": "+90 555 123 4567",
  "company": "Remax Istanbul",
  "license_number": "TR123456",
  "created_at": "2024-01-15T10:00:00Z"
}
```

## Veritabanı Şeması

```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  company VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Kullanım

### Ana Sayfa

```tsx
// src/app/agents/page.tsx
import AgentsPage from './agents/page';

// Sayfa otomatik olarak agent'ları yükler ve gösterir
```

### Demo Sayfa

```tsx
// src/app/agents-demo/page.tsx
// Demo verilerle çalışan versiyon
```

## Responsive Tasarım

- **Mobile**: 1 sütun grid
- **Tablet**: 2 sütun grid
- **Desktop**: 3 sütun grid

## Test Dosyaları

- `__tests__/responsive/AgentsPage.responsive.test.tsx` - Responsive testler
- Agent kartları, arama fonksiyonu ve istatistikler test edilir

## Stil Sınıfları

### Ana Container

```css
.min-h-screen.bg-gray-50.py-8
```

### Agent Kartları

```css
.grid.grid-cols-1.md:grid-cols-2.lg:grid-cols-3.gap-6
```

### Arama Kutusu

```css
.w-full.px-4.py-3.pl-10.border.border-gray-300.rounded-lg
```

## Gelecek Özellikler

1. **Agent Detay Sayfası**: Her agent için detaylı profil sayfası
2. **Filtreleme**: Şirket, lokasyon, deneyim yılına göre filtreleme
3. **Değerlendirme Sistemi**: Agent'lar için puanlama ve yorumlar
4. **İletişim Formu**: Doğrudan agent'a mesaj gönderme
5. **Harita Entegrasyonu**: Agent'ların ofis lokasyonlarını gösterme

## Teknik Detaylar

### State Yönetimi

- `useState` ile local state yönetimi
- `useUIStore` ile toast bildirimleri

### Error Handling

- API hatalarında kullanıcı dostu mesajlar
- Loading states
- Empty state handling

### Performance

- Lazy loading (gelecekte)
- Debounced search (gelecekte)
- Image optimization

## Güvenlik

- RLS (Row Level Security) politikaları
- Agent verilerinin doğrulanması
- XSS koruması

## Deployment

Agent sayfası production'a deploy edildiğinde:

1. API endpoint'leri aktif olacak
2. Gerçek agent verileri gösterilecek
3. Arama fonksiyonu çalışacak
4. Responsive tasarım tüm cihazlarda çalışacak
