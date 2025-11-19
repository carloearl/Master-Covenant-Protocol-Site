import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, Lock, CheckCircle, AlertCircle, 
  Shield, Calendar, Loader2, Info 
} from "lucide-react";

export default function Payment() {
  const navigate = useNavigate();
  const [consultationId, setConsultationId] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [isLoadingStripe, setIsLoadingStripe] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('consultation_id');
    if (id) {
      setConsultationId(id);
      loadConsultation(id);
    }
  }, []);

  useEffect(() => {
    loadStripe();
  }, []);

  const loadStripe = async () => {
    try {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = () => {
        console.log('Stripe.js loaded successfully');
        setIsLoadingStripe(false);
      };
      script.onerror = () => {
        setError('Failed to load Stripe. Please refresh the page.');
        setIsLoadingStripe(false);
      };
      document.body.appendChild(script);
    } catch (err) {
      setError('Failed to load Stripe. Please refresh the page.');
      setIsLoadingStripe(false);
    }
  };

  const loadConsultation = async (id) => {
    try {
      const consultations = await base44.entities.Consultation.filter({ id });
      if (consultations.length > 0) {
        setConsultation(consultations[0]);
        await createPaymentIntent(consultations[0]);
      }
    } catch (err) {
      setError("Failed to load consultation details");
    }
  };

  const createPaymentIntent = async (consultation) => {
    try {
      setIsProcessing(true);
      
      // Get Stripe publishable key from backend
      const configResult = await base44.functions.call('get-stripe-config');
      
      if (!configResult.success) {
        throw new Error('Failed to load payment configuration');
      }

      const publishableKey = configResult.publishableKey;
      
      // Create payment intent
      const result = await base44.functions.call('stripe-create-payment-intent', {
        consultationId: consultation.id,
        amount: 29900,
        email: consultation.email,
        name: consultation.full_name
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to initialize payment');
      }

      setClientSecret(result.clientSecret);
      
      // Initialize Stripe Elements
      if (window.Stripe && publishableKey) {
        initializeStripeElements(result.clientSecret, publishableKey);
      } else {
        throw new Error('Stripe not loaded or key missing');
      }
      
      setIsProcessing(false);
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const initializeStripeElements = (clientSecret, publishableKey) => {
    try {
      const stripeInstance = window.Stripe(publishableKey);
      setStripe(stripeInstance);
      
      const elementsInstance = stripeInstance.elements({
        clientSecret: clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#3b82f6',
            colorBackground: '#1f2937',
            colorText: '#ffffff',
            colorDanger: '#ef4444',
            borderRadius: '0.5rem',
            fontFamily: 'system-ui, sans-serif'
          }
        }
      });
      
      setElements(elementsInstance);
      
      const paymentElement = elementsInstance.create('payment');
      paymentElement.mount('#payment-element');
      
      paymentElement.on('ready', () => {
        console.log('Payment element ready');
      });
      
      paymentElement.on('change', (event) => {
        if (event.error) {
          setError(event.error.message);
        } else {
          setError(null);
        }
      });
      
    } catch (err) {
      console.error('Failed to initialize Stripe elements:', err);
      setError('Failed to initialize payment form. Please refresh the page.');
    }
  };

  const processPayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system not ready. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + createPageUrl("PaymentSuccess") + `?consultation_id=${consultationId}`,
        },
        redirect: 'if_required'
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        setTimeout(() => {
          navigate(createPageUrl("PaymentSuccess") + `?consultation_id=${consultationId}`);
        }, 2000);
      }

    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-black text-white py-20 flex items-center justify-center">
        <Card className="glass-card-dark border-green-500/30 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-4">Your consultation has been confirmed</p>
            <div className="animate-pulse text-blue-400 text-sm">Redirecting...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 mb-6">
              <Lock className="w-4 h-4 mr-2" />
              Secure Payment via Stripe
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Complete Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Booking</span>
            </h1>
            <p className="text-gray-400">Powered by Stripe • PCI DSS Level 1 Certified</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="bg-red-500/10 border-red-500/30 mb-6">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-white">{error}</AlertDescription>
                    </Alert>
                  )}

                  {isLoadingStripe || (isProcessing && !clientSecret) ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                      <span className="ml-3 text-gray-400">
                        {isLoadingStripe ? 'Loading payment system...' : 'Initializing payment...'}
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={processPayment} className="space-y-6">
                      <div>
                        <Label className="text-white mb-3 block">Card Details</Label>
                        <div id="payment-element" className="min-h-[200px]">
                          {/* Stripe Elements will mount here */}
                        </div>
                      </div>

                      <Alert className="bg-blue-500/10 border-blue-500/30">
                        <Info className="h-4 w-4 text-blue-400" />
                        <AlertDescription className="text-white text-sm">
                          Your payment is processed securely by Stripe. We never see or store your card details.
                        </AlertDescription>
                      </Alert>

                      <Button
                        type="submit"
                        disabled={isProcessing || !clientSecret}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 text-lg"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 mr-2" />
                            Pay $299.00
                          </>
                        )}
                      </Button>

                      <p className="text-center text-xs text-gray-500 mt-4">
                        By completing this payment, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Shield className="w-5 h-5 text-green-400" />
                  Stripe Powered
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock className="w-5 h-5 text-blue-400" />
                  PCI DSS Level 1
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                  256-bit SSL
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="glass-card-dark border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {consultation ? (
                    <>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Service</div>
                        <div className="font-semibold text-white">{consultation.service_interest}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Client</div>
                        <div className="text-white">{consultation.full_name}</div>
                        <div className="text-sm text-gray-400">{consultation.email}</div>
                      </div>
                      {consultation.preferred_date && (
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Preferred Date</div>
                          <div className="flex items-center gap-2 text-white">
                            <Calendar className="w-4 h-4" />
                            {new Date(consultation.preferred_date).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Loading details...</div>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Consultation Fee</span>
                      <span className="text-white">$299.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Processing Fee</span>
                      <span className="text-white">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-700">
                      <span className="text-white">Total</span>
                      <span className="text-blue-400">$299.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-700/10 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-sm">What's Included</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    60-minute expert consultation
                  </div>
                  <div className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Comprehensive security analysis
                  </div>
                  <div className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Custom solution recommendations
                  </div>
                  <div className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Detailed proposal document
                  </div>
                  <div className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    30-day follow-up support
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card-dark border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Refund Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm">
                    Not satisfied? Get a full refund within 48 hours of your consultation. No questions asked.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}