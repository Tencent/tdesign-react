export default {
  strategies: 'injectManifest',
  includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],  
  manifest: {
    name: 'TDesign for React',
    short_name: 'TDesign',
    description: 'React UI Component',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ]
  }
};
