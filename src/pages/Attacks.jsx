import React, { useState } from 'react';
import {
  Zap, AlertTriangle, ShieldAlert, CheckCircle2,
  XCircle, ArrowRight, Play, Calculator, Lock, Unlock
} from 'lucide-react';
import {
  fermatFactorization, integerCubeRoot, extendedGcd,
  modPow, tryFactor, DEMO_KEYS
} from '../lib/rsa.js';

export default function Attacks({ onGoToSim }) {
  const [activeAttack, setActiveAttack] = useState('fermat');

  // ── Attack 1: Fermat's Factorization ──
  const [fermatP, setFermatP] = useState('10007');
  const [fermatQ, setFermatQ] = useState('10009');
  const [fermatResult, setFermatResult] = useState(null);

  const handleRunFermat = () => {
    try {
      const p = BigInt(fermatP || '3');
      const q = BigInt(fermatQ || '5');
      const n = p * q;
      const res = fermatFactorization(n, 100000);
      setFermatResult({ ...res, n });
    } catch (e) {
      console.error(e);
    }
  };

  // ── Attack 2: Small Public Exponent e=3 ──
  const [smallM, setSmallM] = useState('42');
  const [smallModN, setSmallModN] = useState('3233'); // n > m^3? (42^3 = 74088 > 3233, so let's pick larger n or small m)
  const [cubeResult, setCubeResult] = useState(null);

  const handleRunCubeRootAttack = () => {
    try {
      const m = BigInt(smallM || '2');
      const n = BigInt(smallModN || '1000000');
      const e = 3n;

      // Encrypt with e=3
      const c = modPow(m, e, n);
      const isUnwrapped = m * m * m < n;

      // Attacker takes cube root of c
      const recoveredM = integerCubeRoot(c);

      setCubeResult({
        m, n, c,
        isUnwrapped,
        cubeOfM: m * m * m,
        recoveredM,
        success: recoveredM === m,
      });
    } catch (e) {
      console.error(e);
    }
  };

  // ── Attack 3: Common Modulus Attack ──
  const [cmM, setCmM] = useState('65');
  const [cmN, setCmN] = useState('3233');
  const [cmE1, setCmE1] = useState('3');
  const [cmE2, setCmE2] = useState('5');
  const [cmResult, setCmResult] = useState(null);

  const handleRunCommonModulus = () => {
    try {
      const m = BigInt(cmM);
      const n = BigInt(cmN);
      const e1 = BigInt(cmE1);
      const e2 = BigInt(cmE2);

      // Ciphertexts captured by attacker
      const c1 = modPow(m, e1, n);
      const c2 = modPow(m, e2, n);

      // Extended Euclidean on e1, e2
      const { g, x: r, y: s } = extendedGcd(e1, e2);

      let recovered = 0n;
      if (g === 1n) {
        // m = c1^r * c2^s mod n
        let part1 = r >= 0n ? modPow(c1, r, n) : modPow(modPow(c1, -r, n), n - 2n, n); // inverse via Fermat or extendedGcd
        let part2 = s >= 0n ? modPow(c2, s, n) : modPow(modPow(c2, -s, n), n - 2n, n);
        recovered = (part1 * part2) % n;
      }

      setCmResult({
        c1: c1.toString(),
        c2: c2.toString(),
        r: r.toString(),
        s: s.toString(),
        g: g.toString(),
        recovered: recovered.toString(),
        success: recovered === m,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Sub-tab pills */}
      <div style={{ display: 'flex', gap: 8, background: '#FFFFFF', padding: 6, borderRadius: 12, border: '1px solid #E2E8F0', width: 'fit-content', flexWrap: 'wrap' }}>
        {[
          { id: 'fermat', label: '1. Fermat Factorization (Close Primes)' },
          { id: 'small_e', label: '2. Small Exponent e=3 (Unpadded Cube Root)' },
          { id: 'common_mod', label: '3. Common Modulus Attack' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className="btn-modern"
            style={{
              background: activeAttack === t.id ? '#EF4444' : 'transparent',
              color: activeAttack === t.id ? '#FFFFFF' : '#475569',
              boxShadow: activeAttack === t.id ? '0 2px 6px rgba(239, 68, 68, 0.25)' : 'none',
              padding: '6px 14px',
              fontSize: 12.5,
            }}
            onClick={() => setActiveAttack(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Attack 1: Fermat Factorization ── */}
      {activeAttack === 'fermat' && (
        <div className="modern-card">
          <div className="card-head-row">
            <div className="card-title-group">
              <div className="card-title-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                <Zap size={16} />
              </div>
              <div>
                <div className="card-heading">Fermat Factorization: The Close Primes Vulnerability</div>
                <div className="card-subheading">If primes p and q are chosen too close together, n can be factored in microseconds</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#FEE2E2', color: '#991B1B' }}>
              Algebraic Attack
            </span>
          </div>

          <div className="info-callout amber">
            <div>
              <strong>Mathematical Principle:</strong> Any odd composite integer <code>n = a² - b² = (a - b)(a + b)</code>. When <em>p</em> and <em>q</em> are close, <code>a = (p+q)/2</code> is only slightly larger than <code>√n</code>. Fermat's method begins searching at <code>⌈√n⌉</code> and finds the factor in very few steps!
            </div>
          </div>

          <div className="input-row">
            <label className="input-label">Close Prime p:</label>
            <input
              type="number"
              className="text-input"
              value={fermatP}
              onChange={(e) => setFermatP(e.target.value)}
            />
            <label className="input-label">Close Prime q:</label>
            <input
              type="number"
              className="text-input"
              value={fermatQ}
              onChange={(e) => setFermatQ(e.target.value)}
            />
            <button
              type="button"
              className="btn-modern"
              style={{ background: '#DC2626', color: '#FFFFFF' }}
              onClick={handleRunFermat}
            >
              Crack via Fermat's Method
            </button>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: '#64748B', alignSelf: 'center', marginRight: 4 }}>Vulnerable Presets:</span>
            {[
              { p: '10007', q: '10009', label: '10007 × 10009 (Diff: 2)' },
              { p: '65537', q: '65539', label: '65537 × 65539 (Diff: 2)' },
              { p: '100003', q: '100019', label: '100003 × 100019 (Diff: 16)' },
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="btn-modern outline"
                style={{ fontSize: 11, padding: '3px 8px' }}
                onClick={() => {
                  setFermatP(preset.p);
                  setFermatQ(preset.q);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {fermatResult && (
            <div style={{ padding: 16, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: '#991B1B', fontSize: 14 }}>
                  Factorization Result: {fermatResult.success ? 'CRACKED SUCCESSFULLY!' : 'Exceeded Search Budget'}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#991B1B' }}>
                  Iterations: {fermatResult.steps} steps
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
                <div className="stat-pill-box" style={{ background: '#FFFFFF' }}>
                  <div className="stat-pill-label">Modulus (n)</div>
                  <div className="stat-pill-val">{fermatResult.n.toString()}</div>
                </div>
                <div className="stat-pill-box" style={{ background: '#FFFFFF' }}>
                  <div className="stat-pill-label">Recovered Prime p</div>
                  <div className="stat-pill-val" style={{ color: '#DC2626' }}>{fermatResult.p?.toString()}</div>
                </div>
                <div className="stat-pill-box" style={{ background: '#FFFFFF' }}>
                  <div className="stat-pill-label">Recovered Prime q</div>
                  <div className="stat-pill-val" style={{ color: '#DC2626' }}>{fermatResult.q?.toString()}</div>
                </div>
                <div className="stat-pill-box" style={{ background: '#FFFFFF' }}>
                  <div className="stat-pill-label">Prime Distance |q - p|</div>
                  <div className="stat-pill-val">{fermatResult.diff}</div>
                </div>
              </div>

              <div style={{ fontSize: 12.5, color: '#7F1D1D', lineHeight: 1.5 }}>
                <strong>Mitigation Rule:</strong> Cryptographic standards mandate that random prime generation must enforce <code>|p - q| &gt; 2^(n_bits/2 - 100)</code>. Primes must never be picked near each other!
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Attack 2: Small Public Exponent e=3 ── */}
      {activeAttack === 'small_e' && (
        <div className="modern-card">
          <div className="card-head-row">
            <div className="card-title-group">
              <div className="card-title-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                <Unlock size={16} />
              </div>
              <div>
                <div className="card-heading">Small Exponent Attack: Cube-Root Plaintext Recovery (e = 3)</div>
                <div className="card-subheading">When an unpadded message m³ &lt; n, modular reduction never happens!</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#FEE2E2', color: '#991B1B' }}>
              No Modulo Wrap
            </span>
          </div>

          <div className="info-callout amber">
            <div>
              If <em>e = 3</em> and message <em>m</em> satisfies <code>m³ &lt; n</code>, then <code>c = m³ mod n = m³</code> in standard integer arithmetic. An eavesdropper simply computes the integer cube root <code>m = ∛c</code> to read the message without the private key!
            </div>
          </div>

          <div className="input-row">
            <label className="input-label">Small Plaintext (m):</label>
            <input
              type="number"
              className="text-input"
              style={{ width: 100 }}
              value={smallM}
              onChange={(e) => setSmallM(e.target.value)}
            />
            <label className="input-label">Large Modulus (n):</label>
            <input
              type="number"
              className="text-input"
              style={{ width: 140 }}
              value={smallModN}
              onChange={(e) => setSmallModN(e.target.value)}
            />
            <button
              type="button"
              className="btn-modern"
              style={{ background: '#DC2626', color: '#FFFFFF' }}
              onClick={handleRunCubeRootAttack}
            >
              Simulate Cube Root Attack
            </button>
          </div>

          {cubeResult && (
            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 14, border: '1px solid #E2E8F0', marginTop: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                <div className="stat-pill-box">
                  <div className="stat-pill-label">Cube of Message m³</div>
                  <div className="stat-pill-val">{cubeResult.cubeOfM.toString()}</div>
                </div>
                <div className="stat-pill-box">
                  <div className="stat-pill-label">Ciphertext c = m³ mod n</div>
                  <div className="stat-pill-val" style={{ color: '#0284C7' }}>{cubeResult.c.toString()}</div>
                </div>
                <div className="stat-pill-box highlight">
                  <div className="stat-pill-label">Attacker Cube Root (∛c)</div>
                  <div className="stat-pill-val" style={{ color: '#166534' }}>{cubeResult.recoveredM.toString()}</div>
                </div>
              </div>

              {cubeResult.isUnwrapped ? (
                <div className="info-callout rose" style={{ marginBottom: 0 }}>
                  <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>CRITICAL LEAK:</strong> Because <code>m³ ({cubeResult.cubeOfM}) &lt; n ({cubeResult.n})</code>, no modular reduction took place! The attacker took <code>∛{cubeResult.c} = {cubeResult.recoveredM}</code> and read your message with ZERO private key knowledge!
                    <div style={{ marginTop: 4, fontWeight: 700 }}>
                      Defense: Always use OAEP padding (PKCS#1 v2.2) to pad small messages with random bits up to the bit-length of n.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="info-callout green" style={{ marginBottom: 0 }}>
                  <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Modular Wrap Occurred:</strong> m³ &gt; n, so modular wraparound occurred. Simple integer cube root cannot recover the message.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Attack 3: Common Modulus Attack ── */}
      {activeAttack === 'common_mod' && (
        <div className="modern-card">
          <div className="card-head-row">
            <div className="card-title-group">
              <div className="card-title-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                <Lock size={16} />
              </div>
              <div>
                <div className="card-heading">Common Modulus Attack: Shared Modulus Vulnerability</div>
                <div className="card-subheading">If two entities share modulus n with coprime exponents, message m is intercepted without private keys</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#FEE2E2', color: '#991B1B' }}>
              Multi-Cipher Intercept
            </span>
          </div>

          <div className="info-callout amber">
            <div>
              If two users share the same modulus <em>n</em> with coprime exponents <code>gcd(e₁, e₂) = 1</code>, Bezout's identity gives <code>r·e₁ + s·e₂ = 1</code>. An interceptor capturing both <code>c₁ = m^e₁ mod n</code> and <code>c₂ = m^e₂ mod n</code> computes <code>c₁^r · c₂^s ≡ m (mod n)</code> directly!
            </div>
          </div>

          <div className="input-row">
            <label className="input-label" style={{ width: 120 }}>Message (m):</label>
            <input
              type="number"
              className="text-input"
              style={{ width: 90 }}
              value={cmM}
              onChange={(e) => setCmM(e.target.value)}
            />
            <label className="input-label" style={{ width: 120 }}>Shared Modulus (n):</label>
            <input
              type="number"
              className="text-input"
              style={{ width: 100 }}
              value={cmN}
              onChange={(e) => setCmN(e.target.value)}
            />
            <label style={{ fontSize: 13, fontWeight: 600 }}>e₁:</label>
            <input
              type="number"
              className="text-input"
              style={{ width: 60 }}
              value={cmE1}
              onChange={(e) => setCmE1(e.target.value)}
            />
            <label style={{ fontSize: 13, fontWeight: 600 }}>e₂:</label>
            <input
              type="number"
              className="text-input"
              style={{ width: 60 }}
              value={cmE2}
              onChange={(e) => setCmE2(e.target.value)}
            />
            <button
              type="button"
              className="btn-modern"
              style={{ background: '#DC2626', color: '#FFFFFF' }}
              onClick={handleRunCommonModulus}
            >
              Run Intercept Crack
            </button>
          </div>

          {cmResult && (
            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 14, border: '1px solid #E2E8F0', marginTop: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                <div className="stat-pill-box">
                  <div className="stat-pill-label">Captured Ciphertext c₁</div>
                  <div className="stat-pill-val">{cmResult.c1}</div>
                </div>
                <div className="stat-pill-box">
                  <div className="stat-pill-label">Captured Ciphertext c₂</div>
                  <div className="stat-pill-val">{cmResult.c2}</div>
                </div>
                <div className="stat-pill-box">
                  <div className="stat-pill-label">Bezout Coefficients (r, s)</div>
                  <div className="stat-pill-val">({cmResult.r}, {cmResult.s})</div>
                </div>
                <div className="stat-pill-box highlight">
                  <div className="stat-pill-label">Recovered Message m</div>
                  <div className="stat-pill-val" style={{ color: '#166534' }}>{cmResult.recovered}</div>
                </div>
              </div>

              <div className="info-callout green" style={{ marginBottom: 0 }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Attack Succeeded:</strong> Message {cmResult.recovered} recovered from c₁ and c₂ using Bezout identity without knowing private exponent d or factoring n!
                  <div style={{ marginTop: 4, fontWeight: 700, color: '#991B1B' }}>
                    Golden Rule: NEVER share modulus n between multiple public exponents! Every user must have unique (p, q, n).
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
