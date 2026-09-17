const PIN_LENGTH = 6;
const HASH_ITERATIONS = 120_000;

function toBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function randomBytes(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function derivePinHash(pin: string, salt: Uint8Array) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pin),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: HASH_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return new Uint8Array(bits);
}

export function isValidPin(pin: string) {
  return /^\d{6}$/.test(pin);
}

export async function createPinSecret(pin: string) {
  if (!isValidPin(pin)) {
    throw new Error("PIN phải gồm đúng 6 chữ số.");
  }

  const salt = randomBytes(16);
  const hash = await derivePinHash(pin, salt);
  return { pinSalt: toBase64(salt), pinHash: toBase64(hash) };
}

export async function verifyPin(
  pin: string,
  secret: { pinSalt: string; pinHash: string },
) {
  if (!isValidPin(pin)) {
    return false;
  }

  const actual = await derivePinHash(pin, fromBase64(secret.pinSalt));
  const expected = fromBase64(secret.pinHash);
  if (actual.length !== expected.length) {
    return false;
  }

  let difference = 0;
  actual.forEach((byte, index) => {
    difference |= byte ^ expected[index];
  });
  return difference === 0;
}

export { PIN_LENGTH };
