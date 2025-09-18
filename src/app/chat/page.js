import Header from "../component/Header";
import Footer from "../component/Footer";
import UploadForm from "../component/upload/UploadForm";
import { Upload, FileText, Send, MessageCircle, Network } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="h-screen bg-white text-gray-900 flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 overflow-hidden min-h-0">
        <section className="w-full h-full overflow-hidden">
          <div className="flex items-center justify-center py-2">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Research Workspace</h1>
              <p className="text-sm text-slate-600">
                Chat with AI, visualize knowledge graphs, and upload PDFs to
                index.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-[calc(100%-6rem)] overflow-hidden px-2 md:px-6">
            {/* Chat */}
            <div className="border border-slate-100 rounded-lg p-2 h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-slate-600" />
                  Chat with AI
                </h3>
              </div>
              <div className="flex-1 rounded-md border-2 border-dashed border-slate-100 bg-gray-50 flex items-center justify-center text-slate-400 p-6 overflow-hidden">
                <div className="text-center">
                  Start a conversation about your research
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  placeholder="Ask questions about your research..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner"
                />
                <button
                  type="button"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Knowledge graph */}
            <div className="border border-slate-100 rounded-lg p-2 h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Network className="h-4 w-4 text-slate-600" />
                  Knowledge Graph
                </h3>
              </div>
              <div className="flex-1 rounded-md border-2 border-dashed border-slate-100 bg-gray-50 flex items-center justify-center text-slate-400 p-6 overflow-hidden">
                <div className="text-center">
                  Knowledge Graph Visualization
                  <br />
                  Upload a PDF to generate an interactive graph
                </div>
              </div>
            </div>

            {/* Upload panel */}
            <div className="border border-slate-100 rounded-lg p-2 h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-600" />
                  Upload Research Paper
                </h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <UploadForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
