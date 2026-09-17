function encode(value: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(value)));
}

function decode(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

export function supportsBiometric() {
  return (
    window.isSecureContext &&
    "PublicKeyCredential" in window &&
    typeof navigator.credentials?.create === "function" &&
    typeof navigator.credentials?.get === "function"
  );
}

export async function registerBiometric() {
  if (!supportsBiometric()) {
    throw new Error("Thiết bị hoặc trình duyệt này chưa hỗ trợ xác thực sinh trắc học.");
  }

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: { name: "e2m" },
      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: "e2m-user",
        displayName: "e2m",
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "preferred",
      },
      timeout: 60_000,
      attestation: "none",
    },
  });

  if (!(credential instanceof PublicKeyCredential)) {
    throw new Error("Không thể tạo thông tin xác thực trên thiết bị này.");
  }

  return encode(credential.rawId);
}

export async function verifyBiometric(credentialId: string) {
  if (!supportsBiometric()) {
    throw new Error("Thiết bị hoặc trình duyệt này chưa hỗ trợ xác thực sinh trắc học.");
  }

  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials: [
        { id: decode(credentialId), type: "public-key", transports: ["internal"] },
      ],
      userVerification: "required",
      timeout: 60_000,
    },
  });

  return credential instanceof PublicKeyCredential;
}
