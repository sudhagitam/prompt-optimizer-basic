import { useState, useRef } from "react";
import Head from "next/head";
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
        <title>Prompt Optimizer</title>
        <meta name="description" content="AI-powered prompt optimization tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.page}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.h1}>Prompt Studio</h1>
          <p className={styles.subtitle}>User Concept</p>
          <div className={styles.modelBadge}>● Groq · Llama 3.3 70B</div>
        </header>

        {/* Step 1 - Input */}
        <div className={styles.card} style={{ paddingTop: 28 }}>
          <div className={styles.stepNum}>1</div>
          <div className={styles.stepLabel}>single-focused entry</div>
          <textarea
            className={`${styles.textarea} ${styles.ruled}`}
            rows={4}
            maxLength={500}
            placeholder="What do you want the AI to do?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className={styles.textareaFooter}>
            <span className={styles.charCount}>{input.length} / 500</span>
            <button
              className={styles.btnOptimize}
              onClick={() => runOptimize()}
              disabled={loading || !input.trim()}
            >
              <span>↓</span> Optimize
            </button>
          </div>
        </div>

        {/* Advanced toggle */}
        <div className={styles.advRow}>
          <button
            className={`${styles.advToggle} ${advOpen ? styles.open : ""}`}
            onClick={() => setAdvOpen(!advOpen)}
            aria-expanded={advOpen}
          >
            <span className={styles.arrow}>▼</span>
            Advanced options
          </button>
          <span className={styles.advHiddenLabel}>—hidden by default</span>
        </div>

        {/* Advanced panel */}
        {advOpen && (
          <div className={styles.advPanel}>
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
                <button
                  key={g}
                  className={`${styles.chip} ${activeGoal === g ? styles.chipActive : ""}`}
                  onClick={() => setActiveGoal(g)}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className={styles.chipGroupLabel}>TASK TYPE</div>
            <div className={styles.chips}>
              {TASKS.map((t) => (
                <button
                  key={t}
                  className={`${styles.chip} ${activeTask === t ? styles.chipActive : ""}`}
                  onClick={() => setActiveTask(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className={styles.chipsNote}>chips, not dropdowns — faster to scan</p>
          </div>
        )}

        {/* Connector */}
        <div className={styles.connector}>↓</div>

        {/* Step 2 - Loading */}
        {loading && (
          <div className={styles.loadingCard}>
            <div className={styles.spinner} />
            <span>{loadingMsg}</span>
            <div className={styles.stepLabel} style={{ position: "absolute", top: 8, right: 14 }}>
              loading state
            </div>
          </div>
        )}

        {/* Step 3 - Result */}
        {showResult && !loading && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <div className={styles.resultHeaderLeft}>
                <span className={styles.resultNum}>3</span>
                <span className={styles.resultTitle}>OPTIMIZED PROMPT</span>
              </div>
              <button className={styles.btnCopy} onClick={copyResult}>
                {copied ? "✓ Copied!" : "⧉ Copy"}
              </button>
            </div>
            {result && (
              <pre className={styles.resultBody}>{result}</pre>
            )}
            {error && (
              <div className={styles.errorText}>⚠ {error}</div>
            )}
            <p className={styles.resultNote}>monospaced result · full prompt shown</p>
          </div>
        )}

        {/* Step 4 - Refine */}
        {result && !loading && (
          <div className={styles.refineRow}>
            <span className={styles.refineLabel}>4 · Refine:</span>
            {REFINE_OPTIONS.map((r) => (
              <button
                key={r.label}
                className={styles.chip}
                onClick={() => runOptimize(r.instruction)}
              >
                {r.label}
              </button>
            ))}
            <span className={styles.refineNote}>—tap refinements after result</span>
          </div>
        )}

        {/* Insight box */}
        <div className={styles.insightBox}>
          <strong>Key insight: Show ONE field first. Hide everything else.</strong>
          <p>Progressive disclosure → less cognitive load → more conversions.</p>
        </div>
      </div>
    </>
  );
}
