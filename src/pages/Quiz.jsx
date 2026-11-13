import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, RotateCcw, ChevronRight, HelpCircle } from 'lucide-react';

const QUESTIONS = [
  {
    q: "What does the acronym RSA stand for?",
    opts: [
      "Random Secure Algorithm",
      "Rivest–Shamir–Adleman",
      "Recursive Security Architecture",
      "Remote Signing Apparatus"
    ],
    ans: 1,
    exp: "RSA was designed in 1977 at MIT by Ron Rivest, Adi Shamir, and Leonard Adleman."
  },
  {
    q: "In the RSA cryptosystem, what constitutes the public key?",
    opts: [
      "The private exponent d and modulus n",
      "The prime factors p and q",
      "The public exponent e and modulus n",
      "Euler's totient φ(n) and e"
    ],
    ans: 2,
    exp: "The public key is the pair (e, n), where e is the public exponent and n is the modulus."
  },
  {
    q: "What fundamental computational problem underpins the security of RSA?",
    opts: [
      "Discrete Logarithm Problem",
      "Integer Factorization Problem (IFP)",
      "Shortest Vector in a Lattice",
      "Elliptic Curve Diffie-Hellman"
    ],
    ans: 1,
    exp: "RSA relies on the Integer Factorization Problem: multiplying two primes p and q is easy, but factoring n = p·q back into p and q is sub-exponentially hard."
  },
  {
    q: "What mathematical condition must the public exponent e strictly satisfy?",
    opts: [
      "e must be an even integer",
      "1 < e < φ(n) and gcd(e, φ(n)) = 1 (coprime)",
      "e must be equal to the private key d",
      "e must be a prime factor of n"
    ],
    ans: 1,
    exp: "e must be coprime to φ(n) to guarantee that a unique modular inverse d = e⁻¹ mod φ(n) exists."
  },
  {
    q: "What is Euler's totient φ(n) when n is the product of two distinct primes p and q?",
    opts: [
      "φ(n) = p · q",
      "φ(n) = (p + 1)(q + 1)",
      "φ(n) = (p - 1)(q - 1)",
      "φ(n) = p + q - 1"
    ],
    ans: 2,
    exp: "For prime numbers p and q, φ(n) = φ(p)·φ(q) = (p - 1)(q - 1). It counts positive integers up to n coprime to n."
  },
  {
    q: "Which algorithm is used to compute the private decryption exponent d = e⁻¹ mod φ(n)?",
    opts: [
      "Miller-Rabin Primality Test",
      "Extended Euclidean Algorithm",
      "Sieve of Eratosthenes",
      "Chinese Remainder Theorem"
    ],
    ans: 1,
    exp: "The Extended Euclidean Algorithm solves Bezout's identity e·d + φ(n)·y = gcd(e, φ(n)) = 1 to find the modular inverse d."
  },
  {
    q: "How is an integer message m encrypted to ciphertext c using RSA?",
    opts: [
      "c = (m · e) mod n",
      "c = (m + e) mod n",
      "c = (mᵉ) mod n",
      "c = (mᵈ) mod n"
    ],
    ans: 2,
    exp: "RSA encryption raises the plaintext message m to the public exponent e modulo n: c = mᵉ mod n."
  },
  {
    q: "How does the recipient recover the plaintext m from ciphertext c?",
    opts: [
      "m = (c · d) mod n",
      "m = (cᵈ) mod n",
      "m = (cᵉ) mod n",
      "m = (c / d) mod n"
    ],
    ans: 1,
    exp: "Decryption uses the private exponent d: m = cᵈ mod n = (mᵉ)ᵈ mod n ≡ m (mod n)."
  },
  {
    q: "Why is textbook RSA encryption vulnerable if used without padding (e.g. OAEP)?",
    opts: [
      "It is deterministic: the same plaintext always produces identical ciphertext",
      "It uses symmetric keys",
      "The private key is published automatically",
      "It cannot handle numeric data"
    ],
    ans: 0,
    exp: "Because textbook RSA is purely deterministic, an attacker can create codebooks or identify repeated messages. OAEP padding adds randomized bytes."
  },
  {
    q: "What is the most widely adopted public exponent e in industry protocols and why?",
    opts: [
      "e = 3",
      "e = 17",
      "e = 65537 (0x10001)",
      "e = 256"
    ],
    ans: 2,
    exp: "65537 is the 4th Fermat prime (2¹⁶ + 1). Its binary form (10000000000000001) has only two 1-bits, enabling fast square-and-multiply exponentiation while resisting small-exponent attacks."
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz() {
  const [questionList, setQuestionList] = useState(() => shuffle(QUESTIONS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [finished, setFinished] = useState(false);

  const curQ = questionList[currentIndex];

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelectedIdx(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedIdx === null || submitted) return;
    const isCorrect = selectedIdx === curQ.ans;
    setSubmitted(true);
    setHistory(prev => [
      ...prev,
      {
        question: curQ.q,
        selected: selectedIdx,
        correct: curQ.ans,
        isCorrect,
        explanation: curQ.exp,
        options: curQ.opts,
      }
    ]);
  };

  const handleNext = () => {
    if (currentIndex < questionList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedIdx(null);
      setSubmitted(false);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setQuestionList(shuffle(QUESTIONS));
    setCurrentIndex(0);
    setSelectedIdx(null);
    setSubmitted(false);
    setHistory([]);
    setFinished(false);
  };

  const score = history.filter(h => h.isCorrect).length;
  const percentage = Math.round((score / questionList.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="modern-card">
        <div className="card-head-row">
          <div className="card-title-group">
            <div className="card-title-icon green">
              <Award size={16} />
            </div>
            <div>
              <div className="card-heading">Knowledge Check & Self-Evaluation</div>
              <div className="card-subheading">Test your comprehension of RSA keypair algebra and operational security</div>
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#ECFDF5', color: '#065F46' }}>
            10 Questions
          </span>
        </div>

        {!finished ? (
          <div>
            {/* Progress Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>
                Question {currentIndex + 1} of {questionList.length}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {questionList.map((_, i) => {
                  const h = history[i];
                  let bg = '#F1F5F9', col = '#64748B';
                  if (h) {
                    bg = h.isCorrect ? '#DCFCE7' : '#FEE2E2';
                    col = h.isCorrect ? '#166534' : '#991B1B';
                  } else if (i === currentIndex) {
                    bg = '#EEF2FF';
                    col = '#4F46E5';
                  }
                  return (
                    <div
                      key={i}
                      style={{
                        width: 24, height: 24, borderRadius: 6,
                        background: bg, color: col,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11.5, fontWeight: 700
                      }}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question Text */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 18, lineHeight: 1.5 }}>
              {curQ.q}
            </h3>

            {/* Options */}
            <div style={{ marginBottom: 16 }}>
              {curQ.opts.map((opt, optIdx) => {
                const letters = ['A', 'B', 'C', 'D'];
                let optClass = 'modern-quiz-option';
                if (submitted) {
                  if (optIdx === curQ.ans) optClass += ' correct';
                  else if (optIdx === selectedIdx) optClass += ' wrong';
                } else if (selectedIdx === optIdx) {
                  optClass += ' selected';
                }

                return (
                  <div
                    key={optIdx}
                    className={optClass}
                    onClick={() => handleSelect(optIdx)}
                  >
                    <div className="quiz-letter-badge">{letters[optIdx]}</div>
                    <div style={{ flex: 1 }}>{opt}</div>
                    {submitted && optIdx === curQ.ans && (
                      <CheckCircle2 size={18} color="#10B981" />
                    )}
                    {submitted && optIdx === selectedIdx && optIdx !== curQ.ans && (
                      <XCircle size={18} color="#EF4444" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            {submitted && (
              <div className={selectedIdx === curQ.ans ? 'info-callout green' : 'info-callout amber'}>
                <HelpCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>{selectedIdx === curQ.ans ? 'Correct!' : 'Incorrect.'}</strong> {curQ.exp}
                </div>
              </div>
            )}

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 14, borderTop: '1px solid #E2E8F0' }}>
              {!submitted ? (
                <button
                  type="button"
                  className="btn-modern primary"
                  disabled={selectedIdx === null}
                  onClick={handleSubmitAnswer}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-modern indigo"
                  onClick={handleNext}
                >
                  {currentIndex < questionList.length - 1 ? (
                    <>Next Question <ChevronRight size={14} /></>
                  ) : (
                    <>View Score Breakdown</>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Final Score Screen */
          <div>
            <div style={{ padding: 26, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0', textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: percentage >= 70 ? '#10B981' : '#F59E0B', marginBottom: 4 }}>
                {percentage}%
              </div>
              <div style={{ fontSize: 16.5, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
                You scored {score} out of {questionList.length}
              </div>
              <p style={{ fontSize: 13, color: '#64748B', maxWidth: 440, margin: '0 auto 16px' }}>
                {percentage >= 80
                  ? 'Outstanding comprehension! You have demonstrated a thorough command of RSA number theory and implementation security.'
                  : percentage >= 60
                  ? 'Passing score. Review the questions below to strengthen specific algebraic derivations.'
                  : 'We recommend reviewing the Simulation and Workbench sections before retaking.'}
              </p>
              <button
                type="button"
                className="btn-modern primary"
                onClick={handleReset}
              >
                <RotateCcw size={14} /> Retake Assessment
              </button>
            </div>

            {/* Answer breakdown */}
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
              Detailed Question Review:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history.map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    border: '1px solid #E2E8F0',
                    borderLeft: `4px solid ${h.isCorrect ? '#10B981' : '#EF4444'}`,
                    background: '#FFFFFF',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0F172A', marginBottom: 4 }}>
                    Q{i + 1}: {h.question}
                  </div>
                  <div style={{ fontSize: 12.5, color: h.isCorrect ? '#065F46' : '#991B1B', marginBottom: 2 }}>
                    Your response: <strong>{h.options[h.selected]}</strong>
                  </div>
                  {!h.isCorrect && (
                    <div style={{ fontSize: 12.5, color: '#065F46', marginBottom: 2 }}>
                      Correct answer: <strong>{h.options[h.correct]}</strong>
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 6, background: '#F8FAFC', padding: 8, borderRadius: 6 }}>
                    {h.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
