import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, Upload, Image, Download, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SteganographyTab() {
  const [encodeMessage, setEncodeMessage] = useState("");
  const [encodePassword, setEncodePassword] = useState("");
  const [encodeImage, setEncodeImage] = useState(null);
  const [encodeImagePreview, setEncodeImagePreview] = useState(null);
  const [encodedImageUrl, setEncodedImageUrl] = useState(null);
  const [isEncoding, setIsEncoding] = useState(false);

  const [decodeImage, setDecodeImage] = useState(null);
  const [decodePassword, setDecodePassword] = useState("");
  const [decodedMessage, setDecodedMessage] = useState("");
  const [isDecoding, setIsDecoding] = useState(false);

  const encodeFileRef = useRef(null);
  const decodeFileRef = useRef(null);

  const handleEncodeImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    setEncodeImage(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setEncodeImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDecodeImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    setDecodeImage(file);
  };

  const handleEncode = async () => {
    if (!encodeImage || !encodeMessage) {
      alert('Please provide an image and message');
      return;
    }

    setIsEncoding(true);
    
    try {
      const { file_url: imageUrl } = await base44.integrations.Core.UploadFile({ file: encodeImage });
      
      const result = await base44.functions.invoke('encodeImageData', {
        image_url: imageUrl,
        message: encodeMessage,
        password: encodePassword || undefined
      });

      setEncodedImageUrl(result.data.encoded_image_url);
    } catch (error) {
      console.error("Encoding error:", error);
      alert('Failed to encode message. Please try again.');
    } finally {
      setIsEncoding(false);
    }
  };

  const handleDecode = async () => {
    if (!decodeImage) {
      alert('Please provide an image to decode');
      return;
    }

    setIsDecoding(true);
    setDecodedMessage("");
    
    try {
      const { file_url: imageUrl } = await base44.integrations.Core.UploadFile({ file: decodeImage });
      
      const result = await base44.functions.invoke('decodeImageData', {
        image_url: imageUrl,
        password: decodePassword || undefined
      });

      setDecodedMessage(result.data.message);
    } catch (error) {
      console.error("Decoding error:", error);
      alert('Failed to decode message. Check password or image format.');
    } finally {
      setIsDecoding(false);
    }
  };

  const downloadEncodedImage = () => {
    if (!encodedImageUrl) return;
    const link = document.createElement('a');
    link.href = encodedImageUrl;
    link.download = 'encoded-image.png';
    link.click();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-400" />
            Encode Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-white mb-2 block">Select Image</Label>
            <div 
              onClick={() => encodeFileRef.current?.click()}
              className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
            >
              <input
                ref={encodeFileRef}
                type="file"
                accept="image/*"
                onChange={handleEncodeImageChange}
                className="hidden"
              />
              {encodeImagePreview ? (
                <img src={encodeImagePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-white">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                </>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="encode-message" className="text-white">Secret Message *</Label>
            <Textarea
              id="encode-message"
              value={encodeMessage}
              onChange={(e) => setEncodeMessage(e.target.value)}
              placeholder="Enter the message you want to hide..."
              rows={5}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="encode-password" className="text-white">Encryption Password (optional)</Label>
            <Input
              id="encode-password"
              type="password"
              value={encodePassword}
              onChange={(e) => setEncodePassword(e.target.value)}
              placeholder="Enter password to encrypt message"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <Button
            onClick={handleEncode}
            disabled={!encodeImage || !encodeMessage || isEncoding}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            {isEncoding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Encoding...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Encode Message
              </>
            )}
          </Button>

          {encodedImageUrl && (
            <Alert className="bg-green-500/10 border-green-500/30">
              <AlertDescription className="text-white flex items-center justify-between">
                <span>✓ Message encoded successfully</span>
                <Button
                  onClick={downloadEncodedImage}
                  size="sm"
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <Download className="w-3 h-3 mr-2" />
                  Download
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Decode Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-white mb-2 block">Select Encoded Image</Label>
            <div 
              onClick={() => decodeFileRef.current?.click()}
              className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
            >
              <input
                ref={decodeFileRef}
                type="file"
                accept="image/*"
                onChange={handleDecodeImageChange}
                className="hidden"
              />
              <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-white">
                {decodeImage ? decodeImage.name : "Click to upload image with hidden message"}
              </p>
              <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div>
            <Label htmlFor="decode-password" className="text-white">Decryption Password (if encrypted)</Label>
            <Input
              id="decode-password"
              type="password"
              value={decodePassword}
              onChange={(e) => setDecodePassword(e.target.value)}
              placeholder="Enter password to decrypt message"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <Button
            onClick={handleDecode}
            disabled={!decodeImage || isDecoding}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            {isDecoding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Decoding...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Decode Message
              </>
            )}
          </Button>

          {decodedMessage && (
            <Alert className="bg-blue-500/10 border-blue-500/30">
              <AlertDescription>
                <div className="text-sm text-blue-400 mb-2 font-semibold">Decoded Message:</div>
                <div className="bg-gray-800 p-4 rounded-lg text-white whitespace-pre-wrap">
                  {decodedMessage}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-800 text-center">
            <CardContent className="pt-6">
              <Lock className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold mb-2 text-white">AES Encryption</h3>
              <p className="text-sm text-gray-400">Military-grade encryption</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800 text-center">
            <CardContent className="pt-6">
              <EyeOff className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold mb-2 text-white">LSB Encoding</h3>
              <p className="text-sm text-gray-400">Invisible to the eye</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800 text-center">
            <CardContent className="pt-6">
              <Image className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold mb-2 text-white">Lossless</h3>
              <p className="text-sm text-gray-400">No quality degradation</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}