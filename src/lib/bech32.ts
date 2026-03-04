// src/lib/bech32.ts
// ============================================
// Pure Bech32 Encoder for Cardano Addresses
// Zero dependencies - implements BIP-0173
// Used to convert CIP-30 hex addresses to bech32
// ============================================

const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

function polymod(values: number[]): number {
  let chk = 1;
  for (const v of values) {
    const top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) {
      if ((top >> i) & 1) {
        chk ^= GENERATOR[i];
      }
    }
  }
  return chk;
}

function hrpExpand(hrp: string): number[] {
  const ret: number[] = [];
  for (let i = 0; i < hrp.length; i++) {
    ret.push(hrp.charCodeAt(i) >> 5);
  }
  ret.push(0);
  for (let i = 0; i < hrp.length; i++) {
    ret.push(hrp.charCodeAt(i) & 31);
  }
  return ret;
}

function createChecksum(hrp: string, data: number[]): number[] {
  const values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
  const mod = polymod(values) ^ 1;
  const ret: number[] = [];
  for (let p = 0; p < 6; p++) {
    ret.push((mod >> (5 * (5 - p))) & 31);
  }
  return ret;
}

function verifyChecksum(hrp: string, data: number[]): boolean {
  return polymod(hrpExpand(hrp).concat(data)) === 1;
}

/**
 * Convert a byte array (8-bit) to 5-bit groups for bech32
 */
function convertBits(
  data: Uint8Array,
  fromBits: number,
  toBits: number,
  pad: boolean
): number[] | null {
  let acc = 0;
  let bits = 0;
  const ret: number[] = [];
  const maxv = (1 << toBits) - 1;

  for (const value of data) {
    if (value < 0 || value >> fromBits !== 0) return null;
    acc = (acc << fromBits) | value;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      ret.push((acc >> bits) & maxv);
    }
  }

  if (pad) {
    if (bits > 0) {
      ret.push((acc << (toBits - bits)) & maxv);
    }
  } else if (bits >= fromBits || (acc << (toBits - bits)) & maxv) {
    return null;
  }

  return ret;
}

/**
 * Encode data as bech32
 */
export function bech32Encode(hrp: string, data5bit: number[]): string {
  const checksum = createChecksum(hrp, data5bit);
  const combined = data5bit.concat(checksum);
  let result = hrp + "1";
  for (const d of combined) {
    result += CHARSET.charAt(d);
  }
  return result;
}

export function bech32Decode(str: string): { hrp: string; data: number[] } | null {
  const lowered = str.toLowerCase();
  const pos = lowered.lastIndexOf("1");
  if (pos < 1 || pos + 7 > lowered.length || lowered.length > 1023) return null;

  const hrp = lowered.substring(0, pos);
  const data: number[] = [];
  for (let i = pos + 1; i < lowered.length; i++) {
    const d = CHARSET.indexOf(lowered.charAt(i));
    if (d === -1) return null;
    data.push(d);
  }

  if (!verifyChecksum(hrp, data)) return null;
  return { hrp, data: data.slice(0, data.length - 6) };
}


export function hexToBech32Address(hexAddress: string): string {
  if (!hexAddress || hexAddress.length < 2) return hexAddress;

  // If it already starts with "addr", return as-is
  if (hexAddress.startsWith("addr")) return hexAddress;

  const bytes = hexToBytes(hexAddress);
  if (bytes.length === 0) return hexAddress;

  // First byte: upper nibble = type, lower nibble = network
  const firstByte = bytes[0];
  const addressType = (firstByte >> 4) & 0x0f;
  const networkId = firstByte & 0x0f;

  // Byron addresses (type 8) are base58-encoded, not bech32
  if (addressType === 8) {
    console.warn("Byron addresses are not supported for bech32 conversion");
    return hexAddress;
  }

  // Determine HRP based on network ID
  // networkId 0 = testnet (preview/preprod), networkId 1 = mainnet
  const hrp = networkId === 0 ? "addr_test" : "addr";

  // Convert 8-bit bytes to 5-bit groups
  const data5bit = convertBits(bytes, 8, 5, true);
  if (!data5bit) {
    console.error("Failed to convert address bits");
    return hexAddress;
  }

  return bech32Encode(hrp, data5bit);
}

/**
 * Convert a bech32 address back to hex
 */
export function bech32ToHexAddress(bech32Address: string): string | null {
  const decoded = bech32Decode(bech32Address);
  if (!decoded) return null;

  const data8bit = convertBits(new Uint8Array(decoded.data), 5, 8, false);
  if (!data8bit) return null;

  return bytesToHex(new Uint8Array(data8bit));
}

/**
 * Detect if a string is a hex address or bech32
 */
export function isHexAddress(address: string): boolean {
  return /^[0-9a-fA-F]+$/.test(address) && !address.startsWith("addr");
}

/**
 * Ensure address is in bech32 format (convert if hex)
 */
export function ensureBech32(address: string): string {
  if (!address) return address;
  if (address.startsWith("addr")) return address; // Already bech32
  if (isHexAddress(address)) return hexToBech32Address(address);
  return address;
}

// ============================================
// UTILITIES
// ============================================

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substr(i, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
