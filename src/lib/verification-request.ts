import { EmailProviderSendVerificationRequestParams } from "next-auth/providers";
import { createTransport } from "nodemailer"

interface Theme {
    colorScheme?: "auto" | "dark" | "light"
    logo?: string
    brandColor?: string
    buttonText?: string
  }

export async function sendVerificationRequest(params: EmailProviderSendVerificationRequestParams) {
  const { identifier, url, provider, theme } = params
  const { host } = new URL(url)
  const transport = createTransport(provider.server)
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, theme }),
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }
}
 
function html({ url, host, theme }: { url: string; host: string; theme: Theme }) {
  const escapedHost = host.replace(/\./g, "&#8203;.");
  const brandColor = theme.brandColor || "#346df1";
  const color = {
    background: "#f4f4f7",
    text: "#333333",
    mainBackground: "#ffffff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#ffffff",
  };

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Sign in to ${escapedHost}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: ${color.background};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${color.background}; padding: 40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: ${color.mainBackground}; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="padding: 40px 40px 20px 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; color: ${color.text};">
                <h1 style="margin: 0 0 10px; font-size: 26px;">Welcome Back 👋</h1>
                <p style="margin: 0; font-size: 16px; line-height: 24px;">
                  Click the button below to securely sign in to <strong>${escapedHost}</strong>.
                  This link will expire shortly for your security.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 30px 40px;">
                <a href="${url}" target="_blank"
                  style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: ${color.buttonText}; background-color: ${color.buttonBackground}; border: 1px solid ${color.buttonBorder}; border-radius: 8px; text-decoration: none;">
                  Sign in to ${escapedHost}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px 30px 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${color.text}; text-align: center;">
                <p style="margin: 0;">Didn’t request this email? You can safely ignore it. No action will be taken.</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f5; padding: 20px 40px; text-align: center; font-size: 12px; color: #888;">
                <p style="margin: 0;">This message was sent by ${escapedHost}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

 
// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}