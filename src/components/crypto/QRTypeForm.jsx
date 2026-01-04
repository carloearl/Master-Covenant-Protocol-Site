import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Terminal, Settings, Info } from 'lucide-react';

export default function QRTypeForm({ qrType, qrData, setQrData, selectedPayloadType }) {
  
  // Handle dynamic form generation from catalog fields
  if (selectedPayloadType?.fields && selectedPayloadType.fields.length > 0) {
    
    // Construct the payload string whenever dynamic fields change
    useEffect(() => {
      if (qrType === 'custom' && selectedPayloadType.fields) {
        // Simple logic to reconstruct payload string from form data
        // This is a basic implementation - specific formatters could be added to the catalog later
        const params = new URLSearchParams();
        let base = "";
        
        // Handle common prefixes if defined in placeholder or description logic
        if (selectedPayloadType.id.startsWith('url_')) {
           base = qrData[`${selectedPayloadType.id}_url`] || "";
        }
        
        // Build payload string logic (simplified for dynamic types)
        // For production, we'd want specific formatters per type
        // Here we map form fields back to the customPayload state for the QR renderer
        
        let constructedPayload = "";
        
        // Special handlers for known types to format correctly
        if (selectedPayloadType.id === 'url_timelock') {
           const url = qrData[`${selectedPayloadType.id}_url`] || "https://example.com";
           constructedPayload = `${url}?not_before=${qrData[`${selectedPayloadType.id}_startTime`] || ''}&not_after=${qrData[`${selectedPayloadType.id}_endTime`] || ''}`;
        } else if (selectedPayloadType.id === 'url_geolock') {
           const url = qrData[`${selectedPayloadType.id}_url`] || "https://example.com";
           constructedPayload = `${url}?lat=${qrData[`${selectedPayloadType.id}_latitude`] || ''}&lng=${qrData[`${selectedPayloadType.id}_longitude`] || ''}&r=${qrData[`${selectedPayloadType.id}_radius`] || ''}`;
        } else if (selectedPayloadType.id === 'crypto_btc') {
           const addr = qrData[`${selectedPayloadType.id}_address`] || "";
           constructedPayload = `bitcoin:${addr}?amount=${qrData[`${selectedPayloadType.id}_amount`] || ''}&label=${qrData[`${selectedPayloadType.id}_label`] || ''}`;
        } else {
           // Default: JSON-like structure for unknown proprietary types or raw string concatenation
           // This ensures the "customPayload" state is updated for the renderer
           // Ideally, we'd map this perfectly, but for now we rely on the user editing the raw output if needed,
           // OR we just set the individual fields in state and let QrStudio.js buildQRPayload handle it if we extended that switch.
           // BUT since QrStudio uses 'custom' case returning qrData.customPayload, we must set it here.
           
           // Fallback: Dump as key-value pairs text if no specific formatter
           constructedPayload = selectedPayloadType.placeholder || "";
           // We'll let the user see the fields update, but maybe we shouldn't overwrite customPayload directly 
           // if they are typing in it. 
           // BETTER STRATEGY: Update a hidden "dynamicPayload" state and merge? 
           // Actually, let's keep it simple: The FORM updates the individual fields in qrData. 
           // We need to update QrStudio.js to handle these new fields if we want them to generate the correct string.
           // OR we update customPayload here.
           
           // Let's rely on the input fields updating `qrData[fieldKey]` and then we construct the string here.
           const parts = selectedPayloadType.fields.map(f => {
             const val = qrData[`${selectedPayloadType.id}_${f.name}`];
             return val ? `${f.name}=${val}` : null;
           }).filter(Boolean);
           
           if (parts.length > 0) {
             constructedPayload = `${selectedPayloadType.id}://?${parts.join('&')}`;
           }
        }
        
        // Only update if we have meaningful data to avoid overwriting initial state too aggressively
        if (constructedPayload) {
           setQrData(prev => ({ ...prev, customPayload: constructedPayload }));
        }
      }
    }, [qrData, selectedPayloadType, qrType, setQrData]);

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="p-2 bg-cyan-500/20 rounded-md">
            <Settings className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{selectedPayloadType.label} Configuration</h3>
            <p className="text-xs text-slate-400">Configure parameters for this payload type</p>
          </div>
        </div>

        <div className="grid gap-4">
          {selectedPayloadType.fields.map((field) => {
            const fieldKey = `${selectedPayloadType.id}_${field.name}`;
            
            return (
              <div key={field.name} className="space-y-2">
                <Label className="text-xs font-medium text-slate-300 uppercase tracking-wider">{field.label}</Label>
                
                {field.type === 'select' ? (
                  <Select 
                    value={qrData[fieldKey] || ''} 
                    onValueChange={(val) => setQrData({...qrData, [fieldKey]: val})}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      {field.options?.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === 'textarea' ? (
                  <Textarea
                    value={qrData[fieldKey] || ''}
                    onChange={(e) => setQrData({...qrData, [fieldKey]: e.target.value})}
                    placeholder={field.placeholder}
                    className="bg-slate-900 border-slate-700 text-white min-h-[80px]"
                  />
                ) : (
                  <Input
                    type={field.type || 'text'}
                    value={qrData[fieldKey] || (field.defaultValue || '')}
                    onChange={(e) => setQrData({...qrData, [fieldKey]: e.target.value})}
                    placeholder={field.placeholder}
                    readOnly={field.readOnly}
                    step={field.step}
                    className="bg-slate-900 border-slate-700 text-white h-11"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Live Payload Preview */}
        <div className="pt-4 border-t border-slate-800">
          <Label className="text-xs text-slate-500 mb-2 block">Generated Payload Preview</Label>
          <div className="bg-black/30 p-3 rounded border border-slate-800 font-mono text-xs text-cyan-400 break-all">
            {qrData.customPayload || selectedPayloadType.placeholder || "Configure fields above..."}
          </div>
        </div>
      </div>
    );
  }

  // Handle custom generic payloads (fallback for types without fields)
  if (qrType === 'custom') {
    return (
      <div className="space-y-4">
        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-start gap-3">
          <Terminal className="w-5 h-5 text-purple-400 mt-1" />
          <div>
            <h4 className="text-sm font-semibold text-purple-300">Advanced Payload Configuration</h4>
            <p className="text-xs text-purple-200/70 mt-1">
              Configure the raw data for {selectedPayloadType?.label || 'this type'}.
              Ensure the format matches the standard schema.
            </p>
          </div>
        </div>
        <div>
          <Label htmlFor="customPayload" className="text-white">Payload Data *</Label>
          <Textarea
            id="customPayload"
            value={qrData.customPayload || ''}
            onChange={(e) => setQrData({...qrData, customPayload: e.target.value})}
            placeholder={selectedPayloadType?.placeholder || "Enter payload data..."}
            rows={4}
            className="bg-gray-900 border-gray-700 text-cyan-400 font-mono text-sm min-h-[100px]"
          />
          {selectedPayloadType?.description && (
            <p className="text-xs text-gray-500 mt-2">{selectedPayloadType.description}</p>
          )}
        </div>
      </div>
    );
  }

  switch (qrType) {
    case "url":
      return (
        <div>
          <Label htmlFor="url" className="text-white">Website URL *</Label>
          <Input
            id="url"
            value={qrData.url}
            onChange={(e) => setQrData({...qrData, url: e.target.value})}
            placeholder="https://example.com"
            className="bg-gray-800 border-gray-700 text-white min-h-[48px] text-base"
          />
        </div>
      );
    
    case "text":
      return (
        <div>
          <Label htmlFor="text" className="text-white">Text Content *</Label>
          <Textarea
            id="text"
            value={qrData.text}
            onChange={(e) => setQrData({...qrData, text: e.target.value})}
            placeholder="Enter any text..."
            rows={5}
            className="bg-gray-800 border-gray-700 text-white min-h-[48px] text-base"
          />
        </div>
      );
    
    case "email":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={qrData.email}
              onChange={(e) => setQrData({...qrData, email: e.target.value})}
              placeholder="contact@example.com"
              className="bg-gray-800 border-gray-700 text-white min-h-[48px] text-base"
            />
          </div>
          <div>
            <Label htmlFor="emailSubject" className="text-white">Subject</Label>
            <Input
              id="emailSubject"
              value={qrData.emailSubject}
              onChange={(e) => setQrData({...qrData, emailSubject: e.target.value})}
              placeholder="Email subject"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="emailBody" className="text-white">Message</Label>
            <Textarea
              id="emailBody"
              value={qrData.emailBody}
              onChange={(e) => setQrData({...qrData, emailBody: e.target.value})}
              placeholder="Email message"
              rows={3}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      );
    
    case "phone":
      return (
        <div>
          <Label htmlFor="phone" className="text-white">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={qrData.phone}
            onChange={(e) => setQrData({...qrData, phone: e.target.value})}
            placeholder="+1234567890"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      );
    
    case "sms":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="smsNumber" className="text-white">Phone Number *</Label>
            <Input
              id="smsNumber"
              type="tel"
              value={qrData.smsNumber}
              onChange={(e) => setQrData({...qrData, smsNumber: e.target.value})}
              placeholder="+1234567890"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="smsMessage" className="text-white">Message</Label>
            <Textarea
              id="smsMessage"
              value={qrData.smsMessage}
              onChange={(e) => setQrData({...qrData, smsMessage: e.target.value})}
              placeholder="SMS message"
              rows={3}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      );
    
    case "wifi":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="wifiSSID" className="text-white">Network Name (SSID) *</Label>
            <Input
              id="wifiSSID"
              value={qrData.wifiSSID}
              onChange={(e) => setQrData({...qrData, wifiSSID: e.target.value})}
              placeholder="MyWiFiNetwork"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="wifiPassword" className="text-white">Password *</Label>
            <Input
              id="wifiPassword"
              type="password"
              value={qrData.wifiPassword}
              onChange={(e) => setQrData({...qrData, wifiPassword: e.target.value})}
              placeholder="Password"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-white">Encryption</Label>
            <Select value={qrData.wifiEncryption} onValueChange={(value) => setQrData({...qrData, wifiEncryption: value})}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    
    case "vcard":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">First Name *</Label>
              <Input
                value={qrData.vcardFirstName}
                onChange={(e) => setQrData({...qrData, vcardFirstName: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Last Name *</Label>
              <Input
                value={qrData.vcardLastName}
                onChange={(e) => setQrData({...qrData, vcardLastName: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div>
            <Label className="text-white">Organization</Label>
            <Input
              value={qrData.vcardOrganization}
              onChange={(e) => setQrData({...qrData, vcardOrganization: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-white">Phone</Label>
            <Input
              type="tel"
              value={qrData.vcardPhone}
              onChange={(e) => setQrData({...qrData, vcardPhone: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-white">Email</Label>
            <Input
              type="email"
              value={qrData.vcardEmail}
              onChange={(e) => setQrData({...qrData, vcardEmail: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      );
    
    case "location":
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-white">Latitude *</Label>
            <Input
              type="number"
              step="any"
              value={qrData.latitude}
              onChange={(e) => setQrData({...qrData, latitude: e.target.value})}
              placeholder="37.7749"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-white">Longitude *</Label>
            <Input
              type="number"
              step="any"
              value={qrData.longitude}
              onChange={(e) => setQrData({...qrData, longitude: e.target.value})}
              placeholder="-122.4194"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      );
    
    case "event":
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-white">Event Title *</Label>
            <Input
              value={qrData.eventTitle}
              onChange={(e) => setQrData({...qrData, eventTitle: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-white">Location</Label>
            <Input
              value={qrData.eventLocation}
              onChange={(e) => setQrData({...qrData, eventLocation: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Start Date *</Label>
              <Input
                type="date"
                value={qrData.eventStartDate}
                onChange={(e) => setQrData({...qrData, eventStartDate: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Start Time *</Label>
              <Input
                type="time"
                value={qrData.eventStartTime}
                onChange={(e) => setQrData({...qrData, eventStartTime: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">End Date *</Label>
              <Input
                type="date"
                value={qrData.eventEndDate}
                onChange={(e) => setQrData({...qrData, eventEndDate: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">End Time *</Label>
              <Input
                type="time"
                value={qrData.eventEndTime}
                onChange={(e) => setQrData({...qrData, eventEndTime: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div>
            <Label className="text-white">Description</Label>
            <Textarea
              value={qrData.eventDescription}
              onChange={(e) => setQrData({...qrData, eventDescription: e.target.value})}
              rows={3}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      );
    
    default:
      return null;
  }
}