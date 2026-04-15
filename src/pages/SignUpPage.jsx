import { SignUp } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'

export default function SignUpPage() {
  const [error, setError] = useState('')

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #F5F7F6 0%, #E6F4EF 100%)' }}
    >
      <div className="w-full max-w-md px-4">

        {/* Error Popup */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Sign Up Error
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError('')}
                className="ml-auto flex-shrink-0 text-red-400 hover:text-red-500"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#111827]">
            Join{' '}
            <span className="text-[#1A7F5A]">Teacher's Mate</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Create your faculty account to get started
          </p>
        </div>

        <SignUp
          routing="path"
          path="/sign-up"
          afterSignUpUrl="/dashboard"
          signInUrl="/sign-in"
          onError={(error) => {
            // Handle different types of sign-up errors
            if (error.message.includes('email') && error.message.includes('already')) {
              setError('An account with this email already exists. Please sign in instead.')
            } else if (error.message.includes('password') && error.message.includes('weak')) {
              setError('Password is too weak. Please choose a stronger password.')
            } else if (error.message.includes('password') && error.message.includes('short')) {
              setError('Password is too short. Please use at least 8 characters.')
            } else if (error.message.includes('email') && error.message.includes('invalid')) {
              setError('Invalid email address. Please check and try again.')
            } else if (error.message.includes('username') && error.message.includes('taken')) {
              setError('Username is already taken. Please choose a different one.')
            } else if (error.message.includes('too many')) {
              setError('Too many sign-up attempts. Please try again later.')
            } else {
              setError('Sign up failed. Please check your information and try again.')
            }
          }}
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-xl rounded-2xl border border-gray-100 w-full',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton:
                'border border-gray-200 rounded-xl hover:bg-gray-50 transition-all',
              formButtonPrimary:
                'bg-[#1A7F5A] hover:bg-[#155e42] rounded-xl text-sm font-medium transition-all',
              formFieldInput:
                'rounded-xl border-gray-200 focus:border-[#1A7F5A] focus:ring-[#1A7F5A] text-sm',
              footerActionLink:
                'text-[#1A7F5A] hover:text-[#155e42] font-medium',
              formFieldError: 'text-red-600 text-xs mt-1',
              identitySwitcher: 'hidden'
            }
          }}
        />

      </div>
    </div>
  )
}
