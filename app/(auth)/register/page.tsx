'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    complex_name: '',
    city: '',
    address: '',
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        form
      )
      await signIn('credentials', {
        accessToken: data.access_token,
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        complexId: data.user.complex_id,
        unitId: data.user.unit_id || '',
        redirect: false,
      })
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'complex_name', label: 'Community / Complex Name', placeholder: 'Prestige Lakeside' },
    { name: 'city', label: 'City', placeholder: 'Bangalore' },
    { name: 'address', label: 'Address', placeholder: '15 Lakeside Drive, Whitefield' },
    { name: 'name', label: 'Your Name', placeholder: 'Rajan Kumar' },
    { name: 'email', label: 'Email', placeholder: 'admin@example.com', type: 'email' },
    { name: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center py-10" style={{ background: '#F5F7F5' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
            SocietyLens
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6B7B74' }}>Built for better communities</p>
        </div>

        <div className="bg-white rounded-2xl p-8" style={{ border: '0.5px solid #D1EEE4' }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>
            Register your community
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>
                  {f.label}
                </label>
                <input
                  type={f.type || 'text'}
                  name={f.name}
                  value={(form as any)[f.name]}
                  onChange={handleChange}
                  required
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white mt-2 disabled:opacity-60"
              style={{ background: '#1DB87A' }}
            >
              {loading ? 'Creating community…' : 'Create community'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#6B7B74' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: '#1DB87A' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
