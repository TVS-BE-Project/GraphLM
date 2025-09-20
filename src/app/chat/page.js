import Header from "../component/Header";
import Footer from "../component/Footer";
import UploadForm from "../component/upload/UploadForm";
import ResizablePanels from "../component/ResizablePanels";
import { Upload, FileText, Send, MessageCircle, Network } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="h-screen bg-white text-gray-900 flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 overflow-hidden min-h-0">
        <section className="w-full h-full overflow-hidden">
          <div className="flex items-center justify-center py-2">
            <div className="text-center">
              <h1 className="text-xl font-semibold">Research Workspace</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full h-[calc(100%-4rem)] overflow-hidden px-2 md:px-6 relative">
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

            {/* Resizable Panels - Chat and Knowledge Graph (spans 3 columns) */}
            <ResizablePanels />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
