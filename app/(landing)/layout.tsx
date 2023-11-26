export const metadata = {
  title: "MusicGen UI",
  description: "A web UI for MusicGen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
