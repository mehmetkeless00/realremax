import { NextRequest, NextResponse } from 'next/server';
import {
  listListings,
  createListing,
  updateListing,
  deleteListing,
} from '@/server/db/listings';

export async function GET() {
  try {
    return NextResponse.json(await listListings());
  } catch (e: unknown) {
    const error = e as Error;
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return NextResponse.json(await createListing(await req.json()));
  } catch (e: unknown) {
    const error = e as Error;
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.id)
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    return NextResponse.json(await updateListing(String(body.id), body));
  } catch (e: unknown) {
    const error = e as Error;
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(await deleteListing(id));
  } catch (e: unknown) {
    const error = e as Error;
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 400 }
    );
  }
}
