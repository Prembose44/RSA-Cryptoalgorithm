import React from 'react';
import { BookOpen, Key, Lock, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Theory() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* ── 1. Introduction ── */}
      <div className="modern-card">
        <div className="card-head-row">
          <div className="card-title-group">
            <div className="card-title-icon green">
              <BookOpen size={16} />
            </div>
            <div>
              <div className="card-heading">1. Introduction to Asymmetric Cryptography</div>
              <div className="card-subheading">Solving the classical key distribution challenge with two mathematical keys</div>
            </div>
          </div>
        </div>

        <p style={{ color: '#334155', marginBottom: 14 }}>
          In traditional <strong>symmetric cryptosystems</strong> (e.g. AES), both parties must share a single secret key. This creates a severe logistical challenge: how to securely transmit that secret over an insecure channel.
        </p>

        <p style={{ color: '#334155', marginBottom: 16 }}>
          <strong>Asymmetric (Public-Key) Cryptography</strong> solves this by creating two mathematically linked keys:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 16 }}>
          <div style={{ padding: 16, border: '1px solid #BBF7D0', borderRadius: 14, background: '#F0FDF4' }}>
            <div style={{ fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Key size={16} /> Public Key (e, n)
            </div>
            <div style={{ fontSize: 13, color: '#14532D', lineHeight: 1.5 }}>
              Distributed openly across public networks. Anyone wishing to send confidential data to the recipient encrypts with this key.
            </div>
          </div>

          <div style={{ padding: 16, border: '1px solid #FECACA', borderRadius: 14, background: '#FEF2F2' }}>
            <div style={{ fontWeight: 700, color: '#991B1B', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Lock size={16} /> Private Key (d, n)
            </div>
            <div style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.5 }}>
              Kept strictly confidential by the recipient. Only the private key can decrypt ciphertexts or produce valid signatures.
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Mathematical Foundation ── */}
      <div className="modern-card">
        <div className="card-head-row">
          <div className="card-title-group">
            <div className="card-title-icon amber">
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="card-heading">2. Mathematical Foundations of RSA</div>
              <div className="card-subheading">Euler's Totient function, Euler's Theorem, and the trapdoor one-way function</div>
            </div>
          </div>
        </div>

        <div className="info-callout amber">
          <div>
            <strong>Core Trapdoor Premise:</strong> Computing the product of two prime numbers <code>n = p × q</code> is computationally trivial O(log² n), but factoring <code>n</code> back into <code>p</code> and <code>q</code> is sub-exponentially hard without the secret trapdoor.
          </div>
        </div>

        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginTop: 14, marginBottom: 6 }}>
          A. Euler's Totient Function φ(n)
        </h4>
        <p style={{ color: '#475569', fontSize: 13.5, marginBottom: 8 }}>
          For any integer <em>n</em>, φ(n) counts positive integers in [1, n] coprime to <em>n</em>. When <em>n = p × q</em> where p and q are prime:
        </p>
        <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderLeft: '4px solid #10B981', padding: '10px 14px', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 14 }}>
          φ(n) = (p - 1) × (q - 1)
        </div>

        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
          B. Euler's Totient Theorem
        </h4>
        <p style={{ color: '#475569', fontSize: 13.5, marginBottom: 8 }}>
          For every integer <em>m</em> coprime to <em>n</em>:
        </p>
        <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderLeft: '4px solid #6366F1', padding: '10px 14px', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 14 }}>
          m^φ(n) ≡ 1 (mod n)
        </div>
        <p style={{ color: '#475569', fontSize: 13.5, marginBottom: 8 }}>
          Because <code>e · d ≡ 1 (mod φ(n))</code>, there exists an integer <em>k</em> such that <code>e · d = k·φ(n) + 1</code>. Therefore:
        </p>
        <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderLeft: '4px solid #10B981', padding: '10px 14px', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 10 }}>
          (m^e)^d = m^(e·d) = m^(k·φ(n) + 1) = (m^φ(n))^k · m ≡ (1)^k · m ≡ m (mod n)
        </div>
        <p style={{ color: '#065F46', fontSize: 13, fontWeight: 600 }}>
          ✓ This mathematical proof guarantees that private key decryption returns the exact original message!
        </p>
      </div>

      {/* ── 3. Algorithm Phases Table ── */}
      <div className="modern-card">
        <div className="card-head-row">
          <div className="card-title-group">
            <div className="card-title-icon green">
              <Key size={16} />
            </div>
            <div>
              <div className="card-heading">3. Algorithm Phases & Mathematical Formulas</div>
              <div className="card-subheading">Sequential summary of keypair derivation, encryption, and signatures</div>
            </div>
          </div>
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th style={{ width: 140 }}>Phase</th>
              <th style={{ width: 220 }}>Formula</th>
              <th>Operational Rules</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700, color: '#0F172A' }}>Key Generation</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>
                n = p × q<br />
                φ(n) = (p-1)(q-1)<br />
                d = e⁻¹ mod φ(n)
              </td>
              <td>
                1. Select two large distinct primes p and q.<br />
                2. Choose e coprime to φ(n) (standard e = 65537).<br />
                3. Compute d using the Extended Euclidean Algorithm.<br />
                <strong>Public Key:</strong> (e, n) | <strong>Private Key:</strong> (d, n)
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, color: '#0F172A' }}>Encryption</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>c = m^e mod n</td>
              <td>Sender raises plaintext integer <em>m</em> (0 ≤ m &lt; n) to public exponent <em>e</em> modulo <em>n</em>.</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, color: '#0F172A' }}>Decryption</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>m = c^d mod n</td>
              <td>Recipient raises ciphertext <em>c</em> to private exponent <em>d</em> modulo <em>n</em> to recover <em>m</em>.</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, color: '#0F172A' }}>Digital Signature</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>
                s = hash(m)^d mod n<br />
                hash(m) == s^e mod n
              </td>
              <td>Signer signs with secret private key <em>d</em>; any verifier checks with public key <em>e</em>.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── 4. References ── */}
      <div className="modern-card">
        <div className="card-head-row">
          <div className="card-title-group">
            <div className="card-title-icon indigo">
              <BookOpen size={16} />
            </div>
            <div>
              <div className="card-heading">4. Technical References & Syllabus Bibliography</div>
              <div className="card-subheading">Authoritative cryptographic standards and textbook references</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 2 }}>
              RFC 8017 (PKCS #1 v2.2)
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>IETF Standard for RSA Cryptography</div>
            <div style={{ fontSize: 12.5, color: '#334155' }}>Defines OAEP encryption padding and PSS digital signature schemes.</div>
          </div>

          <div style={{ padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 2 }}>
              NIST FIPS 186-5
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Digital Signature Standard (DSS)</div>
            <div style={{ fontSize: 12.5, color: '#334155' }}>Federal criteria for prime generation, Miller-Rabin tests, and key lengths.</div>
          </div>

          <div style={{ padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 2 }}>
              William Stallings (8th Ed.)
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Cryptography and Network Security</div>
            <div style={{ fontSize: 12.5, color: '#334155' }}>Chapter 9 covers RSA mathematics, modular inverses, and attack analysis.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
