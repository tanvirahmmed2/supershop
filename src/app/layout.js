
import ContextProvider from "@/components/helper/Context";
import "./globals.css";
import ToastProvider from "@/components/helper/ToastProvider";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`w-full overflow-x-hidden antialiased`}
      >
        <ContextProvider>
          <ToastProvider>
            <main>
              {children}
            </main>
          </ToastProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
