module.exports = {
  pwa: {
    name: 'Thinka',
    msTileColor: '#7ED321',
    manifestOptions: {
      start_url: '/index.html',
      display: 'standalone',
      background_color: '#358d92',
      theme_color: '#358d92',
      icons: [
        {
          src: 'favicon.ico',
          sizes: '32x32',
          type: 'image/png'
        },
        {
          src: 'favicon144.png',
          sizes: '144x144',
          type: 'image/png'
        }
      ]
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    }
  }
}