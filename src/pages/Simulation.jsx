import React, { useState } from 'react';
import {
  Key, Lock, Unlock, Shield, AlertTriangle, CheckCircle2,
  RefreshCw, ArrowRight, Copy, Play, Zap, ChevronRight,
  Lightbulb, Calculator
} from 'lucide-react';
import {
  gcd, modPow, modInverse, generatePrime, millerRabin,
  textToBigInt, bigIntToText, lcm, generateRSAKeys
} from '../lib/rsa.js';

/* ══════════════════════════════════════════════════════════════
   HELPER COMPONENTS
══════════════════════════════════════════════════════════════ */

function CopyBtn({ text, field, copied, onCopy }) {
  const done = copied === field;
  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        onCopy(field);
        setTimeout(() => onCopy(null), 1800);
      }}
    >
      {done ? <CheckCircle2 size={13} color="#059669" /> : <Copy size={13} />}
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT - STEP-BY-STEP SIMULATION
══════════════════════════════════════════════════════════════ */
export default function Simulation() {
  /* ── Step Management ── */
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  /* ── RSA Parameters ── */
  const [pInput, setPInput] = useState('61');
  const [qInput, setQInput] = useState('53');
  const [eInput, setEInput] = useState('17');
  const [mInput, setMInput] = useState('65');
  const [copied, setCopied] = useState(null);

  /* ── Auto-generate helper ── */
  const handleAutoGenerate = () => {
    const keys = generateRSAKeys(14);
    setPInput(keys.p.toString());
    setQInput(keys.q.toString());
    setEInput(keys.e.toString());
    setMInput('42');
    markStepComplete(0);
    markStepComplete(1);
    markStepComplete(2);
    setCurrentStep(3);
  };

  /* ── Math calculations ── */
  const pBig = (() => { try { return BigInt(pInput || '0'); } catch { return 0n; } })();
  const qBig = (() => { try { return BigInt(qInput || '0'); } catch { return 0n; } })();
  const eBig = (() => { try { return BigInt(eInput || '0'); } catch { return 0n; } })();

  const isPPrime = pBig > 1n && millerRabin(pBig);
  const isQPrime = qBig > 1n && millerRabin(qBig);

  let nBig = 0n, phiBig = 0n, dBig = 0n, keyError = null, isCoprime = false;

  try {
    if (pBig <= 1n || qBig <= 1n) {
      keyError = 'p and q must be positive integers greater than 1';
    } else if (pBig === qBig) {
      keyError = 'p and q must be different primes';
    } else {
      nBig = pBig * qBig;
      phiBig = (pBig - 1n) * (qBig - 1n);
      if (eBig > 1n && eBig < phiBig) {
        const gcdVal = gcd(eBig, phiBig);
        if (gcdVal === 1n) {
          isCoprime = true;
          dBig = modInverse(eBig, phiBig);
        } else {
          keyError = `e and φ(n) are not coprime. gcd = ${gcdVal}`;
        }
      } else {
        keyError = `e must be between 1 and φ(n) = ${phiBig}`;
      }
    }
  } catch (err) {
    keyError = err.message;
  }

  let actualM = 0n, cBig = 0n, decM = 0n, encError = null;
  try {
    actualM = BigInt(mInput || '0');
    if (nBig > 0n && isCoprime) {
      if (actualM < 0n || actualM >= nBig) {
        encError = `Message must be less than n = ${nBig}`;
      } else {
        cBig = modPow(actualM, eBig, nBig);
        decM = modPow(cBig, dBig, nBig);
      }
    }
  } catch (err) {
    encError = err.message;
  }

  const nBits = nBig > 0n ? nBig.toString(2).length : 0;
  const keysReady = isCoprime && !keyError && isPPrime && isQPrime;

  /* ── Step completion helper ── */
  const markStepComplete = (stepNum) => {
    setCompletedSteps(prev => new Set([...prev, stepNum]));
  };

  const goToStep = (stepNum) => {
    setCurrentStep(stepNum);
  };

  /* ── Step configuration ── */
  const steps = [
    { id: 0, title: 'Choose Prime p', badge: 'Step 1' },
    { id: 1, title: 'Choose Prime q', badge: 'Step 2' },
    { id: 2, title: 'Calculate n = p × q', badge: 'Step 3' },
    { id: 3, title: 'Choose Public Exponent e', badge: 'Step 4' },
    { id: 4, title: 'Calculate Private Key d', badge: 'Step 5' },
    { id: 5, title: 'Encrypt & Decrypt Message', badge: 'Step 6' }
  ];

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ══════════════════════════════════════════
          HEADER: Progress Overview
      ══════════════════════════════════════════ */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)', color: '#fff', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              RSA SIMULATION
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
              Step-by-Step RSA Key Generation
            </div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Follow each step to build your RSA keys and encrypt a message
            </div>
          </div>
          <button
            className="btn btn-sm"
            style={{ background: '#fff', color: '#0F172A', fontWeight: 700 }}
            onClick={handleAutoGenerate}
          >
            <Zap size={12} /> Auto-Generate Keys
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
          <div
            style={{
              background: '#10B981',
              height: '100%',
              width: `${(completedSteps.size / 6) * 100}%`,
              transition: 'width 0.4s ease',
              borderRadius: 8
            }}
          />
        </div>
        <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>
          {completedSteps.size} of 6 steps completed
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STEP NAVIGATION TABS
      ══════════════════════════════════════════ */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 0' }}>
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isComplete = completedSteps.has(step.id);
          return (
            <button
              key={step.id}
              className="btn btn-outline btn-sm"
              onClick={() => goToStep(step.id)}
              style={{
                background: isActive ? '#2563EB' : isComplete ? '#F0FDF4' : '#fff',
                color: isActive ? '#fff' : isComplete ? '#059669' : '#64748B',
                borderColor: isActive ? '#2563EB' : isComplete ? '#BBF7D0' : '#E2E8F0',
                fontWeight: isActive || isComplete ? 700 : 500,
                whiteSpace: 'nowrap',
                minWidth: 140
              }}
            >
              {isComplete && <CheckCircle2 size={12} />}
              {step.badge}: {step.title}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════
          STEP CONTENT
      ══════════════════════════════════════════ */}
      
      {/* STEP 0: Choose Prime p */}
      {currentStep === 0 && (
        <div className="card anim-up">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="card-icon card-icon-blue">
                <Key size={16} />
              </div>
              <div>
                <div className="card-title">Step 1: Choose Prime Number p</div>
                <div className="card-subtitle">RSA security relies on two large prime numbers</div>
              </div>
            </div>
          </div>

          <div className="callout callout-blue" style={{ marginBottom: 20 }}>
            <Lightbulb size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>What's a prime number?</strong> A number greater than 1 that can only be divided by 1 and itself (e.g., 2, 3, 5, 7, 11, 13...). For real RSA, we use 1024-bit primes, but here we'll use smaller numbers for learning.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, alignItems: 'start' }}>
            <div>
              <label className="input-label">Enter prime p:</label>
              <input
                type="number"
                className="input mono"
                value={pInput}
                onChange={(e) => setPInput(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  const prime = generatePrime(12);
                  setPInput(prime.toString());
                }}
              >
                <RefreshCw size={12} /> Generate Prime
              </button>
            </div>

            <div className="stat-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div className="stat-label">Your Number: {pInput}</div>
                <span className={`badge ${isPPrime ? 'badge-green' : 'badge-red'}`}>
                  {isPPrime ? '✓ Is Prime' : '✗ Not Prime'}
                </span>
              </div>
              <div className="stat-value" style={{ fontSize: 32 }}>{pInput}</div>
              <div className="stat-hint">
                {pBig > 0n ? `Binary size: ${pBig.toString(2).length} bits` : 'Enter a number'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              Quick presets:
              {[11, 61, 251].map(val => (
                <button
                  key={val}
                  className="btn btn-ghost btn-sm"
                  onClick={() => setPInput(String(val))}
                  style={{ marginLeft: 8 }}
                >
                  p = {val}
                </button>
              ))}
            </div>
            <button
              className="btn btn-green"
              disabled={!isPPrime}
              onClick={() => {
                markStepComplete(0);
                goToStep(1);
              }}
            >
              Next Step <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Choose Prime q */}
      {currentStep === 1 && (
        <div className="card anim-up">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="card-icon card-icon-blue">
                <Key size={16} />
              </div>
              <div>
                <div className="card-title">Step 2: Choose Prime Number q</div>
                <div className="card-subtitle">This must be different from p for security</div>
              </div>
            </div>
          </div>

          <div className="callout callout-amber" style={{ marginBottom: 20 }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Important:</strong> q must be different from p. If p = q, the system can be easily broken! Selected p = <strong>{pInput}</strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, alignItems: 'start' }}>
            <div>
              <label className="input-label">Enter prime q:</label>
              <input
                type="number"
                className="input mono"
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  let prime = generatePrime(12);
                  while (prime.toString() === pInput) {
                    prime = generatePrime(12);
                  }
                  setQInput(prime.toString());
                }}
              >
                <RefreshCw size={12} /> Generate Prime
              </button>
            </div>

            <div className="stat-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div className="stat-label">Your Number: {qInput}</div>
                <span className={`badge ${isQPrime && pInput !== qInput ? 'badge-green' : 'badge-red'}`}>
                  {isQPrime && pInput !== qInput ? '✓ Valid' : isQPrime ? '✗ Same as p' : '✗ Not Prime'}
                </span>
              </div>
              <div className="stat-value" style={{ fontSize: 32 }}>{qInput}</div>
              <div className="stat-hint">
                {qBig > 0n ? `Binary size: ${qBig.toString(2).length} bits` : 'Enter a number'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
            <button
              className="btn btn-outline"
              onClick={() => goToStep(0)}
            >
              ← Previous Step
            </button>
            <button
              className="btn btn-green"
              disabled={!isQPrime || pInput === qInput}
              onClick={() => {
                markStepComplete(1);
                goToStep(2);
              }}
            >
              Next Step <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Calculate n */}
      {currentStep === 2 && (
        <div className="card anim-up">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="card-icon card-icon-green">
                <Calculator size={16} />
              </div>
              <div>
                <div className="card-title">Step 3: Calculate Modulus n = p × q</div>
                <div className="card-subtitle">This becomes your public modulus</div>
              </div>
            </div>
          </div>

          <div className="callout callout-blue" style={{ marginBottom: 20 }}>
            <Lightbulb size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>The modulus n:</strong> This number is shared publicly and defines the size of your key. All encryption happens "mod n" (meaning we divide by n and keep only the remainder). The security comes from the fact that factoring n back into p × q is very hard when n is large.
            </div>
          </div>

          <div style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: '#166534', fontWeight: 600, marginBottom: 12 }}>
              Calculation:
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#0F172A', marginBottom: 8 }}>
              n = p × q
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#0F172A', marginBottom: 12 }}>
              n = {pInput} × {qInput}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, color: '#059669', fontWeight: 800 }}>
              n = {nBig.toString()}
            </div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 8 }}>
              Key size: {nBits} bits {nBits < 2048 && '(Educational - real RSA uses 2048+ bits)'}
            </div>
          </div>

          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#92400E' }}>
              <strong>φ(n) = (p-1) × (q-1) = {phiBig.toString()}</strong><br />
              This is Euler's totient function - we need it for the next step. It counts how many numbers less than n are coprime to n.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              className="btn btn-outline"
              onClick={() => goToStep(1)}
            >
              ← Previous Step
            </button>
            <button
              className="btn btn-green"
              onClick={() => {
                markStepComplete(2);
                goToStep(3);
              }}
            >
              Next Step <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Choose e */}
      {currentStep === 3 && (
        <div className="card anim-up">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="card-icon card-icon-blue">
                <Unlock size={16} />
              </div>
              <div>
                <div className="card-title">Step 4: Choose Public Exponent e</div>
                <div className="card-subtitle">This is part of your public key</div>
              </div>
            </div>
          </div>

          <div className="callout callout-blue" style={{ marginBottom: 20 }}>
            <Lightbulb size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Public exponent e:</strong> This must be coprime with φ(n) = {phiBig.toString()} (meaning gcd(e, φ(n)) = 1). Common choices are 3, 17, or 65537. Smaller e makes encryption faster!
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, alignItems: 'start' }}>
            <div>
              <label className="input-label">Public exponent e:</label>
              <input
                type="number"
                className="input mono"
                value={eInput}
                onChange={(e) => setEInput(e.target.value)}
              />
              <div className="input-hint">Must be coprime with φ(n)</div>
            </div>

            <div className="stat-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div className="stat-label">Coprime Check</div>
                {keyError ? (
                  <span className="badge badge-red">✗ Invalid</span>
                ) : isCoprime ? (
                  <span className="badge badge-green">✓ Valid</span>
                ) : (
                  <span className="badge badge-amber">Checking...</span>
                )}
              </div>
              {keyError && (
                <div style={{ color: '#DC2626', fontSize: 13, marginTop: 8 }}>
                  {keyError}
                </div>
              )}
              {isCoprime && (
                <div style={{ color: '#059669', fontSize: 13, marginTop: 8, fontWeight: 600 }}>
                  ✓ e = {eInput} is coprime with φ(n) = {phiBig.toString()}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 20, fontSize: 12, color: '#64748B' }}>
            Common choices:
            {[3, 5, 17, 257, 65537].filter(val => BigInt(val) < phiBig).map(val => (
              <button
                key={val}
                className="btn btn-ghost btn-sm"
                onClick={() => setEInput(String(val))}
                style={{ marginLeft: 8 }}
              >
                e = {val}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button
              className="btn btn-outline"
              onClick={() => goToStep(2)}
            >
              ← Previous Step
            </button>
            <button
              className="btn btn-green"
              disabled={!isCoprime || keyError}
              onClick={() => {
                markStepComplete(3);
                goToStep(4);
              }}
            >
              Next Step <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Calculate d */}
      {currentStep === 4 && (
        <div className="card anim-up">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="card-icon card-icon-amber">
                <Lock size={16} />
              </div>
              <div>
                <div className="card-title">Step 5: Calculate Private Key d</div>
                <div className="card-subtitle">This is the secret that lets you decrypt</div>
              </div>
            </div>
          </div>

          <div className="callout callout-amber" style={{ marginBottom: 20 }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Keep this secret!</strong> The private key d is calculated such that (e × d) mod φ(n) = 1. Anyone with d can decrypt messages encrypted with your public key!
            </div>
          </div>

          <div style={{ background: '#FEF2F2', border: '2px solid #FECACA', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: '#991B1B', fontWeight: 600, marginBottom: 12 }}>
              Private Key Calculation:
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#0F172A', marginBottom: 8 }}>
              d ≡ e⁻¹ (mod φ(n))
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#0F172A', marginBottom: 12 }}>
              d ≡ {eInput}⁻¹ (mod {phiBig.toString()})
            </div>
            {isCoprime && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, color: '#DC2626', fontWeight: 800 }}>
                d = {dBig.toString()}
              </div>
            )}
          </div>

          {isCoprime && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: 14, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#166534' }}>
                <strong>Verification:</strong> ({eInput} × {dBig.toString()}) mod {phiBig.toString()} = {(eBig * dBig % phiBig).toString()} ✓
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div className="key-box key-box-public">
              <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', marginBottom: 6, textTransform: 'uppercase' }}>
                Public Key (Share This)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#0F172A' }}>
                e = {eInput}<br />
                n = {nBig.toString()}
              </div>
              <CopyBtn text={`e=${eInput}, n=${nBig}`} field="pub" copied={copied} onCopy={setCopied} />
            </div>

            <div className="key-box key-box-private">
              <div style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', marginBottom: 6, textTransform: 'uppercase' }}>
                Private Key (Keep Secret!)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#0F172A' }}>
                d = {dBig.toString()}<br />
                n = {nBig.toString()}
              </div>
              <CopyBtn text={`d=${dBig}, n=${nBig}`} field="priv" copied={copied} onCopy={setCopied} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              className="btn btn-outline"
              onClick={() => goToStep(3)}
            >
              ← Previous Step
            </button>
            <button
              className="btn btn-green"
              onClick={() => {
                markStepComplete(4);
                goToStep(5);
              }}
            >
              Next Step <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Encrypt & Decrypt */}
      {currentStep === 5 && (
        <div className="card anim-up">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="card-icon card-icon-green">
                <Shield size={16} />
              </div>
              <div>
                <div className="card-title">Step 6: Encrypt & Decrypt a Message</div>
                <div className="card-subtitle">See RSA in action!</div>
              </div>
            </div>
          </div>

          <div className="callout callout-green" style={{ marginBottom: 20 }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Your keys are ready!</strong> Now let's encrypt a message. The encryption formula is: c = m<sup>e</sup> mod n, and decryption is: m = c<sup>d</sup> mod n
            </div>
          </div>

          {/* Message input */}
          <div style={{ marginBottom: 20 }}>
            <label className="input-label">Message (must be less than n = {nBig.toString()}):</label>
            <input
              type="number"
              className="input mono"
              value={mInput}
              onChange={(e) => setMInput(e.target.value)}
              placeholder="Enter a number"
            />
            <div className="input-hint">
              Try: {[42, 65, 100, 123].map(val => (
                <button
                  key={val}
                  className="btn btn-ghost btn-sm"
                  onClick={() => setMInput(String(val))}
                  style={{ marginLeft: 4 }}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Encryption process */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 16, alignItems: 'center' }}>
              {/* Original Message */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>
                  PLAINTEXT (m)
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 800, color: '#2563EB' }}>
                  {actualM.toString()}
                </div>
              </div>

              {/* Encrypt arrow */}
              <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                <div style={{ fontSize: 10, marginBottom: 4 }}>ENCRYPT</div>
                <ArrowRight size={20} />
                <div style={{ fontSize: 10, marginTop: 4 }}>m^e mod n</div>
              </div>

              {/* Ciphertext */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>
                  CIPHERTEXT (c)
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 800, color: '#059669' }}>
                  {encError ? '—' : cBig.toString()}
                </div>
              </div>

              {/* Decrypt arrow */}
              <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                <div style={{ fontSize: 10, marginBottom: 4 }}>DECRYPT</div>
                <ArrowRight size={20} />
                <div style={{ fontSize: 10, marginTop: 4 }}>c^d mod n</div>
              </div>

              {/* Decrypted */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>
                  DECRYPTED (m')
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 800, color: encError ? '#DC2626' : decM === actualM ? '#2563EB' : '#DC2626' }}>
                  {encError ? 'Error' : decM.toString()}
                  {!encError && decM === actualM && ' ✓'}
                </div>
              </div>
            </div>
          </div>

          {/* Error or success message */}
          {encError && (
            <div className="callout callout-red" style={{ marginBottom: 16 }}>
              <AlertTriangle size={16} />
              <div>{encError}</div>
            </div>
          )}

          {!encError && decM === actualM && (
            <div className="callout callout-green" style={{ marginBottom: 16 }}>
              <CheckCircle2 size={16} />
              <div>
                <strong>Success!</strong> The message was encrypted and decrypted correctly. m = m' = {actualM.toString()}
              </div>
            </div>
          )}

          {/* Mathematical breakdown */}
          <div style={{ background: '#0F172A', color: '#E2E8F0', borderRadius: 10, padding: 16, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            <div style={{ color: '#94A3B8', marginBottom: 8 }}>// Encryption</div>
            <div>c = {actualM.toString()}<sup>{eInput}</sup> mod {nBig.toString()}</div>
            <div style={{ color: '#10B981' }}>c = {cBig.toString()}</div>
            <div style={{ color: '#94A3B8', marginTop: 12, marginBottom: 8 }}>// Decryption</div>
            <div>m = {cBig.toString()}<sup>{dBig.toString()}</sup> mod {nBig.toString()}</div>
            <div style={{ color: '#10B981' }}>m = {decM.toString()}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button
              className="btn btn-outline"
              onClick={() => goToStep(4)}
            >
              ← Previous Step
            </button>
            <button
              className="btn btn-green"
              onClick={() => {
                markStepComplete(5);
              }}
            >
              <CheckCircle2 size={14} /> Complete!
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          SUMMARY CARD (shown when all steps complete)
      ══════════════════════════════════════════ */}
      {completedSteps.size === 6 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#fff', border: 'none' }}>
          <div style={{ textAlign: 'center' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 16px' }} />
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
              Congratulations! 🎉
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>
              You've successfully generated RSA keys and encrypted/decrypted a message!
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
