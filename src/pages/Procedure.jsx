import React, { useState } from 'react';
import { ListOrdered, ArrowRight, ShieldAlert, CheckCircle2, Play, Info } from 'lucide-react';

const steps = [
  {
    num: 1,
    title: 'Initialize Prime Factors (p, q)',
    desc: 'In the Simulation tab under Step 1, either input two prime numbers (e.g., p = 61, q = 53) manually or click "Generate Random Prime" to generate two primes automatically. Ensure that p ≠ q.',
    module: 'simulation',
    badge: 'Key Generation',
    color: 'green',
  },
  {
    num: 2,
    title: 'Calculate Modulus n and Euler\'s Totient φ(n)',
    desc: 'Observe the calculated modulus n = p × q and totient φ(n) = (p − 1) × (q − 1). Note that the length of n in bits defines the RSA key length.',
    module: 'theory',
    badge: 'Mathematics',
    color: 'amber',
  },
  {
    num: 3,
    title: 'Select Public Exponent (e) and Compute Private Exponent (d)',
    desc: 'Choose an integer e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1. The system will use the Extended Euclidean Algorithm to solve e·d ≡ 1 (mod φ(n)) and display the secret exponent d.',
    module: 'workbench',
    badge: 'Extended GCD',
    color: 'blue',
  },
  {
    num: 4,
    title: 'Act as Bob: Encrypt a Message for Alice',
    desc: "In Step 2 (Bob's Panel), enter an integer message m such that 0 ≤ m < n. Click \"Encrypt with Alice's Public Key\". Bob computes ciphertext c = m^e mod n using fast square-and-multiply modular exponentiation.",
    module: 'simulation',
    badge: 'Encryption',
    color: 'green',
  },
  {
    num: 5,
    title: 'Act as Alice: Decrypt the Received Ciphertext',
    desc: "In Step 3 (Alice's Panel), observe how Alice takes the incoming ciphertext c and applies her private exponent d: m = c^d mod n. Verify that the recovered plaintext matches Bob's original input.",
    module: 'simulation',
    badge: 'Decryption',
    color: 'green',
  },
  {
    num: 6,
    title: 'Test Digital Signatures & Man-in-the-Middle Tampering',
    desc: 'In Step 4, enter a text message for Alice to sign. Click "Generate Digital Signature" to compute s = hash(m)^d mod n. Enable "Simulate Tampering" to modify the payload, then click "Verify Signature" to observe the verification failure.',
    module: 'simulation',
    badge: 'Signatures',
    color: 'red',
  },
];

const colorMap = {
  green: { bg: '#F0FDF4', border: '#BBF7D0', text: '#059669', chip: '#065F46', chipBg: '#DCFCE7' },
  amber: { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', chip: '#92400E', chipBg: '#FEF3C7' },
  blue:  { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB', chip: '#1D4ED8', chipBg: '#DBEAFE' },
  red:   { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', chip: '#991B1B', chipBg: '#FEE2E2' },
};

export default function Procedure({ onGoToSim }) {
  const [hoveredStep, setHoveredStep] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="anim-up">
      {/* Header Card */}
      <div className="modern-card">
        <div className="card-head-row">
          <div className="card-title-group">
            <div className="card-title-icon green">
              <ListOrdered size={16} />
            </div>
            <div>
              <div className="card-heading">Step-by-Step Laboratory Procedure</div>
              <div className="card-subheading">Complete walkthrough for the RSA Virtual Lab experiment</div>
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#F0FDF4', color: '#065F46' }}>
            Lab Guide
          </span>
        </div>

        <div className="info-callout blue" style={{ marginBottom: 0 }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            Follow these sequential steps in the <strong>Simulation</strong> module to complete the virtual experiment.
            All calculations are executed in-browser using JavaScript <code>BigInt</code> — no server required.
          </div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((st, idx) => {
          const c = colorMap[st.color];
          const isHovered = hoveredStep === idx;
          return (
            <div
              key={st.num}
              onMouseEnter={() => setHoveredStep(idx)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{
                display: 'flex', gap: 16, padding: '18px 20px',
                border: `1px solid ${isHovered ? c.border : '#E2E8F0'}`,
                borderLeft: `4px solid ${c.text}`,
                borderRadius: 12, background: isHovered ? c.bg : '#fff',
                transition: 'all 0.18s ease', cursor: 'default',
              }}
            >
              {/* Step Number Circle */}
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: c.bg, border: `1.5px solid ${c.border}`,
                  color: c.text, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 800, fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {st.num}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 5 }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>{st.title}</div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                    background: c.chipBg, color: c.chip, flexShrink: 0,
                  }}>
                    {st.badge}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{st.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert + CTA */}
      <div className="modern-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: 1 }}>
          <ShieldAlert size={18} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
            <strong style={{ color: '#0F172A' }}>Interactive Note:</strong> You can enter custom numbers at every stage,
            or use the pre-configured textbook preset (p=61, q=53, e=17). The simulation renders each step of the
            Square-and-Multiply algorithm for full observability.
          </div>
        </div>
        <button
          type="button"
          className="btn-modern primary"
          style={{ fontSize: 13.5, padding: '9px 20px' }}
          onClick={onGoToSim}
        >
          <Play size={14} fill="currentColor" /> Launch Simulation
        </button>
      </div>
    </div>
  );
}
