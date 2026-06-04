import { NextResponse } from 'next/server';

// Champion pick is now handled via the bracket API (Final round, slot 0).
// This route exists only for backwards compatibility and redirects to bracket.
export async function GET() {
  return NextResponse.json({ message: 'Champion pick is now part of the bracket. Use /api/picks/bracket (Final, slot 0).' }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ message: 'Champion pick is now part of the bracket. Use /api/picks/bracket (Final, slot 0).' }, { status: 410 });
}
