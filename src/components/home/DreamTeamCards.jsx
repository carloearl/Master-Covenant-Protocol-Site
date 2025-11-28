import React from "react";

const cards = [
  {
    name: "Claude Sonnet",
    number: "#2",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/9d7a57bed_Screenshot_20251127-185430Chrome.png"
  },
  {
    name: "Copilot",
    number: "#3",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/610bb02b5_3a737132-cd11-4d00-8626-41d6018598ec.jpg"
  },
  {
    name: "Perplexity",
    number: "#11",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/50465d2f6_73a41682-55ca-43f7-92c8-82253b9d46db.jpg"
  },
  {
    name: "Alfred",
    number: "#7",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/536bc359e_4b73d547-755a-403b-965b-4937b44581b9.jpg"
  }
];

export default function DreamTeamCards() {
  return (
    <section className="py-16 md:py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-blue-900/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              AI Dream Team
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Bound under the GlyphLock Master Covenant</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="group relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30"
            >
              <img 
                src={card.image} 
                alt={`${card.name} ${card.number}`}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-white font-bold text-lg">{card.name}</p>
                  <p className="text-cyan-400 text-sm">{card.number}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}