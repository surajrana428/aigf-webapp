import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload critical fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />

        {/* Favicon and app icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* SEO and social meta */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="format-detection" content="telephone=no" />

        {/* Performance hints */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* Critical CSS to prevent FOUC */}
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #0f0f0f, #1a1a1a, #2d2d2d);
              color: white;
              overflow-x: hidden;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            #__next {
              position: relative;
              min-height: 100vh;
            }
            
            /* Prevent flash of unstyled content */
            .loading-skeleton {
              background: linear-gradient(90deg, #1e1e1e 25%, #2d2d2d 50%, #1e1e1e 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }
            
            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            
            /* Smooth scrolling */
            html {
              scroll-behavior: smooth;
            }
            
            /* Custom scrollbar */
            ::-webkit-scrollbar {
              width: 8px;
            }
            
            ::-webkit-scrollbar-track {
              background: rgba(45, 45, 45, 0.3);
            }
            
            ::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(135deg, #2563eb, #1e40af);
            }
          `
        }} />
      </Head>
      <body>
        {/* Loading fallback */}
        <noscript>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a, #2d2d2d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            zIndex: 9999
          }}>
            Please enable JavaScript to use this application.
          </div>
        </noscript>

        <Main />
        <NextScript />

        {/* Analytics placeholder */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Performance monitoring
            window.addEventListener('load', function() {
              console.log('App loaded successfully');
              // Add your analytics here
            });
            
            // Error tracking
            window.addEventListener('error', function(e) {
              console.error('App error:', e.error);
              // Add error tracking here
            });
          `
        }} />
      </body>
    </Html>
  )
          }
