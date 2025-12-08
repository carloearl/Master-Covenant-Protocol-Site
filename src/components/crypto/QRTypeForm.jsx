import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QRTypeForm({ qrType, qrData, setQrData }) {
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