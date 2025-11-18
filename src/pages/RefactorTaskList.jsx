import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertCircle, Zap, Shield, DollarSign, Lock, Database, Globe, Cpu } from "lucide-react";

export default function RefactorTaskList() {
  const tasks = {
    critical: [
      { id: 1, title: "URGENT: Fix Color Scheme - All Pages Dark Theme", status: "completed", priority: "critical" },
      { id: 2, title: "Master Covenant Page - Dark Glassmorphism", status: "completed", priority: "critical" },
      { id: 3, title: "Stripe Voucher Integration - Build Purchase Flow", status: "completed", priority: "critical" },
      { id: 4, title: "Stripe Webhook Handler - Payment Verification", status: "completed", priority: "critical" },
      { id: 5, title: "OAuth Implementation - User Authentication Flow", status: "completed", priority: "critical" },
      { id: 6, title: "Paywall System - Service Access Control", status: "completed", priority: "critical" },
      { id: 7, title: "Mobile Responsiveness - All Pages", status: "completed", priority: "critical" },
      { id: 8, title: "Voucher Redemption System - QR Verification", status: "completed", priority: "critical" },
      { id: 9, title: "Payment Success Flow - User Dashboard", status: "completed", priority: "critical" },
      { id: 10, title: "Security Headers - CSP & CORS", status: "completed", priority: "critical" },
      { id: 11, title: "SEO Optimization & Google Bot Integration", status: "completed", priority: "critical" },
      { id: 12, title: "Sitemap Generation & Submission", status: "completed", priority: "critical" },
      { id: 13, title: "Master Covenant Gated Download", status: "completed", priority: "critical" },
    ],
    high: [
      { id: 14, title: "Rate Limiting - API Protection", status: "completed", priority: "high" },
      { id: 15, title: "Error Handling - Global Error Boundaries", status: "completed", priority: "high" },
      { id: 16, title: "Voucher Management Dashboard - Admin Panel", status: "completed", priority: "high" },
      { id: 17, title: "Stripe Product Catalog Display - Pricing Page", status: "completed", priority: "high" },
      { id: 18, title: "Email Notifications - Purchase Confirmations", status: "completed", priority: "high" },
      { id: 19, title: "Voucher Balance Tracking - User Wallet", status: "completed", priority: "high" },
      { id: 20, title: "Payment History - Transaction Records", status: "completed", priority: "high" },
      { id: 21, title: "Refund System - Customer Service", status: "completed", priority: "high" },
      { id: 22, title: "Bulk Voucher Purchase - Enterprise Features", status: "completed", priority: "high" },
      { id: 23, title: "Partner Management - Venue Integration", status: "completed", priority: "high" },
      { id: 24, title: "White Background Fixes - Image Generator", status: "completed", priority: "high" },
      { id: 25, title: "White Background Fixes - All Pages Audit", status: "completed", priority: "high" },
      { id: 26, title: "QR Code Security - Anti-Fraud Measures", status: "completed", priority: "high" },
      { id: 27, title: "User Profile Management - Settings Page", status: "completed", priority: "high" },
      { id: 28, title: "Search Functionality - Covenant Search with Preview", status: "completed", priority: "high" },
      { id: 29, title: "Subscription Management - Cancel/Update", status: "completed", priority: "high" },
      { id: 30, title: "Keywords & Meta Tags - All Pages", status: "completed", priority: "high" },
    ],
    medium: [
      { id: 26, title: "Analytics Dashboard - Business Metrics", status: "completed", priority: "medium" },
      { id: 27, title: "API Documentation - Developer Portal", status: "completed", priority: "medium" },
      { id: 28, title: "Voucher Transfer System - P2P Transfers", status: "completed", priority: "medium" },
      { id: 29, title: "Subscription Management - Recurring Vouchers", status: "completed", priority: "medium" },
      { id: 30, title: "Gift Card Feature - Send to Friends", status: "completed", priority: "medium" },
      { id: 31, title: "Loyalty Program - Rewards System", status: "completed", priority: "medium" },
      { id: 32, title: "Promo Codes - Discount System", status: "completed", priority: "medium" },
      { id: 33, title: "Multi-Currency Support - International", status: "completed", priority: "medium" },
      { id: 34, title: "Tax Calculation - Automatic Tax", status: "completed", priority: "medium" },
      { id: 35, title: "Invoice Generation - PDF Receipts", status: "completed", priority: "medium" },
      { id: 36, title: "Voucher Expiration - Auto-Alerts", status: "completed", priority: "medium" },
      { id: 37, title: "Usage Analytics - Redemption Tracking", status: "completed", priority: "medium" },
      { id: 38, title: "NUPS POS Integration - Voucher Acceptance", status: "completed", priority: "medium" },
      { id: 39, title: "GlyphBot AI - Conversational Interface", status: "completed", priority: "medium" },
      { id: 40, title: "Security Scanner - Vulnerability Detection", status: "completed", priority: "medium" },
      { id: 41, title: "Blockchain Integration - Immutable Records", status: "completed", priority: "medium" },
      { id: 42, title: "Hotzone Mapper - Venue Security", status: "completed", priority: "medium" },
      { id: 43, title: "Steganography Tools - Hidden Messages", status: "completed", priority: "medium" },
      { id: 44, title: "2FA Authentication - Enhanced Security", status: "completed", priority: "medium" },
      { id: 45, title: "Session Management - Auto Logout", status: "completed", priority: "medium" },
    ],
    low: [
      { id: 46, title: "Audit Logs - Activity Tracking", status: "completed", priority: "low" },
      { id: 47, title: "Backup System - Data Recovery", status: "completed", priority: "low" },
      { id: 48, title: "Dark Mode Toggle - Theme Switcher", status: "completed", priority: "low" },
      { id: 49, title: "Social Media Integration - Share Features", status: "completed", priority: "low" },
      { id: 50, title: "Blog System - Content Management", status: "completed", priority: "low" },
      { id: 51, title: "Newsletter Signup - Email Marketing", status: "completed", priority: "low" },
      { id: 52, title: "FAQ System - Help Center", status: "completed", priority: "low" },
      { id: 53, title: "Live Chat Support - GlyphBot Jr", status: "completed", priority: "low" },
      { id: 54, title: "Testimonials Page - Customer Reviews", status: "completed", priority: "low" },
      { id: 55, title: "Press Kit - Media Resources", status: "completed", priority: "low" },
      { id: 56, title: "Career Page - Job Listings", status: "completed", priority: "low" },
      { id: 57, title: "Partner Logos - Brand Showcase", status: "completed", priority: "low" },
      { id: 58, title: "Video Tutorials - User Guides", status: "completed", priority: "low" },
      { id: 59, title: "Webinar Registration - Events", status: "completed", priority: "low" },
      { id: 60, title: "Case Studies - Success Stories", status: "completed", priority: "low" },
    ],
    improvements: [
      { title: "Home Page Scroll - 3D Effects", completed: true },
      { title: "Navigation - Glassmorphism Design", completed: true },
      { title: "Interactive Nebula Background", completed: true },
      { title: "Tech Stack Carousel", completed: true },
      { title: "Consultation Booking Form", completed: true },
      { title: "Footer Scroll Issue - Fix Navigation", completed: true },
      { title: "White Background Fixes - Master Covenant Page", completed: true },
      { title: "HSSS Redesign - Real Hotspot Mapping", completed: true },
      { title: "OAuth Login - Google/Microsoft/Apple", completed: true },
      { title: "Governance Hub - Master Covenant Portal", completed: true },
      { title: "Partners Page - Valuation Calculator", completed: true },
      { title: "SEO Head Component - Meta Tags", completed: true },
      { title: "Robots.txt - AI Crawler Access", completed: true },
      { title: "Sitemap Generation - Search Engine Indexing", completed: true },
      { title: "Search Preview - Blurred Content Teaser", completed: true },
      { title: "Structured Data - Schema.org Integration", completed: true },
      { title: "Dynamic Search - Keyword Matching System", completed: true },
      { title: "Search Results - Context-Aware Display", completed: true },
      { title: "GlyphBot Jr. - Floating Assistant Widget", completed: true },
      { title: "Security Monitor - Threat Detection System", completed: true },
      { title: "Interactive Nebula - Animated Background", completed: true },
      { title: "NUPS POS System - Complete Implementation", completed: true },
      { title: "QR Generator - Advanced Customization", completed: true },
      { title: "Steganography - Image Encoding System", completed: true },
      { title: "Blockchain Integration - Transaction Tracking", completed: true },
      { title: "Hotzone Mapper - Interactive Security Maps", completed: true },
      { title: "Dream Team - Team Roster System", completed: true },
      { title: "Partners Page - Valuation & Financial Data", completed: true },
      { title: "Admin Dashboard - Comprehensive Management", completed: true },
      { title: "Contact Form - Email Integration", completed: true },
      { title: "Consultation Booking - Stripe Integration", completed: true },
      { title: "Terms & Privacy Pages - Legal Documentation", completed: true },
      { title: "Error Pages - 404 & Custom Errors", completed: true },
      { title: "Loading States - Skeleton Screens", completed: true },
      { title: "Toast Notifications - User Feedback", completed: true },
      { title: "Responsive Navigation - Mobile Menu", completed: true },
      { title: "Footer Design - Multi-Column Layout", completed: true },
      { title: "Entertainer Management - NUPS Check-In System", completed: true },
      { title: "VIP Room Management - Real-Time Tracking", completed: true },
      { title: "Batch Management - Cash Register System", completed: true },
      { title: "Customer Loyalty - Points & Rewards", completed: true },
      { title: "Marketing Campaigns - Email/SMS", completed: true },
      { title: "Z-Report Generation - Daily Reconciliation", completed: true },
      { title: "Multi-Location Support - Store Management", completed: true },
      { title: "Inventory Tracking - Stock Alerts", completed: true },
    ]
  };

  const stats = {
    total: Object.values(tasks).flat().filter(t => t.id).length,
    completed: Object.values(tasks).flat().filter(t => t.status === "completed").length,
    inProgress: Object.values(tasks).flat().filter(t => t.status === "in-progress").length,
    pending: Object.values(tasks).flat().filter(t => t.status === "pending").length,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "in-progress": return <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case "pending": return <Circle className="w-5 h-5 text-gray-400" />;
      default: return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "low": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Development <span className="text-blue-400">Task List</span>
            </h1>
            <p className="text-xl text-gray-400">
              {stats.completed} of {stats.total} tasks completed • {Math.round((stats.completed/stats.total)*100)}% to production launch
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-card-dark">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Tasks</div>
              </CardContent>
            </Card>
            <Card className="glass-card-dark border-green-500/30">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">{stats.completed}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </CardContent>
            </Card>
            <Card className="glass-card-dark border-yellow-500/30">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.inProgress}</div>
                <div className="text-sm text-gray-400">In Progress</div>
              </CardContent>
            </Card>
            <Card className="glass-card-dark border-gray-500/30">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gray-400 mb-2">{stats.pending}</div>
                <div className="text-sm text-gray-400">Pending</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-card-dark border-red-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  Critical Priority ({tasks.critical.length} tasks)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.critical.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg glass-dark">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-orange-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <Shield className="w-5 h-5" />
                  High Priority ({tasks.high.length} tasks)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.high.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg glass-dark">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Database className="w-5 h-5" />
                  Medium Priority ({tasks.medium.length} tasks)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.medium.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg glass-dark">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-gray-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-400">
                  <Globe className="w-5 h-5" />
                  Low Priority ({tasks.low.length} tasks)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.low.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg glass-dark">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-green-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Completed Improvements ({tasks.improvements.filter(t => t.completed).length} tasks)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.improvements.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg glass-dark">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="font-medium">{item.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}