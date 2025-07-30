import { NextResponse } from 'next/server';
import type { SearchResult } from '@/types';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: 'Query must be at least 2 characters' },
      { status: 400 }
    );
  }

  try {
    const searchQuery = query.trim();
    let suggestions: SearchResult[] = [];

    try {
      const searchResponse = await fetch('https://torre.ai/api/people/search', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Torre-Radar/1.0'
        },
        body: JSON.stringify({
          query: searchQuery,
          limit: 10,
          offset: 0,
          filters: {
            name: searchQuery,
            username: searchQuery
          }
        }),
        cache: 'no-store'
      });

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();

        if (searchData.results && Array.isArray(searchData.results)) {
          for (const person of searchData.results.slice(0, 8)) {
            if (person.username || person.publicId) {
              const username = person.username || person.publicId;
              suggestions.push({
                username: username,
                name: person.name || person.professionalHeadline || 'Unknown',
                professionalHeadline: person.professionalHeadline || 'No headline',
                location: person.location?.name || 'Unknown location',
                completion: person.completion || 0,
                verified: person.verified || false,
              });
            }
          }
        }
      }
    } catch (searchError) {
      console.warn('Torre search API failed, falling back to direct lookup:', searchError);
    }

    if (suggestions.length === 0) {
      try {
        const response = await fetch(`https://torre.ai/api/genome/bios/${searchQuery}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Torre-Radar/1.0'
          },
          cache: 'no-store'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.person) {
            suggestions.push({
              username: data.person.publicId || searchQuery,
              name: data.person.name || 'Unknown',
              professionalHeadline: data.person.professionalHeadline || 'No headline',
              location: data.person.location?.name || 'Unknown location',
              completion: data.person.completion || 0,
              verified: data.person.verified || false,
            });
          }
        }
      } catch (error) {
        console.warn('Direct username lookup failed:', error);
      }
    }

    if (suggestions.length === 0 && searchQuery.length >= 2) {
      const commonUsernames = [
        'sr', 'renan', 'john', 'jane', 'alex', 'maria', 'carlos', 'ana',
        'luis', 'sofia', 'diego', 'laura', 'miguel', 'carmen', 'jose',
        'patricia', 'david', 'elena', 'antonio', 'monica'
      ];

      const matchingUsernames = commonUsernames
        .filter(username => username.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3);

      for (const username of matchingUsernames) {
        try {
          const response = await fetch(`https://torre.ai/api/genome/bios/${username}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'User-Agent': 'Torre-Radar/1.0'
            },
            cache: 'no-store'
          });

          if (response.ok) {
            const data = await response.json();
            if (data.person) {
              suggestions.push({
                username: username,
                name: data.person.name || 'Unknown',
                professionalHeadline: data.person.professionalHeadline || 'No headline',
                location: data.person.location?.name || 'Unknown location',
                completion: data.person.completion || 0,
                verified: data.person.verified || false,
              });
            }
          }
        } catch (error) {
        }
      }
    }

    const nextResponse = NextResponse.json({ suggestions });

    nextResponse.headers.set(
      'Cache-Control',
      's-maxage=300, stale-while-revalidate=600'
    );
    nextResponse.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );

    return nextResponse;
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
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
