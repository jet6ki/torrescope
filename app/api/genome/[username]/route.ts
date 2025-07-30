import { NextResponse } from 'next/server';
import type { TorreGenomeResponse } from '@/types/torre';
import { transformTorreData } from '@/lib/torre-transformer';

export const runtime = 'edge';

interface RouteParams {
  params: {
    username: string;
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { username } = params;

  if (!username || username.trim().length === 0) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  const sanitizedUsername = username.replace(/[^a-zA-Z0-9._-]/g, '');
  if (sanitizedUsername !== username) {
    return NextResponse.json(
      { error: 'Invalid username format' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`https://torre.ai/api/genome/bios/${sanitizedUsername}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Torre-Radar/1.0'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }
      throw new Error(`Torre API responded with ${response.status}`);
    }

    const torreData: TorreGenomeResponse = await response.json();

    if (!torreData.person) {
      return NextResponse.json(
        { error: 'Invalid user data received' },
        { status: 500 }
      );
    }

    const processedData = transformTorreData(torreData);

    console.log(`Processed ${processedData.skills.length} skills and ${processedData.experiences.length} experiences for user ${sanitizedUsername}`);

    const nextResponse = NextResponse.json(processedData);
    nextResponse.headers.set(
      'Cache-Control',
      's-maxage=300, stale-while-revalidate=86400'
    );
    nextResponse.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    nextResponse.headers.set(
      'Access-Control-Allow-Methods',
      'GET, OPTIONS'
    );
    nextResponse.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type'
    );

    return nextResponse;
  } catch (error) {
    console.error('Error fetching Torre data:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error accessing Torre API' },
        { status: 502 }
      );
    }

    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}