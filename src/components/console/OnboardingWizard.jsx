import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, Key, Download, FileText, Activity, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import glyphLockAPI from '@/components/api/glyphLockAPI';

const ONBOARDING_STEPS = [
  {
    id: 'api_key',
    title: 'Create Your First API Key',
    description: 'Generate a secure API key to authenticate your requests',
    icon: Key,
    action: 'Go to API Keys',
    module: 'api-keys'
  },
  {
    id: 'sdk',
    title: 'Download SDK',
    description: 'Get the SDK for your preferred programming language',
    icon: Download,
    action: 'Visit SDK Center',
    module: 'sdk'
  },
  {
    id: 'test_call',
    title: 'Make Your First API Call',
    description: 'Test your integration with a sample request',
    icon: FileText,
    action: 'Try API Reference',
    module: 'api-reference'
  },
  {
    id: 'logs',
    title: 'Enable System Logs',
    description: 'Monitor your API activity and troubleshoot issues',
    icon: Activity,
    action: 'View Logs',
    module: 'logs'
  },
  {
    id: 'invite',
    title: 'Invite Your Team',
    description: 'Add team members and assign roles',
    icon: Users,
    action: 'Manage Team',
    module: 'team-roles'
  }
];

export default function OnboardingWizard({ onClose, onNavigate, completedSteps = [] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completing, setCompleting] = useState(false);

  const progress = (completedSteps.length / ONBOARDING_STEPS.length) * 100;

  const handleStepAction = (module) => {
    onNavigate(module);
    onClose();
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await glyphLockAPI.billing.completeOnboarding();
      toast.success('Onboarding completed! Welcome to GlyphLock.');
      onClose();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast.error('Failed to complete onboarding');
    } finally {
      setCompleting(false);
    }
  };

  const isStepCompleted = (stepId) => completedSteps.includes(stepId);
  const allCompleted = completedSteps.length === ONBOARDING_STEPS.length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-card border-purple-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-white mb-2">Welcome to GlyphLock Enterprise</CardTitle>
              <p className="text-white/70">Get started in 5 simple steps</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>{completedSteps.length} of {ONBOARDING_STEPS.length} completed</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {ONBOARDING_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const completed = isStepCompleted(step.id);

            return (
              <div
                key={step.id}
                className={`p-4 rounded-lg border transition-all ${
                  completed
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'glass-card border-white/10 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    completed ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {completed ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  </div>

                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{step.title}</h4>
                    <p className="text-white/60 text-sm">{step.description}</p>
                  </div>

                  <Button
                    onClick={() => handleStepAction(step.module)}
                    variant={completed ? 'ghost' : 'default'}
                    className={completed ? 'text-white/50' : 'bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90'}
                  >
                    {completed ? 'Revisit' : step.action}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}

          {allCompleted && (
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-[#8C4BFF]/20 to-[#00E4FF]/20 border border-purple-500/30">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">All Set!</h3>
                  <p className="text-white/70">You've completed all onboarding steps.</p>
                </div>
                <Button
                  onClick={handleComplete}
                  disabled={completing}
                  className="bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90"
                >
                  {completing ? 'Completing...' : 'Complete Onboarding'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}