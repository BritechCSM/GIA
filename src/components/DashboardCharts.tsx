import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 45000, orders: 120 },
  { month: "Feb", revenue: 52000, orders: 142 },
  { month: "Mar", revenue: 48000, orders: 135 },
  { month: "Apr", revenue: 61000, orders: 158 },
  { month: "May", revenue: 55000, orders: 149 },
  { month: "Jun", revenue: 67000, orders: 172 },
  { month: "Jul", revenue: 71000, orders: 185 },
  { month: "Aug", revenue: 69000, orders: 178 },
  { month: "Sep", revenue: 78000, orders: 195 },
  { month: "Oct", revenue: 82000, orders: 208 },
  { month: "Nov", revenue: 85000, orders: 215 },
  { month: "Dec", revenue: 92000, orders: 235 }
]

const categoryData = [
  { category: "Electronics", sales: 45000 },
  { category: "Clothing", sales: 38000 },
  { category: "Home & Garden", sales: 32000 },
  { category: "Sports", sales: 28000 },
  { category: "Books", sales: 22000 },
]

export function DashboardCharts() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`RM${value?.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Orders']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`RM${value?.toLocaleString()}`, 'Sales']} />
              <Bar dataKey="sales" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}