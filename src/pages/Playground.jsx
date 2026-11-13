import React, { useState } from 'react';
import {
  Shield, Zap, Hash, Calculator, CheckCircle2, AlertTriangle, ArrowRight, Compass
} from 'lucide-react';
import { generateRSAKeys, modPow, gcd, tryFactor, DEMO_KEYS } from '../lib/rsa.js';

export default function Playground() {
  // ── Exp 1: Prime Size vs Factorization ──
  const [exp1Bits, setExp1Bits] = useState(12);
  const [exp1Results, setExp1Results] = useState([]);
  const [exp1Loading, setExp1Loading] = useState(false);

  const handleRunExp1 = () => {
    setExp1Loading(true);
    setTimeout(() => {
      try {
        const k = generateRSAKeys(Number(exp1Bits));
        const factorResult = tryFactor(k.n);
        const record = {
          bits: exp1Bits,
          n: k.n.toString(),
          p: factorResult ? factorResult.p.toString() : '—',
          q: factorResult ? factorResult.q.toString() : '—',
          factored: !!factorResult,
        };
        setExp1Results(prev => [record, ...prev.slice(0, 4)]);
      } catch (err) {
        console.error(err);
      } finally {
        setExp1Loading(false);
      }
    }, 50);
  };

  // ── Exp 2: Avalanche Effect ──
  const [exp2M, setExp2M] = useState('65');
  const [exp2Rows, setExp2Rows] = useState(null);

  const handleRunExp2 = () => {
    try {
      const baseM = BigInt(exp2M || '0');
      const { e, n } = DEMO_KEYS.small.publicKey;
      const offsets = [0n, 1n, -1n, 10n, 100n];
      const rows = offsets.map((off) => {
        const mVal = baseM + off;
        if (mVal < 0n || mVal >= n) {
          return { offset: off === 0n ? 'Baseline' : off > 0n ? `m + ${off}` : `m - ${-off}`, message: mVal.toString(), ciphertext: 'Out of range' };
        }
        const cVal = modPow(mVal, e, n);
        return {
          offset: off === 0n ? 'Baseline (m)' : off > 0n ? `m + ${off}` : `m - ${-off}`,
          message: mVal.toString(),
          ciphertext: cVal.toString(),
        };
      });
      setExp2Rows(rows);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Exp 3: Coprimality Space ──
  const [exp3Phi, setExp3Phi] = useState('3120');
  const [exp3Max, setExp3Max] = useState('50');
  const [exp3Results, setExp3Results] = useState(null);

  const handleRunExp3 = () => {
    try {
      const phiVal = BigInt(exp3Phi || '1');
      const maxVal = Math.min(100, Math.max(10, Number(exp3Max) || 50));
      const valid = [], invalid = [];
      for (let i = 2; i <= maxVal; i++) {
        const iBig = BigInt(i);
        if (gcd(iBig, phiVal) === 1n) valid.push(i);
        else invalid.push(i);
      }
      setExp3Results({ valid, invalid, total: maxVal - 1 });
    } catch (err) {
      console.error(err);
    }
  };

  // ── Exp 4: Euler's Theorem ──
  const [exp4A, setExp4A] = useState('7');
  const [exp4P, setExp4P] = useState('61');
  const [exp4Q, setExp4Q] = useState('53');
  const [exp4Result, setExp4Result] = useState(null);

  const handleRunExp4 = () => {
    try {
      const a = BigInt(exp4A || '2');
      const p = BigInt(exp4P || '3');
      const q = BigInt(exp4Q || '5');
      const n = p * q;
      const phi = (p - 1n) * (q - 1n);
      const isCoprime = gcd(a, n) === 1n;
      const modResult = isCoprime ? modPow(a, phi, n) : null;
      setExp4Result({
        n: n.toString(), phi: phi.toString(), isCoprime,
        modResult: modResult !== null ? modResult.toString() : 'N/A',
        verified: modResult === 1n,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Intro banner */}
      <div className="card" style={{ borderLeft: '3px solid #D97706', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="card-icon amber"><Compass size={16} /></div>
          <div>
            <div className="card-title">Parameter Experiments</div>
            <div className="card-subtitle">Run controlled experiments to observe how RSA parameters affect security and behaviour</div>
          </div>
        </div>
      </div>

      {/* ── Experiment 1: Prime Bit-Length vs. Factorization ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon amber"><Shield size={16} /></div>
            <div>
              <div className="card-title">Experiment 1 — Prime Bit-Length vs. Factorization Security</div>
              <div className="card-subtitle">Observe how trial division breaks small primes in milliseconds vs. larger primes resisting all attempts</div>
            </div>
          </div>
          <span className="badge badge-amber">Brute-Force</span>
        </div>

        <div className="callout callout-amber" style={{ marginBottom: 16 }}>
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Security Insight:</strong> RSA-2048 uses 1024-bit primes. Trial division against such primes would require more time than the age of the universe even on the world's fastest supercomputers.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <label className="input-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Prime Bit-Length:</label>
          <select
            className="input"
            style={{ width: 240 }}
            value={exp1Bits}
            onChange={(e) => setExp1Bits(Number(e.target.value))}
          >
            <option value={8}>8 bits (Trivial — ~16-bit modulus)</option>
            <option value={12}>12 bits (Fast crack — ~24-bit modulus)</option>
            <option value={16}>16 bits (Demo default — ~32-bit modulus)</option>
            <option value={20}>20 bits (Trial division timeout)</option>
          </select>
          <button
            type="button"
            className={`btn btn-primary ${exp1Loading ? '' : ''}`}
            onClick={handleRunExp1}
            disabled={exp1Loading}
          >
            {exp1Loading ? 'Analyzing...' : 'Generate & Factor Modulus'}
          </button>
        </div>

        {exp1Results.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Prime Bits</th>
                <th>Generated Modulus n</th>
                <th>Factor p</th>
                <th>Factor q</th>
                <th>Security Verdict</th>
              </tr>
            </thead>
            <tbody>
              {exp1Results.map((r, i) => (
                <tr key={i}>
                  <td><strong>{r.bits} bits</strong></td>
                  <td className="mono">{r.n.length > 20 ? r.n.slice(0, 18) + '…' : r.n}</td>
                  <td className="mono" style={{ color: r.factored ? '#DC2626' : '#94A3B8' }}>{r.p}</td>
                  <td className="mono" style={{ color: r.factored ? '#DC2626' : '#94A3B8' }}>{r.q}</td>
                  <td>
                    {r.factored ? (
                      <span className="badge badge-red">COMPROMISED — Factored</span>
                    ) : (
                      <span className="badge badge-green">SECURE — Trial limit reached</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Experiment 2: Avalanche Effect ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon blue"><Zap size={16} /></div>
            <div>
              <div className="card-title">Experiment 2 — Avalanche Effect (Non-Linear Diffusion)</div>
              <div className="card-subtitle">A single-integer offset in the plaintext completely transforms the resulting ciphertext</div>
            </div>
          </div>
          <span className="badge badge-blue">Diffusion</span>
        </div>

        <div className="callout callout-blue" style={{ marginBottom: 16 }}>
          <div>
            <strong>What to observe:</strong> Even changing m by ±1 produces a ciphertext that shares zero obvious relationship with the baseline. This non-linearity prevents statistical frequency analysis.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <label className="input-label" style={{ margin: 0 }}>Base Message m:</label>
          <input
            type="number"
            className="input mono"
            style={{ width: 120 }}
            value={exp2M}
            onChange={(e) => setExp2M(e.target.value)}
            placeholder="e.g. 65"
          />
          <div style={{ fontSize: 12, color: '#64748B' }}>Using keys: e=17, n=3233</div>
          <button type="button" className="btn btn-primary" onClick={handleRunExp2}>
            Compute Offset Ciphertexts
          </button>
        </div>

        {exp2Rows && (
          <table className="table">
            <thead>
              <tr>
                <th>Message Offset</th>
                <th>Plaintext m</th>
                <th>Ciphertext c = m¹⁷ mod 3233</th>
                <th>Observation</th>
              </tr>
            </thead>
            <tbody>
              {exp2Rows.map((r, i) => (
                <tr key={i}>
                  <td><strong>{r.offset}</strong></td>
                  <td className="mono">{r.message}</td>
                  <td className="mono" style={{ color: '#2563EB', fontWeight: 700 }}>{r.ciphertext}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>
                    {i === 0 ? 'Baseline ciphertext' : 'No discernible algebraic pattern — full diffusion'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Experiment 3: Public Exponent Coprimality ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon slate"><Hash size={16} /></div>
            <div>
              <div className="card-title">Experiment 3 — Valid Public Exponent e Coprimality Space</div>
              <div className="card-subtitle">Scan integers to find which values of e are valid (coprime to φ(n)) and which are forbidden</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <div>
            <label className="input-label">Totient φ(n)</label>
            <input
              type="number"
              className="input mono"
              style={{ width: 140 }}
              value={exp3Phi}
              onChange={(e) => setExp3Phi(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label">Max e to scan</label>
            <input
              type="number"
              className="input mono"
              style={{ width: 90 }}
              value={exp3Max}
              onChange={(e) => setExp3Max(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-outline" onClick={handleRunExp3} style={{ marginTop: 20 }}>
            Scan Coprime Values
          </button>
        </div>

        {exp3Results && (
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', marginBottom: 6 }}>
                Valid exponents (gcd(e, φ(n)) = 1) — {exp3Results.valid.length} found:
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {exp3Results.valid.map((v) => (
                  <span
                    key={v}
                    style={{
                      padding: '3px 10px', borderRadius: 6,
                      background: '#ECFDF5', color: '#065F46',
                      fontWeight: 600, fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      border: '1px solid #BBF7D0',
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', marginBottom: 6 }}>
                Invalid exponents (gcd &gt; 1, no modular inverse exists):
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {exp3Results.invalid.slice(0, 30).map((v) => (
                  <span
                    key={v}
                    style={{
                      padding: '2px 8px', borderRadius: 5,
                      background: '#FEF2F2', color: '#991B1B',
                      fontSize: 11.5, fontFamily: 'var(--font-mono)',
                      border: '1px solid #FECACA',
                    }}
                  >
                    {v}
                  </span>
                ))}
                {exp3Results.invalid.length > 30 && (
                  <span style={{ fontSize: 11.5, color: '#94A3B8', alignSelf: 'center' }}>
                    +{exp3Results.invalid.length - 30} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Experiment 4: Euler's Theorem Verification ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon green"><Calculator size={16} /></div>
            <div>
              <div className="card-title">Experiment 4 — Empirical Proof of Euler's Theorem</div>
              <div className="card-subtitle">Verifies that a^φ(n) ≡ 1 (mod n) — the mathematical foundation that makes RSA decryption work</div>
            </div>
          </div>
        </div>

        <div className="callout callout-blue" style={{ marginBottom: 16 }}>
          <div>
            <strong>Why this matters:</strong> RSA only works because Euler's theorem guarantees (m^e)^d = m^(ed) ≡ m (mod n). This experiment lets you verify that guarantee empirically with your own numbers.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <div>
            <label className="input-label">Base a</label>
            <input type="number" className="input mono" style={{ width: 80 }} value={exp4A} onChange={(e) => setExp4A(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Prime p</label>
            <input type="number" className="input mono" style={{ width: 90 }} value={exp4P} onChange={(e) => setExp4P(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Prime q</label>
            <input type="number" className="input mono" style={{ width: 90 }} value={exp4Q} onChange={(e) => setExp4Q(e.target.value)} />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleRunExp4} style={{ marginTop: 20 }}>
            Verify Theorem
          </button>
        </div>

        {exp4Result && (
          <div className="anim-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 14 }}>
              <div className="stat-box">
                <div className="stat-label">Modulus n = p × q</div>
                <div className="stat-value">{exp4Result.n}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Euler Totient φ(n)</div>
                <div className="stat-value">{exp4Result.phi}</div>
              </div>
              <div className="stat-box" style={{ background: exp4Result.verified ? '#F0FDF4' : '#FEF2F2', borderColor: exp4Result.verified ? '#BBF7D0' : '#FECACA' }}>
                <div className="stat-label">a^φ(n) mod n</div>
                <div className="stat-value" style={{ color: exp4Result.verified ? '#059669' : '#DC2626' }}>
                  {exp4Result.modResult}
                </div>
              </div>
            </div>

            {exp4Result.verified ? (
              <div className="callout callout-green">
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Theorem Confirmed:</strong> {exp4A}^{exp4Result.phi} mod {exp4Result.n} = <strong>1</strong>. Because this identity holds, RSA's key design ensures (m^e)^d ≡ m (mod n) — exact plaintext recovery is mathematically guaranteed.
                </div>
              </div>
            ) : (
              <div className="callout callout-red">
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Precondition Failed:</strong> gcd(a, n) must equal 1 for Euler's theorem to hold. The base a and modulus n must be coprime. Try a different value of a.
                </div>
              </div>
            )}

            <div className="formula-line green" style={{ marginTop: 14 }}>
              {exp4A}^{exp4Result.phi} mod {exp4Result.n} = {exp4Result.modResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
