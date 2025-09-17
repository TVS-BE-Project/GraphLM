import { GetStartedButton, HeaderAuth } from "./component/auth"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Starter
          </div>
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Docs</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <HeaderAuth />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">Build smarter with AI + OAuth</h1>
            <p className="text-lg text-gray-600 mb-8">A lightweight Next.js starter with GitHub sign-in, Prisma-backed users, and ready-to-plug AI integrations.</p>
            <div className="flex items-center gap-4">
              <GetStartedButton />
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Learn more</a>
            </div>
          </div>

          <div className="h-64 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">Illustration / screenshot</div>
          </div>
        </section>

        <section id="features" className="border-t py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold mb-6">Why this starter?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="font-medium mb-2">OAuth made easy</h3>
                <p className="text-sm text-gray-600">Login with GitHub out of the box using NextAuth and Prisma.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="font-medium mb-2">Prisma + Postgres</h3>
                <p className="text-sm text-gray-600">Persistent user records and adapters ready for production.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="font-medium mb-2">AI-ready</h3>
                <p className="text-sm text-gray-600">Drop in your AI models and use authenticated endpoints to power features.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600">© {new Date().getFullYear()} AI Starter</div>
      </footer>
    </div>
  )
}
