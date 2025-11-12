import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, Shield, Mail, Calendar } from "lucide-react";

export default function AdminUsers({ users }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Platform Users</CardTitle>
          <Badge variant="outline" className="border-purple-500/50 text-purple-400">
            {filteredUsers.length} Users
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <Badge className={
                  user.role === 'admin'
                    ? 'bg-red-500/20 text-red-400 border-red-500/50'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                }>
                  {user.role === 'admin' ? (
                    <>
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    'User'
                  )}
                </Badge>
              </div>

              <div className="mb-3">
                <div className="font-bold text-white mb-1">{user.full_name || 'No Name'}</div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(user.created_date).toLocaleDateString()}
                </div>
                <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}