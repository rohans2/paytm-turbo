import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import { NextResponse } from "next/server";

export const GET = async () => {
    //use Session hook can only be used in UI components
    const session = await getServerSession(authOptions);
    if(session?.user){
        return NextResponse.json({
            user: session.user
        })
    }
    return NextResponse.json({
        message: "You are not logged in"
    }, {
        status: 403
    })
}