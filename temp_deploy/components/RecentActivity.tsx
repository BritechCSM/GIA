import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { ExternalLink, Eye } from "lucide-react"

const recentTransactions = [
  {
    id: "TXN-001",
    type: "Sale",
    customer: "Acme Corp",
    amount: "RM12,340",
    status: "Completed",
    channel: "Website",
    date: "2025-01-15",
    time: "14:32"
  },
  {
    id: "TXN-002",
    type: "Purchase",
    customer: "Tech Solutions",
    amount: "RM8,560",
    status: "Processing",
    channel: "Store",
    date: "2025-01-15",
    time: "13:45"
  },
  {
    id: "TXN-003",
    type: "Sale",
    customer: "Global Industries",
    amount: "RM21,500",
    status: "Shipped",
    channel: "Marketplace",
    date: "2025-01-14",
    time: "16:20"
  },
  {
    id: "TXN-004",
    type: "Return",
    customer: "Local Business",
    amount: "-RM6,950",
    status: "Pending",
    channel: "Store",
    date: "2025-01-14",
    time: "11:15"
  },
  {
    id: "TXN-005",
    type: "Sale",
    customer: "Startup Inc",
    amount: "RM15,800",
    status: "Completed",
    channel: "Website",
    date: "2025-01-13",
    time: "09:30"
  }
]

const integrationActivity = [
  {
    integration: "EasyParcel API",
    action: "Shipment created",
    details: "Order #ORD-1234 shipped",
    status: "success",
    time: "5 min ago"
  },
  {
    integration: "Marketplace Sync",
    action: "Inventory updated",
    details: "245 products synchronized",
    status: "success",
    time: "12 min ago"
  },
  {
    integration: "Payment Gateway",
    action: "Payment failed",
    details: "Transaction #TXN-5678",
    status: "error",
    time: "23 min ago"
  },
  {
    integration: "WMS System",
    action: "Stock adjustment",
    details: "Low stock alerts sent",
    status: "warning",
    time: "1 hour ago"
  }
]

function getStatusBadge(status: string) {
  const statusColors = {
    Completed: "bg-green-50 text-green-700 border-green-200",
    Processing: "bg-blue-50 text-blue-700 border-blue-200",
    Shipped: "bg-purple-50 text-purple-700 border-purple-200",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200"
  }
  
  return (
    <Badge className={`${statusColors[status as keyof typeof statusColors]} border text-xs font-normal`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function getChannelBadge(channel: string) {
  return (
    <Badge variant="outline" className="text-xs font-normal">
      {channel}
    </Badge>
  )
}

export function RecentActivity() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle style={{ fontFamily: 'Satoshi' }}>Recent Transactions</CardTitle>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Transaction</TableHead>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Channel</TableHead>
                <TableHead className="text-xs">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-sm">{transaction.id}</TableCell>
                  <TableCell className="text-sm">{transaction.customer}</TableCell>
                  <TableCell className={`text-sm font-medium ${
                    transaction.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.amount}
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>{getChannelBadge(transaction.channel)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {transaction.date}
                    <br />
                    <span className="text-xs">{transaction.time}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle style={{ fontFamily: 'Satoshi' }}>Integration Activity</CardTitle>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Monitor
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrationActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.integration}</p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.details}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
