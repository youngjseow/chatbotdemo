import 'bootstrap/dist/css/bootstrap.min.css'; // Global Bootstrap CSS
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}
