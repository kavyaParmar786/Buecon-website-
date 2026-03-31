export const metadata = {
  title: "Buecon",
  description: "Buecon Bathroom Accessories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
