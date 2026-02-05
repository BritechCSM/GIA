import { Plus, FileText, Users, Package, ShoppingCart, Calculator } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const quickActions = [
  { icon: Plus, label: "New Order", color: "bg-blue-500" },
  { icon: FileText, label: "Create Invoice", color: "bg-green-500" },
  { icon: Users, label: "Add Customer", color: "bg-purple-500" },
  { icon: Package, label: "Add Product", color: "bg-orange-500" },
  { icon: ShoppingCart, label: "Process Return", color: "bg-red-500" },
  { icon: Calculator, label: "Generate Report", color: "bg-indigo-500" },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
          >
            <div className={`p-2 rounded-md ${action.color} text-white`}>
              <action.icon className="w-4 h-4" />
            </div>
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
