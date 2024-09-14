import 'leaflet/dist/leaflet.css';  // Import Leaflet CSS globally
import '../src/index.css';          // Import your custom CSS globally
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
