import { useState, useRef } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  Zap,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  Send,
  Loading as LoaderIcon,
} from "lucide-react";
import styles from "../styles/Home.module.css";

const GOALS = ["Maximize accuracy", "Minimize tokens", "Deterministic", "Creative"];
const TASKS = ["Code", "UI gen", "Debugging", "Writing", "Research", "Email"];
const MODELS = [
  { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
  { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
  { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
  { value: "gemma2-9b-it", label: "Gemma 2 9B" },
  { value: "deepseek-r1-distill-llama-70b", label: "DeepSeek R1 70B" },
];
const OUTPUT_STYLES = [
  { value: "ask", label: "Ask (single-turn)" },
  { value: "instruct", label: "Instruct" },
  { value: "system", label: "System prompt" },
  { value: "chain", label: "Chain of thought" },
];

const LOADING_MESSAGES = [
  "Optimizing your prompt...",
  "Analyzing structure...",
  "Applying best practices...",
  "Polishing output...",
];

const REFINE_OPTIONS = [
  { label: "More concise", instruction: "Make it more concise and shorter" },
  { label: "Add CoT", instruction: "Add chain of thought reasoning steps" },
  { label: "More specific", instruction: "Make it more specific and detailed" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Home() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [outputStyle, setOutputStyle] = useState("ask");
  const [activeGoal, setActiveGoal] = useState("Maximize accuracy");
  const [activeTask, setActiveTask] = useState("Code");
  const [advOpen, setAdvOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const loadingIntervalRef = useRef(null);

  const startLoadingMessages = () => {
    let idx = 0;
    loadingIntervalRef.current = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[idx]);
    }, 1400);
  };

  const stopLoadingMessages = () => {
    clearInterval(loadingIntervalRef.current);
    setLoadingMsg(LOADING_MESSAGES[0]);
  };

  const runOptimize = async (refinement = null) => {
    const promptText = refinement ? result : input.trim();
    if (!promptText) return;
    if (loading) return;

    setLoading(true);
    setError("");
    if (!refinement) setResult("");
    startLoadingMessages();

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          refinement,
          model,
          style: outputStyle,
          goal: activeGoal,
          task: activeTask,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      stopLoadingMessages();
      setLoading(false);
    }
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const showResult = result || error;

  return (
    <>
      <Head>
        <title>PromptUp — Powered by Groq</title>
        <meta name="description" content="AI-powered prompt(Save tokens-Save time -Better results)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.div
        className={styles.page}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header className={styles.header} variants={itemVariants}>
          <h1 className={styles.h1}>PromptUp</h1>
          <p className={styles.subtitle}>Save Tokens-Save Time-Better results</p>
          <div className={styles.badge}>
            <Sparkles size={16} />
            Groq • Llama 3.3 70B
          </div>
        </motion.header>

        {/* Step 1 - Input */}
        <motion.div className={styles.card} variants={itemVariants}>
          <label style={{ display: "block", marginBottom: "12px", fontSize: "0.9rem", fontWeight: "600" }}>
            Your initial prompt or task description
          </label>
          <textarea
            className={styles.textarea}
            rows={5}
            maxLength={500}
            placeholder="type your prompt/task here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className={styles.textareaFooter}>
            <span className={styles.charCount}>{input.length} / 500</span>
            <motion.button
              className={styles.btnOptimize}
              onClick={() => runOptimize()}
              disabled={loading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={18} />
              Optimize
            </motion.button>
          </div>
        </motion.div>

        {/* Advanced toggle */}
        <motion.div className={styles.advRow} variants={itemVariants}>
          <motion.button
            className={`${styles.advToggle} ${advOpen ? styles.open : ""}`}
            onClick={() => setAdvOpen(!advOpen)}
            aria-expanded={advOpen}
            whileHover={{ scale: 1.05 }}
          >
            <ChevronDown size={16} />
            Advanced options
          </motion.button>
          <span className={styles.advHiddenLabel}>—click to expand</span>
        </motion.div>

        {/* Advanced panel */}
        {advOpen && (
          <motion.div
            className={styles.advPanel}
            variants={itemVariants}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className={styles.advGrid}>
              <div className={styles.advField}>
                <label>MODEL</label>
                <select value={model} onChange={(e) => setModel(e.target.value)}>
                  {MODELS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.advField}>
                <label>OUTPUT STYLE</label>
                <select value={outputStyle} onChange={(e) => setOutputStyle(e.target.value)}>
                  {OUTPUT_STYLES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.chipGroupLabel}>OPTIMIZATION GOAL</div>
            <div className={styles.chips}>
              {GOALS.map((g) => (
                <motion.button
                  key={g}
                  className={`${styles.chip} ${activeGoal === g ? styles.chipActive : ""}`}
                  onClick={() => setActiveGoal(g)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {g}
                </motion.button>
              ))}
            </div>

            <div className={styles.chipGroupLabel}>TASK TYPE</div>
            <div className={styles.chips}>
              {TASKS.map((t) => (
                <motion.button
                  key={t}
                  className={`${styles.chip} ${activeTask === t ? styles.chipActive : ""}`}
                  onClick={() => setActiveTask(t)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t}
                </motion.button>
              ))}
            </div>
            <p className={styles.chipsNote}>Select one per section</p>
          </motion.div>
        )}

        {/* Connector */}
        {(loading || showResult) && (
          <motion.div className={styles.connector} variants={itemVariants}>
            ↓
          </motion.div>
        )}

        {/* Step 2 - Loading */}
        {loading && (
          <motion.div className={styles.loadingCard} variants={itemVariants}>
            <motion.div
              className={styles.spinner}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>{loadingMsg}</span>
          </motion.div>
        )}

        {/* Step 3 - Result */}
        {showResult && !loading && (
          <motion.div className={styles.resultCard} variants={itemVariants}>
            <div className={styles.resultHeader}>
              <div className={styles.resultHeaderLeft}>
                <span className={styles.resultNum}>3</span>
                <span className={styles.resultTitle}>OPTIMIZED PROMPT</span>
              </div>
              <motion.button
                className={styles.btnCopy}
                onClick={copyResult}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </motion.button>
            </div>
            {result && <pre className={styles.resultBody}>{result}</pre>}
            {error && <div className={styles.errorText}>⚠ {error}</div>}
            <p className={styles.resultNote}>Full prompt ready to use</p>
          </motion.div>
        )}

        {/* Step 4 - Refine */}
        {result && !loading && (
          <motion.div className={styles.refineRow} variants={itemVariants}>
            <span className={styles.refineLabel}>4 · Refine:</span>
            {REFINE_OPTIONS.map((r) => (
              <motion.button
                key={r.label}
                className={styles.chip}
                onClick={() => runOptimize(r.instruction)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {r.label}
              </motion.button>
            ))}
            <span className={styles.refineNote}>—iterative improvements</span>
          </motion.div>
        )}

        {/* Insight Box */}
        <motion.div className={styles.insightBox} variants={itemVariants}>
          <strong>✨ Pro Tip</strong>
          <p>
            Add specific context, examples, and constraints to your prompts. The more detailed your input,
            the more refined your optimization will be.
          </p>
        </motion.div>
      </motion.div>
    </>
  );
}
