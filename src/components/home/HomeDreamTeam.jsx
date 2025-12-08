// DREAM TEAM SECTION - DO NOT MODIFY, DELETE, OR RENDER ON HOME PAGE
// This component is DEPRECATED for Home page use.
// Use HomeDreamTeamCTA.jsx on Home page instead.
// Flip cards live exclusively on pages/DreamTeam.jsx

import { useNavigate } from "react-router-dom";

export default function HomeDreamTeam() {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 w-full overflow-hidden dreamteam-shell">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <h2 className="text-6xl font-extrabold dreamteam-title mb-6">
          The Dream Team
        </h2>

        <p className="dreamteam-subtitle mb-4">
          AI is a roster, not a religion. When one model stumbles another picks up the ball.
          This is synergy. This is intelligence with teammates.
        </p>

        <p className="dreamteam-description max-w-3xl mx-auto mb-12">
          GlyphLock runs every operator like a championship lineup.
          Precision from one. Creativity from another. Stability from a third.
          Their overlap forms the backbone of our truth infrastructure.
        </p>

        <button
          onClick={() => navigate('/dream-team')}
          className="dreamteam-button"
        >
          Enter the Dream Team
        </button>

        <div className="dreamteam-ticker mt-14">
          <span>Claude — Deep Reasoning</span>
          <span>Alfred — System Orchestration</span>
          <span>GPT — Creative Intelligence</span>
          <span>Perplexity — Real-time Recall</span>
          <span>Cursor — Code Precision</span>
        </div>

      </div>
    </section>
  );
}