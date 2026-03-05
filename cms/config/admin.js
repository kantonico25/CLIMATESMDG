module.exports = ({ env }) => {
  const clientUrls = env("CLIENT_URL", "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  return {
    auth: {
      secret: env("ADMIN_JWT_SECRET")
    },
    apiToken: {
      salt: env("API_TOKEN_SALT")
    },
    transfer: {
      token: {
        salt: env("TRANSFER_TOKEN_SALT")
      }
    },
    secrets: {
      encryptionKey: env("ENCRYPTION_KEY")
    },
    preview: {
      enabled: clientUrls.length > 0,
      config: {
        allowedOrigins: clientUrls
      }
    }
  };
};
