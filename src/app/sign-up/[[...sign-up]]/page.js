import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-[#215E61]/8 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 'bg-[#215E61] hover:bg-[#233D4D] text-white',
              footerActionLink: 'text-[#215E61] hover:text-[#233D4D]',
            },
          }}
        />
      </div>
    </div>
  )
}
