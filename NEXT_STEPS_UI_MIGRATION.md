# UI Design System — Next Steps Checklist

This file gives you a short, practical plan to finish integrating the new design system.

---

## 0) Sanity Checks (5–10 min)

- [ ] `src/design-system/tokens.css` ve `theme.css` importları **src/app/globals.css** içinde en üstte.
- [ ] `tailwind.config.ts` → `extend` bölümünde **colors / fontFamily / spacing / radius / shadows** CSS değişkenlerine bağlı.
- [ ] DevTools → `body` **font-family** değerinde **Montserrat** görünüyor.
- [ ] Tema değişimi: `document.documentElement.setAttribute('data-theme', 'dark')` yaptığında arka plan/metin renkleri değişiyor.

---

## 1) Hızlı Smoke Test

```bash
npm run dev
# localhost:3000 üzerinde:
# - Buttons, Inputs, Cards görsel olarak doğru mu?
# - Dark mode geçişi anlık çalışıyor mu?
# - Form focus (mavi halka) görünüyor mu?
```

- [ ] Her sayfada en az 1 buton ve input ile göz testi yaptım.

---

## 2) Refactor Sırası (Önceliklendirilmiş)

1. **Buttons** → tüm sayfalarda ham Tailwind class'lı `<button>` yerine `components/ui/button.tsx`

- [ ] `/properties`
- [ ] `/favorites`
- [ ] `/dashboard` & `/dashboard/listings`
- [ ] `/auth/*`
- [ ] `/profile`

2. **Inputs & Labels** → `components/ui/input.tsx` + `components/ui/label.tsx`

- [ ] Arama/filtre alanları
- [ ] Auth formları
- [ ] Profil/Listing formları

3. **Cards** → `components/ui/card.tsx` ile liste/grid kartları (örn: ilan kartları)

- [ ] Property listesinde tüm kartlar Card bileşenine taşındı

4. **Patterns** → Mevcut **PropertyCard**'ı sadece UI olacak şekilde sadeleştir (data/iş mantığını container'a taşı)

- [ ] `PropertyCard` UI (presentational) + `PropertyCardContainer` (data)
- [ ] Re-usable alt parçalar: fiyat alanı, badge, agent chip

5. **Header / Layout** → spacing, renk, shadow ve radius’ları token’lardan kullan

---

## 3) Kod Kalitesi

```bash
# Otomatik düzeltmeler
npm run format
npm run lint -- --fix

# Tip kontrol
npm run type-check

# Prod build
npm run build
```

- [ ] Build uyarıları ve hataları sıfırlandı
- [ ] Prettier/ESLint sorunları kalmadı

---

## 4) Erişilebilirlik (a11y) Hız Kontrol Listesi

- [ ] Tüm form kontrollerinde `label`/`htmlFor` eşleşmesi var
- [ ] Butonlar `<button>` olarak tanımlı, linkler `<a>`/`Link`
- [ ] Modallar (varsa) `role="dialog"` ve odak tuzağına sahip
- [ ] Kontrastlar (AA) yeterli (koyu temada özellikle)
- [ ] Klavye ile tüm etkileşimler yapılabiliyor

---

## 5) Performans & Görseller

- [ ] Tüm görseller `next/image` kullanıyor
- [ ] Büyük/ikincil bileşenlerde `dynamic(import)` (SSR: false gerekliyse)
- [ ] Listelerde pagination/limit var (sonsuz render yok)

---

## 6) SEO & Meta

- [ ] Sayfa başlıkları ve açıklamaları: `export const metadata = { title, description, openGraph }`
- [ ] OG/Twitter görselleri (opsiyonel)
- [ ] Yapılandırılmış veri (Schema.org) (opsiyonel)

---

## 7) ENV Kontrol Listesi

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SENDGRID_API_KEY` (server only)
- [ ] `NEXT_PUBLIC_GA_ID` (varsa)

> Prod/test anahtarlarını ayrı tut, Vercel Environment Variables ayarlı olsun.

---

## 8) İlerleme Takibi (Örnek Tablo)

| Sayfa/Modül           | Durum | Not                        |
| --------------------- | ----- | -------------------------- |
| `/properties`         | ☐     | Button/Input/Card refactor |
| `/properties/[id]`    | ☐     | Görsel optimizasyon        |
| `/favorites`          | ☐     | Card & Badge               |
| `/dashboard`          | ☐     | Layout & Buttons           |
| `/dashboard/listings` | ☐     | Forms & Validation         |
| `/auth/*`             | ☐     | Inputs/Labels              |
| `/profile`            | ☐     | Form erişilebilirliği      |

---

## 9) Kabul Kriterleri (Definition of Done)

- [ ] Tüm butonlar/inputs/cards yeni primitives ile
- [ ] Dark/light temada bozulma yok
- [ ] En az 1 kritik akış (Login → Favori ekleme) manuel testten geçti
- [ ] `npm run build` temiz
- [ ] ENV eksiksiz
- [ ] A11y hızlı kontrol listesi tamam

---

## 10) Opsiyonel: Storybook (önerilir)

```bash
npx storybook@latest init
npm run storybook
```

- [ ] Button/Input/Card için Light/Dark story’leri hazır
- [ ] Storybook ile görsel kontrol rahat yapılıyor

---

### İpuçları

- “Ham class → primitive” dönüşümünde yavaş ama **tutarlı** ilerle: önce butonlar, sonra inputlar.
- Pattern’leri (PropertyCard, AdvancedSearchBar) **yalnız UI** yap; veri çekimi container seviyesine.
- Token’ları sabitle (değiştikçe tüm proje etkilenir), kod review’da önce token/kural uyumunu kontrol et.
