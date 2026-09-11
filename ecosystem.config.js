module.exports = {
  apps: [
    {
      name: 'indocast-api',
      script: 'npm',
      args: 'start',
      max_memory_restart: '2G', // 🎯 Batasi max memory 2GB (Otomatis restart jika lewat)
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};