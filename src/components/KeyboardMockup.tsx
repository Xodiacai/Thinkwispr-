import { motion } from "motion/react";

export default function KeyboardMockup() {
  return (
    <section className="w-full bg-[#000] py-24 sm:py-32 px-6 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-pink-500 font-sans text-xs font-semibold uppercase tracking-wider block mb-2 select-none">
            Universal Input
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 font-sans select-none">
            Works anywhere you can type.
          </h2>
          <p className="text-zinc-400 text-xs sm:text-[13px] max-w-xl mx-auto leading-relaxed font-sans select-none">
            Slack, Notion, Cursor, Gmail, or your favorite code editor — thinkwispr runs globally at the system level.
          </p>
        </div>

        {/* High-Quality Image Display without border and fully translucent and modern */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="w-full max-w-5xl overflow-hidden rounded-3xl bg-transparent"
        >
          <img 
            src="https://i.ibb.co/0zHVFLc/Screenshot-20260606-135525-Chrome.jpg" 
            alt="thinkwispr keyboard output integration layout" 
            className="w-full h-auto object-contain select-none shadow-[0_25px_60px_rgba(0,0,0,0.85)] rounded-3xl border border-white/[0.05]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

      </div>
    </section>
  );
}
