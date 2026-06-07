'use client'

import { SessionProvider } from 'next-auth/react'
import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

const theme = createTheme({
  primaryColor: 'green',
  colors: {
    green: [
      '#F0FAF6', '#D1EEE4', '#6EE7B7', '#34D399', '#1DB87A',
      '#16A567', '#0D7A4C', '#0B3D2E', '#083323', '#051F16',
    ],
  },
  fontFamily: 'DM Sans, sans-serif',
  headings: { fontFamily: 'Sora, sans-serif' },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        {children}
      </MantineProvider>
    </SessionProvider>
  )
}
