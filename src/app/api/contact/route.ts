import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    // Kullanıcıyı kontrol et
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId, name, email, message } = await request.json();

    // Basit validasyon
    if (!propertyId || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Contact mesajını kaydet (gerçek uygulamada bu bir contact_messages tablosuna kaydedilir)
    // Şimdilik sadece başarılı response döndürüyoruz

    // TODO: Contact messages tablosu oluşturulduğunda buraya kaydetme işlemi eklenecek
    // const { data, error } = await supabase
    //   .from('contact_messages')
    //   .insert([{
    //     user_id: user.id,
    //     property_id: propertyId,
    //     agent_id: agentId,
    //     name,
    //     email,
    //     phone,
    //     message,
    //   }])
    //   .select();

    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 400 });
    // }

    return NextResponse.json({
      message: 'Message sent successfully',
      // data
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
