"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  Box,
  Calendar,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  Ship,
  ShoppingCart,
  Truck,
  User,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShipmentStatusChart } from "@/components/shipment-status-chart"
import { ShipmentTable } from "@/components/shipment-table"
import { DeliveryPlanCalendar } from "@/components/delivery-plan-calendar"
import { NotificationCenter } from "@/components/notification-center"
import { DashboardMetrics } from "@/components/dashboard-metrics"

export default function DashboardPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Package className="h-6 w-6" />
                    <span>ShipTrack Pro</span>
                  </Link>
                  <Separator />
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-primary"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/shipments" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                    <Ship className="h-5 w-5" />
                    <span>Shipments</span>
                  </Link>
                  <Link
                    href="/purchase-orders"
                    className="flex items-center gap-2"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Purchase Orders</span>
                  </Link>
                  <Link href="/delivery" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                    <Truck className="h-5 w-5" />
                    <span>Delivery</span>
                  </Link>
                  <Link href="/ports" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                    <Box className="h-5 w-5" />
                    <span>Ports & Terminals</span>
                  </Link>
                  <Link href="/clients" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                    <Users className="h-5 w-5" />
                    <span>Clients</span>
                  </Link>
                  <Link href="/reports" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                    <FileText className="h-5 w-5" />
                    <span>Reports</span>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2 md:hidden">
              <Package className="h-6 w-6" />
              <span className="font-bold">ShipTrack</span>
            </Link>
            <Link href="/" className="hidden items-center gap-2 md:flex">
              <Package className="h-6 w-6" />
              <span className="font-bold">ShipTrack Pro</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <form className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search shipments..." className="w-64 pl-8 md:w-80 lg:w-96" />
              </div>
            </form>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                5
              </Badge>
            </Button>
            <Button variant="outline" size="sm" className="ml-auto gap-1 md:gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline-flex">John Doe</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </div>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/shipments"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Ship className="h-4 w-4" />
              Shipments
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">12</Badge>
            </Link>
            <Link
              href="/purchase-orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <ShoppingCart className="h-4 w-4" />
              Purchase Orders
            </Link>
            <Link
              href="/delivery"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Truck className="h-4 w-4" />
              Delivery
            </Link>
            <Link
              href="/ports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Box className="h-4 w-4" />
              Ports & Terminals
            </Link>
            <Link
              href="/clients"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Clients
            </Link>
            <Link
              href="/reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              Reports
            </Link>
            <Separator className="my-2" />
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              href="/logout"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </nav>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/shipments/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Shipment
                </Link>
              </Button>
              <Select defaultValue="today">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
            </div>
          </div>
          <DashboardMetrics />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Shipment Status Overview</CardTitle>
                <CardDescription>Distribution of shipments by current status</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ShipmentStatusChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Deliveries</CardTitle>
                <CardDescription>Scheduled deliveries for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <DeliveryPlanCalendar />
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="recent">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="recent">Recent Shipments</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="ports">Port Status</TabsTrigger>
              </TabsList>
              <div className="ml-auto">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/shipments">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    View All
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="recent" className="border-none p-0 pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Shipments</CardTitle>
                  <CardDescription>Latest shipment updates and status changes</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ShipmentTable />
                </CardContent>
                <CardFooter className="border-t bg-muted/50 p-3">
                  <div className="flex w-full items-center justify-between">
                    <p className="text-xs text-muted-foreground">Showing 10 of 142 shipments</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="alerts" className="border-none p-0 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>Important notifications requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationCenter />
                </CardContent>
                <CardFooter className="border-t bg-muted/50 p-3">
                  <Button variant="outline" size="sm" className="ml-auto">
                    Mark All as Read
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="ports" className="border-none p-0 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Port Status</CardTitle>
                  <CardDescription>Current status of ports and terminals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">KICT</CardTitle>
                            <Badge className="bg-green-500">Operational</Badge>
                          </div>
                          <CardDescription>Karachi International Container Terminal</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-muted-foreground">
                            <div className="flex justify-between py-1">
                              <span>Vessels Berthed:</span>
                              <span className="font-medium">3</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Waiting Time:</span>
                              <span className="font-medium">2 days</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Congestion Level:</span>
                              <span className="font-medium">Medium</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">SAPT</CardTitle>
                            <Badge className="bg-yellow-500">Partial Delay</Badge>
                          </div>
                          <CardDescription>South Asia Pakistan Terminals</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-muted-foreground">
                            <div className="flex justify-between py-1">
                              <span>Vessels Berthed:</span>
                              <span className="font-medium">2</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Waiting Time:</span>
                              <span className="font-medium">4 days</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Congestion Level:</span>
                              <span className="font-medium">High</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">QICT</CardTitle>
                            <Badge className="bg-green-500">Operational</Badge>
                          </div>
                          <CardDescription>Qasim International Container Terminal</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-muted-foreground">
                            <div className="flex justify-between py-1">
                              <span>Vessels Berthed:</span>
                              <span className="font-medium">1</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Waiting Time:</span>
                              <span className="font-medium">1 day</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Congestion Level:</span>
                              <span className="font-medium">Low</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Weather alert: Strong winds expected at Port Qasim on May 6, 2025</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
