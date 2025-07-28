import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('API route hit: /api/ai/analyze-cv');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    // Forward the request to the backend API
    const backendUrl = 'http://localhost:5001/api/v1/ai/analyze-cv';
    console.log('Forwarding to:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      // Handle rate limit error specifically
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'One CV analysis per minute, please try again after 1 minute' },
          { status: 429 }
        );
      }
      
      // Try to parse JSON response for other errors
      try {
        const data = await response.json();
        console.log('Backend returned error:', data);
        return NextResponse.json(
          { error: data.error || 'CV analysis failed' },
          { status: response.status }
        );
      } catch (parseError) {
        // If JSON parsing fails, return a generic error
        console.log('Failed to parse error response as JSON');
        return NextResponse.json(
          { error: 'CV analysis failed, please try again' },
          { status: response.status }
        );
      }
    }

    // Parse successful response
    const data = await response.json();
    console.log('Backend response data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('CV analysis proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 