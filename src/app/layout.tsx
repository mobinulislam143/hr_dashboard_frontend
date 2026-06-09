import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { StoreProvider } from '@/components/providers/StoreProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthGate } from '@/components/providers/AuthGate';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Omira | Recruiting Dashboard', template: '%s | Omira' },
  description: 'Complete recruiting pipeline management for high-performing sales organizations.',
  keywords: ['recruiting', 'sales', 'hiring', 'pipeline', 'dashboard'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <StoreProvider>
          <ThemeProvider>
            <AuthGate>
              {children}
            </AuthGate>
            <Toaster
              position="top-right"
              toastOptions={{
                classNames: {
                  toast: 'bg-card border border-border text-foreground font-sans shadow-xl',
                  description: 'text-muted-foreground',
                },
              }}
            />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
