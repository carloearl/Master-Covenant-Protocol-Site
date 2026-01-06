import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Shield, Lock, User, Briefcase, Mic } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { GlyphInput, GlyphButton, GlyphFormPanel } from "@/components/ui/GlyphForm";

export default function NUPSLogin() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // 'admin', 'staff', 'entertainer'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [staffName, setStaffName] = useState("");
  const [pin, setPin] = useState("");
  const [dancerName, setDancerName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  // Mock staff data for the dropdown
  const staffList = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      switch (role) {
        case 'admin':
          // This would be the flow for a real admin login
          // await base44.auth.login({ email, password });
          // Then, you might have an MFA step.
          // For now, we'll just simulate a successful login and redirect.
          if (email && password) {
            console.log("Admin login successful (mock)");
            navigate('/nups-owner');
          } else {
            setError("Please enter email and password.");
          }
          break;
        case 'staff':
          // Mock staff authentication
          if (staffName && pin.length === 4) {
            console.log(`Staff clock-in: ${staffName}`);
            navigate('/nups-staff');
          } else {
            setError("Please select your name and enter a 4-digit PIN.");
          }
          break;
        case 'entertainer':
          // Mock entertainer authentication
          if (dancerName && password) {
            console.log(`Entertainer sign-in: ${dancerName}`);
            setShowAgreement(true);
          } else {
            setError("Please enter your dancer name and password.");
          }
          break;
        default:
          setError("An unexpected error occurred.");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAgreement = () => {
    setShowAgreement(false);
    navigate('/nups-time-clock');
  };

  const renderRoleSelection = () => (
    <div className="flex flex-col gap-4">
        <h2 className="text-center text-lg font-semibold text-white/80 mb-2">Select Your Role</h2>
        <GlyphButton onClick={() => setRole('admin')} variant="outline" className="w-full">
            <Shield className="w-4 h-4 mr-2" /> Admin
        </GlyphButton>
        <GlyphButton onClick={() => setRole('staff')} variant="outline" className="w-full">
            <Briefcase className="w-4 h-4 mr-2" /> Staff
        </GlyphButton>
        <GlyphButton onClick={() => setRole('entertainer')} variant="outline" className="w-full">
            <Mic className="w-4 h-4 mr-2" /> Entertainer
        </GlyphButton>
    </div>
  );

  const renderLoginForm = () => {
    let formContent;
    let title = "Sign In";

    switch (role) {
      case 'admin':
        title = "Admin Login";
        formContent = (
          <>
            <GlyphInput
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
            <GlyphInput
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <GlyphInput
              type="text"
              placeholder="MFA Code"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              autoComplete="one-time-code"
            />
          </>
        );
        break;
      case 'staff':
        title = "Staff Clock-In";
        formContent = (
          <>
            <select
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
            >
                <option value="" disabled>Select your name</option>
                {staffList.map(staff => (
                    <option key={staff.id} value={staff.name}>{staff.name}</option>
                ))}
            </select>
            <GlyphInput
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength="4"
              inputMode="numeric"
            />
          </>
        );
        break;
      case 'entertainer':
        title = "Entertainer Sign-In";
        formContent = (
          <>
            <GlyphInput
              type="text"
              placeholder="Enter your Dancer Name"
              value={dancerName}
              onChange={(e) => setDancerName(e.target.value)}
            />
            <GlyphInput
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        );
        break;
      default:
        formContent = null;
    }

    return (
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <h2 className="text-center text-lg font-semibold text-white/80 mb-2">{title}</h2>
        {formContent}
        <GlyphButton type="submit" variant="mixed" className="w-full mt-2">
          {loading ? (
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 animate-spin" />
              Authenticating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {role === 'staff' ? 'Clock In' : 'Sign In'}
            </span>
          )}
        </GlyphButton>
        <button type="button" onClick={() => setRole(null)} className="text-sm text-white/60 hover:underline mt-2">
          Back to role selection
        </button>
      </form>
    );
  };

  const renderAgreementModal = () => (
    <Dialog open={showAgreement} onOpenChange={setShowAgreement}>
      <DialogContent className="bg-slate-900 border-purple-500/50 text-white">
        <DialogHeader>
          <DialogTitle>Sub-Contract Agreement</DialogTitle>
          <DialogDescription className="text-slate-400">
            Please acknowledge the following terms before proceeding.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm text-slate-300 space-y-2 py-4">
          <p>I acknowledge and agree to the terms of my initial contract.</p>
          <p>I will obey all club laws and policies.</p>
          <p>This digital affirmation is legally binding.</p>
        </div>
        <DialogFooter>
          <GlyphButton onClick={handleAgreement} variant="mixed">I Agree</GlyphButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative">
      {renderAgreementModal()}
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF]/20 via-[#7C3AED]/10 to-[#3B82F6]/20" />
      
      <div className="relative z-10">
        <GlyphFormPanel title="">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(124,58,237,0.5)]">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black">
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent">
                N.U.P.S.
              </span>{" "}
              <span className="text-white">POS</span>
            </h1>
            <p className="text-white/60 mt-1 text-sm">Nexus Universal Point-of-Sale</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-500/20 border-red-500/50">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {role ? renderLoginForm() : renderRoleSelection()}

          <div className="mt-6 pt-4 border-t border-[#3B82F6]/30 w-full">
            <div className="text-xs text-white/60 space-y-2">
              <div className="flex items-center justify-between">
                <span>Staff Access:</span>
                <span className="text-[#3B82F6]">Basic Operations</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Manager Access:</span>
                <span className="text-[#60A5FA]">Reports & Inventory</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Owner Access:</span>
                <span className="text-[#8B5CF6]">Full Administration</span>
              </div>
            </div>
          </div>
        </GlyphFormPanel>
      </div>
    </div>
  );
}