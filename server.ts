import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { WebSocket } from 'ws';

async function startServer() {
  console.log("Initializing server...");
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Health check endpoint for Cloud Run
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', node_env: process.env.NODE_ENV });
  });

  app.post('/api/speech-to-text', express.raw({ type: ['*/*', 'application/octet-stream'], limit: '50mb' }), async (req, res) => {
    try {
      // Expecting 16000 Hz, 16-bit PCM raw audio from the client
      const pcm16Data = req.body;

      if (!pcm16Data || pcm16Data.length === 0) {
        return res.status(400).json({ error: 'No audio data' });
      }

      const API_KEY = process.env.ASSEMBLYAI_API_KEY || "ef4285f3bb4a4202975b5459c5ad163b";
      const urlParams = new URLSearchParams({
        sample_rate: '16000',
        speech_model: 'u3-rt-pro',
        format_turns: 'true',
        end_of_turn_confidence_threshold: '0.4',
        min_end_of_turn_silence_when_confident: '100',
        max_turn_silence: '1000',
        vad_threshold: '0.4',
        language_detection: 'true',
        u3_rt_pro_vad_threshold: '0.5'
      });

      const url = `wss://streaming.assemblyai.com/v3/ws?${urlParams.toString()}`;
      
      const ws = new WebSocket(url, {
        headers: {
          'Authorization': API_KEY
        }
      });

      let finalTranscript = "";
      let hasResponded = false;

      const respondWithError = (errorMsg: string) => {
        if (!hasResponded) {
          hasResponded = true;
          res.status(500).json({ error: errorMsg });
          ws.close();
        }
      };

      ws.on('open', () => {
        // Send the raw PCM chunk by chunk
        const chunkSize = 4096;
        for (let i = 0; i < pcm16Data.length; i += chunkSize) {
          ws.send(pcm16Data.subarray(i, i + chunkSize));
        }
        // Send termination message to end the turn and get the final transcript details
        ws.send(JSON.stringify({ type: "Terminate" }));
      });

      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          
          if (msg.type === "Turn") {
            const transcript = msg.transcript || '';
            // We want to accumulate formatted turns. Sometimes it sends unformatted partials, but format_turns should emit complete formatted chunks
            // if we are looking for the finalized turn:
            if (msg.turn_is_formatted) {
                finalTranscript += transcript + " ";
            } else if (!msg.turn_is_formatted && finalTranscript.length === 0) {
                // Keep the unformatted one just in case we terminate abruptly and it isn't formatted
                finalTranscript = transcript;
            }
          } else if (msg.type === "Termination") {
            if (!hasResponded) {
              hasResponded = true;
              res.json({ text: finalTranscript.trim() });
            }
            ws.close();
          } else if (msg.error) {
            console.error("AssemblyAI Error:", msg.error);
            respondWithError(msg.error);
          }
        } catch (e) {
          console.error("Error parsing message from AssemblyAI:", e);
        }
      });

      ws.on('error', (err) => {
        console.error("WebSocket Error:", err);
        respondWithError("WebSocket connection error to AssemblyAI");
      });

      // Timeout in case AssemblyAI never responds
      setTimeout(() => {
        if (!hasResponded) {
          respondWithError("Timed out waiting for AssemblyAI");
        }
      }, 30000);

    } catch (error) {
      console.error('Speech to text route error:', error);
      if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to transcribe audio' });
      }
    }
  });

  // helper function for simulated fallback when Gemini key is not populated
  function getSimulatedResponse(task: string, prompt: string, tone?: string, customTask?: string) {
    if (task === 'optimizer') {
      return {
        optimized: `### Objective\n${prompt.trim()}\n\n### Context\nGenerated from active dictation overlay, optimized for maximum prompt precision.\n\n### Core Directives\n1. Use clear, bulleted, and structured responses.\n2. Ensure zero fluff and high-density information.\n3. Include a final quick summary of results.`,
        explanation: ["Added clear visual structure & headings", "Enforced zero-fluff directives"]
      };
    } else if (task === 'email') {
      return {
        subject: `Draft: Planning Response - ${prompt.substring(0, 30)}...`,
        draft: `Hi there,\n\nI hope this email finds you well.\n\nRegarding the recent notes: We should align on "${prompt.trim()}". Let's get started as soon as possible.\n\nWarm regards,\nAnubhav`,
        tone: tone || "Professional"
      };
    } else if (task === 'todo_list') {
      return {
        title: "Extracted Action Tasks",
        items: [
          { id: "s1", text: `Review requirements: "${prompt.substring(0, 40)}..."`, completed: false },
          { id: "s2", text: "Create draft project itinerary", completed: false },
          { id: "s3", text: "Send structured follow-up to team", completed: true }
        ]
      };
    } else if (task === 'slack') {
      return {
        draft: `📢 *Update Alert*:\n\nWe need to process the following request as prioritized:\n> ${prompt.trim()}\n\nLet me know if you would like to sync on this today! 🚀`,
        formatting_tips: "Post in the main tech channel and tag @here if action is urgent."
      };
    } else {
      return {
        result: `### Agent Analysis of Custom Work (${customTask || 'Summarize'})\n\nHere is the organized work performed on the provided dictation:\n\n* **Input processed:** "${prompt.trim()}"\n* **Action completed:** Successfully executed *${customTask || 'Summarize'}* on target text with high coherence.\n* **Key recommendation:** Consider structuring this project into short 2-week iterations.`
      };
    }
  }

  app.post('/api/agent', async (req, res) => {
    try {
      const { prompt, task, tone, customTask } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'No prompt text provided' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY is not defined. Using simulated AI response.");
        return res.json({
          simulated: true,
          message: "Please configure GEMINI_API_KEY in Settings > Secrets to enable live Gemini AI. Running on Simulated mode:",
          ...getSimulatedResponse(task, prompt, tone, customTask)
        });
      }

      // Lazy import GoogleGenAI to comply with API instructions
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let systemInstruction = "";
      if (task === 'optimizer') {
        systemInstruction = `You are an expert Prompt Engineer. Polish and optimize the following rough user speech transcription or text draft into a highly clear, professional, and well-structured prompt for advanced LLMs (like ChatGPT, Claude, or Cursor). Standardize the layout with headers like 'Objective', 'Context', and 'Constraints'. Return a valid JSON object matching this schema: { "optimized": "Polished structured prompt here", "explanation": ["Dynamic list of 2-3 specific improvements made"] }`;
      } else if (task === 'email') {
        systemInstruction = `You are an executive assistant and master of office communication. Transform the following rough speech dictation into a polished, complete email. Use the specified tone: "${tone || 'Professional'}". Include a suitable Subject line, Salutation, structured Body paragraphs, and a dynamic Signature banner. Return a valid JSON object matching this schema: { "subject": "Subject line here", "draft": "Complete email body here", "tone": "${tone || 'Professional'}" }`;
      } else if (task === 'todo_list') {
        systemInstruction = `You are an expert organizer and productivity coach. From the following narrated text, extract all actionable items, tasks, checklists, or steps. Organize them logically. Return a valid JSON object matching this schema: { "title": "A summary title of the action list", "items": [ { "id": "1", "text": "Task description here", "completed": false } ] }`;
      } else if (task === 'slack') {
        systemInstruction = `You are a social communications specialist. Revamp the following dictate into a concise, punchy message tailored for Slack, Teams, or Discord. Add appropriate bullet points and occasional natural emphasis (like highlighting key words). Return a valid JSON object with the schema: { "draft": "The polished message draft here", "formatting_tips": "A short advice tip on when to post or whom to tag" }`;
      } else {
        systemInstruction = `You are an intelligent AI Agent co-pilot. Run the following custom instruction on the input text: "${customTask || 'Summarize'}" and produce a comprehensive, structured output. Return a valid JSON object with the schema: { "result": "The finished agent work output markdown text goes here" }`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemInstruction + "\n\nUser input text to process:\n" + prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText.trim());
        return res.json(parsed);
      } catch (jsonErr) {
        console.error("Failed to parse JSON from Gemini response", jsonErr, responseText);
        if (task === 'optimizer') {
          return res.json({ optimized: responseText, explanation: ["Converted by intelligent fallback model"] });
        } else if (task === 'email') {
          return res.json({ subject: "Email Draft", draft: responseText, tone: tone || "Professional" });
        } else if (task === 'todo_list') {
          return res.json({ title: "To-Do List", items: [{ id: "1", text: responseText, completed: false }] });
        } else if (task === 'slack') {
          return res.json({ draft: responseText, formatting_tips: "Post in relevant team channels" });
        } else {
          return res.json({ result: responseText });
        }
      }

    } catch (err: any) {
      console.error("Agent execution error:", err);
      const errStr = String(err.message || err.stack || err || '');
      const isQuota = err.status === 429 || errStr.includes('429') || errStr.toLowerCase().includes('quota') || errStr.includes('RESOURCE_EXHAUSTED');
      
      console.warn("Gemini API error intercepted. Falling back to simulated response to protect user experience.");
      return res.json({
        simulated: true,
        isQuotaExceeded: isQuota,
        message: isQuota 
          ? "You've temporary exceeded your raw Gemini API free-tier quota (5 requests/minute). To keep your workflow entirely uninterrupted, we're serving this agent request in offline simulator mode!"
          : `AI Service encountered an issue: ${err.message || "Failed to reach model servers"}. Switched to intelligent offline simulator mode!`,
        ...getSimulatedResponse(task, prompt, tone, customTask)
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    console.log(`Serving static files from: ${distPath}`);
    
    if (!fs.existsSync(distPath)) {
      console.error(`CRITICAL ERROR: dist directory not found at ${distPath}`);
    } else {
      const indexPath = path.join(distPath, 'index.html');
      if (!fs.existsSync(indexPath)) {
        console.error(`CRITICAL ERROR: index.html not found at ${indexPath}`);
      }
    }

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`Error sending index.html: ${err}`);
          if (!res.headersSent) {
            res.status(500).send("Application shell not found. Please try again later.");
          }
        }
      });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV})`);
  });
}

startServer().catch(err => {
  console.error("Critical error during server startup:", err);
  process.exit(1);
});
