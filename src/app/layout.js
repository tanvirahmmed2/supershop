
import ContextProvider from "@/components/helper/Context";
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`w-full overflow-x-hidden antialiased`}
      >
        <ContextProvider>
          <main>
            {children}
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
