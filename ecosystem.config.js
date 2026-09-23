module.exports = {
  apps: [
    {
      name: 'indocast-api',
      script: 'node', // 🔥 UBAH JADI NODE
      args: '.next/standalone/server.js', // 🔥 ARAHIN KE FILE STANDALONE
      node_args: '--dns-result-order=ipv4first',
      max_memory_restart: "1.5G", // 🔥 SEKARANG FITUR INI BAKAL AKTIF 100%
      cron_restart: "0 4 * * *",
      exec_mode: 'fork',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://indocast.site',
      },
    },
  ],
};