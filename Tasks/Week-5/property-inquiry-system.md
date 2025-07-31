### Task: Implement Property Inquiry System

**Description**: Build a system to send property inquiries to agents via SendGrid email, with inquiry tracking in Supabase.

**PDR Reference**: Contact Forms (Section 4.5.2)

**Dependencies**: Property Detail Page

**Estimated Effort**: 8 hours

**Acceptance Criteria**:
- Inquiry form sends email to assigned agent.
- Inquiry is logged in Supabase inquiries table.
- Users receive confirmation email.
- Agents can view inquiries in dashboard.

**Sample Code**:
```ts
// app/api/inquiry/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => {} }
  );
  const { propertyId, message, userEmail } = await request.json();
  const { data: property } = await supabase.from('properties').select('agent_id').eq('id', propertyId).single();
  const { data: agent } = await supabase.from('agents').select('email').eq('id', property.agent_id).single();

  await sendgrid.send({
    to: agent.email,
    from: 'no-reply@remax.com',
    subject: `New Inquiry for ${propertyId}`,
    text: message,
  });

  const { error } = await supabase.from('inquiries').insert([{ property_id: propertyId, user_email: userEmail, message }]);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
```