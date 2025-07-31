# Row Level Security (RLS) Policies

Bu klasör Supabase projesi için Row Level Security politikalarını içerir.

## Genel Bakış

Row Level Security (RLS), PostgreSQL'de tablo seviyesinde güvenlik sağlayan bir özelliktir. Her satır için erişim kontrolü yaparak, kullanıcıların sadece kendi verilerine erişmesini sağlar.

## Tablolar ve Politikalar

### 1. users

- **SELECT**: Kullanıcılar kendi profillerini görüntüleyebilir
- **UPDATE**: Kullanıcılar kendi profillerini güncelleyebilir
- **Public READ**: Tüm kullanıcılar public bilgileri görebilir

### 2. agents

- **SELECT**: Agent'lar kendi profillerini görüntüleyebilir
- **UPDATE**: Agent'lar kendi profillerini güncelleyebilir
- **INSERT**: Agent'lar kendi profillerini oluşturabilir
- **Public READ**: Tüm kullanıcılar agent bilgilerini görebilir

### 3. properties

- **SELECT**: Tüm kullanıcılar property'leri görebilir (public)
- **INSERT**: Sadece agent'lar property ekleyebilir
- **UPDATE**: Agent'lar sadece kendi property'lerini güncelleyebilir
- **DELETE**: Agent'lar sadece kendi property'lerini silebilir

### 4. listings

- **SELECT**: Tüm kullanıcılar listing'leri görebilir (public)
- **INSERT**: Sadece agent'lar listing ekleyebilir
- **UPDATE**: Agent'lar sadece kendi listing'lerini güncelleyebilir
- **DELETE**: Agent'lar sadece kendi listing'lerini silebilir

### 5. favorites

- **SELECT**: Kullanıcılar sadece kendi favorilerini görebilir
- **INSERT**: Kullanıcılar kendi favorilerini ekleyebilir
- **DELETE**: Kullanıcılar kendi favorilerini silebilir

### 6. inquiries

- **SELECT**:
  - Kullanıcılar kendi inquiry'lerini görebilir
  - Agent'lar kendi property'leri için gelen inquiry'leri görebilir
- **INSERT**: Kullanıcılar inquiry oluşturabilir
- **UPDATE**: Agent'lar kendi property'leri için gelen inquiry'leri güncelleyebilir

## Güvenlik Prensipleri

1. **Principle of Least Privilege**: Kullanıcılar sadece gerekli minimum erişime sahip
2. **Data Isolation**: Her kullanıcı sadece kendi verilerine erişebilir
3. **Role-Based Access**: Farklı roller farklı erişim seviyelerine sahip
4. **Audit Trail**: Tüm değişiklikler loglanır

## Test Senaryoları

Her politika için test senaryoları `tests/` klasöründe bulunabilir.

## Deployment

Bu politikalar Supabase Dashboard üzerinden veya SQL Editor ile uygulanabilir.
