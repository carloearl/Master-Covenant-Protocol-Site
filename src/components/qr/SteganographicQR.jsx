import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, Eye, EyeOff, Image as ImageIcon, Scan } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SteganographicQR({ qrPayload, qrGenerated }) {
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [stegoImage, setStegoImage] = useState(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState(null);
  const [extractedImage, setExtractedImage] = useState(null);
  const fileInputRef = useRef(null);
  const decodeInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setCoverImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImageUrl(reader.result);
    };
    reader.onerror = () => {
      alert('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const stringToBinary = (str) => {
    return str.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
  };

  const binaryToString = (binary) => {
    const bytes = binary.match(/.{8}/g);
    if (!bytes) return '';
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
  };

  const encodeQRInImage = async () => {
    if (!coverImage || !qrPayload || !coverImageUrl) return;

    setIsEncoding(true);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      const loadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      img.src = coverImageUrl;
      await loadPromise;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Prepare data: QR payload + delimiter
      const delimiter = '<<<END>>>';
      const dataToHide = qrPayload + delimiter;
      const binaryData = stringToBinary(dataToHide);
      
      // Check if image has enough capacity
      const maxCapacity = (pixels.length / 4) * 3; // 3 bits per pixel (RGB only)
      if (binaryData.length > maxCapacity) {
        alert('Image is too small to hide this QR code. Please use a larger image.');
        setIsEncoding(false);
        return;
      }

      // Encode binary data into LSB of RGB channels
      let dataIndex = 0;
      for (let i = 0; i < pixels.length && dataIndex < binaryData.length; i += 4) {
        // Red channel
        if (dataIndex < binaryData.length) {
          pixels[i] = (pixels[i] & 0xFE) | parseInt(binaryData[dataIndex]);
          dataIndex++;
        }
        // Green channel
        if (dataIndex < binaryData.length) {
          pixels[i + 1] = (pixels[i + 1] & 0xFE) | parseInt(binaryData[dataIndex]);
          dataIndex++;
        }
        // Blue channel
        if (dataIndex < binaryData.length) {
          pixels[i + 2] = (pixels[i + 2] & 0xFE) | parseInt(binaryData[dataIndex]);
          dataIndex++;
        }
        // Skip alpha channel (i + 3)
      }

      ctx.putImageData(imageData, 0, 0);
      
      // Convert to blob and create download URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setStegoImage(url);
        }
        setIsEncoding(false);
      }, 'image/png');

    } catch (error) {
      console.error('Encoding error:', error);
      alert('Error encoding QR code into image: ' + error.message);
      setIsEncoding(false);
    }
  };

  const decodeQRFromImage = async (file) => {
    setIsDecoding(true);
    setDecodedData(null);

    try {
      const reader = new FileReader();
      
      const readPromise = new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
      });
      
      reader.readAsDataURL(file);
      const dataUrl = await readPromise;

      const img = new Image();
      img.crossOrigin = "anonymous";
      
      const loadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      img.src = dataUrl;
      await loadPromise;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Extract binary data from LSB
      let binaryData = '';
      for (let i = 0; i < pixels.length; i += 4) {
        // Red channel
        binaryData += (pixels[i] & 1).toString();
        // Green channel
        binaryData += (pixels[i + 1] & 1).toString();
        // Blue channel
        binaryData += (pixels[i + 2] & 1).toString();
      }

      // Convert binary to string
      const extractedText = binaryToString(binaryData);
      
      // Find delimiter
      const delimiter = '<<<END>>>';
      const delimiterIndex = extractedText.indexOf(delimiter);
      
      if (delimiterIndex === -1) {
        alert('No hidden QR data found in this image');
        setIsDecoding(false);
        return;
      }

      const hiddenData = extractedText.substring(0, delimiterIndex);
      setDecodedData(hiddenData);
      setExtractedImage(dataUrl);
      setIsDecoding(false);
      
    } catch (error) {
      console.error('Decoding error:', error);
      alert('Error decoding image: ' + error.message);
      setIsDecoding(false);
    }
  };

  const handleDecodeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    decodeQRFromImage(file);
  };

  const downloadStegoImage = () => {
    if (!stegoImage) return;
    
    const link = document.createElement('a');
    link.href = stegoImage;
    link.download = 'steganographic-qr.png';
    link.click();
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <EyeOff className="w-5 h-5" />
          Steganographic QR (Hidden in Image)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="encode">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="encode" className="text-white data-[state=active]:text-blue-400">
              Encode (Hide)
            </TabsTrigger>
            <TabsTrigger value="decode" className="text-white data-[state=active]:text-blue-400">
              Decode (Extract)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encode" className="space-y-6">
            {!qrGenerated && (
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertDescription className="text-white">
                  Generate a QR code first to enable steganographic encoding
                </AlertDescription>
              </Alert>
            )}

            {qrGenerated && (
              <>
                <div>
                  <Label className="text-white mb-2 block">Step 1: Upload Cover Image</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {coverImageUrl ? (
                    <div className="space-y-3">
                      <div className="border-2 border-gray-700 rounded-lg p-4 bg-gray-800">
                        <img 
                          src={coverImageUrl} 
                          alt="Cover" 
                          className="max-w-full max-h-48 mx-auto rounded"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full border-blue-500/50 hover:bg-blue-500/10 text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-blue-500/50 transition-colors"
                    >
                      <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-white">Click to upload cover image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG - Larger images recommended</p>
                    </button>
                  )}
                </div>

                <Button
                  onClick={encodeQRInImage}
                  disabled={!coverImage || isEncoding}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  {isEncoding ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2 animate-pulse" />
                      Hiding QR in Image...
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide QR Code in Image (LSB Encoding)
                    </>
                  )}
                </Button>

                {stegoImage && (
                  <div className="space-y-3">
                    <Alert className="bg-green-500/10 border-green-500/30">
                      <AlertDescription className="text-white">
                        <strong>✓ QR Code Hidden Successfully!</strong>
                        <p className="text-xs text-gray-400 mt-1">
                          The image looks identical but contains your QR data in the least significant bits
                        </p>
                      </AlertDescription>
                    </Alert>

                    <div className="border-2 border-green-500/30 rounded-lg p-4 bg-gray-800">
                      <Label className="text-white text-sm mb-2 block">Steganographic Image</Label>
                      <img 
                        src={stegoImage} 
                        alt="Steganographic" 
                        className="max-w-full max-h-48 mx-auto rounded mb-3"
                        crossOrigin="anonymous"
                      />
                      <p className="text-xs text-gray-400 text-center">
                        Looks normal, but contains hidden QR data
                      </p>
                    </div>

                    <Button
                      onClick={downloadStegoImage}
                      variant="outline"
                      className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Steganographic Image
                    </Button>
                  </div>
                )}

                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <AlertDescription className="text-xs text-white">
                    <strong>How it works:</strong> LSB (Least Significant Bit) encoding hides data by modifying the last bit of each RGB pixel. Changes are invisible to human eyes but can be extracted programmatically.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </TabsContent>

          <TabsContent value="decode" className="space-y-6">
            <div>
              <Label className="text-white mb-2 block">Upload Image to Extract Hidden QR</Label>
              <input
                ref={decodeInputRef}
                type="file"
                accept="image/*"
                onChange={handleDecodeUpload}
                className="hidden"
              />
              
              <button
                onClick={() => decodeInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-blue-500/50 transition-colors"
                disabled={isDecoding}
              >
                {isDecoding ? (
                  <>
                    <Scan className="w-12 h-12 text-blue-400 mx-auto mb-3 animate-pulse" />
                    <p className="text-white">Extracting hidden data...</p>
                  </>
                ) : (
                  <>
                    <Scan className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-white">Click to upload steganographic image</p>
                    <p className="text-xs text-gray-500 mt-1">Must be a PNG with hidden QR data</p>
                  </>
                )}
              </button>
            </div>

            {decodedData && (
              <div className="space-y-3">
                <Alert className="bg-green-500/10 border-green-500/30">
                  <AlertDescription className="text-white">
                    <strong>✓ Hidden QR Data Extracted!</strong>
                  </AlertDescription>
                </Alert>

                {extractedImage && (
                  <div className="border-2 border-gray-700 rounded-lg p-4 bg-gray-800">
                    <Label className="text-white text-sm mb-2 block">Original Image</Label>
                    <img 
                      src={extractedImage} 
                      alt="Extracted" 
                      className="max-w-full max-h-32 mx-auto rounded"
                      crossOrigin="anonymous"
                    />
                  </div>
                )}

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <Label className="text-white text-sm mb-2 block">Extracted QR Payload</Label>
                  <div className="bg-gray-900 p-3 rounded border border-gray-700">
                    <p className="text-white text-sm font-mono break-all">{decodedData}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(decodedData)}`}
                    alt="Extracted QR"
                    className="max-w-full"
                  />
                </div>
              </div>
            )}

            <Alert className="bg-blue-500/10 border-blue-500/30">
              <AlertDescription className="text-xs text-white">
                <strong>Security Note:</strong> This extraction only works on images created with LSB encoding. Regular images won't contain hidden data.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </CardContent>
    </Card>
  );
}