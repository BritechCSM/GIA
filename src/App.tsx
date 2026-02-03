import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AnalysisConsole } from './components/AnalysisConsole';
import { GiaAssistant } from './components/GiaAssistant';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'console' | 'connections' | 'queries' | 'reports'>('console');

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header currentView={currentView} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <AnalysisConsole currentView={currentView} />
        </main>
      </div>

      {/* Gia AI Assistant */}
      <GiaAssistant />
    </div>
  );
}
