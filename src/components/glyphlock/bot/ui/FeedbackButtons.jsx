import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function FeedbackButtons({ messageText, userQuery, sessionId }) {
  const [rating, setRating] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitFeedback = async (selectedRating, text = '') => {
    setLoading(true);
    try {
      await base44.entities.GlyphBotFeedback.create({
        message_text: messageText?.substring(0, 500),
        user_query: userQuery?.substring(0, 200),
        rating: selectedRating,
        feedback_text: text?.substring(0, 500),
        session_id: sessionId
      });
      setSubmitted(true);
    } catch (err) {
      console.error('[Feedback] Save failed:', err);
    }
    setLoading(false);
  };

  const handleRating = (type) => {
    setRating(type);
    if (type === 'negative') {
      setShowTextInput(true);
    } else {
      submitFeedback(type);
    }
  };

  const handleTextSubmit = () => {
    submitFeedback(rating, feedbackText);
    setShowTextInput(false);
  };

  if (submitted) {
    return (
      <div className="mt-2 text-xs text-blue-300/60 flex items-center gap-1">
        ✓ Thanks for feedback!
      </div>
    );
  }

  if (showTextInput) {
    return (
      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="What could be better?"
            className="flex-1 bg-blue-950/50 border border-blue-400/30 rounded-lg px-3 py-1.5 text-xs text-white placeholder-blue-300/50 focus:outline-none focus:ring-1 focus:ring-blue-400"
            maxLength={200}
            autoFocus
          />
          <button
            onClick={handleTextSubmit}
            disabled={loading}
            className="p-1.5 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg text-blue-300 transition-colors"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MessageSquare className="w-3 h-3" />}
          </button>
          <button
            onClick={() => { setShowTextInput(false); submitFeedback(rating); }}
            className="p-1.5 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-300 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <button
        onClick={() => handleRating('positive')}
        disabled={loading || rating}
        className={`p-1.5 rounded-lg transition-all ${
          rating === 'positive' 
            ? 'bg-green-600/40 text-green-300' 
            : 'bg-blue-600/20 hover:bg-green-600/30 text-blue-300/60 hover:text-green-300'
        }`}
        title="Helpful"
      >
        <ThumbsUp className="w-3 h-3" />
      </button>
      <button
        onClick={() => handleRating('negative')}
        disabled={loading || rating}
        className={`p-1.5 rounded-lg transition-all ${
          rating === 'negative' 
            ? 'bg-red-600/40 text-red-300' 
            : 'bg-blue-600/20 hover:bg-red-600/30 text-blue-300/60 hover:text-red-300'
        }`}
        title="Not helpful"
      >
        <ThumbsDown className="w-3 h-3" />
      </button>
    </div>
  );
}