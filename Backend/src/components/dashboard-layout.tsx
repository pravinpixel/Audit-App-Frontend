import type React from "react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Users, Menu, X, LogOut, Search, Bell, FileText, UserCheck, Building2, ClipboardList, LayoutDashboard, UserCog, ChevronDown, ChevronRight, Settings, Shield, Database, Package, Building, GitBranch, MapPin, Map, Activity as City, Layers, ImageIcon, Contact, ClipboardCheck, Headphones, CalendarClock, FileEdit, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuditMenuExpanded, setIsAuditMenuExpanded] = useState(
    pathname?.startsWith("/audit-summary") ||
      pathname?.startsWith("/audit-assignments") ||
      pathname?.startsWith("/audits") ||
      pathname?.startsWith("/audit-enquiry"),
  )
  const [isAdminSettingsExpanded, setIsAdminSettingsExpanded] = useState(pathname?.startsWith("/admin-settings"))
  const [isMasterExpanded, setIsMasterExpanded] = useState(pathname?.startsWith("/master"))
  const [isBannerExpanded, setIsBannerExpanded] = useState(pathname?.startsWith("/banner-management"))
  const [isEmployeeExpanded, setIsEmployeeExpanded] = useState(
    pathname === "/dashboard" || pathname?.startsWith("/third-party"),
  )
  const [isCustomerExpanded, setIsCustomerExpanded] = useState(
    pathname?.startsWith("/customers") || pathname?.startsWith("/contact-data"),
  )
  const [isDataReviewExpanded, setIsDataReviewExpanded] = useState(pathname?.startsWith("/data-review"))
  const [isCustomerSuccessExpanded, setIsCustomerSuccessExpanded] = useState(
    pathname?.startsWith("/customer-success"),
  )

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated")
    navigate("/")
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard-home", active: pathname === "/dashboard-home" },
  ]

  const employeeItems = [
    { icon: Users, label: "Employees", path: "/dashboard", active: pathname === "/dashboard" },
    {
      icon: UserCheck,
      label: "Data collector",
      path: "/third-party",
      active: pathname?.startsWith("/third-party"),
    },
  ]

  const dataReviewItems = [
    {
      icon: Users,
      label: "Employee",
      path: "/data-review/employees",
      active: pathname?.startsWith("/data-review/employees"),
      pendingCount: 3,
    },
    {
      icon: UserCheck,
      label: "Data collector",
      path: "/data-review/data-collector",
      active: pathname?.startsWith("/data-review/data-collector"),
      pendingCount: 5,
    },
    {
      icon: Building2,
      label: "Customer data",
      path: "/data-review/customer-data",
      active: pathname?.startsWith("/data-review/customer-data"),
      pendingCount: 12,
    },
    {
      icon: Contact,
      label: "Contact data",
      path: "/data-review/contact-data",
      active: pathname?.startsWith("/data-review/contact-data"),
      pendingCount: 7,
    },
    {
      icon: FileText,
      label: "Survey Data",
      path: "/data-review/survey-data",
      active: pathname?.startsWith("/data-review/survey-data"),
      pendingCount: 4,
    },
    {
      icon: UserCog,
      label: "Audit Assignment",
      path: "/data-review/audit-assignment",
      active: pathname?.startsWith("/data-review/audit-assignment"),
      pendingCount: 0,
    },
  ]

  const assignCustomerItems = [
    {
      icon: UserPlus,
      label: "Assign Customer",
      path: "/assign-customer",
      active: pathname?.startsWith("/assign-customer"),
    },
  ]

  const customerSuccessItems = [
    {
      icon: CalendarClock,
      label: "Due date followup",
      path: "/customer-success/due-date-followup",
      active: pathname?.startsWith("/customer-success/due-date-followup"),
    },
    {
      icon: FileEdit,
      label: "Customer change request",
      path: "/customer-success/change-request",
      active: pathname?.startsWith("/customer-success/change-request"),
    },
  ]

  const customerItems = [
    {
      icon: Building2,
      label: "Customer Data",
      path: "/customers",
      active: pathname?.startsWith("/customers"),
    },
    {
      icon: Contact,
      label: "Contact Data",
      path: "/contact-data",
      active: pathname?.startsWith("/contact-data"),
    },
  ]

  const auditMenuItems = [
    {
      icon: ClipboardList,
      label: "Survey Summary",
      path: "/audit-summary",
      active: pathname?.startsWith("/audit-summary"),
    },
    {
      icon: UserCog,
      label: "Survey Assignments",
      path: "/audit-assignments",
      active: pathname?.startsWith("/audit-assignments"),
    },
    {
      icon: FileText,
      label: "Survey Data",
      path: "/audits",
      active:
        pathname?.startsWith("/audits") &&
        !pathname?.startsWith("/audit-enquiry") &&
        !pathname?.startsWith("/audit-assignments") &&
        !pathname?.startsWith("/audit-summary"),
    },
  ]

  const adminSettingsItems = [
    {
      icon: Users,
      label: "Users",
      path: "/admin-settings/users",
      active: pathname?.startsWith("/admin-settings/users"),
    },
    {
      icon: Shield,
      label: "Roles",
      path: "/admin-settings/roles",
      active: pathname?.startsWith("/admin-settings/roles"),
    },
  ]

  const bannerItems = [
    {
      icon: ImageIcon,
      label: "Banner List",
      path: "/banner-management",
      active: pathname?.startsWith("/banner-management"),
    },
  ]

  const masterItems = [
    {
      icon: Package,
      label: "Safety Equipments",
      path: "/master/safety-equipments",
      active: pathname?.startsWith("/master/safety-equipments"),
    },
    {
      icon: Building,
      label: "Companies",
      path: "/master/companies",
      active: pathname?.startsWith("/master/companies"),
    },
    {
      icon: GitBranch,
      label: "Branch",
      path: "/master/branches",
      active: pathname?.startsWith("/master/branches"),
    },
    {
      icon: MapPin,
      label: "District",
      path: "/master/districts",
      active: pathname?.startsWith("/master/districts"),
    },
    {
      icon: Map,
      label: "State",
      path: "/master/states",
      active: pathname?.startsWith("/master/states"),
    },
    {
      icon: City,
      label: "City",
      path: "/master/cities",
      active: pathname?.startsWith("/master/cities"),
    },
    {
      icon: Layers,
      label: "Floor Details",
      path: "/master/floor-details",
      active: pathname?.startsWith("/master/floor-details"),
    },
  ]

  const isEmployeeActive = employeeItems.some((item) => item.active)
  const isCustomerActive = customerItems.some((item) => item.active)
  const isDataReviewActive = dataReviewItems.some((item) => item.active)
  const isCustomerSuccessActive = customerSuccessItems.some((item) => item.active)
  const isAuditManagementActive = auditMenuItems.some((item) => item.active)
  const isAdminSettingsActive = adminSettingsItems.some((item) => item.active)
  const isMasterActive = masterItems.some((item) => item.active)
  const isBannerActive = bannerItems.some((item) => item.active)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E63946] rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">SM</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gray-900">Safety Matters</h1>
              <p className="text-xs text-gray-500">Fire Safety Management System</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input type="text" placeholder="Search audits, employees..." className="w-64 pl-9 h-9 text-sm" />
          </div>

          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E63946] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">AD</span>
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-900">Admin User</span>
          </div>
        </div>
      </header>

      <aside
        className={cn(
          "fixed top-16 left-0 h-[calc(100vh-4rem)] w-60 flex-shrink-0 bg-white border-r border-gray-200 z-40 transition-transform duration-300",
          "lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full w-full">
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path)
                  setIsSidebarOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  item.active
                    ? "bg-[#E63946] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                )}
              >
                <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="text-left">{item.label}</span>
              </button>
            ))}

            <div>
              <button
                onClick={() => setIsEmployeeExpanded(!isEmployeeExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isEmployeeActive
                    ? "bg-[#E63946] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                )}
              >
                <Users className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="text-left flex-1">Employee Management</span>
                {isEmployeeExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </button>

              {isEmployeeExpanded && (
                <div className="mt-1 ml-4 space-y-1">
                  {employeeItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path)
                        setIsSidebarOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        item.active
                          ? "bg-[#E63946]/20 text-[#E63946] border-l-2 border-[#E63946]"
                          : "text-gray-600 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                      )}
                    >
                      <item.icon className="h-[16px] w-[16px] flex-shrink-0" />
                      <span className="text-left">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setIsCustomerExpanded(!isCustomerExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isCustomerActive
                    ? "bg-[#E63946] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                )}
              >
                <Building2 className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="text-left flex-1">Customer Management</span>
                {isCustomerExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </button>

              {isCustomerExpanded && (
                <div className="mt-1 ml-4 space-y-1">
                  {customerItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path)
                        setIsSidebarOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        item.active
                          ? "bg-[#E63946]/20 text-[#E63946] border-l-2 border-[#E63946]"
                          : "text-gray-600 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                      )}
                    >
                      <item.icon className="h-[16px] w-[16px] flex-shrink-0" />
                      <span className="text-left">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setIsAuditMenuExpanded(!isAuditMenuExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isAuditManagementActive
                    ? "bg-[#E63946] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                )}
              >
                <FileText className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="text-left flex-1">Survey Management</span>
                {isAuditMenuExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </button>

              {isAuditMenuExpanded && (
                <div className="mt-1 ml-4 space-y-1">
                  {auditMenuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path)
                        setIsSidebarOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        item.active
                          ? "bg-[#E63946]/20 text-[#E63946] border-l-2 border-[#E63946]"
                          : "text-gray-600 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                      )}
                    >
                      <item.icon className="h-[16px] w-[16px] flex-shrink-0" />
                      <span className="text-left">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setIsDataReviewExpanded(!isDataReviewExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isDataReviewActive
                    ? "bg-[#E63946] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                )}
              >
                <ClipboardCheck className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="text-left flex-1">Data Review</span>
                {isDataReviewExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </button>

              {isDataReviewExpanded && (
                <div className="mt-1 ml-4 space-y-1">
                  {dataReviewItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path)
                        setIsSidebarOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        item.active
                          ? "bg-[#E63946]/20 text-[#E63946] border-l-2 border-[#E63946]"
                          : "text-gray-600 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                      )}
                    >
                      <item.icon className="h-[16px] w-[16px] flex-shrink-0" />
                      <span className="text-left flex-1">{item.label}</span>
                      {item.pendingCount > 0 && (
                        <span className={cn(
                          "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex-shrink-0",
                          item.active ? "bg-[#E63946] text-white" : "bg-red-100 text-[#E63946]",
                        )}>
                          {item.pendingCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {assignCustomerItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path)
                  setIsSidebarOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  item.active
                    ? "bg-[#E63946] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                )}
              >
                <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="text-left">{item.label}</span>
              </button>
            ))}

            <div>
              <button
                onClick={() => setIsCustomerSuccessExpanded(!isCustomerSuccessExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isCustomerSuccessActive
                    ? "bg-[#E63946] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                )}
              >
                <Headphones className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="text-left flex-1">Customer Success</span>
                {isCustomerSuccessExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </button>

              {isCustomerSuccessExpanded && (
                <div className="mt-1 ml-4 space-y-1">
                  {customerSuccessItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path)
                        setIsSidebarOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        item.active
                          ? "bg-[#E63946]/20 text-[#E63946] border-l-2 border-[#E63946]"
                          : "text-gray-600 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                      )}
                    >
                      <item.icon className="h-[16px] w-[16px] flex-shrink-0" />
                      <span className="text-left">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setIsMasterExpanded(!isMasterExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isMasterActive
                    ? "bg-[#E63946] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                )}
              >
                <Database className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="text-left flex-1">Master</span>
                {isMasterExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </button>

              {isMasterExpanded && (
                <div className="mt-1 ml-4 space-y-1">
                  {masterItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path)
                        setIsSidebarOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        item.active
                          ? "bg-[#E63946]/20 text-[#E63946] border-l-2 border-[#E63946]"
                          : "text-gray-600 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                      )}
                    >
                      <item.icon className="h-[16px] w-[16px] flex-shrink-0" />
                      <span className="text-left">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setIsAdminSettingsExpanded(!isAdminSettingsExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isAdminSettingsActive
                    ? "bg-[#E63946] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                )}
              >
                <Settings className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="text-left flex-1">Admin Settings</span>
                {isAdminSettingsExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </button>

              {isAdminSettingsExpanded && (
                <div className="mt-1 ml-4 space-y-1">
                  {adminSettingsItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path)
                        setIsSidebarOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        item.active
                          ? "bg-[#E63946]/20 text-[#E63946] border-l-2 border-[#E63946]"
                          : "text-gray-600 hover:bg-[#E63946]/10 hover:text-[#E63946]",
                      )}
                    >
                      <item.icon className="h-[16px] w-[16px] flex-shrink-0" />
                      <span className="text-left">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-[#E63946]/10 hover:text-[#E63946]"
              onClick={handleLogout}
            >
              <LogOut className="h-[18px] w-[18px] mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-30 top-16" onClick={() => setIsSidebarOpen(false)} />
      )}

      <main className="lg:ml-60 pt-16 pb-14">
        <div className="p-4 lg:p-6">{children}</div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 lg:left-60 bg-gray-100 border-t border-gray-200 py-3 px-6 z-40">
        <p className="text-xs text-gray-600 text-center leading-relaxed">
          2026© Usha Fire Safety. All Rights Reserved. Biz Master is a proprietary application developed by Usha Fire Safety for enhancing workplace task management. Unauthorized use, distribution, or reproduction of the application and its content is strictly prohibited. For more information, please contact us at{" "}
          <a href="mailto:enquiry@ushafire.in" className="text-[#E63946] hover:underline">
            enquiry@ushafire.in
          </a>
        </p>
      </footer>
    </div>
  )
}
