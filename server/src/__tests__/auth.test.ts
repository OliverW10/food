import jwt from 'jsonwebtoken';

// We recommend installing an extension to run jest tests.

const USER = { id: 123, email: 'user@example.com' };

type AuthModule = typeof import('../service/auth');

async function loadAuth(): Promise<AuthModule> {
    jest.resetModules();
    process.env.JWT_SECRET = 'test_jwt_secret';
    process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';
    const mod = await import('../service/auth');
    return mod;
}

describe('auth service', () => {
    let auth: AuthModule;

    const silenceLogs = () => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
    };

    beforeAll(async () => {
        silenceLogs();
        auth = await loadAuth();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe('hashPassword / comparePassword', () => {
        it('hashes a password and validates with comparePassword', async () => {
            const hash = await auth.hashPassword('secret123');
            expect(hash).not.toBe('secret123');
            expect(hash).toMatch(/^\$2[aby]\$/);
            const ok = await auth.comparePassword('secret123', hash);
            expect(ok).toBe(true);
        });

        it('returns false for wrong password', async () => {
            const hash = await auth.hashPassword('secret123');
            const ok = await auth.comparePassword('wrong', hash);
            expect(ok).toBe(false);
        });

        it('produces different hashes for same password (salted)', async () => {
            const h1 = await auth.hashPassword('repeat-pass');
            const h2 = await auth.hashPassword('repeat-pass');
            expect(h1).not.toEqual(h2);
        });
    });

    describe('createAccessToken / verifyAccessToken', () => {
        it('creates a valid access token containing sub and email', () => {
            const token = auth.createAccessToken(USER);
            const payload = auth.verifyAccessToken(token) as jwt.JwtPayload;
            expect(payload.sub).toBe(USER.id);
            expect(payload.email).toBe(USER.email);
            expect(typeof payload.iat).toBe('number');
            expect(typeof payload.exp).toBe('number');
        });

        it('rejects an invalid (tampered) access token', () => {
            const token = auth.createAccessToken(USER);
            const parts = token.split('.');
            const tampered = [parts[0], parts[1].replace(/.$/, parts[1].slice(-1) === 'A' ? 'B' : 'A'), parts[2]].join('.');
            expect(() => auth.verifyAccessToken(tampered)).toThrow();
        });

        it('rejects a token signed with a different secret', () => {
            const foreign = jwt.sign({ sub: USER.id }, 'another_secret', { expiresIn: '15m' });
            expect(() => auth.verifyAccessToken(foreign)).toThrow();
        });
    });

    describe('createRefreshToken / verifyRefreshToken', () => {
        it('creates a valid refresh token with expected claims', () => {
            const token = auth.createRefreshToken(USER);
            const payload = auth.verifyRefreshToken(token) as jwt.JwtPayload;
            expect(payload.sub).toBe(USER.id);
            expect(payload.email).toBe(USER.email);
            expect(payload.exp).toBeGreaterThan(payload.iat!);
        });

        it('access and refresh tokens differ', () => {
            const access = auth.createAccessToken(USER);
            const refresh = auth.createRefreshToken(USER);
            expect(access).not.toEqual(refresh);
        });

        it('rejects invalid refresh token', () => {
            const token = auth.createRefreshToken(USER);
            const parts = token.split('.');
            const tampered = [parts[0], parts[1], parts[2].replace(/.$/, 'A')].join('.');
            const output: string | jwt.JwtPayload | null = null;
            expect(() => auth.verifyRefreshToken(tampered)).toThrow();
            expect(output).toBe(null);
        });
    });

    describe('environment handling', () => {
        it('re-loads with new secrets when module is re-imported', async () => {
            process.env.JWT_SECRET = 'new_secret_value';
            process.env.REFRESH_TOKEN_SECRET = 'new_refresh_secret_value';
            const fresh = await loadAuth();
            const t = fresh.createAccessToken(USER);
            expect(() => auth.verifyAccessToken(t)).toThrow();
            expect(() => fresh.verifyAccessToken(t)).not.toThrow();
        });
    });
});
