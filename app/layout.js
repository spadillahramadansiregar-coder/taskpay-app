import './globals.css'

export const metadata = {
  title: 'TaskPay',
  description: 'Hasilkan uang dengan menyelesaikan task',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}