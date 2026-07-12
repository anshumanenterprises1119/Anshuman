import { NextResponse } from 'next/server';
import { runCatalogDiagnosis } from '../../../lib/db/diagnose';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const result = await runCatalogDiagnosis();
    return NextResponse.json({
      success: true,
      message: 'Catalog database integrity scan finished. Markdown report generated.',
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
