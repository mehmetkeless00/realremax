# Security Documentation

Bu dokümantasyon projenin güvenlik özelliklerini ve Row Level Security (RLS) politikalarını açıklar.

## Genel Bakış

Bu proje Supabase PostgreSQL kullanarak Row Level Security (RLS) ile güçlü güvenlik katmanları sağlar. RLS, her satır için erişim kontrolü yaparak kullanıcıların sadece kendi verilerine erişmesini garanti eder.

## Güvenlik Katmanları

### 1. Authentication (Kimlik Doğrulama)

- **Supabase Auth**: JWT tabanlı kimlik doğrulama
- **Role-based Access**: Farklı kullanıcı rolleri (visitor, registered, agent, admin)
- **Session Management**: Güvenli oturum yönetimi

### 2. Authorization (Yetkilendirme)

- **Row Level Security (RLS)**: Tablo seviyesinde erişim kontrolü
- **Policy-based Access**: Her tablo için özel erişim politikaları
- **Function-based Security**: Güvenlik fonksiyonları

### 3. Data Protection

- **Data Isolation**: Kullanıcılar sadece kendi verilerine erişebilir
- **Audit Logging**: Tüm değişiklikler loglanır
- **Input Validation**: Giriş verilerinin doğrulanması

## RLS Politikaları

### Users Tablosu

```sql
-- Kullanıcılar kendi profillerini görüntüleyebilir
CREATE POLICY "users_select_own_profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid()::text = id::text);

-- Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "users_update_own_profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);
```

### Properties Tablosu

```sql
-- Anonim kullanıcılar sadece aktif property'leri görebilir
CREATE POLICY "properties_public_read" ON properties
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

-- Agent'lar sadece kendi property'lerini güncelleyebilir
CREATE POLICY "properties_agent_update" ON properties
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = properties.agent_id
      AND agents.user_id::text = auth.uid()::text
    )
  );
```

### Favorites Tablosu

```sql
-- Kullanıcılar sadece kendi favorilerini görebilir
CREATE POLICY "favorites_user_select" ON favorites
  FOR SELECT TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Kullanıcılar sadece kendi favorilerini ekleyebilir
CREATE POLICY "favorites_user_insert" ON favorites
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);
```

### Inquiries Tablosu

```sql
-- Kullanıcılar kendi inquiry'lerini görebilir
CREATE POLICY "inquiries_user_select" ON inquiries
  FOR SELECT TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Agent'lar kendi property'leri için gelen inquiry'leri görebilir
CREATE POLICY "inquiries_agent_select" ON inquiries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = inquiries.property_id
      AND properties.agent_id IN (
        SELECT id FROM agents WHERE user_id::text = auth.uid()::text
      )
    )
  );
```

## Güvenlik Fonksiyonları

### is_agent(user_uuid)

Kullanıcının agent olup olmadığını kontrol eder.

```sql
CREATE OR REPLACE FUNCTION is_agent(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM agents
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### owns_property(user_uuid, property_uuid)

Kullanıcının property'nin sahibi olup olmadığını kontrol eder.

```sql
CREATE OR REPLACE FUNCTION owns_property(user_uuid UUID, property_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM properties p
    JOIN agents a ON p.agent_id = a.id
    WHERE a.user_id = user_uuid AND p.id = property_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Audit Logging

Tüm kritik işlemler audit_logs tablosunda loglanır:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  record_id UUID,
  user_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Audit Trigger

Her INSERT, UPDATE, DELETE işlemi otomatik olarak loglanır:

```sql
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, operation, record_id, user_id, new_data)
    VALUES (TG_TABLE_NAME, 'INSERT', NEW.id, auth.uid(), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, operation, record_id, user_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, 'UPDATE', NEW.id, auth.uid(), to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, operation, record_id, user_id, old_data)
    VALUES (TG_TABLE_NAME, 'DELETE', OLD.id, auth.uid(), to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Güvenlik Testleri

### Manuel Test Senaryoları

1. **Kullanıcı Erişim Testleri**
   - Kullanıcı kendi profiline erişebilir
   - Kullanıcı başka kullanıcının profiline erişemez
   - Anonim kullanıcı sadece public verilere erişebilir

2. **Agent Erişim Testleri**
   - Agent kendi property'lerini yönetebilir
   - Agent başka agent'ın property'lerini yönetemez
   - Agent kendi property'leri için gelen inquiry'leri görebilir

3. **Favorites Testleri**
   - Kullanıcı kendi favorilerini yönetebilir
   - Kullanıcı başka kullanıcının favorilerini yönetemez

4. **Inquiries Testleri**
   - Kullanıcı kendi inquiry'lerini görebilir
   - Agent sadece kendi property'leri için gelen inquiry'leri görebilir

### Otomatik Testler

Test senaryoları `supabase/policies/test_scenarios.sql` dosyasında bulunabilir.

## Güvenlik En İyi Uygulamaları

### 1. Principle of Least Privilege

- Kullanıcılar sadece gerekli minimum erişime sahip
- Her politika spesifik işlemler için tasarlanmış

### 2. Defense in Depth

- Çoklu güvenlik katmanları
- Authentication + Authorization + Audit

### 3. Input Validation

- Tüm giriş verileri doğrulanır
- SQL injection koruması

### 4. Audit Trail

- Tüm değişiklikler loglanır
- Geriye dönük izleme mümkün

## Güvenlik Kontrol Listesi

- [ ] RLS tüm tablolarda aktif
- [ ] Tüm politikalar test edildi
- [ ] Audit logging çalışıyor
- [ ] Güvenlik fonksiyonları doğru çalışıyor
- [ ] Input validation uygulandı
- [ ] Error handling güvenli
- [ ] Session management güvenli
- [ ] HTTPS kullanılıyor
- [ ] Environment variables güvenli

## Güvenlik İhlali Müdahale

### 1. Tespit

- Audit logları düzenli kontrol edilmeli
- Anormal aktiviteler izlenmeli

### 2. Müdahale

- İlgili kullanıcı hesabı askıya alınmalı
- Güvenlik ekibi bilgilendirilmeli
- Gerekirse yasal makamlar bilgilendirilmeli

### 3. Önleme

- Güvenlik politikaları güncellenmeli
- Ek güvenlik katmanları eklenmeli
- Kullanıcı eğitimi yapılmalı

## İletişim

Güvenlik sorunları için: security@example.com
