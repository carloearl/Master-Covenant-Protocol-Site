import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Plus, Edit, DollarSign, ShoppingCart, Phone, Mail } from "lucide-react";

export default function LocationManagement({ locations }) {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    location_id: `LOC-${Date.now()}`,
    name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    email: "",
    manager_email: "",
    is_active: true,
    opening_hours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    }
  });

  const createLocation = useMutation({
    mutationFn: (data) => base44.entities.POSLocation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['pos-locations']);
      setShowDialog(false);
      resetForm();
    }
  });

  const updateLocation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.POSLocation.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['pos-locations']);
      setShowDialog(false);
      resetForm();
    }
  });

  const resetForm = () => {
    setFormData({
      location_id: `LOC-${Date.now()}`,
      name: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      phone: "",
      email: "",
      manager_email: "",
      is_active: true,
      opening_hours: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM",
        saturday: "10:00 AM - 4:00 PM",
        sunday: "Closed"
      }
    });
    setEditingLocation(null);
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    setFormData(location);
    setShowDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingLocation) {
      updateLocation.mutate({ id: editingLocation.id, data: formData });
    } else {
      createLocation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Store Locations</CardTitle>
            <Button 
              onClick={() => {
                resetForm();
                setShowDialog(true);
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {locations.map((location) => (
              <div key={location.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{location.name}</h3>
                      <Badge className={
                        location.is_active
                          ? 'bg-green-500/20 text-green-400 border-green-500/50'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                      }>
                        {location.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(location)}
                    className="border-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-400">{location.address}</div>
                  <div className="text-sm text-gray-400">
                    {location.city}, {location.state} {location.zip_code}
                  </div>
                  {location.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Phone className="w-3 h-3" />
                      {location.phone}
                    </div>
                  )}
                  {location.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Mail className="w-3 h-3" />
                      {location.email}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <div className="text-xs text-gray-500">Total Revenue</div>
                    <div className="flex items-center gap-1 text-green-400 font-bold">
                      <DollarSign className="w-4 h-4" />
                      {(location.total_revenue || 0).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Transactions</div>
                    <div className="flex items-center gap-1 text-blue-400 font-bold">
                      <ShoppingCart className="w-4 h-4" />
                      {location.total_transactions || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {locations.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No locations yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Location Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Location Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>

            <div>
              <Label>Address *</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>
              <div>
                <Label>State *</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>
              <div>
                <Label>ZIP Code *</Label>
                <Input
                  value={formData.zip_code}
                  onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            <div>
              <Label>Manager Email</Label>
              <Input
                type="email"
                value={formData.manager_email}
                onChange={(e) => setFormData({...formData, manager_email: e.target.value})}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <Button 
              type="submit" 
              disabled={createLocation.isPending || updateLocation.isPending}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700"
            >
              {editingLocation ? 'Update Location' : 'Create Location'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}