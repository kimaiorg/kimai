import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withApiAuthRequired(async (req: NextRequest) => {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken();

    return NextResponse.json({ accessToken }, res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
});
