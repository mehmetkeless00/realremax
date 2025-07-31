### Task: Form Validation Strategy (Zod + React Hook Form)

**Description**: Establish a robust form validation approach using Zod schemas and React Hook Form (RHF) for all user-facing forms.

**Subtasks:**
- Install Zod and RHF
- Create `/lib/validation/` directory for schemas
- Integrate Zod with RHF using `zodResolver`
- Provide example for a property listing form

**Folder/File Path Suggestions:**
- `/lib/validation/propertySchema.ts`
- `/components/ListingForm.tsx`

**Acceptance Criteria:**
- All forms use Zod schemas for validation
- Validation errors are shown inline
- TypeScript types are inferred from schemas

**Estimated Effort:** 3 hours

**Example:**
```ts
// lib/validation/propertySchema.ts
import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(3),
  price: z.number().min(1),
});

export type PropertyInput = z.infer<typeof propertySchema>;
```
```tsx
// components/ListingForm.tsx (snippet)
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, PropertyInput } from '@/lib/validation/propertySchema';

export default function ListingForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
  });
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      <input type="number" {...register('price', { valueAsNumber: true })} />
      {errors.price && <span>{errors.price.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```