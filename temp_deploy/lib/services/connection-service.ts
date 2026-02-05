import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Types
export type ConnectionType = 'postgres' | 'mysql' | 'sqlserver' | 'snowflake';

export interface CreateConnectionDTO {
    organizationId: string;
    name: string;
    type: ConnectionType;
    connectionString: string;
}

// Environment Variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-dev-key-must-be-32-bytes!!'; // 32 chars
const ALGORITHM = 'aes-256-gcm';

export class ConnectionService {

    /**
     * Encrypts a connection string using AES-256-GCM
     */
    static encrypt(text: string): string {
        const iv = randomBytes(16);
        const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag().toString('hex');

        // Format: iv:authTag:encryptedContent
        return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    }

    /**
     * Decrypts a connection string
     */
    static decrypt(encryptedText: string): string {
        const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');

        const decipher = createDecipheriv(
            ALGORITHM,
            Buffer.from(ENCRYPTION_KEY),
            Buffer.from(ivHex, 'hex')
        );

        decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    /**
     * Validates a Postgres connection string (Basic check)
     */
    static validateConnectionString(url: string): boolean {
        return url.startsWith('postgresql://') || url.startsWith('postgres://');
    }
}
