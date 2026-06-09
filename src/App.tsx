import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { 
  AudioLines, Sparkles, Command, Mic, Square, Mail, ListTodo, 
  MessageSquare, Copy, Check, ChevronRight, Wand2, RefreshCw, Layers,
  ChevronDown, Sun, Moon, Cloud, Globe, Play, Heart, Star, Compass
} from "lucide-react";

import { Card, CardContent } from "./components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./components/ui/accordion";
import { Badge } from "./components/ui/badge";
import { Switch } from "./components/ui/switch";
import { Input } from "./components/ui/input";

// Import custom modular components
import BentoSection from "./components/BentoSection";
import KeyboardMockup from "./components/KeyboardMockup";
import TestimonialSection from "./components/TestimonialSection";

// Apple SVG icon
const AppleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.152 6.896c-.022-2.313 1.905-3.415 1.986-3.468-1.074-1.576-2.748-1.782-3.344-1.815-1.425-.143-2.782.842-3.513.842-.731 0-1.841-.81-2.992-.788-1.517.022-2.915.885-3.69 2.235-1.562 2.709-.395 6.721 1.134 8.92 .743 1.074 1.62 2.279 2.782 2.235 1.118-.044 1.547-.723 2.894-.723 1.347 0 1.733.723 2.915.701 1.205-.022 1.951-1.096 2.682-2.148.843-1.233 1.192-2.427 1.214-2.493-.028-.011-2.336-.893-2.358-3.504L12.152 6.896zm-1.884-5.32c.621-.75 1.042-1.8 1.042-2.84.004-.15-.015-.298-.051-.436-.921.036-2.072.612-2.716 1.385-.516.611-.97 1.688-.867 2.721.157.012.316.02.476.015.823-.005 1.83-.497 2.45-1.246"/>
  </svg>
);

// Windows SVG icon
const WindowsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.101zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95V12.45z" />
  </svg>
);

const VoiceVisualizer = () => {
  return (
    <div className="flex items-center gap-1 h-6">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-red-500 rounded-full"
          animate={{
            height: [8, 24, 12, 20, 8],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.6 + i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Reusable animation components
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function App() {
  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Home Page Interaction States
  const [playgroundText, setPlaygroundText] = useState(
    "Hey Louis, any update on the website structure? Just wanted to make sure we're on track for launch next week."
  );
  const [playgroundTone, setPlaygroundTone] = useState<"Casual" | "Formal" | "Legal" | "Chat" >("Casual");
  const [playgroundResult, setPlaygroundResult] = useState("hey louis. got any updates on the website layout? just wanted to make sure we are on track for launching next week! lmk!");
  const [isLoadingPlayground, setIsLoadingPlayground] = useState(false);

  // Custom Settings Interactive Panel: Active LLM Selection
  const [activeLLM, setActiveLLM] = useState<"gpt5" | "claude" | "llama" | "grok" | "gemini">("gemini");

  const llmModels = {
    gemini: {
      name: "Gemini 3.5 Flash",
      developer: "Google",
      latency: "140ms",
      accuracy: "High",
      purpose: "Ultra responsive live formatting",
      badge: "Fastest Response"
    },
    gpt5: {
      name: "GPT-5 Intelligence",
      developer: "OpenAI",
      latency: "520ms",
      accuracy: "Stellar",
      purpose: "Deep logical structures and charts",
      badge: "Deep Thinker"
    },
    claude: {
      name: "Claude Haiku 4.5",
      developer: "Anthropic",
      latency: "310ms",
      accuracy: "98.7%",
      purpose: "Natural human-like coding instructions",
      badge: "Master Writer"
    },
    llama: {
      name: "Llama 4 Ultra",
      developer: "Meta",
      latency: "280ms",
      accuracy: "96.4%",
      purpose: "Local offline desktop rendering",
      badge: "100% Offline Compatible"
    },
    grok: {
      name: "Grok 4.1 Realtime",
      developer: "xAI",
      latency: "340ms",
      accuracy: "Realtime grounding",
      purpose: "Live web searching and summaries",
      badge: "Grounding Guard"
    }
  };

  // Weather/Status widget interactive states
  const [isCloudy, setIsCloudy] = useState(true);
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const h = String(date.getUTCHours()).padStart(2, "0");
      const m = String(date.getUTCMinutes()).padStart(2, "0");
      setUtcTime(`${h}:${m} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Playgound transformation rule simulator mapping
  useEffect(() => {
    const simulateTransition = async () => {
      setIsLoadingPlayground(true);
      // Slight delay for premium feel
      await new Promise((r) => setTimeout(r, 450));
      
      const cleanInput = playgroundText.trim();
      if (!cleanInput) {
        setPlaygroundResult("");
        setIsLoadingPlayground(false);
        return;
      }

      switch (playgroundTone) {
        case "Casual":
          setPlaygroundResult(
            `Hey louis! Just checking in on the website format structure. We still looking solid to ship it next week? Let me know, thanks!`
          );
          break;
        case "Formal":
          setPlaygroundResult(
            `Dear Louis, I trust this email finds you well. I am writing to formally request a status update concerning the core architectural website structure. We must ensure project alignment in preparation for our prioritized release scheduled for the following week.`
          );
          break;
        case "Legal":
          setPlaygroundResult(
            `Notice: Relative to our technical development agreement, status reporting is hereby requested concerning the visual frontend layouts. Party of the second part shall verify if the target system complies with the launch calendar set for the upcoming epoch.`
          );
          break;
        case "Chat":
          setPlaygroundResult(
            `updates on site layout? want to confirm we are on track for next wk. lmk, thx!`
          );
          break;
      }
      setIsLoadingPlayground(false);
    };
    simulateTransition();
  }, [playgroundText, playgroundTone]);

  // Audio process handler API connections
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      setPlaygroundText("");
      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Microphone grab failure:", e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const processAudio = async (audioBlob: Blob) => {
     setIsFormatting(true);
     try {
       const arrayBuffer = await audioBlob.arrayBuffer();
       const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
       const audioBufferDecode = await audioContext.decodeAudioData(arrayBuffer);
       const float32Data = audioBufferDecode.getChannelData(0);

       const int16Data = new Int16Array(float32Data.length);
       for (let i = 0; i < float32Data.length; i++) {
         let s = Math.max(-1, Math.min(1, float32Data[i]));
         int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
       }

       const res = await fetch("/api/speech-to-text", {
         method: "POST",
         headers: { "Content-Type": "application/octet-stream" },
         body: int16Data.buffer
       });
       
       const data = await res.json();
       
       const finalTranscribedText = data.text || data.transcription || (typeof data === 'string' ? data : "Could you speak a bit louder?");
       
       setPlaygroundText(finalTranscribedText);
     } catch (e) {
       console.error("Transcription pipeline failure", e);
     } finally {
       setIsFormatting(false);
     }
  };

  // ================= VIEW STATE: MAIN BRAND HOMEPAGE (showDemo === false) =================
  return (
    <div className="min-h-screen bg-black text-[#f5f5f5] font-sans selection:bg-neutral-800 flex flex-col items-center w-full overflow-x-hidden">
      
      {/* Sticky Pill Navigation */}
      <motion.div 
        initial={{ y: -60, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="fixed top-6 left-1/2 z-50 w-[95%] max-w-[650px]"
      >
        <div className="bg-black/30 backdrop-blur-md rounded-full border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center justify-between pr-2 pl-6 py-2 gap-4 w-full">
          <div className="flex items-center gap-2 font-extrabold text-lg tracking-tight pt-0.5 shrink-0 text-white">
             <AudioLines className="w-5 h-5 text-white stroke-[2]" />
             <span>thinkwsipr</span>
          </div>

          {/* Minimalist Navigation Anchors */}
          <div className="hidden sm:flex items-center gap-6 text-xs text-stone-300 font-medium font-sans">
            <span className="hover:text-white transition-colors cursor-pointer select-none">Features</span>
            <span className="hover:text-white transition-colors cursor-pointer select-none">Integrations</span>
            <span className="hover:text-white transition-colors cursor-pointer select-none">FAQ</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="bg-white hover:bg-zinc-150 text-black text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer pointer-events-auto">
              <AppleIcon className="w-3.5 h-3.5 mb-0.5" />
              Get For Mac
            </button>
          </div>
        </div>
      </motion.div>

      {/* Hero Section with Backdrop light */}
      <section className="w-full relative flex flex-col items-center justify-center pt-52 pb-44 px-4 overflow-hidden min-h-screen bg-black border-b border-neutral-900">
        
        {/* FIRST PAGE IMMERSIVE FULL-BLEED BACKGROUND GRAPHIC (Line-face artwork & high-fidelity workspace layout) */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none opacity-100 transition-opacity duration-700" 
          style={{ 
            backgroundImage: `url('https://i.ibb.co/bjxHfdsc/1780741141830.png')`,
            backgroundRepeat: 'no-repeat'
          }}
        />

        <div className="relative z-10 text-center flex flex-col items-center w-full max-w-4xl mx-auto">
          {/* Slogan */}
          <FadeIn delay={0.25}>
            <h1 className="text-5xl sm:text-7xl md:text-[84px] tracking-tight text-white font-extrabold leading-[1.05] mb-8 font-sans">
              Just speak.<br />
              <span className="text-white">Write faster.</span>
            </h1>
          </FadeIn>

          {/* Download buttons columns */}
          <FadeIn delay={0.35}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                className="bg-white hover:bg-neutral-100 text-black font-extrabold rounded-full px-8 py-4 flex items-center justify-center gap-2.5 transition-all text-sm shadow-xl hover:scale-105 cursor-pointer pointer-events-auto"
                onClick={() => {
                  alert("thinkwsipr client package downloaded for macOS. Press standard triple-spacebar globally to dictate.");
                }}
              >
                <AppleIcon className="w-4 h-4 mb-0.5" />
                Download for Mac
              </button>
              
              <button 
                className="bg-black hover:bg-neutral-900 text-white font-extrabold rounded-full px-8 py-4 flex items-center justify-center gap-2.5 transition-all text-sm border border-neutral-800 hover:scale-105 cursor-pointer pointer-events-auto"
                onClick={() => {
                  alert("thinkwsipr download initiated for Windows Core Operating Systems.");
                }}
              >
                <WindowsIcon className="w-4 h-4 mb-0.5" />
                Download for Windows
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.45}>
            <span className="text-slate-400 text-xs mt-6 block cursor-pointer hover:text-white transition-colors pointer-events-auto">
              Also available for iPhone &gt;
            </span>
          </FadeIn>

          <FadeIn delay={0.55}>
            <p className="text-[15px] sm:text-[17px] md:text-[18px] text-slate-300 font-medium max-w-xl mx-auto mt-12 text-center leading-relaxed">
              Turn your voice into polished text.<br />
              Works in Slack, Gmail and any other site or app.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ADAPTABILITY SECTION: Core Dual-Pane live playground */}
      <section className="w-full bg-[#030303] py-24 md:py-32 px-6 border-b border-neutral-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          
          {/* Left: Chat Image (smaller) */}
          <div className="md:col-span-5 order-2 md:order-1 flex justify-center w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="w-full max-w-[380px] sm:max-w-[420px] overflow-hidden rounded-3xl bg-transparent"
            >
              <img 
                src="https://i.ibb.co/hxLdK14X/Screenshot-20260606-135356-Chrome.jpg" 
                alt="Adaptability communication tone switcher overview" 
                className="w-full h-auto object-contain select-none shadow-[0_20px_55px_rgba(0,0,0,0.65)] rounded-3xl border border-white/[0.05]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Right: Adaptability info */}
          <div className="md:col-span-7 order-1 md:order-2 flex flex-col justify-center">
            <span className="text-pink-500 font-mono text-xs uppercase tracking-[0.2em] block mb-4 select-none">
              Playground interface demo
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white mb-6 leading-[1.1] font-sans select-none">
              Adaptability: Communication isn't one-size-fits-all
            </h2>
            <p className="text-[#a1a1a1] text-sm md:text-base max-w-xl leading-relaxed font-sans select-none">
              Double tap space, speak, and format tone automatically to match any environment without tedious keyboard touch edits. Whether it's formal corporate reports or casual message streams, Thinkwispr molds your voice to the local vibe effortlessly.
            </p>
          </div>

        </div>
      </section>

      {/* Bento Grid Features */}
      <BentoSection />

      {/* CUSTOM MODE: BUILD IT YOURSELF */}
      <section className="w-full bg-[#030303] py-32 px-6 border-t border-b border-neutral-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                  {/* Left: Interactive mockup settings panel (Col span 6) */}
          <div className="md:col-span-6 flex flex-col items-center w-full">
            
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-transparent border-0">
              <img 
                src="https://i.ibb.co/5gvJfXGG/Screenshot-20260606-135507-Chrome.jpg" 
                alt="Model selection configurations" 
                className="w-full h-auto object-contain select-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>

          {/* Right: Pitch & info (Col span 6) */}
          <div className="md:col-span-6 flex flex-col justify-center">
            <span className="text-stone-500 font-mono text-xs uppercase tracking-[0.25em] block mb-3">
              Custom Mode
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white mb-6">
              Build it yourself.
            </h2>
            <p className="text-stone-400 text-sm md:text-base mb-8 leading-relaxed">
              Custom Mode lets you define how thinkwsipr thinks, writes, and formats. Directly match specific client workflows, insert APIs, and automate triggers.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
                  <Command className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Beyond tone – precision control</h4>
                  <p className="text-stone-400 text-xs sm:text-sm">Set strict formatting parameters, specialized vocabularies and specific bullet outlines once, replicate always.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-1.5 rounded-full bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Pick the right model for the job</h4>
                  <p className="text-stone-400 text-xs sm:text-sm">Quickly transition between GPT, Gemini, and local Llama to perfectly balance latency, logic accuracy, and bandwidth concerns.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Physical Mechanical Keyboard Mockup */}
      <KeyboardMockup />

      {/* Interactive Paper Stack Testimonials */}
      <TestimonialSection />

      {/* FAQ SECTION */}
      <section className="w-full bg-[#030303] py-32 px-6 border-t border-neutral-900 border-[1px]">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-stone-500 font-mono text-xs uppercase tracking-[0.25em] block mb-3">
              FAQ
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-neutral-800 py-2">
              <AccordionTrigger className="text-white hover:text-indigo-300 hover:no-underline font-semibold text-sm sm:text-base">
                How does the dictation transcription interface operate?
              </AccordionTrigger>
              <AccordionContent className="text-stone-400 text-xs sm:text-sm leading-relaxed pt-2">
                Thinkwispr leverages AssemblyAI and Gemini flash models to transcribe and formatted stream-recordings. You can double tap key hotkeys globally to run transcription without clicking desktop panels.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-neutral-800 py-2">
              <AccordionTrigger className="text-white hover:text-indigo-300 hover:no-underline font-semibold text-sm sm:text-base">
                Will it work locally on Intel or Apple Silicon M-series CPUs?
              </AccordionTrigger>
              <AccordionContent className="text-stone-400 text-xs sm:text-sm leading-relaxed pt-2">
                Absolutely! Our client application is fully optimized for macOS Sonoma/Sequoia running both raw Intel processors and highly complex Apple Silicon M1/M2/M3/M4 chips utilizing core neural engines offline.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-neutral-800 py-2">
              <AccordionTrigger className="text-white hover:text-indigo-300 hover:no-underline font-semibold text-sm sm:text-base">
                Is my voice data safe and kept private?
              </AccordionTrigger>
              <AccordionContent className="text-stone-400 text-xs sm:text-sm leading-relaxed pt-2">
                Yes. Since Thinkwispr specializes in local model support, forced offline cores ensure zero acoustic transcripts leave your device. Your passwords, secrets, and private business outlines remain strictly local.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </div>
      </section>

      {/* Modern Black Footer Section */}
      <footer className="w-full bg-black text-white pt-24 pb-12 px-6 md:px-12 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 mb-20">
          
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5 font-extrabold text-2xl tracking-tight mb-4 text-white">
              <AudioLines className="w-6 h-6 text-white stroke-[2]" />
              <span>thinkwsipr</span>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed mb-6">
              Crafted with absolute dedication. Safe, offline-compatible AI dictation designed to let you dictate anything, anywhere, 10x faster.
            </p>
            <span className="text-xs text-zinc-600 block">Created by Anubhav sapkota and Daksh.</span>
          </div>

          <div>
             <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1c7483] mb-4">PRODUCT</h4>
             <ul className="space-y-2.5 text-xs text-zinc-500">
               <li><span className="hover:text-white transition-colors cursor-pointer">Mac client</span></li>
               <li><span className="hover:text-white transition-colors cursor-pointer">Windows client</span></li>
               <li><span className="hover:text-white transition-colors cursor-pointer">Enterprise API</span></li>
               <li><span className="hover:text-white transition-colors cursor-pointer">Local models</span></li>
             </ul>
          </div>

          <div>
             <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 mb-4">RESOURCES</h4>
             <ul className="space-y-2.5 text-xs text-zinc-500">
               <li><span className="hover:text-white transition-colors cursor-pointer">Changelog</span></li>
               <li><span className="hover:text-white transition-colors cursor-pointer">Documentation</span></li>
               <li><span className="hover:text-white transition-colors cursor-pointer font-bold flex items-center gap-1.5 text-amber-500">Careers <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" /></span></li>
               <li><span className="hover:text-white transition-colors cursor-pointer">Support channels</span></li>
             </ul>
          </div>

          <div>
             <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400 mb-4">POLICIES</h4>
             <ul className="space-y-2.5 text-xs text-zinc-500">
               <li><span className="hover:text-white transition-colors cursor-pointer">Terms & Agreement</span></li>
               <li><span className="hover:text-white transition-colors cursor-pointer">Privacy metrics</span></li>
               <li><span className="hover:text-white transition-colors cursor-pointer">Refund outline</span></li>
               <li><span className="hover:text-white transition-colors cursor-pointer">Data security</span></li>
             </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto border-t border-neutral-800/60 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600 gap-4">
          <p>© 2026 thinwsipr. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">X Twitter</span>
            <span className="hover:text-white transition-colors cursor-pointer">Discord Community</span>
            <span className="hover:text-white transition-colors cursor-pointer">GitHub Repository</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
