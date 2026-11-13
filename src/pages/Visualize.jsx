import React, { useState, useEffect } from 'react';
import {
  Play, Pause, RotateCcw, ChevronRight, ChevronLeft,
  Cpu, Hash, Key, Lock, Calculator, CheckCircle, XCircle, Info, RefreshCw
} from 'lucide-react';
import { generateRSAKeys, modPowSteps, extGcdSteps, millerRabin, DEMO_KEYS } from '../lib/rsa.js';

export default function Visualize() {
  const [activeTab, setActiveTab] = useState('keygen');

  // ── Tab 1: Key Generation Pipeline ──
  const [keyGenData, setKeyGenData] = useState(() => generateRSAKeys(16));
  const [keyStepIndex, setKeyStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Auto-play for Key Gen
  useEffect(() => {
    let timer = null;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setKeyStepIndex((prev) => {
          if (prev >= keyGenData.steps.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying, keyGenData.steps.length]);

  const handleRegenKeys = () => {
    setIsAutoPlaying(false);
    const newKeys = generateRSAKeys(16);
    setKeyGenData(newKeys);
    setKeyStepIndex(0);
  };

  // ── Tab 2: Modular Exponentiation Trace ──
  const [modBase, setModBase] = useState('65');
  const [modExp, setModExp] = useState('17');
  const [modMod, setModMod] = useState('3233');
  const [modSteps, setModSteps] = useState(() => modPowSteps(65n, 17n, 3233n));
  const [modStepIndex, setModStepIndex] = useState(0);

  const handleComputeModPow = () => {
    try {
      const b = BigInt(modBase || '0');
      const e = BigInt(modExp || '0');
      const m = BigInt(modMod || '1');
      if (m <= 0n) return;
      const steps = modPowSteps(b, e, m);
      setModSteps(steps);
      setModStepIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Tab 3: Extended Euclidean Algorithm ──
  const [gcdA, setGcdA] = useState('17');
  const [gcdB, setGcdB] = useState('3120');
  const [gcdResult, setGcdResult] = useState(() => extGcdSteps(17n, 3120n));

  const handleComputeGcd = () => {
    try {
      const a = BigInt(gcdA || '1');
      const b = BigInt(gcdB || '1');
      const res = extGcdSteps(a, b);
      setGcdResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Tab 4: Miller-Rabin Primality Test ──
  const [mrCandidate, setMrCandidate] = useState('61');
  const [mrResult, setMrResult] = useState(() => {
    const n = 61n;
    return {
      n: 61n,
      isPrime: millerRabin(61n),
      r: 1n,
      d: 30n,
    };
  });

  const handleRunMillerRabin = (val) => {
    const targetStr = val !== undefined ? val : mrCandidate;
    try {
      const n = BigInt(targetStr || '2');
      if (n < 2n) return;
      
      let r = 0n, d = n - 1n;
      while (d > 0n && d % 2n === 0n) {
        r++;
        d /= 2n;
      }
      
      const isP = millerRabin(n);
      setMrCandidate(targetStr);
      setMrResult({ n, isPrime: isP, r, d });
    } catch (err) {
      console.error(err);
    }
  };

  const currentKeyStep = keyGenData.steps[keyStepIndex] || keyGenData.steps[0];
  const currentModStep = modSteps[modStepIndex] || modSteps[0];

  return (
    <div className="page anim-up">
      <div className="page-eyebrow">MODULE 03 · VISUALIZATION LAB</div>
      <h1 className="page-title">Algorithm Visualization Lab</h1>
      <p className="page-desc mb-5">
        Explore the internal mechanics of RSA with step-by-step state visualization, fast modular exponentiation bit traces, Euclidean inverses, and primality verification.
      </p>

      {/* Tabs */}
      <div className="tabs mb-5">
        <button
          type="button"
          className={`tab ${activeTab === 'keygen' ? 'active' : ''}`}
          onClick={() => setActiveTab('keygen')}
        >
          Key Generation Pipeline
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'modpow' ? 'active' : ''}`}
          onClick={() => setActiveTab('modpow')}
        >
          Square-and-Multiply Exponentiation
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'extgcd' ? 'active' : ''}`}
          onClick={() => setActiveTab('extgcd')}
        >
          Extended Euclidean Algorithm
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'miller' ? 'active' : ''}`}
          onClick={() => setActiveTab('miller')}
        >
          Miller-Rabin Primality
        </button>
      </div>

      {/* ─── TAB 1: Key Generation Pipeline ─── */}
      {activeTab === 'keygen' && (
        <div className="anim-in">
          {/* Pipeline bar */}
          <div className="card mb-4">
            <div className="row ac jb mb-3">
              <div className="stat-label">6-Stage Key Derivation Pipeline</div>
              <div className="row ac g-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleRegenKeys}
                >
                  <RefreshCw size={12} /> Regenerate Primes
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${isAutoPlaying ? 'btn-amber' : 'btn-green'}`}
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                >
                  {isAutoPlaying ? <Pause size={12} /> : <Play size={12} />}
                  {isAutoPlaying ? 'Pause Autoplay' : 'Autoplay'}
                </button>
              </div>
            </div>

            <div className="pipeline">
              {keyGenData.steps.map((st, idx) => {
                const isDone = idx < keyStepIndex;
                const isActive = idx === keyStepIndex;
                const nodeClass = isDone ? 'pipe-node-done' : isActive ? 'pipe-node-active' : 'pipe-node-idle';
                const labelClass = isDone ? 'pipe-label-done' : isActive ? 'pipe-label-active' : '';

                return (
                  <React.Fragment key={st.id}>
                    <div
                      className="pipe-step clickable"
                      onClick={() => { setIsAutoPlaying(false); setKeyStepIndex(idx); }}
                    >
                      <div className={`pipe-node ${nodeClass}`}>{idx + 1}</div>
                      <div className={`pipe-label ${labelClass}`}>{st.id}</div>
                    </div>
                    {idx < keyGenData.steps.length - 1 && (
                      <div className={`pipe-line ${idx < keyStepIndex ? 'pipe-line-done' : ''}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Active Step Details */}
          <div className="g3 mb-4">
            {/* Main Stage Card */}
            <div className="card card-green" style={{ gridColumn: 'span 2' }}>
              <div className="row ac jb mb-3">
                <div className="row ac g-2">
                  <div className="step-num step-num-active">{keyStepIndex + 1}</div>
                  <div>
                    <div className="card-title">{currentKeyStep.title}</div>
                    <div className="card-sub">Stage {keyStepIndex + 1} of {keyGenData.steps.length}</div>
                  </div>
                </div>
                <span className="chip chip-green">Active Calculation</span>
              </div>

              <div className="t-2 t-xs mb-3">{currentKeyStep.description}</div>

              <div className="stat-label mb-1">Mathematical Formula & Execution</div>
              <div className="code-block mb-3" style={{ fontSize: 13 }}>
                {currentKeyStep.formula}
              </div>

              {/* Navigation Controls */}
              <div className="row ac jb pt-2" style={{ borderTop: '1px solid var(--border-lt)' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={keyStepIndex === 0}
                  onClick={() => { setIsAutoPlaying(false); setKeyStepIndex(p => Math.max(0, p - 1)); }}
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <div className="t-3 mono t-xs">
                  Step {keyStepIndex + 1} / {keyGenData.steps.length}
                </div>
                <button
                  type="button"
                  className="btn btn-green btn-sm"
                  disabled={keyStepIndex === keyGenData.steps.length - 1}
                  onClick={() => { setIsAutoPlaying(false); setKeyStepIndex(p => Math.min(keyGenData.steps.length - 1, p + 1)); }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Stage Selector Sidebar */}
            <div className="col g-2">
              <div className="stat-label mb-1">All Stages</div>
              {keyGenData.steps.map((s, idx) => (
                <div
                  key={s.id}
                  className={`step-box ${idx === keyStepIndex ? 'active' : idx < keyStepIndex ? 'done' : 'pending'}`}
                  onClick={() => { setIsAutoPlaying(false); setKeyStepIndex(idx); }}
                  style={{ padding: '8px 12px' }}
                >
                  <div className="row ac jb">
                    <div className="row ac g-2">
                      <div className={`step-num ${idx < keyStepIndex ? 'step-num-done' : idx === keyStepIndex ? 'step-num-active' : 'step-num-idle'}`} style={{ width: 18, height: 18, fontSize: 9 }}>
                        {idx + 1}
                      </div>
                      <span className="t-xs w-600 t-1 truncate" style={{ maxWidth: 140 }}>{s.title}</span>
                    </div>
                    {idx === keyStepIndex && <div className="algo-dot" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: Modular Exponentiation Trace ─── */}
      {activeTab === 'modpow' && (
        <div className="anim-in">
          {/* Controls */}
          <div className="card mb-4">
            <div className="row ac jb mb-3">
              <div className="card-title">Square-and-Multiply (Fast Exponentiation) Execution Trace</div>
              <span className="chip chip-amber">O(log exp) vs O(exp)</span>
            </div>
            <div className="g3 mb-3">
              <div className="field">
                <label className="label">Base (m or c)</label>
                <input
                  type="number"
                  className="input"
                  value={modBase}
                  onChange={(e) => setModBase(e.target.value)}
                  placeholder="e.g. 65"
                />
              </div>
              <div className="field">
                <label className="label">Exponent (e or d)</label>
                <input
                  type="number"
                  className="input"
                  value={modExp}
                  onChange={(e) => setModExp(e.target.value)}
                  placeholder="e.g. 17"
                />
              </div>
              <div className="field">
                <label className="label">Modulus (n)</label>
                <input
                  type="number"
                  className="input"
                  value={modMod}
                  onChange={(e) => setModMod(e.target.value)}
                  placeholder="e.g. 3233"
                />
              </div>
            </div>

            <div className="row ac jb">
              <button
                type="button"
                className="btn btn-green"
                onClick={handleComputeModPow}
              >
                <Calculator size={14} /> Calculate Exponentiation Trace
              </button>
              <div className="t-3 t-xs mono">
                Total Steps: {modSteps.length}
              </div>
            </div>
          </div>

          {/* Trace Pipeline */}
          <div className="card card-amber mb-4">
            <div className="row ac jb mb-3">
              <div className="stat-label">Exponent Binary Representation</div>
              <span className="chip chip-muted">
                Binary: {BigInt(modExp || '0').toString(2)}
              </span>
            </div>

            <div className="bit-row mb-4">
              {BigInt(modExp || '0').toString(2).split('').map((bit, idx) => (
                <div
                  key={idx}
                  className={`bit-cell ${bit === '1' ? 'bit-1' : 'bit-0'}`}
                  title={`Bit ${idx}: ${bit}`}
                >
                  {bit}
                </div>
              ))}
            </div>

            {/* Step card */}
            <div className="vbox vbox-amber mb-3" style={{ padding: 14 }}>
              <div className="row ac jb mb-2">
                <span className="chip chip-amber">
                  Step {modStepIndex + 1} of {modSteps.length}: {currentModStep.operation || 'Execution'}
                </span>
                <span className="t-3 mono t-xs">
                  {currentModStep.bit !== null ? `Evaluating bit index ${currentModStep.bit}` : 'State'}
                </span>
              </div>
              <div className="t-1 mono mb-3" style={{ fontSize: 13 }}>
                {currentModStep.desc}
              </div>

              <div className="g2">
                <div className="stat">
                  <div className="stat-label">Current Accumulator (Result)</div>
                  <div className="t-green mono t-lg w-600">{currentModStep.result}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Current Base Factor</div>
                  <div className="t-amber mono t-lg w-600">{currentModStep.base}</div>
                </div>
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="row ac jb">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={modStepIndex === 0}
                onClick={() => setModStepIndex(p => Math.max(0, p - 1))}
              >
                <ChevronLeft size={14} /> Previous Operation
              </button>
              <span className="t-3 mono t-xs">
                {modStepIndex + 1} / {modSteps.length}
              </span>
              <button
                type="button"
                className="btn btn-amber btn-sm"
                disabled={modStepIndex === modSteps.length - 1}
                onClick={() => setModStepIndex(p => Math.min(modSteps.length - 1, p + 1))}
              >
                Next Operation <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: Extended Euclidean Algorithm ─── */}
      {activeTab === 'extgcd' && (
        <div className="anim-in">
          <div className="card mb-4">
            <div className="row ac jb mb-3">
              <div>
                <div className="card-title">Extended Euclidean Algorithm (Bezout Matrix)</div>
                <div className="card-sub">Calculates modular inverse d such that a·d ≡ 1 (mod b)</div>
              </div>
              <span className="chip chip-sky">d = e⁻¹ mod φ(n)</span>
            </div>

            <div className="g2 mb-3">
              <div className="field">
                <label className="label">Public Exponent e (a)</label>
                <input
                  type="number"
                  className="input"
                  value={gcdA}
                  onChange={(e) => setGcdA(e.target.value)}
                  placeholder="e.g. 17"
                />
              </div>
              <div className="field">
                <label className="label">Totient φ(n) (b)</label>
                <input
                  type="number"
                  className="input"
                  value={gcdB}
                  onChange={(e) => setGcdB(e.target.value)}
                  placeholder="e.g. 3120"
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-green"
              onClick={handleComputeGcd}
            >
              <Calculator size={14} /> Run Extended Euclidean Steps
            </button>
          </div>

          {/* Table display */}
          <div className="card card-sky mb-4">
            <div className="stat-label mb-2">Step-by-Step Quotient & Remainder Table</div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Quotient (q)</th>
                    <th>Remainder (r)</th>
                    <th>Coefficient s (for e)</th>
                    <th>Coefficient t (for φ(n))</th>
                  </tr>
                </thead>
                <tbody>
                  {gcdResult.rows.map((row, idx) => (
                    <tr key={idx} style={row.isResult ? { background: 'rgba(34,197,94,.08)' } : {}}>
                      <td>#{idx + 1}</td>
                      <td>{row.q}</td>
                      <td className={row.isResult ? 't-green w-700' : ''}>
                        {row.r} {row.isResult ? ' (GCD)' : ''}
                      </td>
                      <td className={row.isResult ? 't-amber w-700' : ''}>{row.s}</td>
                      <td>{row.t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="info info-green mt-4">
              <CheckCircle size={16} className="shrink-0" />
              <div>
                <strong>Calculation Result:</strong> gcd({gcdA}, {gcdB}) = <strong>{gcdResult.gcd.toString()}</strong>.
                {gcdResult.gcd === 1n ? (
                  <>
                    {' '}Since the GCD is 1, a modular inverse exists! The raw Bezout coefficient is <strong>{gcdResult.x.toString()}</strong>, which translates into modular inverse: <strong>{(((gcdResult.x % BigInt(gcdB)) + BigInt(gcdB)) % BigInt(gcdB)).toString()}</strong>.
                  </>
                ) : (
                  <>
                    {' '}The GCD is not 1; these values are not coprime, so no modular inverse exists!
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: Miller-Rabin Primality Test ─── */}
      {activeTab === 'miller' && (
        <div className="anim-in">
          <div className="card mb-4">
            <div className="row ac jb mb-3">
              <div>
                <div className="card-title">Miller-Rabin Probabilistic Primality Verification</div>
                <div className="card-sub">Fast polynomial-time randomized prime testing for key generation</div>
              </div>
              <span className="chip chip-violet">Rabin (1980)</span>
            </div>

            <div className="field mb-3">
              <label className="label">Candidate Integer to Test</label>
              <div className="row ac g-2">
                <input
                  type="number"
                  className="input"
                  value={mrCandidate}
                  onChange={(e) => setMrCandidate(e.target.value)}
                  placeholder="Enter integer, e.g. 61"
                />
                <button
                  type="button"
                  className="btn btn-green"
                  onClick={() => handleRunMillerRabin()}
                >
                  <Cpu size={14} /> Test Primality
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="row ac g-2 wrap">
              <span className="t-3 t-xs">Presets:</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleRunMillerRabin('61')}
              >
                61 (Prime)
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleRunMillerRabin('91')}
              >
                91 (7 × 13 Composite)
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleRunMillerRabin('561')}
              >
                561 (Carmichael number)
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleRunMillerRabin('65537')}
              >
                65537 (Fermat Prime)
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div className="card card-violet">
            <div className="row ac jb mb-3">
              <div className="card-title">Primality Test Evaluation</div>
              <span className={`chip ${mrResult.isPrime ? 'chip-green' : 'chip-rose'}`}>
                {mrResult.isPrime ? 'PROBABLE PRIME' : 'COMPOSITE'}
              </span>
            </div>

            <div className="g3 mb-3">
              <div className="stat">
                <div className="stat-label">Candidate (n)</div>
                <div className="t-1 mono t-lg w-600">{mrResult.n.toString()}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Decomposition n - 1 = 2^r · d</div>
                <div className="t-violet mono t-lg w-600">
                  2^{mrResult.r.toString()} · {mrResult.d.toString()}
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">Witness Evaluation</div>
                <div className="t-green mono t-lg w-600">
                  {mrResult.isPrime ? 'Passed 12 bases' : 'Witness found'}
                </div>
              </div>
            </div>

            <div className={`info ${mrResult.isPrime ? 'info-green' : 'info-rose'}`}>
              {mrResult.isPrime ? (
                <>
                  <CheckCircle size={16} className="shrink-0" />
                  <div>
                    <strong>Verification Passed:</strong> Candidate <strong>{mrResult.n.toString()}</strong> passed all tested bases. In cryptographic key generation, passing 40 independent rounds reduces false-positive probability below 2⁻⁸⁰.
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={16} className="shrink-0" />
                  <div>
                    <strong>Composite Detected:</strong> Candidate <strong>{mrResult.n.toString()}</strong> is not a prime and cannot be used as an RSA prime factor p or q.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
