import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { a as getDb, v as verification, b as account, c as session, u as user } from './env_BlcyOfWY.mjs';

async function sendEmail(apiKey, options) {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "LogoPrompt.pro",
          email: "noreply@logoprompt.pro"
        },
        to: [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.html
      })
    });
    if (!response.ok) {
      console.error("Failed to send email:", await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}
async function sendVerificationEmail(apiKey, email, verificationUrl) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4; margin: 0; padding: 40px 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 16px 0;">Verify your email</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
          Click the button below to verify your email address and complete your registration.
        </p>
        <a href="${verificationUrl}" style="display: inline-block; background: #DC2626; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Verify Email
        </a>
        <p style="color: #999; font-size: 14px; margin: 32px 0 0 0;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          LogoPrompt.pro - AI-powered logo generation
        </p>
      </div>
    </body>
    </html>
  `;
  await sendEmail(apiKey, {
    to: email,
    subject: "Verify your email - LogoPrompt.pro",
    html
  });
}
async function sendPasswordResetEmail(apiKey, email, resetUrl) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4; margin: 0; padding: 40px 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 16px 0;">Reset your password</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
          We received a request to reset your password. Click the button below to choose a new password.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #DC2626; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 14px; margin: 32px 0 0 0;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <p style="color: #999; font-size: 14px; margin: 8px 0 0 0;">
          This link will expire in 1 hour.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          LogoPrompt.pro - AI-powered logo generation
        </p>
      </div>
    </body>
    </html>
  `;
  await sendEmail(apiKey, {
    to: email,
    subject: "Reset your password - LogoPrompt.pro",
    html
  });
}

let authInstance = null;
let currentConfig = null;
function createAuth(config) {
  if (authInstance && currentConfig && currentConfig.databaseUrl === config.databaseUrl && currentConfig.secret === config.secret) {
    return authInstance;
  }
  const db = getDb(config.databaseUrl);
  authInstance = betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: user,
        session: session,
        account: account,
        verification: verification
      }
    }),
    baseURL: config.baseUrl,
    secret: config.secret,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        if (config.brevoApiKey) {
          await sendPasswordResetEmail(config.brevoApiKey, user.email, url);
        }
      }
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        if (config.brevoApiKey) {
          await sendVerificationEmail(config.brevoApiKey, user.email, url);
        }
      },
      sendOnSignUp: false
    },
    socialProviders: {
      google: {
        clientId: config.googleClientId,
        clientSecret: config.googleClientSecret
      }
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      // 7 days
      updateAge: 60 * 60 * 24,
      // Update session every 24 hours
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5
        // 5 minutes
      }
    },
    advanced: {
      generateId: () => crypto.randomUUID()
    }
  });
  currentConfig = config;
  return authInstance;
}
function getAuthFromEnv(env) {
  return createAuth({
    databaseUrl: env.DATABASE_URL,
    secret: env.BETTER_AUTH_SECRET,
    baseUrl: env.BETTER_AUTH_URL,
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    brevoApiKey: env.BREVO_API_KEY
  });
}

export { getAuthFromEnv as g };
