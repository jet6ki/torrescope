import { NextResponse } from 'next/server';
import { computePercentile } from '@/lib/computePercentile';
import type { TorreGenomeResponse, ProcessedGenome, TorreSkill, TorreExperience, TorreLanguage } from '@/types/torre';

export const runtime = 'edge';

interface RouteParams {
  params: {
    username: string;
  };
}

const TORRE_BASE_URL = process.env.NEXT_PUBLIC_TORRE_BASE || 'https://torre.ai/api';

export async function GET(request: Request, { params }: RouteParams) {
  const { username } = params;

  // Validate username
  if (!username || username.trim().length === 0) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  // Sanitize username to prevent injection
  const sanitizedUsername = username.replace(/[^a-zA-Z0-9._-]/g, '');
  if (sanitizedUsername !== username) {
    return NextResponse.json(
      { error: 'Invalid username format' },
      { status: 400 }
    );
  }

  try {
    // Fetch from Torre API
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

    const torreData = await response.json();

    // Process the data
    const processedData: ProcessedGenome = {
      username: username,
      person: {
        name: torreData.person?.name || '',
        professionalHeadline: torreData.person?.professionalHeadline || '',
        location: torreData.person?.location?.name || '',
        completion: torreData.person?.completion || 0
      },
      skills: []
    };

    // Extract skills from strengths if available
    if (torreData.strengths && torreData.strengths.length > 0) {
      processedData.skills = torreData.strengths
        .filter((strength: TorreSkill) => strength.proficiency && strength.proficiency > 0)
        .map((strength: TorreSkill) => ({
          name: strength.name,
          proficiency: strength.proficiency,
          percentile: computePercentile(strength.name, strength.proficiency),
        }))
        .sort((a: { proficiency: number }, b: { proficiency: number }) => b.proficiency - a.proficiency)
        .slice(0, 20);
    }

    // Sort by proficiency and limit
    processedData.skills = processedData.skills
      .sort((a, b) => b.proficiency - a.proficiency)
      .slice(0, 15); // Limit to 15 for better radar visualization

    const nextResponse = NextResponse.json(processedData);

    // Set cache headers
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

    // Return appropriate error based on error type
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