import { NextResponse } from 'next/server';
import type { User } from '@/types';
import { ALL_USERS_DATASET } from '@/lib/constants';

export const runtime = 'edge';

export async function GET() {
  try {
    console.log('🌐 Fetching all users...');

    const users = ALL_USERS_DATASET.map(user => ({
      ...user,
      completion: Math.floor(Math.random() * 40) + 60
    }));

    console.log(`✅ Returning ${users.length} users`);

    const response = NextResponse.json({ 
      users,
      total: users.length,
      message: `Found ${users.length} Torre users`
    });

    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=7200, max-age=1800'
    );
    response.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );

    return response;
  } catch (error) {
    console.error('❌ Error fetching all users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
