import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "ObraCerta - Orçamentos Rápidos",
  description: "Gerador de orçamentos com assinatura digital",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="container-fluid min-vh-100 p-0">{children}</main>
        {/* Carrega o JS do Bootstrap para interatividade de modais/dropdowns */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}