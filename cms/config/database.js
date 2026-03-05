module.exports = ({ env }) => ({
  connection: {
    client: env("DATABASE_CLIENT", "postgres"),
    connection: (() => {
      const databaseUrl = env("DATABASE_URL", "");
      const sslRejectUnauthorized = env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", false);

      if (databaseUrl) {
        const url = new URL(databaseUrl);
        const sslMode = (url.searchParams.get("sslmode") || "").toLowerCase();
        const sslFromUrl =
          sslMode === "require" || sslMode === "verify-ca" || sslMode === "verify-full";
        const useSsl = env.bool("DATABASE_SSL", sslFromUrl);

        return {
          connectionString: databaseUrl,
          ssl: useSsl && {
            rejectUnauthorized: sslRejectUnauthorized
          }
        };
      }

      return {
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "climates"),
        user: env("DATABASE_USERNAME", "climates"),
        password: env("DATABASE_PASSWORD", "climates"),
        ssl: env.bool("DATABASE_SSL", false) && {
          rejectUnauthorized: env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", true)
        }
      };
    })(),
    pool: { min: 0, max: 10 }
  }
});
