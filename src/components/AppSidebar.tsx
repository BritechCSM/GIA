import { 
  Home,
  TrendingUp,
  Package,
  DollarSign,
  Warehouse,
  Truck,
  Users,
  Store,
  Globe,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  Crown,
  Minimize2
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { ImageWithFallback } from './figma/ImageWithFallback'
import kredivLogo from 'figma:asset/78c5270246ba09f94198b786559619f1c2eac406.png'

const navigationItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: Home, url: "#", active: true },
      { title: "Analytics", icon: BarChart3, url: "#" },
    ]
  },
  {
    title: "Sales Channels",
    items: [
      { title: "Store", icon: Store, url: "#" },
      { title: "Marketplace", icon: ShoppingCart, url: "#" },
      { title: "Website", icon: Globe, url: "#" },
    ]
  },
  {
    title: "SCM & Stocks",
    items: [
      { title: "Inventory", icon: Package, url: "#" },
      { title: "Products", icon: Package, url: "#" },
      { title: "Supply Chain", icon: TrendingUp, url: "#" },
    ]
  },
  {
    title: "Finance",
    items: [
      { title: "Invoicing", icon: FileText, url: "#" },
      { title: "Reports", icon: BarChart3, url: "#" },
      { title: "Accounts", icon: DollarSign, url: "#" },
    ]
  },
  {
    title: "WMS",
    items: [
      { title: "Warehouse", icon: Warehouse, url: "#" },
      { title: "Orders", icon: FileText, url: "#" },
      { title: "Tracking", icon: Package, url: "#" },
    ]
  },
  {
    title: "Delivery",
    items: [
      { title: "EasyParcel", icon: Truck, url: "#" },
      { title: "Deliva", icon: Truck, url: "#" },
      { title: "ParcelDaily", icon: Truck, url: "#" },
    ]
  },
  {
    title: "CRM",
    items: [
      { title: "Customers", icon: Users, url: "#" },
      { title: "Support", icon: Users, url: "#" },
    ]
  }
]

interface AppSidebarProps {
  onMinimize?: () => void
}

export function AppSidebar({ onMinimize }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <ImageWithFallback 
                src={kredivLogo} 
                alt="Krediv Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-sidebar-foreground text-lg" style={{ fontFamily: 'Satoshi' }}>
              Krediv ERP
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMinimize}
            className="h-8 w-8 p-0 hover:bg-accent"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 mb-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`w-full justify-start gap-3 h-9 px-3 rounded-lg transition-colors ${
                        item.active 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <a href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        
        <Separator className="my-4" />
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="w-full justify-start gap-3 h-9 px-3 rounded-lg hover:bg-accent hover:text-accent-foreground">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button className="w-full justify-start gap-2 bg-gradient-to-r from-primary to-[#ff6b2d] hover:from-primary/90 hover:to-[#ff6b2d]/90 text-primary-foreground">
          <Crown className="w-4 h-4" />
          Upgrade Plan
        </Button>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}