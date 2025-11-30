import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  GripVertical, Settings, Zap, Shield, Clock, AlertTriangle,
  Save, Upload, Trash2, Plus, Check, X, RotateCcw, Activity,
  ChevronDown, ChevronUp, Brain, Code, FileJson, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const DEFAULT_PROVIDERS = [
  { id: 'GEMINI', label: 'Gemini Flash', enabled: true, priority: 1, jsonMode: true, color: 'cyan' },
  { id: 'OPENAI', label: 'OpenAI GPT-4', enabled: true, priority: 2, jsonMode: true, color: 'emerald' },
  { id: 'CLAUDE', label: 'Claude Sonnet', enabled: true, priority: 3, jsonMode: true, color: 'purple' },
  { id: 'OPENROUTER', label: 'OpenRouter', enabled: true, priority: 4, jsonMode: false, color: 'amber' },
  { id: 'LOCAL_OSS', label: 'Local Fallback', enabled: true, priority: 999, jsonMode: false, color: 'slate' }
];

const PERSONA_OPTIONS = [
  { id: 'GENERAL', label: 'General Assistant', icon: Brain },
  { id: 'SECURITY', label: 'Security Analyst', icon: Shield },
  { id: 'CODE', label: 'Code Expert', icon: Code },
  { id: 'AUDIT', label: 'Audit Specialist', icon: FileJson }
];

const DEFAULT_HEALTH_CONFIG = {
  maxFailuresBeforeDisable: 3,
  healthCheckIntervalMs: 30000,
  latencyThresholdMs: 5000,
  successRateThreshold: 0.7,
  cooldownPeriodMs: 60000
};

const DEFAULT_CONFIG = {
  name: 'Default Chain',
  providers: DEFAULT_PROVIDERS,
  healthConfig: DEFAULT_HEALTH_CONFIG,
  defaultPersona: 'GENERAL',
  auditPersona: 'AUDIT',
  enableAutoFallback: true,
  enableHealthMonitoring: true
};

export default function ChainConfigBuilder({ onConfigChange, initialConfig }) {
  const [config, setConfig] = useState(initialConfig || DEFAULT_CONFIG);
  const [expandedProvider, setExpandedProvider] = useState(null);
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');

  // Load saved configs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('glyphlock_chain_configs');
    if (stored) {
      try {
        setSavedConfigs(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved configs:', e);
      }
    }
  }, []);

  // Notify parent of config changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(config);
    }
    // Also save to session for the GlyphBot to pick up
    sessionStorage.setItem('glyphlock_chain_config', JSON.stringify(config));
  }, [config, onConfigChange]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(config.providers);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    // Update priorities based on new order
    const updated = items.map((item, idx) => ({
      ...item,
      priority: item.id === 'LOCAL_OSS' ? 999 : idx + 1
    }));

    setConfig({ ...config, providers: updated });
    toast.success('Chain order updated');
  };

  const toggleProvider = (providerId) => {
    setConfig({
      ...config,
      providers: config.providers.map(p =>
        p.id === providerId ? { ...p, enabled: !p.enabled } : p
      )
    });
  };

  const toggleJsonMode = (providerId) => {
    setConfig({
      ...config,
      providers: config.providers.map(p =>
        p.id === providerId ? { ...p, jsonMode: !p.jsonMode } : p
      )
    });
  };

  const updateHealthConfig = (key, value) => {
    setConfig({
      ...config,
      healthConfig: { ...config.healthConfig, [key]: value }
    });
  };

  const saveConfig = () => {
    if (!newConfigName.trim()) {
      toast.error('Please enter a config name');
      return;
    }

    const newConfig = { ...config, name: newConfigName, savedAt: new Date().toISOString() };
    const updated = [...savedConfigs.filter(c => c.name !== newConfigName), newConfig];
    setSavedConfigs(updated);
    localStorage.setItem('glyphlock_chain_configs', JSON.stringify(updated));
    setSaveDialogOpen(false);
    setNewConfigName('');
    toast.success(`Configuration "${newConfigName}" saved`);
  };

  const loadConfig = (savedConfig) => {
    setConfig(savedConfig);
    setLoadDialogOpen(false);
    toast.success(`Loaded "${savedConfig.name}"`);
  };

  const deleteConfig = (name) => {
    const updated = savedConfigs.filter(c => c.name !== name);
    setSavedConfigs(updated);
    localStorage.setItem('glyphlock_chain_configs', JSON.stringify(updated));
    toast.success(`Deleted "${name}"`);
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_CONFIG);
    toast.info('Reset to default configuration');
  };

  const getProviderColorClasses = (color, enabled) => {
    if (!enabled) return 'border-slate-700 bg-slate-900/50 text-slate-500';
    const colors = {
      cyan: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400',
      emerald: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
      purple: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
      amber: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
      slate: 'border-slate-500/50 bg-slate-500/10 text-slate-400'
    };
    return colors[color] || colors.slate;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Chain Configuration
          </h3>
          <p className="text-sm text-slate-400">Drag to reorder, click to configure</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            className="border-slate-700 text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          
          <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white">
                <Upload className="w-4 h-4 mr-1" />
                Load
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Load Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedConfigs.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No saved configurations</p>
                ) : (
                  savedConfigs.map((cfg) => (
                    <div
                      key={cfg.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-white">{cfg.name}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(cfg.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => loadConfig(cfg)} className="bg-cyan-600 hover:bg-cyan-500">
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteConfig(cfg.name)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Save Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Configuration Name</Label>
                  <Input
                    value={newConfigName}
                    onChange={(e) => setNewConfigName(e.target.value)}
                    placeholder="My Custom Chain"
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                  />
                </div>
                <Button onClick={saveConfig} className="w-full bg-cyan-600 hover:bg-cyan-500">
                  Save Configuration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Provider Chain - Drag & Drop */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-slate-300">Provider Priority Chain</span>
          <Badge className="ml-auto bg-slate-800 text-slate-400 text-xs">
            {config.providers.filter(p => p.enabled).length} active
          </Badge>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="providers">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {config.providers.map((provider, index) => (
                  <Draggable key={provider.id} draggableId={provider.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`rounded-xl border transition-all ${
                          snapshot.isDragging 
                            ? 'shadow-lg shadow-cyan-500/20 scale-[1.02]' 
                            : ''
                        } ${getProviderColorClasses(provider.color, provider.enabled)}`}
                      >
                        <div className="flex items-center gap-3 p-3">
                          <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-5 h-5 text-slate-500" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${provider.enabled ? 'text-white' : 'text-slate-500'}`}>
                                {provider.label}
                              </span>
                              <Badge className={`text-[10px] ${
                                provider.enabled 
                                  ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                                  : 'bg-slate-800 text-slate-500 border-slate-700'
                              }`}>
                                P{provider.priority}
                              </Badge>
                              {provider.jsonMode && provider.enabled && (
                                <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/50">
                                  JSON
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Switch
                            checked={provider.enabled}
                            onCheckedChange={() => toggleProvider(provider.id)}
                            className="data-[state=checked]:bg-cyan-600"
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedProvider(expandedProvider === provider.id ? null : provider.id)}
                            className="text-slate-400 hover:text-white"
                          >
                            {expandedProvider === provider.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {/* Expanded Settings */}
                        {expandedProvider === provider.id && (
                          <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                  <FileJson className="w-4 h-4 text-amber-400" />
                                  <span className="text-sm text-slate-300">JSON Mode</span>
                                </div>
                                <Switch
                                  checked={provider.jsonMode}
                                  onCheckedChange={() => toggleJsonMode(provider.id)}
                                  disabled={!provider.enabled}
                                  className="data-[state=checked]:bg-amber-600"
                                />
                              </div>

                              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-purple-400" />
                                  <span className="text-sm text-slate-300">Audit Ready</span>
                                </div>
                                <Check className={`w-4 h-4 ${provider.jsonMode ? 'text-green-400' : 'text-slate-600'}`} />
                              </div>
                            </div>

                            <div className="text-xs text-slate-500">
                              Provider ID: <code className="text-cyan-400">{provider.id}</code>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Persona Configuration */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-slate-300">Persona Preferences</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Default Persona</Label>
            <Select
              value={config.defaultPersona}
              onValueChange={(v) => setConfig({ ...config, defaultPersona: v })}
            >
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {PERSONA_OPTIONS.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-white">
                    <div className="flex items-center gap-2">
                      <p.icon className="w-4 h-4" />
                      {p.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Audit Persona</Label>
            <Select
              value={config.auditPersona}
              onValueChange={(v) => setConfig({ ...config, auditPersona: v })}
            >
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {PERSONA_OPTIONS.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-white">
                    <div className="flex items-center gap-2">
                      <p.icon className="w-4 h-4" />
                      {p.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Health Monitoring Configuration */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-slate-300">Health Monitoring</span>
          </div>
          <Switch
            checked={config.enableHealthMonitoring}
            onCheckedChange={(v) => setConfig({ ...config, enableHealthMonitoring: v })}
            className="data-[state=checked]:bg-red-600"
          />
        </div>

        {config.enableHealthMonitoring && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-slate-400 text-xs">Max Failures Before Disable</Label>
                <span className="text-cyan-400 font-mono text-sm">{config.healthConfig.maxFailuresBeforeDisable}</span>
              </div>
              <Slider
                value={[config.healthConfig.maxFailuresBeforeDisable]}
                onValueChange={([v]) => updateHealthConfig('maxFailuresBeforeDisable', v)}
                min={1}
                max={10}
                step={1}
                className="[&_[role=slider]]:bg-cyan-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-slate-400 text-xs">Latency Threshold (ms)</Label>
                <span className="text-amber-400 font-mono text-sm">{config.healthConfig.latencyThresholdMs}ms</span>
              </div>
              <Slider
                value={[config.healthConfig.latencyThresholdMs]}
                onValueChange={([v]) => updateHealthConfig('latencyThresholdMs', v)}
                min={1000}
                max={30000}
                step={500}
                className="[&_[role=slider]]:bg-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-slate-400 text-xs">Success Rate Threshold</Label>
                <span className="text-emerald-400 font-mono text-sm">{Math.round(config.healthConfig.successRateThreshold * 100)}%</span>
              </div>
              <Slider
                value={[config.healthConfig.successRateThreshold * 100]}
                onValueChange={([v]) => updateHealthConfig('successRateThreshold', v / 100)}
                min={10}
                max={100}
                step={5}
                className="[&_[role=slider]]:bg-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-slate-400 text-xs">Cooldown Period (ms)</Label>
                <span className="text-purple-400 font-mono text-sm">{(config.healthConfig.cooldownPeriodMs / 1000).toFixed(0)}s</span>
              </div>
              <Slider
                value={[config.healthConfig.cooldownPeriodMs]}
                onValueChange={([v]) => updateHealthConfig('cooldownPeriodMs', v)}
                min={10000}
                max={300000}
                step={5000}
                className="[&_[role=slider]]:bg-purple-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Auto-Fallback Toggle */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="font-medium text-white">Auto-Fallback</p>
              <p className="text-xs text-slate-400">Automatically switch to next provider on failure</p>
            </div>
          </div>
          <Switch
            checked={config.enableAutoFallback}
            onCheckedChange={(v) => setConfig({ ...config, enableAutoFallback: v })}
            className="data-[state=checked]:bg-cyan-600"
          />
        </div>
      </div>
    </div>
  );
}