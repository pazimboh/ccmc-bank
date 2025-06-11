
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight, CreditCard, ShoppingBag } from "lucide-react";

interface RecentTransactionsProps {
  limit?: number;
}

const transactions = [
  {
    id: "1",
    description: "Amazon.com",
    amount: -33500,
    date: "Today",
    type: "purchase",
    icon: ShoppingBag,
    color: "text-red-500",
  },
  {
    id: "2",
    description: "Salary Deposit",
    amount: 1440000,
    date: "Yesterday",
    type: "deposit",
    icon: ArrowDownRight,
    color: "text-green-500",
  },
  {
    id: "3",
    description: "Starbucks",
    amount: -2700,
    date: "Mar 10",
    type: "purchase",
    icon: CreditCard,
    color: "text-red-500",
  },
  {
    id: "4",
    description: "Transfer to Savings",
    amount: -300000,
    date: "Mar 8",
    type: "transfer",
    icon: ArrowUpRight,
    color: "text-blue-500",
  },
  {
    id: "5",
    description: "Netflix Subscription",
    amount: -9600,
    date: "Mar 5",
    type: "subscription",
    icon: CreditCard,
    color: "text-red-500",
  },
];

const RecentTransactions = ({ limit }: RecentTransactionsProps) => {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="space-y-4">
      {displayTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-gray-100 ${transaction.color}`}>
              <transaction.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">{transaction.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${transaction.amount < 0 ? "text-red-500" : "text-green-500"}`}>
              {transaction.amount < 0 ? "-" : "+"}{Math.abs(transaction.amount).toLocaleString()} FCFA
            </p>
            <Badge variant="outline" className="text-xs capitalize">
              {transaction.type}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactions;
