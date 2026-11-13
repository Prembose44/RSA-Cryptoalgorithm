/**
 * RSA Core Algorithm — Pure JavaScript implementation using BigInt
 * No external dependencies. All operations run in the browser.
 */

// ─── Utility helpers ───────────────────────────────────────────────────────

/** Greatest Common Divisor (Euclidean algorithm) */
export function gcd(a, b) {
  a = BigInt(a); b = BigInt(b);
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** Extended Euclidean Algorithm — returns { g, x, y } such that a*x + b*y = g */
export function extendedGcd(a, b) {
  a = BigInt(a); b = BigInt(b);
  if (b === 0n) return { g: a, x: 1n, y: 0n };
  const { g, x, y } = extendedGcd(b, a % b);
  return { g, x: y, y: x - (a / b) * y };
}

/** Modular inverse of a mod m (a must be coprime to m) */
export function modInverse(a, m) {
  a = BigInt(a); m = BigInt(m);
  const { g, x } = extendedGcd(a, m);
  if (g !== 1n) throw new Error(`No modular inverse exists: gcd(${a},${m}) = ${g}`);
  return ((x % m) + m) % m;
}

/** Fast modular exponentiation: base^exp mod mod */
export function modPow(base, exp, mod) {
  base = BigInt(base); exp = BigInt(exp); mod = BigInt(mod);
  if (mod === 1n) return 0n;
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    exp = exp >> 1n;
    base = (base * base) % mod;
  }
  return result;
}

/** Miller-Rabin primality test — returns true if n is probably prime */
export function millerRabin(n, k = 10) {
  n = BigInt(n);
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;

  // Write n-1 as 2^r * d
  let r = 0n, d = n - 1n;
  while (d % 2n === 0n) {
    r++;
    d /= 2n;
  }

  const witnesses = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  for (let i = 0; i < k && i < witnesses.length; i++) {
    const a = witnesses[i];
    if (a >= n) continue;
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let cont = false;
    for (let j = 0n; j < r - 1n; j++) {
      x = (x * x) % n;
      if (x === n - 1n) { cont = true; break; }
    }
    if (!cont) return false;
  }
  return true;
}

/** Generate a random BigInt in range [min, max] */
export function randomBigInt(min, max) {
  const range = max - min;
  const bits = range.toString(2).length;
  let rand;
  do {
    rand = BigInt('0x' + [...Array(Math.ceil(bits / 4))].map(() =>
      Math.floor(Math.random() * 16).toString(16)).join(''));
    rand = rand % (range + 1n);
  } while (rand < 0n);
  return min + rand;
}

/** Generate a random probable prime of approximately `bits` bits */
export function generatePrime(bits = 16) {
  const min = 1n << BigInt(bits - 1);
  const max = (1n << BigInt(bits)) - 1n;
  let candidate;
  do {
    candidate = randomBigInt(min, max);
    if (candidate % 2n === 0n) candidate += 1n;
  } while (!millerRabin(candidate));
  return candidate;
}

// ─── RSA Key Generation ────────────────────────────────────────────────────

/**
 * Generate RSA key pair.
 * @param {number} bitSize — bit size of each prime (total modulus = 2×bitSize). Default 16 (for pedagogy).
 * @returns {{ p, q, n, phi, e, d, publicKey: {e,n}, privateKey: {d,n}, steps }}
 */
export function generateRSAKeys(bitSize = 16) {
  const steps = [];

  // Step 1: Choose two distinct primes p and q
  let p, q;
  p = generatePrime(bitSize);
  do { q = generatePrime(bitSize); } while (q === p);

  steps.push({
    id: 'primes',
    title: 'Choose Primes p and q',
    description: `Select two large distinct prime numbers. Here we use ${bitSize}-bit primes for demonstration.`,
    formula: `p = ${p}\nq = ${q}`,
    values: { p: p.toString(), q: q.toString() },
  });

  // Step 2: Compute n = p × q
  const n = p * q;
  steps.push({
    id: 'modulus',
    title: 'Compute Modulus n = p × q',
    description: `The modulus n is the product of p and q. It forms part of both the public and private keys. Its bit-length determines RSA security.`,
    formula: `n = p × q\nn = ${p} × ${q}\nn = ${n}`,
    values: { n: n.toString() },
  });

  // Step 3: Compute Euler's totient φ(n) = (p-1)(q-1)
  const phi = (p - 1n) * (q - 1n);
  steps.push({
    id: 'totient',
    title: "Compute Euler's Totient φ(n) = (p−1)(q−1)",
    description: `φ(n) counts integers in [1,n] coprime to n. By Euler's theorem, aᵠ⁽ⁿ⁾ ≡ 1 (mod n) for any a coprime to n — this is the mathematical foundation of RSA.`,
    formula: `φ(n) = (p − 1) × (q − 1)\nφ(n) = (${p} − 1) × (${q} − 1)\nφ(n) = ${p - 1n} × ${q - 1n}\nφ(n) = ${phi}`,
    values: { phi: phi.toString() },
  });

  // Step 4: Choose public exponent e
  // Commonly 65537; for small keys pick smallest valid e
  let e = 65537n;
  if (e >= phi || gcd(e, phi) !== 1n) {
    e = 3n;
    while (e < phi && gcd(e, phi) !== 1n) e += 2n;
  }
  steps.push({
    id: 'pubexp',
    title: 'Choose Public Exponent e',
    description: `e must satisfy 1 < e < φ(n) and gcd(e, φ(n)) = 1. The most common choice is 65537 (a Fermat prime, efficient for exponentiation). For small keys we may use a smaller value.`,
    formula: `gcd(e, φ(n)) = gcd(${e}, ${phi}) = ${gcd(e, phi)}\nCondition satisfied: 1 < e < φ(n) ✓`,
    values: { e: e.toString() },
  });

  // Step 5: Compute private exponent d
  const d = modInverse(e, phi);
  steps.push({
    id: 'privexp',
    title: 'Compute Private Exponent d = e⁻¹ mod φ(n)',
    description: `d is the modular inverse of e modulo φ(n), computed via the Extended Euclidean Algorithm. It satisfies e·d ≡ 1 (mod φ(n)).`,
    formula: `d × e ≡ 1 (mod φ(n))\nd = e⁻¹ mod φ(n)\nd = ${e}⁻¹ mod ${phi}\nd = ${d}\n\nVerification: (e × d) mod φ(n) = (${e} × ${d}) mod ${phi} = ${(e * d) % phi}`,
    values: { d: d.toString() },
  });

  steps.push({
    id: 'keys',
    title: 'Key Pair Ready',
    description: `The public key (e, n) is shared openly. The private key (d, n) is kept secret. Security rests on the difficulty of factoring n to recover p and q.`,
    formula: `Public Key:  (e = ${e}, n = ${n})\nPrivate Key: (d = ${d}, n = ${n})`,
    values: {
      publicKey: `(e=${e}, n=${n})`,
      privateKey: `(d=${d}, n=${n})`,
    },
  });

  return {
    p, q, n, phi, e, d,
    publicKey: { e, n },
    privateKey: { d, n },
    steps,
  };
}

// ─── RSA Encryption ────────────────────────────────────────────────────────

/**
 * Encrypt a numeric message m with public key (e, n).
 * c = m^e mod n
 * m must satisfy 0 ≤ m < n
 */
export function rsaEncrypt(m, e, n) {
  m = BigInt(m); e = BigInt(e); n = BigInt(n);
  if (m < 0n || m >= n) throw new Error(`Message m must satisfy 0 ≤ m < n (n=${n})`);
  const c = modPow(m, e, n);
  return {
    ciphertext: c,
    steps: [
      { label: 'Plaintext m', value: m.toString() },
      { label: 'Public Exponent e', value: e.toString() },
      { label: 'Modulus n', value: n.toString() },
      { label: 'Formula', value: `c = m^e mod n = ${m}^${e} mod ${n}` },
      { label: 'Ciphertext c', value: c.toString() },
    ],
  };
}

/**
 * Decrypt ciphertext c with private key (d, n).
 * m = c^d mod n
 */
export function rsaDecrypt(c, d, n) {
  c = BigInt(c); d = BigInt(d); n = BigInt(n);
  const m = modPow(c, d, n);
  return {
    plaintext: m,
    steps: [
      { label: 'Ciphertext c', value: c.toString() },
      { label: 'Private Exponent d', value: d.toString() },
      { label: 'Modulus n', value: n.toString() },
      { label: 'Formula', value: `m = c^d mod n = ${c}^${d} mod ${n}` },
      { label: 'Recovered Plaintext m', value: m.toString() },
    ],
  };
}

// ─── Text ↔ Number encoding ────────────────────────────────────────────────

/** Encode ASCII string to BigInt (simple byte concatenation) */
export function textToBigInt(text) {
  let hex = '';
  for (let i = 0; i < text.length; i++) {
    hex += text.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return BigInt('0x' + (hex || '00'));
}

/** Decode BigInt back to ASCII string */
export function bigIntToText(n) {
  let hex = n.toString(16);
  if (hex.length % 2) hex = '0' + hex;
  let result = '';
  for (let i = 0; i < hex.length; i += 2) {
    result += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return result;
}

// ─── Digital Signature (RSA-based) ────────────────────────────────────────

/** Simple hash: sum of char codes mod n */
export function simpleHash(message, n) {
  n = BigInt(n);
  let h = 0n;
  for (let i = 0; i < message.length; i++) {
    h = (h * 31n + BigInt(message.charCodeAt(i))) % n;
  }
  return h;
}

/** Sign: s = hash(m)^d mod n */
export function rsaSign(message, d, n) {
  d = BigInt(d); n = BigInt(n);
  const h = simpleHash(message, n);
  const signature = modPow(h, d, n);
  return { hash: h, signature };
}

/** Verify: hash(m) == s^e mod n */
export function rsaVerify(message, signature, e, n) {
  e = BigInt(e); n = BigInt(n); signature = BigInt(signature);
  const h = simpleHash(message, n);
  const recovered = modPow(signature, e, n);
  return { valid: h === recovered, hash: h, recovered };
}

// ─── Step-by-step modPow trace ─────────────────────────────────────────────

/** Returns detailed steps of square-and-multiply exponentiation */
export function modPowSteps(base, exp, mod) {
  base = BigInt(base); exp = BigInt(exp); mod = BigInt(mod);
  const steps = [];
  let result = 1n;
  let b = base % mod;
  let e = exp;
  const expBits = exp.toString(2);

  steps.push({
    bit: null,
    expBinary: expBits,
    desc: `Start: result = 1, base = ${b}, exponent bits = ${expBits}`,
    result: result.toString(),
    base: b.toString(),
  });

  let tempExp = exp;
  let bit = 0;
  while (tempExp > 0n) {
    const curBit = tempExp % 2n;
    if (curBit === 1n) {
      const before = result;
      result = (result * b) % mod;
      steps.push({
        bit: bit,
        bitValue: 1,
        desc: `Bit ${bit} = 1 → result = (${before} × ${b}) mod ${mod} = ${result}`,
        result: result.toString(),
        base: b.toString(),
        operation: 'multiply',
      });
    } else {
      steps.push({
        bit: bit,
        bitValue: 0,
        desc: `Bit ${bit} = 0 → result unchanged = ${result}`,
        result: result.toString(),
        base: b.toString(),
        operation: 'skip',
      });
    }
    b = (b * b) % mod;
    tempExp = tempExp >> 1n;
    bit++;
    if (tempExp > 0n) {
      steps.push({
        bit: bit,
        desc: `Square base: b = (${steps[steps.length - 1].base} × ${steps[steps.length - 1].base}) mod ${mod} = ${b}`,
        result: result.toString(),
        base: b.toString(),
        operation: 'square',
      });
    }
  }

  steps.push({
    bit: null,
    desc: `Final result: ${base}^${exp} mod ${mod} = ${result}`,
    result: result.toString(),
    base: b.toString(),
    operation: 'final',
  });

  return steps;
}

// ─── Extended Euclidean steps ──────────────────────────────────────────────

export function extGcdSteps(a, b) {
  a = BigInt(a); b = BigInt(b);
  const rows = [];
  let old_r = a, r = b;
  let old_s = 1n, s = 0n;
  let old_t = 0n, t = 1n;

  while (r !== 0n) {
    const q = old_r / r;
    rows.push({
      q: q.toString(),
      r: old_r.toString(),
      s: old_s.toString(),
      t: old_t.toString(),
    });
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
    [old_t, t] = [t, old_t - q * t];
  }

  rows.push({
    q: '—',
    r: old_r.toString(),
    s: old_s.toString(),
    t: old_t.toString(),
    isResult: true,
  });

  return { rows, gcd: old_r, x: old_s, y: old_t };
}

// ─── Predefined small key sets for visualization ───────────────────────────

export const DEMO_KEYS = {
  tiny: {
    p: 11n, q: 13n, n: 143n, phi: 120n, e: 7n, d: 103n,
    publicKey: { e: 7n, n: 143n },
    privateKey: { d: 103n, n: 143n },
    label: 'Tiny (p=11, q=13) — pedagogical',
  },
  small: {
    p: 61n, q: 53n, n: 3233n, phi: 3120n, e: 17n, d: 2753n,
    publicKey: { e: 17n, n: 3233n },
    privateKey: { d: 2753n, n: 3233n },
    label: 'Small (p=61, q=53) — classic textbook example',
  },
};

/** Factorization check for educational purposes (only works on small n) */
export function tryFactor(n) {
  n = BigInt(n);
  if (n <= 3n) return null;
  for (let i = 2n; i * i <= n && i < 10000n; i++) {
    if (n % i === 0n) return { p: i, q: n / i };
  }
  return null;
}

export function formatBigInt(bn, maxLen = 60) {
  const s = bn.toString();
  if (s.length <= maxLen) return s;
  return s.slice(0, 20) + '…' + s.slice(-10);
}

// ─── Additional RSA Educational Math Utilities ──────────────────────────────

/** Least Common Multiple (LCM) */
export function lcm(a, b) {
  a = BigInt(a); b = BigInt(b);
  if (a === 0n || b === 0n) return 0n;
  return (a * b) / gcd(a, b);
}

/** Integer Square Root (floor of sqrt(n)) */
export function integerSqrt(n) {
  n = BigInt(n);
  if (n < 0n) throw new Error('Square root of negative number');
  if (n === 0n) return 0n;
  let x0 = n / 2n;
  if (x0 === 0n) return 1n;
  let x1 = (x0 + n / x0) / 2n;
  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + n / x0) / 2n;
  }
  return x0;
}

/** Integer Cube Root (exact or floor) */
export function integerCubeRoot(n) {
  n = BigInt(n);
  if (n < 0n) throw new Error('Cube root of negative number');
  if (n === 0n) return 0n;
  let low = 1n, high = n;
  while (low <= high) {
    const mid = (low + high) / 2n;
    const cube = mid * mid * mid;
    if (cube === n) return mid;
    if (cube < n) low = mid + 1n;
    else high = mid - 1n;
  }
  return high;
}

/** Fermat's Factorization Method — extremely fast when p and q are close */
export function fermatFactorization(n, maxSteps = 50000) {
  n = BigInt(n);
  if (n % 2n === 0n) return { p: 2n, q: n / 2n, steps: 1, success: true };
  let a = integerSqrt(n);
  if (a * a < n) a += 1n;
  
  let steps = 0;
  while (steps < maxSteps) {
    steps++;
    const b2 = a * a - n;
    const b = integerSqrt(b2);
    if (b * b === b2) {
      const p = a - b;
      const q = a + b;
      return { p, q, steps, success: true, diff: (q - p).toString() };
    }
    a += 1n;
  }
  return { p: null, q: null, steps, success: false };
}

/** Chinese Remainder Theorem (CRT) Fast RSA Decryption */
export function crtDecrypt(c, p, q, d) {
  c = BigInt(c); p = BigInt(p); q = BigInt(q); d = BigInt(d);
  const dp = d % (p - 1n);
  const dq = d % (q - 1n);
  const qinv = modInverse(q, p);

  // m1 = c^dp mod p, m2 = c^dq mod q
  const m1 = modPow(c, dp, p);
  const m2 = modPow(c, dq, q);

  // Garner's formula: h = qinv * (m1 - m2) mod p
  let diff = (m1 - m2) % p;
  if (diff < 0n) diff += p;
  const h = (qinv * diff) % p;
  const m = m2 + h * q;

  return { dp, dq, qinv, m1, m2, h, plaintext: m };
}
