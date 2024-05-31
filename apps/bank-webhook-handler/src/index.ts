import db from '@rohansharma18/db/client';
import express from "express";
import z from "zod";

const app = express()

const paymentInformationSchema = z.object({
    token: z.string(),
    userId: z.string(),
    amount: z.string()
})

type paymentInformationType = z.infer<typeof paymentInformationSchema>
app.use(express.json())
app.post("/hdfcWebhook", async (req,res) => {
     //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
     console.log(req.body);

     if(!req.body){
        res.status(403).json({
            message: "No request body"
        })
     }
    const paymentInformation: paymentInformationType = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    }

    try{
        await db.$transaction([
            db.balance.update({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success"
                }
            })
        ]);
        
        res.json({
            message: "Captured"
        })
    }catch(e){
        console.log(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003);