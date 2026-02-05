import crypto from 'crypto';

// Ensure we have a secure key. In production this should come from env.
// For now we will use a generated one or process.env.ENCRYPTION_KEY
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES, this is always 16
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

function getKey(secret: string) {
    // Determine if the secret is a hex string (common in env vars) or just text
    // If it's hex and 64 chars (32 bytes), use it directly. 
    // Otherwise derive.
    if (/^[0-9a-fA-F]{64}$/.test(secret)) {
        return Buffer.from(secret, 'hex');
    }
    // Fallback: This is less secure if secret is weak. 
    // Ideally we enforce a 32-byte hex key in env.
    return crypto.scryptSync(secret, 'salt', 32);
}

export const EncryptionService = {
    encrypt(text: string, secretKey: string): string {
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = getKey(secretKey);

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const tag = cipher.getAuthTag();

        // Format: iv:encrypted:tag
        return `${iv.toString('hex')}:${encrypted}:${tag.toString('hex')}`;
    },

    decrypt(encryptedText: string, secretKey: string): string {
        const [ivHex, encryptedHex, tagHex] = encryptedText.split(':');

        if (!ivHex || !encryptedHex || !tagHex) {
            throw new Error('Invalid encrypted format');
        }

        const iv = Buffer.from(ivHex, 'hex');
        const tag = Buffer.from(tagHex, 'hex');
        const key = getKey(secretKey);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
};
