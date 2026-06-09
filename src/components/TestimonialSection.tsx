import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Twitter, CircleAlert } from "lucide-react";
import { Testimonial } from "../types";

export default function TestimonialSection() {
  const reviews: Testimonial[] = [
    {
      id: "karpathy",
      name: "Andrej Karpathy",
      handle: "@karpathy",
      role: "Founder Eureka Labs, Former Tesla & OpenAI",
      avatar: "https://framerusercontent.com/images/BD0IjamMdd4pWLkZSrAyKkLeLQ.png", // Stand-in high-quality profile
      tweet: `There's a new kind of coding I call "vibe coding", where you fully give in to the vibes, embrace exponentials, and forget that the code even exists. It's possible because LLMs (like Cursor Composer) are getting too good. I just talk to Composer with @superwhisperapp so I barely even touch the keyboard. It is a cheat code. Highly recommended.`,
      date: "Mar 15, 2026"
    },
    {
      id: "levels",
      name: "Pieter Levels",
      handle: "@levelsio",
      role: "Serial Solo Founder: NomadList, PhotoAI, RemoteOK",
      avatar: "https://framerusercontent.com/images/BD0IjamMdd4pWLkZSrAyKkLeLQ.png",
      tweet: `Superwhisper is by far the best local dictation app I have ever used on my Mac book. Literally saves me up to 2-3 hours every single day writing newsletters, emails and responding to tweets. The custom dictionary does not fail on technical phrases, and offline models are extremely fast.`,
      date: "Apr 2, 2026"
    },
    {
      id: "wilkinson",
      name: "Andrew Wilkinson",
      handle: "@awilkinson",
      role: "CEO & Co-founder, Tiny Capital",
      avatar: "https://framerusercontent.com/images/BD0IjamMdd4pWLkZSrAyKkLeLQ.png",
      tweet: `My wrists and hands were starting to hurt severely from typing lengthy memos and Slack follow-ups all day. Tried many speech tools, but Superwhisper is total magic. It automatically cleans out all my pauses, formats structured bullet logs, and lets me write at 150 words per minute.`,
      date: "Jan 12, 2026"
    },
    {
      id: "rauch",
      name: "Guillermo Rauch",
      handle: "@rauchg",
      role: "Founder & CEO, Vercel",
      avatar: "https://framerusercontent.com/images/BD0IjamMdd4pWLkZSrAyKkLeLQ.png",
      tweet: `Speech dictation that runs locally with absolute zero lag is a massive superpower for productivity. The layout, native key registrations, and overall speed are unmatched. Superwhisper sets a pristine standard for developer micro-utilities in 2026.`,
      date: "Feb 28, 2026"
    }
  ];

  const [activeId, setActiveId] = useState("karpathy");
  const selectedReview = reviews.find((r) => r.id === activeId) || reviews[0];

  return (
    <section className="w-full bg-[#030303] py-32 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Mock Paper Tweet Stack (Col span 7) */}
        <div className="md:col-span-7 flex flex-col justify-center items-center relative">
          
          {/* Main stacked cards container with Framer Motion layout */}
          <div className="w-full max-w-lg aspect-[1.4] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl relative p-8 flex flex-col justify-between overflow-hidden">
            
            {/* Real steel paperclip vector floating clip on upper left */}
            <div className="absolute top-4 left-6 z-30 pointer-events-none" title="Priceless Paperclip">
              <svg 
                width="34" 
                height="80" 
                viewBox="0 0 34 80" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
              >
                {/* Silver steel paperclip curve */}
                <path 
                  d="M17 10C11.5 10 7 14.5 7 20V55C7 64.4 14.6 72 24 72C33.4 72 41 64.4 41 55V20C41 12.3 34.7 6 27 6C19.3 6 13 12.3 13 20V55C13 58.9 16.1 62 20 62C23.9 62 27 58.9 27 55V25" 
                  stroke="#bdc3c7" 
                  strokeWidth="3.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M17 10C11.5 10 7 14.5 7 20V55C7 64.4 14.6 72 24 72C33.4 72 41 64.4 41 55V20C41 12.3 34.7 6 27 6C19.3 6 13 12.3 13 20V55C13 58.9 16.1 62 20 62C23.9 62 27 58.9 27 55V25" 
                  stroke="#ecf0f1" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>

            {/* Backdrop angled papers simulating stacks */}
            <div className="absolute inset-0 bg-neutral-800/10 -rotate-2 transform scale-[0.98] rounded-3xl border border-neutral-700/20 translate-x-2 translate-y-2 -z-10" />
            <div className="absolute inset-0 bg-neutral-800/20 rotate-1 transform scale-[0.99] rounded-3xl border border-neutral-700/20 translate-x-1 translate-y-1 -z-10" />

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedReview.id}
                initial={{ opacity: 0, scale: 0.94, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col h-full justify-between"
              >
                
                {/* Review Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5 pl-8 mt-1">
                    {/* High-quality profile render */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800">
                      <img 
                        src={selectedReview.avatar} 
                        alt={selectedReview.name} 
                        className="w-full h-full object-cover grayscale" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-[15px]">{selectedReview.name}</h4>
                      <p className="text-stone-400 text-xs">{selectedReview.handle}</p>
                    </div>
                  </div>
                  <div className="text-zinc-600">
                    <Twitter className="w-5 h-5 fill-current text-sky-400" />
                  </div>
                </div>

                {/* Tweet Body Code */}
                <div className="my-6">
                  <p className="text-[#f5f5f5] text-[15px] leading-relaxed font-sans font-light italic">
                    "{selectedReview.tweet}"
                  </p>
                </div>

                {/* Review Card Footer */}
                <div className="flex items-center justify-between border-t border-neutral-800/80 pt-4 text-xs font-mono text-stone-500">
                  <span>{selectedReview.role}</span>
                  <span>{selectedReview.date}</span>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* Right Side: Active Reviewer List (Col span 5) */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <span className="text-stone-500 font-mono text-xs uppercase tracking-[0.25em] block mb-3">
            User Testimonials
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter text-white mb-8">
            Endless happy users
          </h2>

          <div className="flex flex-col gap-3">
            {reviews.map((reviewer) => {
              const isActive = reviewer.id === activeId;
              return (
                <button
                  key={reviewer.id}
                  onClick={() => setActiveId(reviewer.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer relative flex items-center justify-between group pointer-events-auto ${
                    isActive
                      ? "bg-zinc-800/80 border-zinc-700 shadow-xl scale-[1.01]"
                      : "bg-[#0b0c0f] border-zinc-900/40 hover:border-zinc-800 hover:bg-zinc-900/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Active Indigo Dot indicator inside button */}
                    <div className={`w-2.5 h-2.5 rounded-full transition-transform ${
                      isActive ? "bg-indigo-500 scale-100" : "bg-neutral-800 group-hover:bg-neutral-700"
                    }`} />
                    <div>
                      <h4 className="text-sm font-bold text-white">{reviewer.name}</h4>
                      <p className="text-stone-400 text-xs font-mono truncate max-w-[200px]">{reviewer.role}</p>
                    </div>
                  </div>
                  
                  {/* Subtle chevron or hover-action indicator */}
                  <div className="text-xs text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Post ↗
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
