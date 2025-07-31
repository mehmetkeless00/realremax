### Task: Create Property Listing Form

**Description**: Build a multi-step form for agents to create/edit property listings with details, photos, and specs.

**PDR Reference**: Form Components (Section 4.5)

**Dependencies**: Property Card

**Estimated Effort**: 10 hours

**Acceptance Criteria**:

- Multi-step wizard for property details, photos, pricing.
- Drag-and-drop photo upload with preview.
- Form validation for required fields.
- Accessible only to authenticated agents.

**Sample Code**:

```tsx
// components/ListingForm.tsx
'use client';
import { useState } from 'react';
import { useSupabase } from '@/lib/supabase';

export default function ListingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', price: 0 });
  const supabase = useSupabase();

  const handleSubmit = async () => {
    const { error } = await supabase.from('properties').insert([formData]);
    if (error) console.error(error);
  };

  return (
    <form className="space-y-4">
      {step === 1 && (
        <>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="input-field"
          />
          <button
            type="button"
            onClick={() => setStep(2)}
            className="button-primary"
          >
            Next
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            className="input-field"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="button-primary"
          >
            Submit
          </button>
        </>
      )}
    </form>
  );
}
```
