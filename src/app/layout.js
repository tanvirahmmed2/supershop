
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`w-full overflow-x-hidden antialiased`}
      >
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
