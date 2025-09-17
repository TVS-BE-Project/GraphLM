import UploadForm from "../component/upload/UploadForm";
import { HeaderAuth } from "../component/auth";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Starter</div>
          <nav className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Home</a>
            <HeaderAuth />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-semibold mb-4">Upload documents to index</h1>
          <p className="text-sm text-gray-600 mb-6">Upload one or more PDFs or paste text to index into the vector store.</p>
          <UploadForm />
        </section>
      </main>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600">© {new Date().getFullYear()} AI Starter</div>
      </footer>
    </div>
  );
}
