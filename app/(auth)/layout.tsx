import { ReactNode } from 'react'
import { TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-900 border-r border-neutral-800 text-white flex-col justify-between p-12">
        <div>
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold mb-12">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <span>FinanceAI</span>
          </Link>
          <div className="space-y-6 max-w-md">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Pul mablag&apos;laringizni sun&apos;iy intellekt bilan boshqaring
            </h1>
            <p className="text-lg text-neutral-400">
              Xarajatlaringizni kuzatib boring, byudjetingizni rejalashtiring va sun&apos;iy intellektga asoslangan shaxsiy moliyaviy maslahatlarni oling.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <blockquote className="space-y-2">
            <p className="text-lg italic text-neutral-300">
              &quot;Boylik pulning ko&apos;pligida emas, uning qanday boshqarilishida.&quot;
            </p>
            <footer className="text-sm text-neutral-500">— Epiktet, Faylasuf</footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-background">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              <span>FinanceAI</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
