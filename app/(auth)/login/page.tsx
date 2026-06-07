'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F7F5' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
            SocietyLens
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6B7B74' }}>Built for better communities</p>
        </div>

        <div className="bg-white rounded-2xl p-8" style={{ border: '0.5px solid #D1EEE4' }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>
            Sign in
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
                style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
                style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ background: '#1DB87A' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            <p style={{ color: '#6B7B74' }}>
              New resident?{' '}
              <Link href="/join" className="font-medium" style={{ color: '#1DB87A' }}>
                Join with invite code
              </Link>
            </p>
            <p style={{ color: '#6B7B74' }}>
              Creating a new community?{' '}
              <Link href="/register" className="font-medium" style={{ color: '#1DB87A' }}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
