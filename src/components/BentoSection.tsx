import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Plus, WifiOff, AudioLines, MessageSquare, Mail, Settings2 } from "lucide-react";
import { CustomWord } from "../types";

export default function BentoSection() {
  // Card 1 state: Offline Wifi simulator
  const [offlineMode, setOfflineMode] = useState(true);

  // Card 2 state: Use your own words
  const [words, setWords] = useState<CustomWord[]>([
    { id: "1", word: "EBITDA" },
    { id: "2", word: "C'est la vie" },
    { id: "3", word: "Øystein" },
  ]);
  const [newWord, setNewWord] = useState("");

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    const item: CustomWord = {
      id: Math.random().toString(),
      word: newWord.trim(),
    };
    setWords([...words, item]);
    setNewWord("");
  };

  const handleRemoveWord = (id: string) => {
    setWords(words.filter((w) => w.id !== id));
  };

  // Card 3 state: Predefined modes toggle
  const [activeMode, setActiveMode] = useState<"voice" | "message">("message");

  return (
    <section className="w-full bg-[#000000] text-white py-28 px-6 border-b border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-12">
          <span className="text-pink-500 font-sans text-xs font-semibold uppercase tracking-wider block mb-2 select-none">
            What's inside
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Powerful features,<br />
            seamlessly integrated.
          </h2>
        </div>

        {/* Bento Grid: Exactly 3 side-by-side columns on medium devices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Works Offline */}
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col justify-between min-h-[460px] hover:border-white/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden group">
            {/* Ambient Background glow */}
            <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 ease-in-out -z-10 ${
              offlineMode 
                ? "from-emerald-950/20 via-transparent to-transparent opacity-80" 
                : "from-blue-950/20 via-transparent to-transparent opacity-80"
            }`} />
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all duration-500 pointer-events-none" />

            {/* Visual Toggle Area */}
            <div 
              className="w-full rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5 shadow-inner bg-cover bg-center h-56 mb-6" 
              style={{ 
                backgroundImage: "linear-gradient(to bottom, rgba(73, 20, 110, 0.15), rgba(9, 1, 14, 0.6)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80')" 
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
              
              {/* Wi-Fi custom toggle */}
              <div className="w-[85%] max-w-[240px] py-3.5 px-5 bg-black/70 backdrop-blur-md rounded-[28px] border border-white/10 flex items-center justify-between shadow-2xl">
                <span className="text-white font-semibold text-base tracking-tight select-none font-sans">Wi-Fi</span>
                <button
                  type="button"
                  onClick={() => setOfflineMode(!offlineMode)}
                  className={`w-12 h-7 rounded-full p-0.5 transition-all duration-300 cursor-pointer relative border flex items-center ${
                    offlineMode ? "bg-green-500 border-green-400/30" : "bg-white/10 border-white/10"
                  }`}
                >
                  <motion.div
                    layout
                    className="w-5 h-5 rounded-full bg-white shadow-md"
                    animate={{ x: offlineMode ? 18 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

            {/* Info Block */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  offlineMode ? "bg-green-500/10 text-green-400" : "bg-white/5 text-stone-450"
                }`}>
                  <WifiOff className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-bold text-white font-sans select-none">Works offline</h3>
              </div>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans select-none">
                thinkwispr works offline, so you can transcribe anytime. No Wi-Fi, no problem.
              </p>
            </div>
          </div>

          {/* Card 2: Use your own words */}
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col justify-between min-h-[460px] hover:border-white/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden group">
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-indigo-950/15 via-transparent to-transparent -z-10 opacity-70" />

            {/* Visual Custom Dictionary Panel */}
            <div className="w-full h-56 mb-6 flex flex-col relative z-20">
              <div className="text-stone-400 font-sans text-xs font-semibold mb-3 select-none">Add a new word</div>
              
              <form onSubmit={handleAddWord} className="flex gap-2 mb-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="Word"
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-white/15 font-sans transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white/10 hover:bg-white/25 text-stone-200 px-3.5 py-2 rounded-xl text-xs font-sans font-medium flex items-center gap-1.5 hover:text-white transition-all border border-white/5"
                >
                  <span>Create</span>
                  <span className="text-stone-500 font-sans text-[10px] hidden sm:inline select-none">⌘ + Enter</span>
                </button>
              </form>

              {/* Custom words list stacked vertically */}
              <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 scrollbar-thin">
                <AnimatePresence>
                  {words.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white/[0.03] border border-white/5 rounded-xl py-2 px-3 text-xs flex items-center justify-between text-stone-200 hover:bg-white/[0.06] transition-all"
                    >
                      <span className="font-sans font-medium">{item.word}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveWord(item.id)}
                        className="text-stone-600 hover:text-red-400 cursor-pointer pointer-events-auto transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Info Block */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Settings2 className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-bold text-white font-sans select-none">Use your own words</h3>
              </div>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans select-none">
                Enter names, abbreviations, and specialized terms once. thinkwispr remembers forever.
              </p>
            </div>
          </div>

          {/* Card 3: Predefined modes */}
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col justify-between min-h-[460px] hover:border-white/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden group">
            {/* Decorative background glow additions */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-pink-950/15 via-transparent to-transparent -z-10 opacity-70" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/15 transition-all duration-500 pointer-events-none" />

            {/* Visual audio/chat elements container */}
            <div className="w-full h-56 rounded-2xl relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#ff3366]/5 via-[#990033]/2 to-black border border-white/5 mb-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-44 bg-gradient-to-tr from-pink-500/10 to-violet-500/10 blur-[40px] pointer-events-none rounded-full" />
              
              {/* Floating glass slider panel - transparent with borders */}
              <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-3 flex gap-4 shadow-2xl relative z-10">
                {/* Voice */}
                <button 
                  type="button"
                  onClick={() => setActiveMode("voice")}
                  className="flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                  style={{ opacity: activeMode === "voice" ? 1 : 0.4 }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${
                    activeMode === "voice" 
                      ? "bg-violet-600 border border-violet-400 shadow-[0_0_15px_rgba(124,58,237,0.4)]" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}>
                    <AudioLines className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium text-stone-300">Voice</span>
                </button>

                {/* Message */}
                <button 
                  type="button"
                  onClick={() => setActiveMode("message")}
                  className="flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                  style={{ opacity: activeMode === "message" ? 1 : 0.4 }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${
                    activeMode === "message" 
                      ? "bg-rose-500 border border-rose-450 shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}>
                    <MessageSquare className="w-5 h-5 fill-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white bg-white/5 px-2 py-0.5 rounded-full border border-white/10">Message</span>
                </button>

                {/* Email - Faded slider placeholder */}
                <div className="flex flex-col items-center gap-1.5 opacity-20 select-none">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium text-stone-300">Email</span>
                </div>
              </div>
            </div>

            {/* Info Block */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-rose-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-bold text-white font-sans select-none">Predefined modes</h3>
              </div>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans select-none">
                Predefined modes optimize tone, structure, and formatting. So your text is always right, right away.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
