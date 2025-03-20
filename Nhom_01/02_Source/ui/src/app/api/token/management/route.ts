import { getSession } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    // check if the user has the required roles
    const session = await getSession();

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.post<{
            access_token: string;
            expires_in: number;
            token_type: string;
        }>(
            `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.AUTH0_CLIENT_ID!,
                client_secret: process.env.AUTH0_CLIENT_SECRET!,
                audience: process.env.AUTH0_IAM_API_AUDIENCE!,
            }),
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            }
        );

        const accessToken = response.data.access_token;
        return NextResponse.json({ accessToken });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
};
