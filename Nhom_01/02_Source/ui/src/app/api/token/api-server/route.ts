import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    // check if the user has the required roles
    const session = await getSession();
    console.log(req ? "" : "req is null");

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = new NextResponse();
    const { accessToken } = await getAccessToken();

    return NextResponse.json({ accessToken }, res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
};
