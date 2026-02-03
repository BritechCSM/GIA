import { Search, Bell, User, Menu, Minimize2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { SidebarTrigger } from "./ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface DashboardHeaderProps {
  onMinimizeUI?: () => void
}

export function DashboardHeader({ onMinimizeUI }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-6 border-border">
      <SidebarTrigger className="h-8 w-8" />
      
      <div className="flex-1 flex items-center gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="pl-10 w-full bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Minimize UI Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMinimizeUI}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Minimize UI"
        >
          <Minimize2 className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0 hover:bg-accent">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 px-1 py-0 text-xs min-w-4 h-4 text-[10px] bg-primary text-primary-foreground">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel style={{ fontFamily: 'Satoshi' }}>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-accent">
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-medium">Low Stock Alert</p>
                <p className="text-xs text-muted-foreground">Product "Widget A" has only 5 units remaining</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-accent">
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-medium">New Order #1234</p>
                <p className="text-xs text-muted-foreground">Customer John Doe placed an order worth RM1,250</p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-accent">
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-medium">Payment Received</p>
                <p className="text-xs text-muted-foreground">Invoice #INV-5678 has been paid</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 hover:bg-accent">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel style={{ fontFamily: 'Satoshi' }}>Admin User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-accent">Profile</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-accent">Settings</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-accent">Help</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-accent">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}