// app/layout.js
import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Gymnasieval - Admin',
  description: 'Admin dashboard för programrekommendationer'
};

const RootLayout = ({ children }) => {
  return (
    <html lang="sv">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
