import { NextRequest, NextResponse } from 'next/server';
import { getTrackingDetails } from '../../../../../lib/tracking/provider';

export async function GET(
  request: NextRequest,
  { params }: { params: { carrier: string; number: string } }
) {
  try {
    const { carrier, number } = params;

    if (!carrier || !number) {
      return NextResponse.json(
        { error: 'Carrier name and tracking number are required' },
        { status: 400 }
      );
    }

    const trackingDetails = await getTrackingDetails(carrier, number);

    return NextResponse.json(trackingDetails);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
