"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AnalysisConsole } from '@/components/AnalysisConsole';
import { GiaAssistant } from '@/components/GiaAssistant';
// Import other views if they exist in the copied components, typically they are separate files
import { ConnectionsView } from '@/components/ConnectionsView';
import { SavedQueriesView } from '@/components/SavedQueriesView';
import { ReportsView } from '@/components/ReportsView';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'console' | 'settings' | 'queries' | 'reports'>('console');

  return (
    <div className="flex h-screen bg-background overflow-hidden font-inter">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
        {/* Header */}
        <Header currentView={currentView} onViewChange={setCurrentView} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'console' && <AnalysisConsole currentView={currentView} />}
          {currentView === 'settings' && <AnalysisConsole currentView={currentView} />}
          {currentView === 'queries' && <AnalysisConsole currentView={currentView} />}
          {currentView === 'reports' && <AnalysisConsole currentView={currentView} />}
        </main>
      </div>

      {/* Gia AI Assistant (Always available) */}
      <GiaAssistant />
    </div>
  );
}
