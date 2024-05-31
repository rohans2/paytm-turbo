
"use server"

import { getServerSession } from "next-auth"
import prisma from "@rohansharma18/db/client"
import { authOptions } from "../auth"

export async function createOnRampTransaction(provider: string, amount: number){
    // the token must come from the banking provider (hdfc/axis)
    const session = await getServerSession(authOptions)
    if(!session?.user || !session.user?.id){
        return {
            message: "Unauthorized request"
        }
    }
    const token = (Math.random() * 1000).toString();
    await prisma.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: Number(session?.user?.id),
            amount: amount * 100
        }
    })
    return {
        message: "Done"
    }
}