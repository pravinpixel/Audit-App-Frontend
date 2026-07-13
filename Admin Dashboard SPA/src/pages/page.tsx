import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Users, BarChart3, Shield, TrendingUp, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (email && password) {
      sessionStorage.setItem("isAuthenticated", "true")
      navigate("/dashboard-home")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Orange Gradient with Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#E63946] via-[#FF6B35] to-[#FF8C00] text-white p-12 flex-col justify-between">
        {/* Logo and Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold">SM</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Safety Matters</h1>
              <p className="text-white/90">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold leading-tight">Comprehensive Fire Safety Management Platform</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Streamline your fire safety audits, manage teams, and ensure compliance across all locations with our
              integrated management system.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-lg">Manage 500+ Auditors Nationwide</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-lg">Real-time Analytics & Reporting</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg">Enterprise-grade Security</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-lg">Performance Optimization Tools</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold">2,500+</div>
            <div className="text-white/90">Audits Completed</div>
          </div>
          <div>
            <div className="text-4xl font-bold">98.5%</div>
            <div className="text-white/90">Compliance Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold">24/7</div>
            <div className="text-white/90">Support Available</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* Lock Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E63946] to-[#FF8C00] rounded-2xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Admin Sign In</h2>
              <p className="text-gray-600">Access the Safety Matters admin dashboard</p>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                <Shield className="w-4 h-4" />
                <span>Secure Admin Access</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@safetymatters.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button type="button" className="text-sm text-[#E63946] hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#d32f3c] hover:to-[#f57c00] text-white font-medium"
              >
                Sign In to Admin Portal
                <span className="ml-2">→</span>
              </Button>

              <p className="text-center text-sm text-gray-600">Protected by enterprise security protocols</p>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <p>© 2025 Safety Matters. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4">
              <button className="hover:underline">Privacy Policy</button>
              <span>•</span>
              <button className="hover:underline">Terms of Service</button>
              <span>•</span>
              <button className="hover:underline">Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
