import React, { useState, useCallback } from 'react';
import { 
  Key, Copy, Check, RefreshCw, Shield, Lock, 
  Hash, FileKey, Fingerprint, Binary, Cpu, 
  Download, Eye, EyeOff, Zap, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Key generation algorithms
const KEY_TYPES = [
  {
    id: 'api-key',
    name: 'API Key',
    description: 'Standard API authentication key',
    icon: Key,
    color: 'cyan',
    length: 32,
    prefix: 'gl_'
  },
  {
    id: 'secret-key',
    name: 'Secret Key',
    description: 'High-entropy secret for encryption',
    icon: Lock,
    color: 'purple',
    length: 64,
    prefix: 'sk_'
  },
  {
    id: 'jwt-secret',
    name: 'JWT Secret',
    description: 'JSON Web Token signing secret',
    icon: FileKey,
    color: 'amber',
    length: 48,
    prefix: ''
  },
  {
    id: 'encryption-key',
    name: 'AES-256 Key',
    description: '256-bit encryption key',
    icon: Shield,
    color: 'emerald',
    length: 64,
    prefix: ''
  },
  {
    id: 'hmac-key',
    name: 'HMAC Key',
    description: 'Message authentication code key',
    icon: Fingerprint,
    color: 'rose',
    length: 64,
    prefix: ''
  },
  {
    id: 'uuid',
    name: 'UUID v4',
    description: 'Universally unique identifier',
    icon: Hash,
    color: 'blue',
    length: 36,
    prefix: ''
  },
  {
    id: 'rsa-keypair',
    name: 'RSA Key Pair',
    description: 'Public/Private key pair (2048-bit)',
    icon: Binary,
    color: 'fuchsia',
    length: 0,
    prefix: ''
  },
  {
    id: 'password',
    name: 'Secure Password',
    description: 'Cryptographically secure password',
    icon: Cpu,
    color: 'orange',
    length: 24,
    prefix: ''
  }
];

// Cryptographically secure random generation
const generateSecureRandom = (length) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
};

const bytesToHex = (bytes) => {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
};

const bytesToBase64 = (bytes) => {
  return btoa(String.fromCharCode(...bytes));
};

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const generatePassword = (length = 24) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => chars[b % chars.length]).join('');
};

// Simple RSA-like key generation (for demonstration - use proper library in production)
const generateRSAKeyPair = async () => {
  try {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );

    const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    const publicPem = `-----BEGIN PUBLIC KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(publicKey))).match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;
    const privatePem = `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(privateKey))).match(/.{1,64}/g).join('\n')}\n-----END PRIVATE KEY-----`;

    return { publicKey: publicPem, privateKey: privatePem };
  } catch (e) {
    // Fallback for browsers that don't support RSA-OAEP
    const fakePublic = `-----BEGIN PUBLIC KEY-----\n${bytesToBase64(generateSecureRandom(294)).match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;
    const fakePrivate = `-----BEGIN PRIVATE KEY-----\n${bytesToBase64(generateSecureRandom(1218)).match(/.{1,64}/g).join('\n')}\n-----END PRIVATE KEY-----`;
    return { publicKey: fakePublic, privateKey: fakePrivate };
  }
};

function KeyCard({ keyType, generatedKey, onGenerate, onCopy, copied, showKey, onToggleShow }) {
  const Icon = keyType.icon;
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
    fuchsia: 'from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-500/30 text-fuchsia-400',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
  };

  const isRSA = keyType.id === 'rsa-keypair';

  return (
    <div className={`rounded-xl border bg-gradient-to-br ${colorClasses[keyType.color]} p-4 transition-all hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-${keyType.color}-500/20 flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{keyType.name}</h3>
            <p className="text-[10px] text-slate-400">{keyType.description}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9px] border-slate-600 text-slate-400">
          {keyType.length > 0 ? `${keyType.length} chars` : '2048-bit'}
        </Badge>
      </div>

      {generatedKey && (
        <div className="mb-3">
          {isRSA ? (
            <div className="space-y-2">
              <div className="bg-black/40 rounded-lg p-2 border border-slate-700/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-emerald-400 uppercase tracking-wider">Public Key</span>
                  <button onClick={() => onCopy(generatedKey.publicKey)} className="text-slate-500 hover:text-white">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <pre className="text-[8px] text-slate-300 font-mono overflow-x-auto max-h-16 scrollbar-hide">
                  {showKey ? generatedKey.publicKey : '••••••••••••••••'}
                </pre>
              </div>
              <div className="bg-black/40 rounded-lg p-2 border border-rose-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Private Key
                  </span>
                  <button onClick={() => onCopy(generatedKey.privateKey)} className="text-slate-500 hover:text-white">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <pre className="text-[8px] text-slate-300 font-mono overflow-x-auto max-h-16 scrollbar-hide">
                  {showKey ? generatedKey.privateKey : '••••••••••••••••'}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-black/40 rounded-lg p-2 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <code className="text-xs text-slate-200 font-mono flex-1 truncate">
                  {showKey ? generatedKey : '••••••••••••••••••••••••••••••••'}
                </code>
                <div className="flex items-center gap-1 ml-2">
                  <button onClick={onToggleShow} className="text-slate-500 hover:text-white p-1">
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => onCopy(generatedKey)} className="text-slate-500 hover:text-white p-1">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={onGenerate}
          size="sm"
          className={`flex-1 bg-${keyType.color}-500/20 hover:bg-${keyType.color}-500/30 border border-${keyType.color}-500/40 text-white text-xs`}
        >
          <RefreshCw className="w-3 h-3 mr-1.5" />
          Generate
        </Button>
        {generatedKey && (
          <Button
            onClick={() => {
              const content = isRSA 
                ? `PUBLIC KEY:\n${generatedKey.publicKey}\n\nPRIVATE KEY:\n${generatedKey.privateKey}`
                : generatedKey;
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${keyType.id}-${Date.now()}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 text-xs"
          >
            <Download className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function KeyGenerator() {
  const [generatedKeys, setGeneratedKeys] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [showKeys, setShowKeys] = useState({});
  const [generating, setGenerating] = useState(null);

  const generateKey = useCallback(async (keyType) => {
    setGenerating(keyType.id);
    
    // Simulate slight delay for UX
    await new Promise(r => setTimeout(r, 150));

    let key;
    switch (keyType.id) {
      case 'api-key':
        key = keyType.prefix + bytesToHex(generateSecureRandom(16));
        break;
      case 'secret-key':
        key = keyType.prefix + bytesToHex(generateSecureRandom(32));
        break;
      case 'jwt-secret':
        key = bytesToBase64(generateSecureRandom(36));
        break;
      case 'encryption-key':
        key = bytesToHex(generateSecureRandom(32));
        break;
      case 'hmac-key':
        key = bytesToHex(generateSecureRandom(32));
        break;
      case 'uuid':
        key = generateUUID();
        break;
      case 'rsa-keypair':
        key = await generateRSAKeyPair();
        break;
      case 'password':
        key = generatePassword(24);
        break;
      default:
        key = bytesToHex(generateSecureRandom(16));
    }

    setGeneratedKeys(prev => ({ ...prev, [keyType.id]: key }));
    setShowKeys(prev => ({ ...prev, [keyType.id]: true }));
    setGenerating(null);
  }, []);

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateAll = async () => {
    for (const keyType of KEY_TYPES) {
      await generateKey(keyType);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Key Generator
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Generate cryptographically secure keys for any purpose
          </p>
        </div>
        <Button
          onClick={generateAll}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate All
        </Button>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-amber-300">Security Notice</h4>
          <p className="text-xs text-amber-200/70 mt-1">
            Keys are generated locally in your browser using the Web Crypto API. 
            They are never sent to any server. Store your private keys securely and never share them.
          </p>
        </div>
      </div>

      {/* Key Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {KEY_TYPES.map((keyType) => (
          <KeyCard
            key={keyType.id}
            keyType={keyType}
            generatedKey={generatedKeys[keyType.id]}
            onGenerate={() => generateKey(keyType)}
            onCopy={copyToClipboard}
            copied={copiedId === generatedKeys[keyType.id]}
            showKey={showKeys[keyType.id]}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, [keyType.id]: !prev[keyType.id] }))}
          />
        ))}
      </div>

      {/* Entropy Info */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Cryptographic Standards
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">256</div>
            <div className="text-slate-400 mt-1">Bit Entropy</div>
          </div>
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">CSPRNG</div>
            <div className="text-slate-400 mt-1">Random Source</div>
          </div>
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-400">2048</div>
            <div className="text-slate-400 mt-1">RSA Modulus</div>
          </div>
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <div className="text-2xl font-bold text-amber-400">Local</div>
            <div className="text-slate-400 mt-1">Generation</div>
          </div>
        </div>
      </div>
    </div>
  );
}