"use client";
import React, { useEffect, useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ChatPanel from "./chat/ChatPanel";
import { Network } from "lucide-react";

export default function ResizablePanels() {
  const [defaultLayout, setDefaultLayout] = useState([50, 50]);
  const chatPanelRef = useRef(null);
  const graphPanelRef = useRef(null);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isGraphCollapsed, setIsGraphCollapsed] = useState(false);

  useEffect(() => {
    // Load saved layout from localStorage on component mount
    const savedLayout = localStorage.getItem("resizable-panels:chat-graph-layout");
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setDefaultLayout(parsedLayout);
      } catch (error) {
        console.error("Failed to parse saved layout:", error);
      }
    }
  }, []);

  const onLayout = (sizes) => {
    // Save layout to localStorage for persistence across sessions
    localStorage.setItem("resizable-panels:chat-graph-layout", JSON.stringify(sizes));
    
    // Update collapse state based on panel sizes
    setIsChatCollapsed(sizes[0] <= 5);
    setIsGraphCollapsed(sizes[1] <= 5);
  };

  const handleResizeHandleClick = () => {
    // Toggle between collapsed and expanded states
    if (isChatCollapsed) {
      // Expand chat panel
      if (chatPanelRef.current) {
        chatPanelRef.current.expand();
      }
    } else if (isGraphCollapsed) {
      // Expand graph panel
      if (graphPanelRef.current) {
        graphPanelRef.current.expand();
      }
    } else {
      // Neither is collapsed, so collapse the larger panel
      const savedLayout = JSON.parse(localStorage.getItem("resizable-panels:chat-graph-layout") || "[50, 50]");
      if (savedLayout[0] >= savedLayout[1]) {
        // Collapse chat panel (it's larger or equal)
        if (chatPanelRef.current) {
          chatPanelRef.current.collapse();
        }
      } else {
        // Collapse graph panel (it's larger)
        if (graphPanelRef.current) {
          graphPanelRef.current.collapse();
        }
      }
    }
  };

  return (
    <PanelGroup direction="horizontal" onLayout={onLayout} className="col-span-3 relative">
      {/* Chat Panel */}
      <Panel 
        ref={chatPanelRef}
        defaultSize={defaultLayout[0]} 
        minSize={15}
        collapsible={true}
        className="relative"
      >
        <ChatPanel />
      </Panel>

      {/* Resize Handle - Click to toggle collapse/expand */}
      <PanelResizeHandle 
        className="w-2 transition-colors flex items-center justify-center group hover:bg-slate-300 cursor-pointer"
        onClick={handleResizeHandleClick}
        title={
          isChatCollapsed 
            ? "Click to expand chat panel" 
            : isGraphCollapsed 
            ? "Click to expand graph panel" 
            : "Click to collapse a panel or drag to resize"
        }
      >
        <div className="w-0.5 h-4 bg-slate-300 group-hover:bg-slate-500 transition-colors"></div>
      </PanelResizeHandle>

      {/* Knowledge Graph Panel */}
      <Panel 
        ref={graphPanelRef}
        defaultSize={defaultLayout[1]} 
        minSize={15}
        collapsible={true}
        className="relative"
      >
        <div className="border border-slate-100 rounded-lg p-2 h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Network className="h-4 w-4 text-slate-600" />
              Knowledge Graph
            </h3>
            <button
              type="button"
              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
            >
              Full Graph
            </button>
          </div>
          <div className="flex-1 rounded-md border-2 border-dashed border-slate-100 bg-gray-50 flex items-center justify-center text-slate-400 p-6 overflow-hidden">
            <div className="text-center">
              Knowledge Graph Visualization
              <br />
              Upload a PDF to generate an interactive graph
            </div>
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
}