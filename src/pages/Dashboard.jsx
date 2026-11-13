import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, Key, Lock, Unlock, ShieldCheck,
  Cpu, Calculator, Compass, HelpCircle, BookOpen, CheckCircle2, Play, Zap
} from 'lucide-react';
import { DEMO_KEYS, modPow } from '../lib/rsa.js';

export default function Dashboard({ onNavigate }) {
  // Quick encrypt console state
  const [quickM, setQuickM] = useState('42');
  const [quickC, setQuickC] = useState(() => {
    return modPow(42n, DEMO_KEYS.small.publicKey.e, DEMO_KEYS.small.publicKey.n).toString();
  });

  const handleQuickEncrypt = (val) => {
    setQuickM(val);
    try {
      const mBig = BigInt(val || '0');
      const c = modPow(mBig, DEMO_KEYS.small.publicKey.e, DEMO_KEYS.small.publicKey.n);
      setQuickC(c.toString());
    } catch (e) {
      setQuickC('Error');
    }
  };

  const modules = [
    {
      id: 'simulation',
      title: 'RSA Control Center',
      desc: 'Interactive keypair generation (p, q, n, e, d), live encryption, and circuit architecture dataflow.',
      icon: Cpu,
      badge: 'Core Lab',
      color: 'green',
    },
    {
      id: 'workbench',
      title: 'Mathematical Inspector',
      desc: 'Square-and-Multiply stepper, Extended Euclidean inverse table, and CRT decryption accelerator.',
      icon: Calculator,
      badge: 'Visualizer',
      color: 'indigo',
    },
    {
      id: 'attacks',
      title: 'RSA Attacks & Breaches',
      desc: 'Fermat close-primes factorization, small exponent (e=3) cube root attack, and common modulus crack.',
      icon: Zap,
      badge: 'Cryptanalysis',
      color: 'amber',
    },
    {
      id: 'playground',
      title: 'Parameter Experiments',
      desc: 'Brute-force trial factorization, avalanche diffusion tests, and Euler totient empirical verification.',
      icon: Compass,
      badge: '4 Tests',
      color: 'green',
    },
    {
      id: 'quiz',
      title: 'Knowledge Check',
      desc: 'Self-evaluation test with 10 randomized questions on RSA mathematics, Miller-Rabin, and attacks.',
      icon: HelpCircle,
      badge: 'Assessment',
      color: 'indigo',
    },
    {
      id: 'theory',
      title: 'Mathematical Theory',
      desc: 'Step-by-step mathematical proofs of Euler totient theorem, trapdoor functions, and NIST standards.',
      icon: BookOpen,
      badge: 'Syllabus',
      color: 'green',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* ── Top Hero Banner ── */}
      <div className="hero-banner-card">
        <div className="hero-banner-content">
          <span className="hero-tag">PURE RSA CRYPTOSYSTEM LABORATORY</span>
          <h1 className="hero-title">Interactive RSA Control Center</h1>
          <p className="hero-desc">
            Complete mathematical transparency and parameter control over the <strong>Rivest–Shamir–Adleman (RSA)</strong> cryptosystem. Generate prime keypairs, test arbitrary plaintext messages, inspect step-by-step exponentiations, and simulate algebraic attacks.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn-modern"
              style={{ background: '#FFFFFF', color: '#047857', fontWeight: 700 }}
              onClick={() => onNavigate('simulation')}
            >
              <Play size={14} fill="#047857" /> Launch RSA Control Center
            </button>
            <button
              type="button"
              className="btn-modern"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)' }}
              onClick={() => onNavigate('attacks')}
            >
              <Zap size={14} /> Simulate RSA Attacks
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid: Live Encrypt Console & Learning Status ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
        {/* Instant RSA Console */}
        <div className="modern-card">
          <div className="card-head-row">
            <div className="card-title-group">
              <div className="card-title-icon green">
                <Lock size={16} />
              </div>
              <div>
                <div className="card-heading">Live RSA Exponentiation Console</div>
                <div className="card-subheading">c = m^e mod n with active key (e=17, n=3233)</div>
              </div>
            </div>
          </div>

          <div className="input-row">
            <label className="input-label" style={{ width: 140 }}>Plaintext Integer (m):</label>
            <input
              type="number"
              className="text-input"
              style={{ width: 100 }}
              value={quickM}
              onChange={(e) => handleQuickEncrypt(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 4 }}>
              {[15, 42, 65, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  className="btn-modern outline"
                  style={{ padding: '4px 8px', fontSize: 11 }}
                  onClick={() => handleQuickEncrypt(String(val))}
                >
                  m={val}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 12, background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Ciphertext (c):</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                {quickC}
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#166534', textAlign: 'right' }}>
              Formula: {quickM}¹⁷ mod 3233
            </div>
          </div>
        </div>

        {/* System Telemetry */}
        <div className="modern-card">
          <div className="card-head-row">
            <div className="card-title-group">
              <div className="card-title-icon indigo">
                <ShieldCheck size={16} />
              </div>
              <div>
                <div className="card-heading">RSA Cryptographic Capabilities</div>
                <div className="card-subheading">Available mathematical modules and solvers</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#EEF2FF', color: '#3730A3' }}>
              Full Control
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#334155' }}>Key Generation (Miller-Rabin & Extended GCD)</span>
              <span style={{ fontWeight: 700, color: '#10B981' }}>Interactive</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#334155' }}>Square-and-Multiply Stepper</span>
              <span style={{ fontWeight: 700, color: '#10B981' }}>Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#334155' }}>Chinese Remainder Theorem (CRT) Accelerator</span>
              <span style={{ fontWeight: 700, color: '#10B981' }}>Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#334155' }}>Fermat & Small Exponent Cryptanalysis</span>
              <span style={{ fontWeight: 700, color: '#DC2626' }}>Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modules Directory ── */}
      <div className="modern-card">
        <div className="card-head-row">
          <div className="card-title-group">
            <div className="card-title-icon green">
              <Cpu size={16} />
            </div>
            <div>
              <div className="card-heading">RSA Laboratory Modules</div>
              <div className="card-subheading">Select a tool to explore mathematical operations and vulnerability simulations</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                style={{
                  padding: 18,
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onClick={() => onNavigate(m.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10B981';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px -2px rgba(16, 185, 129, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div className={`card-title-icon ${m.color}`}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#065F46', background: '#ECFDF5', padding: '2px 8px', borderRadius: 6 }}>
                      {m.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.5, marginBottom: 14 }}>
                    {m.desc}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10B981', fontWeight: 600, fontSize: 12.5 }}>
                  <span>Open Module</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
