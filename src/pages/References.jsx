import React from 'react';
import { ExternalLink, BookOpen, Award, FileText, Globe } from 'lucide-react';

export default function References() {
  const references = [
    {
      category: 'Official Cryptographic Standards',
      icon: Award,
      items: [
        {
          title: 'PKCS #1 v2.2: RSA Cryptography Specifications (RFC 8017)',
          author: 'K. Moriarty, B. Kaliski, J. Jonsson, A. Rusch (IETF / RSA Laboratories)',
          desc: 'Specifies mathematical primitives for RSA encryption, decryption, signature generation, and verification with OAEP and PSS padding.',
          url: 'https://www.rfc-editor.org/rfc/rfc8017',
          type: 'RFC Standard',
        },
        {
          title: 'FIPS PUB 186-5: Digital Signature Standard (DSS)',
          author: 'National Institute of Standards and Technology (NIST)',
          desc: 'Federal standard specifying algorithms for digital signatures including RSA-PSS, prime generation criteria, and primality testing.',
          url: 'https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf',
          type: 'NIST Standard',
        },
        {
          title: 'NIST SP 800-57 Part 1 Rev. 5: Recommendation for Key Management',
          author: 'E. Barker (NIST)',
          desc: 'Provides cryptographic key length recommendations, determining that 2048-bit RSA provides adequate security through 2030.',
          url: 'https://doi.org/10.6028/NIST.SP.800-57pt1r5',
          type: 'NIST Guideline',
        },
      ],
    },
    {
      category: 'Seminal Academic Papers',
      icon: FileText,
      items: [
        {
          title: 'A Method for Obtaining Digital Signatures and Public-Key Cryptosystems',
          author: 'R.L. Rivest, A. Shamir, and L. Adleman (1978)',
          desc: 'Communications of the ACM, Vol. 21, No. 2, pp. 120–126. The landmark original paper introducing the RSA cryptosystem.',
          url: 'https://people.csail.mit.edu/rivest/Rsapaper.pdf',
          type: 'Original Paper',
        },
        {
          title: 'New Directions in Cryptography',
          author: 'W. Diffie and M.E. Hellman (1976)',
          desc: 'IEEE Transactions on Information Theory. Founded the concept of public key cryptography and trapdoor one-way functions.',
          url: 'https://ee.stanford.edu/~hellman/publications/24.pdf',
          type: 'Foundational Paper',
        },
        {
          title: 'Probabilistic Algorithm for Testing Primality',
          author: 'M.O. Rabin (1980)',
          desc: 'Journal of Number Theory, Vol. 12, Issue 1. Standardized the Miller-Rabin randomized primality testing algorithm used in key generation.',
          url: 'https://doi.org/10.1016/0022-314X(80)90084-0',
          type: 'Algorithm Paper',
        },
      ],
    },
    {
      category: 'Curriculum Textbooks',
      icon: BookOpen,
      items: [
        {
          title: 'Cryptography and Network Security: Principles and Practice (8th Edition)',
          author: 'William Stallings (Pearson)',
          desc: 'Chapter 9: Public-Key Cryptography and RSA. Covers modular arithmetic, totient theorems, and algorithm implementation.',
          url: 'https://www.pearson.com/en-us/subject-catalog/p/cryptography-and-network-security-principles-and-practice/P200000003332',
          type: 'Syllabus Book',
        },
        {
          title: 'Handbook of Applied Cryptography',
          author: 'A. Menezes, P. van Oorschot, S. Vanstone (CRC Press)',
          desc: 'Chapter 8: Public-Key Encryption. An authoritative reference work freely distributed online by the University of Waterloo.',
          url: 'https://cacr.uwaterloo.ca/hac/',
          type: 'Free Reference',
        },
        {
          title: 'Understanding Cryptography: A Textbook for Students and Practitioners',
          author: 'Christof Paar and Jan Pelzl (Springer)',
          desc: 'Known for accessible mathematical explanations and pedagogical visual diagrams of asymmetric encryption.',
          url: 'https://www.crypto-textbook.com/',
          type: 'Textbook',
        },
      ],
    },
    {
      category: 'Software Specifications & Libraries',
      icon: Globe,
      items: [
        {
          title: 'W3C Web Cryptography API Specification (SubtleCrypto)',
          author: 'World Wide Web Consortium (W3C)',
          desc: 'Browser-native hardware-accelerated cryptographic API providing constant-time RSA-OAEP and RSA-PSS primitives.',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey',
          type: 'Web Standard',
        },
        {
          title: 'OpenSSL Cryptographic Engine Repository',
          author: 'The OpenSSL Project',
          desc: 'Worldwide standard open-source C implementation of modular exponentiation and side-channel attack countermeasures.',
          url: 'https://github.com/openssl/openssl/tree/master/crypto/rsa',
          type: 'Open Source',
        },
      ],
    },
  ];

  return (
    <div>
      <div className="vlab-card">
        <div className="vlab-card-header">
          <div className="vlab-card-title">Technical References & Academic Standards</div>
          <span className="step-badge">Bibliography</span>
        </div>

        <p style={{ color: '#475569', fontSize: 13.5, marginBottom: 20 }}>
          The following standard publications, government recommendations (NIST/FIPS), and authoritative textbooks form the theoretical basis of this virtual laboratory:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {references.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 16, background: '#FFFFFF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
                  <Icon size={18} color="var(--vlab-blue)" />
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{cat.category}</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cat.items.map((it, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 12,
                        borderRadius: 6,
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 600,
                              background: '#E0F2FE',
                              color: '#0369A1',
                              padding: '2px 6px',
                              borderRadius: 4,
                            }}
                          >
                            {it.type}
                          </span>
                          <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 13.5 }}>
                            {it.title}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>{it.author}</div>
                        <div style={{ fontSize: 12.5, color: '#334155' }}>{it.desc}</div>
                      </div>

                      {it.url && (
                        <a
                          href={it.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-vlab btn-vlab-outline"
                          style={{ fontSize: 12, padding: '5px 10px', textDecoration: 'none', flexShrink: 0 }}
                        >
                          <ExternalLink size={12} /> Open
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
