import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt, { SignOptions } from 'jsonwebtoken';

dotenv.config({ path: '.env' });

console.log(process.env.DATABASE_URL);
console.log(process.env.JWT_SECRET);

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = '15m';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const REFRESH_TOKEN_EXPIRES_IN: SignOptions['expiresIn'] = '7d';

console.log("JWT_SECRET:", JWT_SECRET ? 'set' : 'NOT SET');
console.log("REFRESH_TOKEN_SECRET:", REFRESH_TOKEN_SECRET ? 'set' : 'NOT SET');

export function hashPassword(password: string) {
    // cost factor of 10 is a good balance between security and performance
    return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

export function createAccessToken(user: { id: number; email: string }) {
    return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function createRefreshToken(user: { id: number; email: string }) {
    return jwt.sign({ sub: user.id, email: user.email }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
}