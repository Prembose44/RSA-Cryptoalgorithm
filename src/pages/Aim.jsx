import React from 'react';
import { Target, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Aim({ onStartSimulation }) {
  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Aim ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon blue"><Target size={16} /></div>
            <div>
              <div className="card-title">Aim of the Experiment</div>
              <div className="card-subtitle">What this virtual lab is designed to teach</div>
            </div>
          </div>
          <span className="badge badge-blue">Lab Overview</span>
        </div>

        <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.75, marginBottom: 16 }}>
          To understand, mathematically formulate, and interactively simulate the{' '}
          <strong>Rivest–Shamir–Adleman (RSA)</strong> public key cryptosystem. This virtual laboratory
          demonstrates asymmetric keypair generation, modular exponentiation, message encryption and
          decryption, and digital signature schemes — with full mathematical transparency and step-by-step
          visual tracing.
        </p>

        <div className="callout callout-blue">
          <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Syllabus Alignment:</strong> This experiment directly addresses core university topics
            in Information Security — <em>Asymmetric Cryptography, Modular Arithmetic, Euclidean Algorithms,
            Euler's Totient Theorem, and Digital Signatures</em>.
          </div>
        </div>
      </div>

      {/* ── Learning Objectives ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon green"><CheckCircle2 size={16} /></div>
            <div>
              <div className="card-title">Learning Objectives</div>
              <div className="card-subtitle">After completing this virtual lab, students will be able to:</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Explain the fundamental difference between symmetric-key and asymmetric-key cryptosystems and why RSA solves the key distribution problem.',
            'Derive the mathematical relationship between prime factors (p, q), modulus n = p×q, and Euler\'s totient φ(n) = (p-1)(q-1).',
            'Compute the private decryption exponent d using the Extended Euclidean Algorithm — the modular multiplicative inverse of e mod φ(n).',
            'Perform public-key encryption c = m^e mod n and private-key decryption m = c^d mod n via square-and-multiply exponentiation.',
            'Analyze why the Integer Factorization Problem (IFP) makes RSA computationally secure for key lengths ≥ 2048 bits.',
            'Identify and demonstrate real-world RSA vulnerabilities: Fermat factorization (close primes), small public exponent (e=3), and common modulus attacks.',
            'Simulate cryptographic digital signatures to understand message integrity, authenticity, and non-repudiation.',
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 14px',
                background: '#F8FAFC',
                borderRadius: 8,
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#EFF6FF',
                  border: '1.5px solid #BFDBFE',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 11,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {idx + 1}
              </div>
              <span style={{ fontSize: 13.5, color: '#1E293B', lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pre-requisites ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon amber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className="card-title">Pre-requisites</div>
              <div className="card-subtitle">Mathematical background knowledge required before starting</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            {
              title: '1. Prime Numbers & Divisibility',
              desc: 'Concept of prime numbers, coprimality, and the greatest common divisor (GCD). Ability to test whether a number is prime.',
            },
            {
              title: '2. Modular Arithmetic',
              desc: 'Congruences, remainder operations (a mod n), and properties of cyclic groups. Understanding of how integers wrap around a modulus.',
            },
            {
              title: '3. Euclidean Algorithm',
              desc: 'The basic Euclidean algorithm for GCD, and the extended version for computing integers x, y satisfying ax + by = gcd(a, b).',
            },
          ].map((prereq, idx) => (
            <div
              key={idx}
              className="card-sm"
              style={{ background: '#F8FAFC' }}
            >
              <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 5, fontSize: 13 }}>{prereq.title}</div>
              <div style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.55 }}>{prereq.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: 14, padding: '10px 24px' }}
            onClick={onStartSimulation}
          >
            Open Interactive Simulation <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
