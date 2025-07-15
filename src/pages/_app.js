import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS globally
import '../styles/globals.css';
import "bootstrap-icons/font/bootstrap-icons.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
