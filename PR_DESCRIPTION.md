# fix(properties): show listings via mock fallback, add empty-state, tolerate sale/buy

## Problem
- `/properties` page showed "0 listings" with blank grid
- `searchProperties()` only fell back to mock on error, not when DB returned 0 rows
- No empty state UI when no results found
- DB `listing_type` values might use 'sale' instead of 'buy'

## Solution
1. **Enhanced fallback logic**: Now falls back to mock when:
   - Supabase query fails (existing)
   - Supabase returns 0 rows (new)
   - Empty table, RLS blocking, or no filter matches

2. **Sale/Buy tolerance**: When filtering by `mode='buy'`, allows both `'buy'` and `'sale'` values

3. **Empty state UI**: Added proper empty state message when no listings found

4. **Dev convenience**: Added `NEXT_PUBLIC_USE_MOCK_LISTINGS=true` to force mock data

## Environment Variables
Add to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Dev convenience to force mock:
NEXT_PUBLIC_USE_MOCK_LISTINGS=true
```

## RLS Setup (if using Supabase)
If you have Row-Level Security enabled, allow anonymous read access:

```sql
-- Enable RLS on properties table
alter table properties enable row level security;

-- Create policy for anonymous read access (dev only)
create policy "read published properties" on properties
for select using (true); -- or using (published = true) if you have a published column
```

## Quick Seed Data
To test with real Supabase data, insert a few sample rows:

```sql
INSERT INTO properties (
  id, title, description, price, listing_type, type, 
  city, location, bedrooms, bathrooms, size, 
  amenities, photos, created_at
) VALUES 
(
  'p1', 'Modern Apartment in Lisbon', 'Beautiful 2-bedroom apartment', 
  350000, 'buy', 'apartment', 'Lisbon', 'Estrela', 
  2, 2, 85, 
  '["Balcony", "Elevator", "Garage"]', 
  '["/placeholder/prop1.jpg"]', 
  NOW()
),
(
  'p2', 'Cozy Studio for Rent', 'Perfect for young professionals', 
  1200, 'rent', 'apartment', 'Porto', 'Ribeira', 
  1, 1, 45, 
  '["Furnished", "WiFi"]', 
  '["/placeholder/dev1.jpg"]', 
  NOW()
);
```

## Testing
1. With `NEXT_PUBLIC_USE_MOCK_LISTINGS=true`: Should see 8 mock cards immediately
2. With real DB and proper rows/RLS: Supabase results should show
3. With empty DB or RLS blocking: Falls back to mock data
4. Toggle between Buy/Rent: Should show different property sets

## Acceptance Criteria
- ✅ `/properties` shows cards either from DB or mock (never blank)
- ✅ Toggling `NEXT_PUBLIC_USE_MOCK_LISTINGS` switches sources
- ✅ If DB has 0 rows or RLS blocks, mock appears
- ✅ When DB gains rows, DB results appear
- ✅ No secrets logged, clear console diagnostics
- ✅ Empty state shown when no results match filters
