import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@rohansharma18/db/client";
import { P2PTransfers } from "../../../components/P2PTransfers";

async function getTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        {
          toUserId: Number(session?.user?.id),
        },
        { fromUserId: Number(session?.user?.id) },
      ],
    },
  });
  console.log("txns", txns);
  console.log(session?.user?.id);
  return txns.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
    status: t.fromUserId === Number(session?.user?.id) ? "Sent" : "Received",
    peerId:
      t.fromUserId === Number(session?.user?.id) ? t.toUserId : t.fromUserId,
  }));
}

export default async function () {
  const transactions = await getTransactions();
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <SendCard />
        </div>
        <div>
          <P2PTransfers transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
