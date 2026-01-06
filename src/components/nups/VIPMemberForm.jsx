import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  User, MapPin, Phone, Mail, Shield, CreditCard, 
  Upload, Camera, AlertTriangle, Save, Loader2, FileText,
  Heart, Briefcase, Globe
} from "lucide-react";
import { toast } from "sonner";

export default function VIPMemberForm({ guest, onSave, onCancel }) {
  const [form, setForm] = useState({
    // Basic Info
    guest_name: guest?.guest_name || '',
    display_name: guest?.display_name || '',
    date_of_birth: guest?.date_of_birth || '',
    phone: guest?.phone || '',
    phone_secondary: guest?.phone_secondary || '',
    email: guest?.email || '',
    language_preference: guest?.language_preference || 'English',
    
    // Address
    address_line1: guest?.address_line1 || '',
    address_line2: guest?.address_line2 || '',
    city: guest?.city || '',
    state: guest?.state || '',
    zip_code: guest?.zip_code || '',
    country: guest?.country || 'USA',
    
    // ID Verification
    government_id_type: guest?.government_id_type || '',
    government_id_number: guest?.government_id_number || '',
    government_id_state: guest?.government_id_state || '',
    government_id_expiry: guest?.government_id_expiry || '',
    ssn_last_four: guest?.ssn_last_four || '',
    
    // Emergency Contact
    emergency_contact_name: guest?.emergency_contact_name || '',
    emergency_contact_phone: guest?.emergency_contact_phone || '',
    emergency_contact_relationship: guest?.emergency_contact_relationship || '',
    emergency_contact_address: guest?.emergency_contact_address || '',
    
    // Employment
    employer_name: guest?.employer_name || '',
    employer_phone: guest?.employer_phone || '',
    occupation: guest?.occupation || '',
    
    // Membership
    vip_tier: guest?.vip_tier || 'Standard',
    membership_number: guest?.membership_number || '',
    referral_source: guest?.referral_source || '',
    referred_by_member_id: guest?.referred_by_member_id || '',
    
    // Preferences
    preferences: guest?.preferences || '',
    preferred_drinks: guest?.preferred_drinks?.join(', ') || '',
    allergies: guest?.allergies || '',
    medical_conditions: guest?.medical_conditions || '',
    dietary_restrictions: guest?.dietary_restrictions || '',
    notes: guest?.notes || '',
    
    // Billing
    billing_address_same: guest?.billing_address_same ?? true,
    billing_address: guest?.billing_address || '',
    credit_limit: guest?.credit_limit || 0,
    
    // Marketing
    marketing_opt_in: guest?.marketing_opt_in || false,
    sms_opt_in: guest?.sms_opt_in || false
  });
  
  const [idPhotoFile, setIdPhotoFile] = useState(null);
  const [idPhotoBackFile, setIdPhotoBackFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return null;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      return file_url;
    } catch (err) {
      toast.error(`Failed to upload ${type}`);
      return null;
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.guest_name) {
      toast.error('Full legal name is required');
      return;
    }
    if (!form.date_of_birth) {
      toast.error('Date of birth is required for age verification');
      return;
    }
    
    const age = calculateAge(form.date_of_birth);
    if (age && age < 21) {
      toast.error('Guest must be 21 years of age or older');
      return;
    }

    setSaving(true);
    try {
      let idUrl = guest?.id_photo_url;
      let idBackUrl = guest?.id_photo_back_url;
      let profileUrl = guest?.profile_photo_url;

      if (idPhotoFile) {
        idUrl = await handleFileUpload(idPhotoFile, 'ID photo (front)');
      }
      if (idPhotoBackFile) {
        idBackUrl = await handleFileUpload(idPhotoBackFile, 'ID photo (back)');
      }
      if (profilePhotoFile) {
        profileUrl = await handleFileUpload(profilePhotoFile, 'profile photo');
      }

      const memberNumber = form.membership_number || `VIP-${Date.now().toString(36).toUpperCase()}`;

      const data = {
        ...form,
        membership_number: memberNumber,
        id_photo_url: idUrl,
        id_photo_back_url: idBackUrl,
        profile_photo_url: profileUrl,
        preferred_drinks: form.preferred_drinks ? form.preferred_drinks.split(',').map(d => d.trim()) : [],
        status: guest?.status || 'pending_verification',
        verification_status: 'pending'
      };

      if (guest?.id) {
        await base44.entities.VIPGuest.update(guest.id, data);
        toast.success('VIP member profile updated successfully');
      } else {
        await base44.entities.VIPGuest.create(data);
        toast.success('New VIP member registered - proceed to contract signing');
      }

      onSave?.();
    } catch (err) {
      toast.error('Failed to save member profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const age = calculateAge(form.date_of_birth);

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700 flex-wrap h-auto">
          <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
          <TabsTrigger value="address" className="text-xs">Address</TabsTrigger>
          <TabsTrigger value="identity" className="text-xs">ID Verification</TabsTrigger>
          <TabsTrigger value="emergency" className="text-xs">Emergency</TabsTrigger>
          <TabsTrigger value="employment" className="text-xs">Employment</TabsTrigger>
          <TabsTrigger value="membership" className="text-xs">Membership</TabsTrigger>
          <TabsTrigger value="preferences" className="text-xs">Preferences</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <User className="w-4 h-4 text-cyan-400" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Full Legal Name * <span className="text-xs text-slate-500">(as shown on ID)</span></Label>
                  <Input
                    value={form.guest_name}
                    onChange={(e) => handleChange('guest_name', e.target.value)}
                    placeholder="John David Smith"
                    className="bg-slate-900 border-slate-600"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Display Name / Alias</Label>
                  <Input
                    value={form.display_name}
                    onChange={(e) => handleChange('display_name', e.target.value)}
                    placeholder="Preferred name for service"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Date of Birth * <span className="text-xs text-slate-500">(must be 21+)</span></Label>
                  <Input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => handleChange('date_of_birth', e.target.value)}
                    className="bg-slate-900 border-slate-600"
                    required
                  />
                  {age && (
                    <p className={`text-xs mt-1 ${age >= 21 ? 'text-green-400' : 'text-red-400'}`}>
                      Age: {age} years old {age < 21 && '- UNDER 21, NOT ELIGIBLE'}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-slate-300">Primary Phone *</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(555) 555-5555"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Secondary Phone</Label>
                  <Input
                    value={form.phone_secondary}
                    onChange={(e) => handleChange('phone_secondary', e.target.value)}
                    placeholder="Alternative number"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Email Address</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Preferred Language</Label>
                  <Select value={form.language_preference || "English"} onValueChange={(v) => handleChange('language_preference', v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Korean">Korean</SelectItem>
                      <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Profile Photo */}
              <div className="pt-4 border-t border-slate-700">
                <Label className="text-slate-300 mb-2 block">Profile Photo</Label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-cyan-500 transition-colors">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setProfilePhotoFile(e.target.files[0])}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label htmlFor="profile-upload" className="cursor-pointer">
                    <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">
                      {profilePhotoFile ? profilePhotoFile.name : (guest?.profile_photo_url ? 'Photo on file ✓' : 'Click to upload headshot')}
                    </p>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Address */}
        <TabsContent value="address">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4 text-green-400" />
                Residential Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Street Address *</Label>
                <Input
                  value={form.address_line1}
                  onChange={(e) => handleChange('address_line1', e.target.value)}
                  placeholder="123 Main Street"
                  className="bg-slate-900 border-slate-600"
                />
              </div>
              <div>
                <Label className="text-slate-300">Apt / Suite / Unit / Building</Label>
                <Input
                  value={form.address_line2}
                  onChange={(e) => handleChange('address_line2', e.target.value)}
                  placeholder="Apt 4B, Suite 100, etc."
                  className="bg-slate-900 border-slate-600"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Label className="text-slate-300">City *</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">State *</Label>
                  <Input
                    value={form.state}
                    onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
                    placeholder="NV"
                    maxLength={2}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">ZIP Code *</Label>
                  <Input
                    value={form.zip_code}
                    onChange={(e) => handleChange('zip_code', e.target.value)}
                    placeholder="89109"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Country</Label>
                <Input
                  value={form.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="bg-slate-900 border-slate-600"
                />
              </div>

              {/* Billing Address */}
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Checkbox 
                    checked={form.billing_address_same}
                    onCheckedChange={(checked) => handleChange('billing_address_same', checked)}
                    className="border-slate-600"
                  />
                  <span className="text-sm text-slate-300">Billing address same as residential</span>
                </div>
                {!form.billing_address_same && (
                  <div>
                    <Label className="text-slate-300">Billing Address</Label>
                    <Textarea
                      value={form.billing_address}
                      onChange={(e) => handleChange('billing_address', e.target.value)}
                      placeholder="Full billing address if different"
                      className="bg-slate-900 border-slate-600"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Identity Verification */}
        <TabsContent value="identity">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Shield className="w-4 h-4 text-purple-400" />
                Government ID Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-amber-400 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Valid, unexpired government-issued photo ID is REQUIRED for membership
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">ID Type *</Label>
                  <Select value={form.government_id_type || "none"} onValueChange={(v) => handleChange('government_id_type', v === "none" ? "" : v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-600">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="none">Select ID type...</SelectItem>
                      <SelectItem value="Drivers License">Driver's License</SelectItem>
                      <SelectItem value="State ID">State ID Card</SelectItem>
                      <SelectItem value="Passport">U.S. Passport</SelectItem>
                      <SelectItem value="Military ID">Military ID (CAC)</SelectItem>
                      <SelectItem value="Tribal ID">Tribal ID</SelectItem>
                      <SelectItem value="Global Entry Card">Global Entry Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">ID Number *</Label>
                  <Input
                    value={form.government_id_number}
                    onChange={(e) => handleChange('government_id_number', e.target.value)}
                    placeholder="Full ID number"
                    className="bg-slate-900 border-slate-600"
                  />
                  <p className="text-xs text-slate-500 mt-1">Encrypted and stored securely</p>
                </div>
                <div>
                  <Label className="text-slate-300">Issuing State/Authority *</Label>
                  <Input
                    value={form.government_id_state}
                    onChange={(e) => handleChange('government_id_state', e.target.value)}
                    placeholder="e.g., Nevada, USA"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">ID Expiration Date *</Label>
                  <Input
                    type="date"
                    value={form.government_id_expiry}
                    onChange={(e) => handleChange('government_id_expiry', e.target.value)}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">SSN Last 4 Digits <span className="text-xs text-slate-500">(high-tier only)</span></Label>
                  <Input
                    value={form.ssn_last_four}
                    onChange={(e) => handleChange('ssn_last_four', e.target.value.replace(/\D/g, '').slice(-4))}
                    placeholder="XXXX"
                    maxLength={4}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
              </div>

              {/* ID Photo Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <Label className="text-slate-300 mb-2 block">ID Photo - FRONT *</Label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-purple-500 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setIdPhotoFile(e.target.files[0])}
                      className="hidden"
                      id="id-front-upload"
                    />
                    <label htmlFor="id-front-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        {idPhotoFile ? idPhotoFile.name : (guest?.id_photo_url ? 'Front ID on file ✓' : 'Click to upload ID front')}
                      </p>
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300 mb-2 block">ID Photo - BACK *</Label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-purple-500 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setIdPhotoBackFile(e.target.files[0])}
                      className="hidden"
                      id="id-back-upload"
                    />
                    <label htmlFor="id-back-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        {idPhotoBackFile ? idPhotoBackFile.name : (guest?.id_photo_back_url ? 'Back ID on file ✓' : 'Click to upload ID back')}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contact */}
        <TabsContent value="emergency">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Emergency Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">Emergency contact is required for all VIP members</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Contact Name *</Label>
                  <Input
                    value={form.emergency_contact_name}
                    onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
                    placeholder="Full name"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Relationship *</Label>
                  <Select value={form.emergency_contact_relationship || "none"} onValueChange={(v) => handleChange('emergency_contact_relationship', v === "none" ? "" : v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-600">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="none">Select relationship...</SelectItem>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Partner">Partner</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Child">Adult Child</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Attorney">Attorney</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">Phone Number *</Label>
                  <Input
                    value={form.emergency_contact_phone}
                    onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
                    placeholder="(555) 555-5555"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Address</Label>
                  <Input
                    value={form.emergency_contact_address}
                    onChange={(e) => handleChange('emergency_contact_address', e.target.value)}
                    placeholder="City, State"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employment */}
        <TabsContent value="employment">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Briefcase className="w-4 h-4 text-blue-400" />
                Employment Information <span className="text-xs text-slate-500 font-normal">(Optional)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Occupation / Title</Label>
                  <Input
                    value={form.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    placeholder="e.g., Business Owner, Attorney"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Employer / Company</Label>
                  <Input
                    value={form.employer_name}
                    onChange={(e) => handleChange('employer_name', e.target.value)}
                    placeholder="Company name"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Work Phone</Label>
                  <Input
                    value={form.employer_phone}
                    onChange={(e) => handleChange('employer_phone', e.target.value)}
                    placeholder="(555) 555-5555"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Membership Details */}
        <TabsContent value="membership">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Membership Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Member ID</Label>
                  <Input
                    value={form.membership_number}
                    onChange={(e) => handleChange('membership_number', e.target.value)}
                    placeholder="Auto-generated if blank"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">VIP Tier</Label>
                  <Select value={form.vip_tier || "Standard"} onValueChange={(v) => handleChange('vip_tier', v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Diamond">Diamond</SelectItem>
                      <SelectItem value="Black Card">Black Card (Invite Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">How did they hear about us?</Label>
                  <Select value={form.referral_source || "none"} onValueChange={(v) => handleChange('referral_source', v === "none" ? "" : v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-600">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="none">Select source...</SelectItem>
                      <SelectItem value="Member Referral">Member Referral</SelectItem>
                      <SelectItem value="Online Search">Online Search</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Walk-in">Walk-in</SelectItem>
                      <SelectItem value="Hotel Concierge">Hotel Concierge</SelectItem>
                      <SelectItem value="Taxi/Limo Driver">Taxi/Limo Driver</SelectItem>
                      <SelectItem value="Event/Convention">Event/Convention</SelectItem>
                      <SelectItem value="Return Guest">Return Guest</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">Referred by Member ID</Label>
                  <Input
                    value={form.referred_by_member_id}
                    onChange={(e) => handleChange('referred_by_member_id', e.target.value)}
                    placeholder="VIP-XXXXXX"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Credit Limit ($)</Label>
                  <Input
                    type="number"
                    value={form.credit_limit}
                    onChange={(e) => handleChange('credit_limit', Number(e.target.value))}
                    placeholder="0"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
              </div>

              {/* Marketing Preferences */}
              <div className="pt-4 border-t border-slate-700 space-y-3">
                <Label className="text-slate-300">Marketing Preferences</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={form.marketing_opt_in}
                      onCheckedChange={(checked) => handleChange('marketing_opt_in', checked)}
                      className="border-slate-600"
                    />
                    <span className="text-sm text-slate-300">Opt-in to email marketing and promotions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={form.sms_opt_in}
                      onCheckedChange={(checked) => handleChange('sms_opt_in', checked)}
                      className="border-slate-600"
                    />
                    <span className="text-sm text-slate-300">Opt-in to SMS notifications and offers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Heart className="w-4 h-4 text-pink-400" />
                Service Preferences & Health Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">General Preferences</Label>
                <Textarea
                  value={form.preferences}
                  onChange={(e) => handleChange('preferences', e.target.value)}
                  placeholder="Seating preferences, music taste, temperature, lighting, etc."
                  className="bg-slate-900 border-slate-600"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-slate-300">Preferred Drinks <span className="text-xs text-slate-500">(comma separated)</span></Label>
                <Input
                  value={form.preferred_drinks}
                  onChange={(e) => handleChange('preferred_drinks', e.target.value)}
                  placeholder="Macallan 18, Dom Perignon, Hendricks Gin"
                  className="bg-slate-900 border-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    Allergies
                  </Label>
                  <Input
                    value={form.allergies}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    placeholder="Peanuts, shellfish, latex, etc."
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Dietary Restrictions</Label>
                  <Input
                    value={form.dietary_restrictions}
                    onChange={(e) => handleChange('dietary_restrictions', e.target.value)}
                    placeholder="Vegetarian, kosher, halal, etc."
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  Medical Conditions <span className="text-xs text-slate-500">(confidential)</span>
                </Label>
                <Textarea
                  value={form.medical_conditions}
                  onChange={(e) => handleChange('medical_conditions', e.target.value)}
                  placeholder="Diabetes, heart condition, epilepsy, etc. - for emergency purposes only"
                  className="bg-slate-900 border-slate-600"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-slate-300">Staff Notes <span className="text-xs text-slate-500">(internal only)</span></Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Internal notes about this member - service notes, history, etc."
                  className="bg-slate-900 border-slate-600"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-slate-600">
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={saving || (age && age < 21)} 
          className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {guest?.id ? 'Update Member Profile' : 'Register New VIP Member'}
        </Button>
      </div>
    </form>
  );
}