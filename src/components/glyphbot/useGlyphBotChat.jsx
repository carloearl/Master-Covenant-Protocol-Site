import { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

/**
 * Custom hook for GlyphBot chat functionality
 * Handles message sending, file uploads, and state management
 */
export function useGlyphBotChat({
  glyphbotClient,
  persona,
  provider,
  modes,
  voiceSettings,
  playText,
  trackMessage
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [lastMeta, setLastMeta] = useState(null);
  const [providerMeta, setProviderMeta] = useState(null);

  const handleSend = useCallback(async (files = []) => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    // Upload files
    let uploadedUrls = [];
    if (files.length > 0 || uploadedFiles.length > 0) {
      const filesToUpload = files.length > 0 ? files : uploadedFiles;
      try {
        const uploadPromises = filesToUpload.map(async (file) => {
          const { data } = await base44.integrations.Core.UploadFile({ file });
          return { name: file.name, url: data.file_url, type: file.type };
        });
        uploadedUrls = await Promise.all(uploadPromises);
      } catch (e) {
        console.error('[GlyphBot] File upload failed:', e);
        toast.error('File upload failed');
        return;
      }
    }

    const newUserMsg = { 
      id: `user-${Date.now()}`, 
      role: 'user', 
      content: trimmed,
      files: uploadedUrls
    };
    
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
    setUploadedFiles([]);
    setIsSending(true);
    
    trackMessage(newUserMsg);

    try {
      const response = await glyphbotClient.sendMessage(updatedMessages, {
        persona,
        auditMode: modes.audit,
        oneTestMode: modes.test,
        realTime: modes.live,
        tts: modes.voice,
        enforceGlyphFormat: true,
        formatOverride: true,
        systemFirst: true,
        provider: provider === 'AUTO' ? null : provider,
        autoProvider: provider === 'AUTO',
        jsonModeForced: modes.json,
        structuredMode: modes.struct,
        fileUrls: uploadedUrls.length > 0 ? uploadedUrls.map(f => f.url) : undefined
      });

      let botText = response.text || response.data?.text || (typeof response.data === 'string' ? response.data : '') || (typeof response === 'string' ? response : '');
      
      if (!botText) {
        botText = '[No response received]';
        console.error('[GlyphBot] Empty response:', response);
      }

      const botMsg = { 
        id: `bot-${Date.now()}`,
        role: 'assistant', 
        content: botText,
        audit: response.audit || response.data?.audit || null,
        providerId: response.providerUsed || response.data?.providerUsed || 'unknown',
        latencyMs: response.meta?.providerStats?.[response.providerUsed]?.lastLatencyMs || response.data?.latencyMs,
        ttsMetadata: modes.voice ? voiceSettings : null
      };
      
      setMessages(prev => [...prev, botMsg]);
      trackMessage(botMsg);

      const actualProvider = response.providerUsed || response.data?.providerUsed || 'unknown';
      const actualProviderLabel = response.providerLabel || response.data?.providerLabel || actualProvider;
      
      setLastMeta({
        model: response.model || actualProviderLabel,
        providerUsed: actualProvider,
        providerLabel: actualProviderLabel,
        realTimeUsed: response.realTimeUsed,
        shouldSpeak: response.shouldSpeak
      });

      if (modes.voice && botText) {
        try {
          playText(botText, voiceSettings);
        } catch (e) {
          console.warn('[TTS Auto-speak]', e);
        }
      }

      if (response.meta) {
        const updatedMeta = {
          ...response.meta,
          providerUsed: actualProvider,
          providerLabel: actualProviderLabel
        };
        setProviderMeta(updatedMeta);
        sessionStorage.setItem('glyphbot_provider_meta', JSON.stringify(updatedMeta));
      }

    } catch (err) {
      const errorMsg = { 
        id: `err-${Date.now()}`, 
        role: 'assistant', 
        content: `⚠️ **Error**: ${err?.message || 'Connection failed'}`,
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
      trackMessage(errorMsg);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, messages, persona, provider, modes, playText, trackMessage, voiceSettings, uploadedFiles, glyphbotClient]);

  return {
    messages,
    setMessages,
    input,
    setInput,
    isSending,
    uploadedFiles,
    setUploadedFiles,
    lastMeta,
    providerMeta,
    handleSend
  };
}