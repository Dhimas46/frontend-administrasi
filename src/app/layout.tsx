// app/layout.tsx
import { fonts } from './fonts'
import { Providers } from './providers'
import React, { useState } from 'react';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='en' className={fonts.rubik.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}