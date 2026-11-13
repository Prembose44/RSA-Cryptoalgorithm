import React, { useState } from 'react';
import {
  Calculator, ChevronLeft, ChevronRight, RotateCcw,
  Cpu, CheckCircle2, XCircle, FastForward, Play, Square
} from 'lucide-react';
import { modPowSteps, extGcdSteps, millerRabin, crtDecrypt } from '../lib/rsa.js';

export default function Workbench() {
  const [activeTab, setActiveTab] = useState('modpow');

  // ── 1. Square-and-Multiply ──
  const [baseInput, setBaseInput] = useState('65');
  const [expInput, setExpInput]   = useState('17');
  const [modInput, setModInput]   = useState('3233');
  const [steps, setSteps]         = useState(() => modPowSteps(65n, 17n, 3233n));
  const [stepIdx, setStepIdx]     = useState(0);
  const [playing, setPlaying]     = useState(false);
  const playRef = React.useRef(null);

  const computeSteps = () => {
    try {
      const res = modPowSteps(BigInt(baseInput || '0'), BigInt(expInput || '0'), BigInt(modInput || '1'));
      setSteps(res); setStepIdx(0); setPlaying(false);
      if (playRef.current) clearInterval(playRef.current);
    } catch (e) { console.error(e); }
  };

  const togglePlay = () => {
    if (playing) {
      clearInterval(playRef.current); setPlaying(false);
    } else {
      setPlaying(true);
      playRef.current = setInterval(() => {
        setStepIdx(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(playRef.current); setPlaying(false); return prev;
          }
          return prev + 1;
        });
      }, 650);
    }
  };

  React.useEffect(() => () => clearInterval(playRef.current), []);

  const curStep = steps[stepIdx] || steps[0];
  let expBits = [];
  try { expBits = BigInt(expInput || '0').toString(2).split(''); } catch {}

  // ── 2. Extended GCD ──
  const [aInput, setAInput] = useState('17');
  const [bInput, setBInput] = useState('3120');
  const [gcdData, setGcdData] = useState(() => extGcdSteps(17n, 3120n));

  const computeGcd = () => {
    try { setGcdData(extGcdSteps(BigInt(aInput || '1'), BigInt(bInput || '1'))); }
    catch (e) { console.error(e); }
  };

  // ── 3. CRT ──
  const [crtP, setCrtP] = useState('61');
  const [crtQ, setCrtQ] = useState('53');
  const [crtD, setCrtD] = useState('2753');
  const [crtC, setCrtC] = useState('2790');
  const [crtRes, setCrtRes] = useState(() => crtDecrypt(2790n, 61n, 53n, 2753n));

  const computeCRT = () => {
    try { setCrtRes(crtDecrypt(BigInt(crtC), BigInt(crtP), BigInt(crtQ), BigInt(crtD))); }
    catch (e) { console.error(e); }
  };

  // ── 4. Miller-Rabin ──
  const WITNESSES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  const [mrVal, setMrVal]     = useState('61');
  const [mrResult, setMrResult] = useState({ n: 61n, isPrime: true });

  const testMR = (val) => {
    try {
      const n = BigInt(val || '2');
      setMrVal(String(val)); setMrResult({ n, isPrime: millerRabin(n) });
    } catch {}
  };

  const TABS = [
    { id: 'modpow',  label: '1. Square-and-Multiply' },
    { id: 'extgcd',  label: '2. Extended Euclidean'   },
    { id: 'crt',     label: '3. CRT Decryption'       },
    { id: 'miller',  label: '4. Miller-Rabin'          },
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── 1. Square-and-Multiply ── */}
      {activeTab === 'modpow' && (
        <div className="card anim-in">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon blue"><Calculator size={16} /></div>
              <div>
                <div className="card-title">Square-and-Multiply (Binary Exponentiation) Stepper</div>
                <div className="card-subtitle">Computes base^exp mod n in O(log exp) steps — the same algorithm RSA uses for encryption and decryption</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'flex-end' }}>
            {[['Base (m)', baseInput, setBaseInput, 90], ['Exponent (e)', expInput, setExpInput, 90], ['Modulus (n)', modInput, setModInput, 110]].map(([lbl, val, set, w]) => (
              <div key={lbl}>
                <label className="input-label">{lbl}</label>
                <input type="number" className="input mono" style={{ width: w }} value={val}
                  onChange={e => set(e.target.value)} />
              </div>
            ))}
            <button className="btn btn-primary" onClick={computeSteps}>Trace Steps</button>
          </div>

          {/* Binary bit strip */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 7 }}>
              Exponent <strong>{expInput}</strong> in binary = <code style={{ fontFamily: 'var(--font-mono)', background: '#F1F5F9', padding: '1px 6px', borderRadius: 4 }}>{expBits.join('')}</code>
              &nbsp;— each bit drives a "square" or "square then multiply" operation:
            </div>
            <div className="bit-strip">
              {expBits.map((bit, i) => {
                const bitPos = expBits.length - 1 - i;
                const isCur = curStep.bit === bitPos;
                return (
                  <div key={i} className={`bit-box ${bit === '1' ? 'one' : 'zero'}${isCur ? ' active' : ''}`}>
                    {bit}
                  </div>
                );
              })}
            </div>
            {curStep.bit !== null && curStep.bit !== undefined && (
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 6 }}>
                Processing bit position {curStep.bit} from the right
              </div>
            )}
          </div>

          {/* Step display */}
          <div style={{ background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', padding: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="badge badge-blue">Step {stepIdx + 1} of {steps.length}</span>
              <span style={{ fontSize: 11.5, color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                {curStep.operation || 'init'}
              </span>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A', lineHeight: 1.6, marginBottom: 14 }}>
              {curStep.desc}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="stat-box" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
                <div className="stat-label">Accumulator (result)</div>
                <div className="stat-value" style={{ color: '#2563EB' }}>{curStep.result}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Current base factor</div>
                <div className="stat-value">{curStep.base}</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-outline btn-sm" disabled={stepIdx === 0}
              onClick={() => setStepIdx(p => Math.max(0, p - 1))}>
              <ChevronLeft size={13} /> Prev
            </button>
            <button className={`btn btn-sm ${playing ? 'btn-danger' : 'btn-primary'}`} onClick={togglePlay}>
              {playing ? <><Square size={12} /> Stop</> : <><Play size={12} /> Auto-Play</>}
            </button>
            <button className="btn btn-outline btn-sm" disabled={stepIdx === steps.length - 1}
              onClick={() => setStepIdx(p => Math.min(steps.length - 1, p + 1))}>
              Next <ChevronRight size={13} />
            </button>
            <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 4 }}>{stepIdx + 1} / {steps.length}</span>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}
              onClick={() => { setStepIdx(0); setPlaying(false); clearInterval(playRef.current); }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>
      )}

      {/* ── 2. Extended GCD ── */}
      {activeTab === 'extgcd' && (
        <div className="card anim-in">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon blue"><Calculator size={16} /></div>
              <div>
                <div className="card-title">Extended Euclidean Algorithm — Bezout's Identity Table</div>
                <div className="card-subtitle">Finds the modular inverse d such that e · d ≡ 1 (mod φ(n)) — how the private key is derived</div>
              </div>
            </div>
          </div>

          <div className="callout callout-blue" style={{ marginBottom: 16 }}>
            <div>
              Each row divides the previous remainder. The final row (remainder = 0) gives us the GCD.
              The <strong>s column</strong> tracks the coefficient for <em>e</em> — when GCD = 1,
              that s value (taken mod φ(n)) is your private key <strong>d</strong>.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'flex-end' }}>
            <div>
              <label className="input-label">Public Exponent e</label>
              <input type="number" className="input mono" style={{ width: 120 }} value={aInput}
                onChange={e => setAInput(e.target.value)} />
            </div>
            <div>
              <label className="input-label">Euler's Totient φ(n)</label>
              <input type="number" className="input mono" style={{ width: 160 }} value={bInput}
                onChange={e => setBInput(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={computeGcd}>Find Inverse</button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Step</th><th>Quotient q</th><th>Remainder r</th>
                <th>Bezout s (for e)</th><th>Bezout t (for φ)</th>
              </tr>
            </thead>
            <tbody>
              {gcdData.rows.map((row, i) => (
                <tr key={i} style={row.isResult ? { background: '#F0FDF4' } : {}}>
                  <td><strong>#{i + 1}</strong></td>
                  <td className="mono">{row.q}</td>
                  <td className="mono" style={row.isResult ? { color: '#059669', fontWeight: 700 } : {}}>
                    {row.r}{row.isResult ? ' (GCD)' : ''}
                  </td>
                  <td className="mono" style={row.isResult ? { color: '#059669', fontWeight: 700 } : {}}>{row.s}</td>
                  <td className="mono">{row.t}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="callout callout-green" style={{ marginTop: 14 }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <div>
              <strong>Result:</strong> gcd({aInput}, {bInput}) = <strong>{gcdData.gcd.toString()}</strong>.
              The modular inverse (private key d) = <strong>
                {(((gcdData.x % BigInt(bInput || '1')) + BigInt(bInput || '1')) % BigInt(bInput || '1')).toString()}
              </strong>.
              Verify: e × d mod φ(n) = 1.
            </div>
          </div>
        </div>
      )}

      {/* ── 3. CRT ── */}
      {activeTab === 'crt' && (
        <div className="card anim-in">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon green"><FastForward size={16} /></div>
              <div>
                <div className="card-title">Chinese Remainder Theorem (CRT) RSA Decryption</div>
                <div className="card-subtitle">Industry optimization: splits decryption into two smaller exponentiations — approximately 4× faster than standard c^d mod n</div>
              </div>
            </div>
            <span className="badge badge-green">4× Faster</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="stat-box" style={{ borderLeft: '3px solid #DC2626' }}>
              <div className="stat-label">Standard Method</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#334155', marginTop: 4 }}>c^d mod n</div>
              <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 4 }}>Large exponent, slow on 2048-bit keys</div>
            </div>
            <div className="stat-box" style={{ borderLeft: '3px solid #059669', background: '#F0FDF4', borderColor: '#BBF7D0' }}>
              <div className="stat-label">CRT Method</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#065F46', marginTop: 4 }}>c^d_p mod p + c^d_q mod q</div>
              <div style={{ fontSize: 11.5, color: '#059669', marginTop: 4 }}>Half-size exponents, Garner recombination</div>
            </div>
          </div>

          <div className="callout callout-blue" style={{ marginBottom: 16 }}>
            <div>
              Instead of <code>c^d mod n</code> with 2048-bit numbers, CRT uses{' '}
              <code>m₁ = c^d_p mod p</code> and <code>m₂ = c^d_q mod q</code> where the exponents
              are halved in bit-length, then recombines via Garner's formula.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'flex-end' }}>
            {[['Prime p', crtP, setCrtP, 90], ['Prime q', crtQ, setCrtQ, 90], ['Private d', crtD, setCrtD, 110], ['Ciphertext c', crtC, setCrtC, 110]].map(([l, v, s, w]) => (
              <div key={l}>
                <label className="input-label">{l}</label>
                <input type="number" className="input mono" style={{ width: w }} value={v} onChange={e => s(e.target.value)} />
              </div>
            ))}
            <button className="btn btn-primary" onClick={computeCRT}>Execute CRT Decrypt</button>
          </div>

          {crtRes && (
            <div className="anim-in">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 14 }}>
                {[
                  ['d_p = d mod (p-1)', crtRes.dp.toString()],
                  ['d_q = d mod (q-1)', crtRes.dq.toString()],
                  ['q_inv = q⁻¹ mod p', crtRes.qinv.toString()],
                  ['m₁ = c^d_p mod p',  crtRes.m1.toString()],
                  ['m₂ = c^d_q mod q',  crtRes.m2.toString()],
                  ['Plaintext m',        crtRes.plaintext.toString()],
                ].map(([lbl, val], i) => (
                  <div key={i} className="stat-box" style={i === 5 ? { background: '#F0FDF4', borderColor: '#BBF7D0' } : {}}>
                    <div className="stat-label">{lbl}</div>
                    <div className="stat-value" style={{ fontSize: 15, color: i === 5 ? '#059669' : '#0F172A' }}>{val}</div>
                  </div>
                ))}
              </div>
              <div className="code-block">
                {`m₁ = ${crtC}^${crtRes.dp} mod ${crtP} = ${crtRes.m1}\nm₂ = ${crtC}^${crtRes.dq} mod ${crtQ} = ${crtRes.m2}\nh  = q_inv × (m₁ - m₂) mod p = ${crtRes.h}\nm  = m₂ + h × q = ${crtRes.plaintext}`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 4. Miller-Rabin ── */}
      {activeTab === 'miller' && (
        <div className="card anim-in">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon blue"><Cpu size={16} /></div>
              <div>
                <div className="card-title">Miller-Rabin Primality Verifier</div>
                <div className="card-subtitle">Probabilistic polynomial-time primality test — the same algorithm used in industrial RSA key generation</div>
              </div>
            </div>
          </div>

          <div className="callout callout-blue" style={{ marginBottom: 16 }}>
            <div>
              Miller-Rabin tests multiple "witnesses". If any witness finds a composite pattern, the number is definitely composite.
              If all witnesses pass, the number is <em>probably prime</em> — with error probability less than 4^(-k) for k rounds.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14, alignItems: 'flex-end' }}>
            <div>
              <label className="input-label">Candidate Integer</label>
              <input type="number" className="input mono" style={{ width: 180 }} value={mrVal}
                onChange={e => testMR(e.target.value)} placeholder="e.g. 61" />
            </div>
            <button className="btn btn-primary" onClick={() => testMR(mrVal)}>Test Primality</button>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: '#64748B', alignSelf: 'center' }}>Presets:</span>
            {['61', '91', '561', '65537', '100003'].map(p => (
              <button key={p} className="btn btn-ghost btn-sm" onClick={() => testMR(p)}>{p}</button>
            ))}
          </div>

          <div className={`callout ${mrResult.isPrime ? 'callout-green' : 'callout-red'}`} style={{ marginBottom: 14 }}>
            {mrResult.isPrime ? <CheckCircle2 size={16} style={{ flexShrink: 0 }} /> : <XCircle size={16} style={{ flexShrink: 0 }} />}
            <div>
              <strong>{mrResult.isPrime ? 'PROBABLE PRIME' : 'COMPOSITE NUMBER'}: </strong>
              {mrResult.n.toString()} {mrResult.isPrime
                ? 'passed all witness rounds and is safe for RSA key generation.'
                : 'failed the Miller-Rabin witness test and cannot be used as an RSA prime.'}
            </div>
          </div>

          <div style={{ fontSize: 12.5, color: '#334155', marginBottom: 8, fontWeight: 600 }}>Witness check results:</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {WITNESSES.slice(0, 8).map(w => {
              const skip = w >= mrResult.n;
              return (
                <div key={w.toString()}
                  style={{
                    padding: '5px 12px', borderRadius: 7, fontSize: 12,
                    fontFamily: 'var(--font-mono)', fontWeight: 600,
                    background: skip ? '#F8FAFC' : (mrResult.isPrime ? '#F0FDF4' : '#FEF2F2'),
                    color: skip ? '#94A3B8' : (mrResult.isPrime ? '#059669' : '#DC2626'),
                    border: `1px solid ${skip ? '#E2E8F0' : (mrResult.isPrime ? '#BBF7D0' : '#FECACA')}`,
                  }}>
                  a={w.toString()} {skip ? '(skip)' : (mrResult.isPrime ? '✓' : '✗')}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
