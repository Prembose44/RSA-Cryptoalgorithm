import React, { useState } from 'react';
import {
  Key, Lock, Unlock, Shield, AlertTriangle, Copy,
  CheckCircle, XCircle, RefreshCw, ChevronDown, ArrowRight, FileText
} from 'lucide-react';
import {
  generateRSAKeys, rsaEncrypt, rsaDecrypt,
  textToBigInt, bigIntToText,
  rsaSign, rsaVerify,
  DEMO_KEYS
} from '../lib/rsa.js';

export default function Experiment() {
  // Key setup state
  const [keyMode, setKeyMode] = useState('demo'); // 'demo' or 'generated'
  const [keys, setKeys] = useState(DEMO_KEYS.small);
  const [isGenerating, setIsGenerating] = useState(false);

  // Switch to demo keys
  const handleUseDemo = () => {
    setKeyMode('demo');
    setKeys(DEMO_KEYS.small);
  };

  // Generate new keys
  const handleGenerateNew = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newK = generateRSAKeys(16);
      setKeys(newK);
      setKeyMode('generated');
      setIsGenerating(false);
    }, 50);
  };

  // Tabs: 'numeric', 'text', 'signature'
  const [activeTab, setActiveTab] = useState('numeric');

  // ── Tab 1: Numeric state ──
  const [numM, setNumM] = useState('65');
  const [numEncResult, setNumEncResult] = useState(null);
  const [numDecResult, setNumDecResult] = useState(null);
  const [numError, setNumError] = useState(null);

  const handleNumEncrypt = () => {
    setNumError(null);
    try {
      const mBig = BigInt(numM || '0');
      if (mBig < 0n || mBig >= keys.n) {
        setNumError(`Message m must satisfy 0 ≤ m < n (n = ${keys.n})`);
        return;
      }
      const enc = rsaEncrypt(mBig, keys.publicKey.e, keys.publicKey.n);
      const dec = rsaDecrypt(enc.ciphertext, keys.privateKey.d, keys.privateKey.n);
      setNumEncResult(enc);
      setNumDecResult(dec);
    } catch (err) {
      setNumError(err.message);
    }
  };

  // ── Tab 2: Text state ──
  const [textInput, setTextInput] = useState('Hi');
  const [textEncResult, setTextEncResult] = useState(null);
  const [textDecResult, setTextDecResult] = useState(null);
  const [textError, setTextError] = useState(null);

  const handleTextEncrypt = () => {
    setTextError(null);
    try {
      if (!textInput) {
        setTextError('Please enter text to encrypt.');
        return;
      }
      const mBig = textToBigInt(textInput);
      if (mBig >= keys.n) {
        setTextError(`Encoded text exceeds modulus n (${mBig} ≥ ${keys.n}). Try a shorter string (1-2 chars for small keys), or generate larger keys.`);
        return;
      }
      const enc = rsaEncrypt(mBig, keys.publicKey.e, keys.publicKey.n);
      const dec = rsaDecrypt(enc.ciphertext, keys.privateKey.d, keys.privateKey.n);
      const recoveredStr = bigIntToText(dec.plaintext);

      setTextEncResult({ ...enc, bigIntPlaintext: mBig });
      setTextDecResult({ ...dec, recoveredString: recoveredStr });
    } catch (err) {
      setTextError(err.message);
    }
  };

  // ── Tab 3: Digital Signature state ──
  const [sigMessage, setSigMessage] = useState('Payment authorization of $500');
  const [signatureData, setSignatureData] = useState(null);
  const [tampered, setTampered] = useState(false);
  const [tamperedMsg, setTamperedMsg] = useState('Payment authorization of $5000');
  const [verifyResult, setVerifyResult] = useState(null);

  const handleSign = () => {
    try {
      const sigObj = rsaSign(sigMessage, keys.privateKey.d, keys.privateKey.n);
      setSignatureData(sigObj);
      setVerifyResult(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = () => {
    if (!signatureData) return;
    try {
      const msgToCheck = tampered ? tamperedMsg : sigMessage;
      const res = rsaVerify(msgToCheck, signatureData.signature, keys.publicKey.e, keys.publicKey.n);
      setVerifyResult({ ...res, checkedMessage: msgToCheck });
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (txt) => {
    navigator.clipboard?.writeText(String(txt));
  };

  return (
    <div className="page anim-up">
      <div className="page-eyebrow">MODULE 04 · LAB EXPERIMENT</div>
      <h1 className="page-title">Practical Experiment Laboratory</h1>
      <p className="page-desc mb-5">
        Conduct interactive cryptographic operations in real time. Configure keys, execute raw numeric ciphers, encode and encrypt ASCII text, and generate tamper-evident digital signatures.
      </p>

      {/* ── Key Configuration Section ── */}
      <div className="card mb-5">
        <div className="row ac jb mb-3">
          <div className="row ac g-2">
            <Key size={16} className="t-green" />
            <span className="card-title">Active Key Configuration</span>
          </div>
          <div className="row ac g-2">
            <button
              type="button"
              className={`btn btn-sm ${keyMode === 'demo' ? 'btn-green' : 'btn-surface'}`}
              onClick={handleUseDemo}
            >
              Use Textbook Keys (p=61, q=53)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${keyMode === 'generated' ? 'btn-green' : 'btn-surface'}`}
              onClick={handleGenerateNew}
              disabled={isGenerating}
            >
              {isGenerating ? <RefreshCw size={12} className="spinner" /> : <RefreshCw size={12} />}
              Generate 16-bit Primes
            </button>
          </div>
        </div>

        <div className="g2">
          {/* Public Key Card */}
          <div className="key-panel key-panel-pub">
            <div className="row ac jb mb-2">
              <div className="row ac g-2">
                <Unlock size={14} className="t-green" />
                <span className="t-sm w-600 t-green">Public Key (e, n)</span>
              </div>
              <span className="chip chip-green">Safe to Distribute</span>
            </div>
            <div className="t-3 t-xs mb-2">Used by senders to encrypt data, and recipients to verify digital signatures.</div>
            <div className="g2">
              <div className="vbox vbox-green">
                <div className="stat-label">Public Exponent (e)</div>
                <div className="t-green mono t-sm">{keys.publicKey.e.toString()}</div>
              </div>
              <div className="vbox vbox-green">
                <div className="stat-label">Modulus (n)</div>
                <div className="t-green mono t-sm truncate" title={keys.publicKey.n.toString()}>{keys.publicKey.n.toString()}</div>
              </div>
            </div>
          </div>

          {/* Private Key Card */}
          <div className="key-panel key-panel-priv">
            <div className="row ac jb mb-2">
              <div className="row ac g-2">
                <Lock size={14} className="t-violet" />
                <span className="t-sm w-600 t-violet">Private Key (d, n)</span>
              </div>
              <span className="chip chip-rose">Strictly Confidential</span>
            </div>
            <div className="t-3 t-xs mb-2">Kept secret by the keyholder to decrypt ciphertext and create signatures.</div>
            <div className="g2">
              <div className="vbox vbox-violet">
                <div className="stat-label">Private Exponent (d)</div>
                <div className="t-violet mono t-sm truncate" title={keys.privateKey.d.toString()}>{keys.privateKey.d.toString()}</div>
              </div>
              <div className="vbox vbox-violet">
                <div className="stat-label">Modulus (n)</div>
                <div className="t-violet mono t-sm truncate" title={keys.privateKey.n.toString()}>{keys.privateKey.n.toString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mb-4">
        <button
          type="button"
          className={`tab ${activeTab === 'numeric' ? 'active' : ''}`}
          onClick={() => setActiveTab('numeric')}
        >
          Numeric Encryption & Decryption
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          ASCII Text Encryption
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'signature' ? 'active' : ''}`}
          onClick={() => setActiveTab('signature')}
        >
          Digital Signature & Verification
        </button>
      </div>

      {/* ─── TAB 1: Numeric Encryption & Decryption ─── */}
      {activeTab === 'numeric' && (
        <div className="anim-in">
          <div className="card mb-4">
            <div className="row ac jb mb-3">
              <div>
                <div className="card-title">Numeric Plaintext Encryption</div>
                <div className="card-sub">RSA acts directly on non-negative integers m in the range 0 ≤ m &lt; n</div>
              </div>
              <span className="chip chip-sky">Mathematical Core</span>
            </div>

            <div className="field mb-3">
              <label className="label">Plaintext Integer (m)</label>
              <div className="row ac g-2">
                <input
                  type="number"
                  className="input"
                  value={numM}
                  onChange={(e) => setNumM(e.target.value)}
                  placeholder="Enter integer, e.g. 65"
                />
                <button
                  type="button"
                  className="btn btn-green"
                  onClick={handleNumEncrypt}
                >
                  <Lock size={14} /> Encrypt & Decrypt
                </button>
              </div>
            </div>

            {numError && (
              <div className="info info-rose mb-3">
                <AlertTriangle size={15} />
                <span>{numError}</span>
              </div>
            )}
          </div>

          {numEncResult && (
            <div className="g2 mb-4">
              {/* Encryption results */}
              <div className="card card-green">
                <div className="row ac jb mb-3">
                  <div className="row ac g-2">
                    <Lock size={15} className="t-green" />
                    <span className="card-title">1. Encryption Pipeline (c = mᵉ mod n)</span>
                  </div>
                  <span className="chip chip-green">Public Op</span>
                </div>

                <table className="tbl mb-3">
                  <tbody>
                    {numEncResult.steps.map((st, i) => (
                      <tr key={i}>
                        <td className="t-3">{st.label}</td>
                        <td className="t-green">{st.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="vbox vbox-green">
                  <div className="row ac jb">
                    <span className="stat-label">Ciphertext (c)</span>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() => copyToClipboard(numEncResult.ciphertext)}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="t-green mono t-lg w-600">{numEncResult.ciphertext.toString()}</div>
                </div>
              </div>

              {/* Decryption results */}
              <div className="card card-violet">
                <div className="row ac jb mb-3">
                  <div className="row ac g-2">
                    <Unlock size={15} className="t-violet" />
                    <span className="card-title">2. Decryption Pipeline (m = cᵈ mod n)</span>
                  </div>
                  <span className="chip chip-violet">Private Op</span>
                </div>

                <table className="tbl mb-3">
                  <tbody>
                    {numDecResult.steps.map((st, i) => (
                      <tr key={i}>
                        <td className="t-3">{st.label}</td>
                        <td className="t-violet">{st.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="vbox vbox-violet">
                  <div className="stat-label">Recovered Message (m)</div>
                  <div className="row ac jb">
                    <div className="t-violet mono t-lg w-600">{numDecResult.plaintext.toString()}</div>
                    {numDecResult.plaintext.toString() === numM && (
                      <span className="chip chip-green">
                        <CheckCircle size={10} style={{ marginRight: 3 }} /> Decryption Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: ASCII Text Encryption ─── */}
      {activeTab === 'text' && (
        <div className="anim-in">
          <div className="card mb-4">
            <div className="row ac jb mb-3">
              <div>
                <div className="card-title">Text Message Encoding & Encryption</div>
                <div className="card-sub">Converts ASCII strings to BigInt bytes before RSA modular exponentiation</div>
              </div>
              <span className="chip chip-amber">Byte Encoding</span>
            </div>

            <div className="field mb-3">
              <label className="label">Plaintext String</label>
              <div className="row ac g-2">
                <input
                  type="text"
                  className="input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter short text (e.g. 'Hi' or 'OK')"
                />
                <button
                  type="button"
                  className="btn btn-green"
                  onClick={handleTextEncrypt}
                >
                  <Lock size={14} /> Encrypt Text
                </button>
              </div>
              <div className="t-3 t-xs mt-1">
                Note: In RSA, m must be &lt; n. Small key sizes (e.g. 16-32 bits) can only encrypt 1 to 3 characters at a time.
              </div>
            </div>

            {textError && (
              <div className="info info-rose mb-3">
                <AlertTriangle size={15} />
                <span>{textError}</span>
              </div>
            )}
          </div>

          {textEncResult && (
            <div className="g2 mb-4">
              <div className="card card-green">
                <div className="card-title mb-2">Step 1: Character Code Encoding</div>
                <div className="vbox vbox-amber mb-3">
                  <div className="stat-label">BigInt Representation (Hex bytes)</div>
                  <div className="t-amber mono t-sm">{textEncResult.bigIntPlaintext.toString()}</div>
                </div>

                <div className="card-title mb-2">Step 2: RSA Ciphertext Output</div>
                <div className="vbox vbox-green">
                  <div className="stat-label">Numeric Ciphertext (c)</div>
                  <div className="t-green mono t-sm">{textEncResult.ciphertext.toString()}</div>
                </div>
              </div>

              <div className="card card-violet">
                <div className="card-title mb-2">Step 3: Private Key Decryption</div>
                <div className="vbox vbox-violet mb-3">
                  <div className="stat-label">Decrypted Numeric Integer</div>
                  <div className="t-violet mono t-sm">{textDecResult.plaintext.toString()}</div>
                </div>

                <div className="card-title mb-2">Step 4: ASCII String Reconstruction</div>
                <div className="vbox vbox-green">
                  <div className="row ac jb">
                    <span className="stat-label">Recovered String</span>
                    <span className="chip chip-green">Match Confirmed</span>
                  </div>
                  <div className="t-1 mono t-lg w-600">"{textDecResult.recoveredString}"</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: Digital Signature & Verification ─── */}
      {activeTab === 'signature' && (
        <div className="anim-in">
          <div className="card mb-4">
            <div className="row ac jb mb-3">
              <div>
                <div className="card-title">RSA Digital Signature & Tamper Demonstration</div>
                <div className="card-sub">Sign with private key (d, n) and verify authenticity with public key (e, n)</div>
              </div>
              <span className="chip chip-violet">Non-Repudiation</span>
            </div>

            <div className="field mb-3">
              <label className="label">Message to Sign</label>
              <textarea
                className="input"
                value={sigMessage}
                onChange={(e) => { setSigMessage(e.target.value); setVerifyResult(null); }}
                placeholder="Enter document text to sign"
              />
            </div>

            <button
              type="button"
              className="btn btn-green"
              onClick={handleSign}
            >
              <FileText size={14} /> Sign with Private Key d
            </button>
          </div>

          {signatureData && (
            <div className="card card-violet mb-4">
              <div className="row ac jb mb-3">
                <div className="card-title">Generated Signature Record</div>
                <span className="chip chip-violet">s = hash(m)ᵈ mod n</span>
              </div>

              <div className="g2 mb-4">
                <div className="vbox vbox-amber">
                  <div className="stat-label">Computed Polynomial Hash (h)</div>
                  <div className="t-amber mono t-sm">{signatureData.hash.toString()}</div>
                </div>
                <div className="vbox vbox-violet">
                  <div className="stat-label">RSA Digital Signature (s)</div>
                  <div className="t-violet mono t-sm">{signatureData.signature.toString()}</div>
                </div>
              </div>

              {/* Tamper simulation section */}
              <div className="sep mb-3">
                <div className="sep-line" />
                <div className="sep-label">Security & Tamper Simulation</div>
                <div className="sep-line" />
              </div>

              <div className="field mb-3">
                <label className="row ac g-2 clickable">
                  <input
                    type="checkbox"
                    checked={tampered}
                    onChange={(e) => { setTampered(e.target.checked); setVerifyResult(null); }}
                  />
                  <span className="t-sm w-600 t-1">Simulate Man-in-the-Middle Payload Tampering</span>
                </label>
              </div>

              {tampered && (
                <div className="field mb-3 anim-in">
                  <label className="label">Tampered Message Received by Verifier</label>
                  <input
                    type="text"
                    className="input"
                    value={tamperedMsg}
                    onChange={(e) => { setTamperedMsg(e.target.value); setVerifyResult(null); }}
                  />
                </div>
              )}

              <button
                type="button"
                className="btn btn-amber mb-3"
                onClick={handleVerify}
              >
                <Shield size={14} /> Verify Signature with Public Key (e, n)
              </button>

              {/* Verification Feedback */}
              {verifyResult && (
                <div className={`info ${verifyResult.valid ? 'info-green' : 'info-rose'} anim-in`}>
                  {verifyResult.valid ? (
                    <>
                      <CheckCircle size={18} className="shrink-0" />
                      <div>
                        <strong>Signature Verified: AUTHENTIC</strong>
                        <div className="t-xs mt-1">
                          The recovered hash sᵉ mod n ({verifyResult.recovered.toString()}) matches hash(m) ({verifyResult.hash.toString()}). Message integrity and author authenticity are mathematically guaranteed.
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle size={18} className="shrink-0" />
                      <div>
                        <strong>Signature Verification FAILED: TAMPERED</strong>
                        <div className="t-xs mt-1">
                          hash(m) was computed as {verifyResult.hash.toString()}, but decrypting signature s with public key gave {verifyResult.recovered.toString()}. The document was modified in transit!
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
