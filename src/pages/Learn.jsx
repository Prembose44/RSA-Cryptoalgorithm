import React, { useState } from 'react';
import {
  BookOpen, Shield, Zap, AlertTriangle, Globe, Hash,
  Key, Lock, Unlock, ChevronDown, ChevronUp, Calculator, Info,
  CheckCircle, ArrowRight, RefreshCw, Cpu
} from 'lucide-react';
import { gcd, modPow, modInverse } from '../lib/rsa.js';

export default function Learn() {
  // Accordion open/close state
  const [openSections, setOpenSections] = useState({
    intro: true,
    math: true,
    keygen: false,
    example: true,
    apps: false,
  });

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Section 2: Math Foundations sub-tabs & live totient calculator
  const [mathTab, setMathTab] = useState('totient');
  const [calcP, setCalcP] = useState('17');
  const [calcQ, setCalcQ] = useState('19');

  // Compute live values for Math section
  const pBig = BigInt(calcP || '0');
  const qBig = BigInt(calcQ || '0');
  let calcN = 0n;
  let calcPhi = 0n;
  let calcValid = false;
  let calcError = null;

  try {
    if (pBig > 1n && qBig > 1n) {
      if (pBig === qBig) {
        calcError = 'p and q must be distinct primes';
      } else {
        calcN = pBig * qBig;
        calcPhi = (pBig - 1n) * (qBig - 1n);
        calcValid = true;
      }
    } else {
      calcError = 'p and q must be greater than 1';
    }
  } catch (err) {
    calcError = err.message;
  }

  // Section 4: Worked Example interactive message
  const [demoM, setDemoM] = useState('65');
  // Fixed small pedagogical key: p=61, q=53 => n=3233, phi=3120, e=17, d=2753
  const demoP = 61n, demoQ = 53n, demoN = 3233n, demoPhi = 3120n, demoE = 17n, demoD = 2753n;
  
  let computedC = 0n;
  let recoveredM = 0n;
  let demoError = null;
  try {
    const mBig = BigInt(demoM || '0');
    if (mBig < 0n || mBig >= demoN) {
      demoError = `Message m must be between 0 and n - 1 (n = ${demoN})`;
    } else {
      computedC = modPow(mBig, demoE, demoN);
      recoveredM = modPow(computedC, demoD, demoN);
    }
  } catch (err) {
    demoError = 'Invalid numeric input';
  }

  return (
    <div className="page anim-up">
      <div className="page-eyebrow">MODULE 02 · FOUNDATIONS</div>
      <h1 className="page-title">Learn the RSA Algorithm</h1>
      <p className="page-desc mb-5">
        Master the theoretical concepts, core number-theoretic foundations, and practical mathematical execution of the Rivest–Shamir–Adleman cryptosystem with real-time interactive calculations.
      </p>

      <div className="col g-4">
        {/* ── Section 1: Introduction & History ── */}
        <div className="learn-card">
          <div className="learn-card-hd" onClick={() => toggleSection('intro')}>
            <div className="row ac g-3">
              <div className="ib ib-green">
                <BookOpen size={16} />
              </div>
              <div>
                <div className="card-title">1. Introduction & Historical Origins</div>
                <div className="card-sub">Asymmetric revolution and the integer factorization premise</div>
              </div>
            </div>
            <div className="row ac g-2">
              <span className="chip chip-green">Core Concept</span>
              {openSections.intro ? <ChevronUp size={16} className="t-3" /> : <ChevronDown size={16} className="t-3" />}
            </div>
          </div>

          {openSections.intro && (
            <div className="learn-card-bd anim-in">
              <div className="info info-green mt-3 mb-4">
                <Info size={16} className="shrink-0" />
                <div>
                  <strong>Historical Milestone:</strong> Published in 1977 by Ron Rivest, Adi Shamir, and Leonard Adleman at MIT, RSA was the first commercially feasible public-key cryptosystem solving the key-distribution problem.
                </div>
              </div>

              <div className="g3 mb-4">
                <div className="card">
                  <div className="stat-label">System Type</div>
                  <div className="t-1 w-600 mb-1">Public-Key / Asymmetric</div>
                  <div className="t-3 t-xs">Uses a mathematically coupled keypair (public encryption, private decryption).</div>
                </div>
                <div className="card">
                  <div className="stat-label">Hardness Assumption</div>
                  <div className="t-green w-600 mb-1">Integer Factorization</div>
                  <div className="t-3 t-xs">Multiplying p·q is trivial O(log²n); factoring n into p and q is sub-exponentially hard.</div>
                </div>
                <div className="card">
                  <div className="stat-label">Syllabus Scope</div>
                  <div className="t-sky w-600 mb-1">Public-Key Cryptography</div>
                  <div className="t-3 t-xs">Directly covers Modular Arithmetic, Totient, and Extended Euclidean inverse.</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="sep mb-3">
                <div className="sep-line" />
                <div className="sep-label">RSA Evolution Timeline</div>
                <div className="sep-line" />
              </div>

              <div className="g4 mb-2">
                <div className="stat">
                  <div className="stat-label">1977</div>
                  <div className="stat-val" style={{ fontSize: 15 }}>MIT Inception</div>
                  <div className="stat-sub">Rivest, Shamir & Adleman author the landmark paper.</div>
                </div>
                <div className="stat">
                  <div className="stat-label">1994</div>
                  <div className="stat-val" style={{ fontSize: 15 }}>RSA-129 Factored</div>
                  <div className="stat-sub">Factored via cooperative distributed computing over 8 months.</div>
                </div>
                <div className="stat">
                  <div className="stat-label">2015</div>
                  <div className="stat-val" style={{ fontSize: 15 }}>1024-bit Deprecated</div>
                  <div className="stat-sub">NIST deprecates 1024-bit keys in favor of 2048-bit minimum.</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Present</div>
                  <div className="stat-val t-green" style={{ fontSize: 15 }}>RSA-2048 / 4096</div>
                  <div className="stat-sub">Default standard for internet TLS handshakes and PKI.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Section 2: Mathematical Foundations ── */}
        <div className="learn-card">
          <div className="learn-card-hd" onClick={() => toggleSection('math')}>
            <div className="row ac g-3">
              <div className="ib ib-amber">
                <Calculator size={16} />
              </div>
              <div>
                <div className="card-title">2. Mathematical Foundations & Live Calculator</div>
                <div className="card-sub">Euler's Totient, Modular Arithmetic, and Coprimality in action</div>
              </div>
            </div>
            <div className="row ac g-2">
              <span className="chip chip-amber">Interactive Math</span>
              {openSections.math ? <ChevronUp size={16} className="t-3" /> : <ChevronDown size={16} className="t-3" />}
            </div>
          </div>

          {openSections.math && (
            <div className="learn-card-bd anim-in">
              <div className="tabs mt-3">
                <button
                  type="button"
                  className={`tab ${mathTab === 'totient' ? 'active' : ''}`}
                  onClick={() => setMathTab('totient')}
                >
                  Live Totient Calculator
                </button>
                <button
                  type="button"
                  className={`tab ${mathTab === 'euler' ? 'active' : ''}`}
                  onClick={() => setMathTab('euler')}
                >
                  Euler's Theorem
                </button>
                <button
                  type="button"
                  className={`tab ${mathTab === 'mod' ? 'active' : ''}`}
                  onClick={() => setMathTab('mod')}
                >
                  Modular Inverses
                </button>
              </div>

              {mathTab === 'totient' && (
                <div className="card card-amber mb-3">
                  <div className="row ac jb mb-3">
                    <div className="card-title">Live Euler's Totient φ(n) Calculator</div>
                    <span className="chip chip-amber">Real-Time Computation</span>
                  </div>
                  <p className="t-3 t-xs mb-3">
                    Euler's totient function φ(n) counts integers k in [1, n] such that gcd(k, n) = 1. For a product of two distinct primes n = p·q, φ(n) = (p-1)(q-1).
                  </p>

                  <div className="g2 mb-3">
                    <div className="field">
                      <label className="label">Prime p</label>
                      <input
                        type="number"
                        className="input"
                        value={calcP}
                        onChange={(e) => setCalcP(e.target.value)}
                        placeholder="e.g. 17"
                      />
                    </div>
                    <div className="field">
                      <label className="label">Prime q</label>
                      <input
                        type="number"
                        className="input"
                        value={calcQ}
                        onChange={(e) => setCalcQ(e.target.value)}
                        placeholder="e.g. 19"
                      />
                    </div>
                  </div>

                  {calcError ? (
                    <div className="info info-rose mb-3">
                      <AlertTriangle size={15} />
                      <span>{calcError}</span>
                    </div>
                  ) : (
                    <div className="g3 mb-2">
                      <div className="vbox vbox-green">
                        <div className="stat-label">Modulus n = p × q</div>
                        <div className="t-1 t-lg w-600">{calcN.toString()}</div>
                        <div className="t-3 t-xs mt-1">{calcP} × {calcQ}</div>
                      </div>
                      <div className="vbox vbox-amber">
                        <div className="stat-label">Totient φ(n) = (p-1)(q-1)</div>
                        <div className="t-amber t-lg w-600">{calcPhi.toString()}</div>
                        <div className="t-3 t-xs mt-1">({calcP}-1) × ({calcQ}-1)</div>
                      </div>
                      <div className="vbox">
                        <div className="stat-label">Common e = 65537 Valid?</div>
                        <div className="row ac g-2 mt-1">
                          {calcPhi > 65537n && gcd(65537n, calcPhi) === 1n ? (
                            <>
                              <CheckCircle size={15} className="t-green" />
                              <span className="t-green t-sm w-600">Yes (gcd = 1)</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle size={15} className="t-amber" />
                              <span className="t-amber t-sm w-600">e must be &lt; φ(n)</span>
                            </>
                          )}
                        </div>
                        <div className="t-3 t-xs mt-1">gcd(e, φ(n)) requirement</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mathTab === 'euler' && (
                <div className="card card-sky mb-3">
                  <div className="card-title mb-2">Euler's Totient Theorem: The Engine of RSA</div>
                  <p className="t-3 t-xs mb-3">
                    If gcd(a, n) = 1, then:
                  </p>
                  <div className="code-block mb-3">
                    {'a^φ(n) ≡ 1 (mod n)'}
                  </div>
                  <p className="t-3 t-xs mb-2">
                    Multiplying both sides by a^k gives:
                  </p>
                  <div className="code-block mb-3">
                    {'a^(k·φ(n) + 1) ≡ a (mod n)'}
                  </div>
                  <p className="t-2 t-xs">
                    In RSA, we deliberately construct the public exponent <span className="mono t-amber">e</span> and private exponent <span className="mono t-violet">d</span> such that:
                  </p>
                  <div className="code-block t-green mb-1">
                    {'e · d ≡ 1 (mod φ(n))  ⟹  e · d = k·φ(n) + 1'}
                  </div>
                  <div className="t-3 t-xs">
                    Therefore: (m^e)^d = m^(e·d) = m^(k·φ(n) + 1) ≡ m (mod n). This guarantees exact message recovery upon decryption!
                  </div>
                </div>
              )}

              {mathTab === 'mod' && (
                <div className="card mb-3">
                  <div className="card-title mb-2">Extended Euclidean Algorithm (Bezout Identity)</div>
                  <p className="t-3 t-xs mb-3">
                    To decrypt, we need a private key d such that e·d ≡ 1 (mod φ(n)). This is computed via Bezout's identity:
                  </p>
                  <div className="code-block mb-3">
                    {'e · x + φ(n) · y = gcd(e, φ(n)) = 1'}
                  </div>
                  <p className="t-3 t-xs">
                    Here, <span className="mono t-green">x = d</span> represents the modular multiplicative inverse of e mod φ(n). If x is negative, we add φ(n) to wrap it into the positive range [1, φ(n)-1].
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Section 3: Key Generation 6 Steps ── */}
        <div className="learn-card">
          <div className="learn-card-hd" onClick={() => toggleSection('keygen')}>
            <div className="row ac g-3">
              <div className="ib ib-sky">
                <Key size={16} />
              </div>
              <div>
                <div className="card-title">3. The 6 Steps of RSA Key Generation</div>
                <div className="card-sub">Strict sequential mathematical derivation of public & private keypairs</div>
              </div>
            </div>
            <div className="row ac g-2">
              <span className="chip chip-sky">Algorithm Pipeline</span>
              {openSections.keygen ? <ChevronUp size={16} className="t-3" /> : <ChevronDown size={16} className="t-3" />}
            </div>
          </div>

          {openSections.keygen && (
            <div className="learn-card-bd anim-in">
              <div className="col g-3 mt-3 mb-2">
                {[
                  {
                    step: 1,
                    title: 'Choose Two Distinct Large Primes p and q',
                    desc: 'Selected randomly and independently using primality tests like Miller-Rabin. In 2048-bit RSA, each prime is approximately 1024 bits long.',
                    code: 'p = 61,  q = 53',
                    badge: 'Keep Secret',
                    color: 'chip-rose',
                  },
                  {
                    step: 2,
                    title: 'Compute Modulus n = p × q',
                    desc: 'The product n is public and defines the keyspace. The length of n in bits is the RSA key size. Factoring n to find p and q is the central security obstacle.',
                    code: 'n = 61 × 53 = 3233',
                    badge: 'Public',
                    color: 'chip-green',
                  },
                  {
                    step: 3,
                    title: 'Compute Euler’s Totient φ(n) = (p - 1)(q - 1)',
                    desc: 'Calculates the order of the multiplicative group modulo n. Anyone who knows φ(n) can trivially calculate the private key d.',
                    code: 'φ(n) = (61 - 1) × (53 - 1) = 60 × 52 = 3120',
                    badge: 'Keep Secret',
                    color: 'chip-rose',
                  },
                  {
                    step: 4,
                    title: 'Choose Public Exponent e',
                    desc: 'e must satisfy 1 < e < φ(n) and gcd(e, φ(n)) = 1 (coprime). Standard value is 65537 (0x10001) due to having only two 1-bits in binary.',
                    code: 'e = 17,  gcd(17, 3120) = 1  ✓',
                    badge: 'Public',
                    color: 'chip-green',
                  },
                  {
                    step: 5,
                    title: 'Compute Private Exponent d = e⁻¹ mod φ(n)',
                    desc: 'Using the Extended Euclidean Algorithm, find d such that (d × e) % φ(n) = 1. This d is the secret decryption trapdoor.',
                    code: '17 · d ≡ 1 (mod 3120)  ⟹  d = 2753',
                    badge: 'Keep Secret',
                    color: 'chip-rose',
                  },
                  {
                    step: 6,
                    title: 'Publish Public Key & Protect Private Key',
                    desc: 'Public key (e, n) is distributed via digital certificates or public keyservers. Private key (d, n) is stored in secure hardware or encrypted keychains.',
                    code: 'Public Key: (e=17, n=3233)\nPrivate Key: (d=2753, n=3233)',
                    badge: 'Keypair Ready',
                    color: 'chip-violet',
                  },
                ].map((s) => (
                  <div key={s.step} className="step-box done">
                    <div className="row ac jb mb-2">
                      <div className="row ac g-2">
                        <div className="step-num step-num-done">{s.step}</div>
                        <div className="card-title">{s.title}</div>
                      </div>
                      <span className={`chip ${s.color}`}>{s.badge}</span>
                    </div>
                    <div className="t-3 t-xs mb-2">{s.desc}</div>
                    <div className="code-block">{s.code}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Section 4: Worked Example (Interactive) ── */}
        <div className="learn-card">
          <div className="learn-card-hd" onClick={() => toggleSection('example')}>
            <div className="row ac g-3">
              <div className="ib ib-violet">
                <Lock size={16} />
              </div>
              <div>
                <div className="card-title">4. Interactive Worked Example: Encrypt & Decrypt</div>
                <div className="card-sub">Test live ciphertext generation and mathematical recovery in real time</div>
              </div>
            </div>
            <div className="row ac g-2">
              <span className="chip chip-violet">Live Playground</span>
              {openSections.example ? <ChevronUp size={16} className="t-3" /> : <ChevronDown size={16} className="t-3" />}
            </div>
          </div>

          {openSections.example && (
            <div className="learn-card-bd anim-in">
              <div className="info info-sky mt-3 mb-3">
                <Info size={15} />
                <span>
                  Using textbook demo keys: <strong>p=61, q=53, n=3233, e=17, d=2753</strong>. Enter any numerical message m below to watch encryption and decryption execute immediately!
                </span>
              </div>

              <div className="field mb-4">
                <label className="label">Plaintext Message m (must be &lt; 3233)</label>
                <div className="row ac g-2">
                  <input
                    type="number"
                    className="input"
                    value={demoM}
                    onChange={(e) => setDemoM(e.target.value)}
                    placeholder="Enter an integer, e.g. 65"
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setDemoM(String(Math.floor(Math.random() * 2000) + 10))}
                  >
                    <RefreshCw size={12} /> Random
                  </button>
                </div>
              </div>

              {demoError ? (
                <div className="info info-rose mb-3">
                  <AlertTriangle size={15} />
                  <span>{demoError}</span>
                </div>
              ) : (
                <div className="g2 mb-3">
                  {/* Encrypt side */}
                  <div className="card card-green">
                    <div className="row ac jb mb-2">
                      <div className="row ac g-2">
                        <Lock size={15} className="t-green" />
                        <span className="card-title">1. Encryption (Public Key)</span>
                      </div>
                      <span className="chip chip-green">c = m^e mod n</span>
                    </div>
                    <div className="t-3 t-xs mb-2">Anyone holding the public key (e=17, n=3233) encrypts message m:</div>
                    <div className="code-block mb-3">
                      {`c = ${demoM}^17 mod 3233\nc = ${computedC.toString()}`}
                    </div>
                    <div className="vbox vbox-green">
                      <div className="stat-label">Ciphertext (c)</div>
                      <div className="t-green t-lg w-600">{computedC.toString()}</div>
                    </div>
                  </div>

                  {/* Decrypt side */}
                  <div className="card card-violet">
                    <div className="row ac jb mb-2">
                      <div className="row ac g-2">
                        <Unlock size={15} className="t-violet" />
                        <span className="card-title">2. Decryption (Private Key)</span>
                      </div>
                      <span className="chip chip-violet">m = c^d mod n</span>
                    </div>
                    <div className="t-3 t-xs mb-2">Only the holder of secret key (d=2753, n=3233) can recover m:</div>
                    <div className="code-block mb-3">
                      {`m = ${computedC.toString()}^2753 mod 3233\nm = ${recoveredM.toString()}`}
                    </div>
                    <div className="vbox vbox-violet">
                      <div className="stat-label">Recovered Message (m)</div>
                      <div className="row ac jb">
                        <span className="t-violet t-lg w-600">{recoveredM.toString()}</span>
                        {recoveredM.toString() === demoM && (
                          <span className="chip chip-green">
                            <CheckCircle size={10} style={{ marginRight: 3 }} /> Matches Input
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Section 5: Advantages, Limitations & Applications ── */}
        <div className="learn-card">
          <div className="learn-card-hd" onClick={() => toggleSection('apps')}>
            <div className="row ac g-3">
              <div className="ib ib-green">
                <Globe size={16} />
              </div>
              <div>
                <div className="card-title">5. Advantages, Limitations & Real-World Use Cases</div>
                <div className="card-sub">Trade-offs and why hybrid cryptography dominates the internet</div>
              </div>
            </div>
            <div className="row ac g-2">
              <span className="chip chip-muted">Security Review</span>
              {openSections.apps ? <ChevronUp size={16} className="t-3" /> : <ChevronDown size={16} className="t-3" />}
            </div>
          </div>

          {openSections.apps && (
            <div className="learn-card-bd anim-in">
              <div className="g2 mt-3 mb-4">
                {/* Advantages */}
                <div className="card">
                  <div className="row ac g-2 mb-3">
                    <CheckCircle size={16} className="t-green" />
                    <span className="card-title t-green">Strengths & Advantages</span>
                  </div>
                  <div className="col g-2 t-xs t-2">
                    <div className="row ac g-2">
                      <div className="algo-dot" />
                      <span><strong>No Shared Secret Needed:</strong> Sender and recipient never need to exchange secret keys beforehand.</span>
                    </div>
                    <div className="row ac g-2">
                      <div className="algo-dot" />
                      <span><strong>Dual Utility:</strong> Supports both public-key confidential encryption and non-repudiation digital signatures.</span>
                    </div>
                    <div className="row ac g-2">
                      <div className="algo-dot" />
                      <span><strong>Decades of Cryptanalysis:</strong> Thoroughly audited since 1977 with well-understood security margins.</span>
                    </div>
                  </div>
                </div>

                {/* Limitations */}
                <div className="card">
                  <div className="row ac g-2 mb-3">
                    <AlertTriangle size={16} className="t-rose" />
                    <span className="card-title t-rose">Limitations & Risks</span>
                  </div>
                  <div className="col g-2 t-xs t-2">
                    <div className="row ac g-2">
                      <div className="algo-dot" style={{ background: 'var(--rose)' }} />
                      <span><strong>Computationally Heavy:</strong> Roughly 1,000× slower than symmetric ciphers like AES-256.</span>
                    </div>
                    <div className="row ac g-2">
                      <div className="algo-dot" style={{ background: 'var(--rose)' }} />
                      <span><strong>Deterministic Vulnerability:</strong> Textbook RSA without OAEP padding leaks equality of messages.</span>
                    </div>
                    <div className="row ac g-2">
                      <div className="algo-dot" style={{ background: 'var(--rose)' }} />
                      <span><strong>Quantum Vulnerability:</strong> Shor's algorithm on a cryptographically relevant quantum computer can factor n in polynomial time.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hybrid crypto highlight */}
              <div className="card card-sky mb-2">
                <div className="row ac g-2 mb-2">
                  <Zap size={15} className="t-sky" />
                  <span className="card-title">The Industry Standard: Hybrid Cryptosystems</span>
                </div>
                <p className="t-3 t-xs mb-3">
                  In modern protocols (TLS 1.3, SSH, PGP), RSA is <strong>never</strong> used to encrypt the entire payload due to performance constraints. Instead, RSA encrypts a temporary symmetric session key (AES-GCM), and AES encrypts the bulk communication at gigabit speeds.
                </p>
                <div className="row ac g-2 wrap">
                  <span className="chip chip-sky">HTTPS / TLS Certificates</span>
                  <span className="chip chip-green">SSH Host Identity</span>
                  <span className="chip chip-amber">PGP / GPG Email</span>
                  <span className="chip chip-violet">PDF Digital Signatures</span>
                  <span className="chip chip-muted">PKI Code Signing</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
