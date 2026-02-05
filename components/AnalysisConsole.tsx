import { ConsoleView } from './ConsoleView';
import { SettingsView } from './SettingsView';
import { SavedQueriesView } from './SavedQueriesView';
import { ReportsView } from './ReportsView';

interface AnalysisConsoleProps {
  currentView: 'console' | 'settings' | 'queries' | 'reports';
}

export function AnalysisConsole({ currentView }: AnalysisConsoleProps) {
  return (
    <>
      {currentView === 'console' && <ConsoleView />}
      {currentView === 'settings' && <SettingsView />}
      {currentView === 'queries' && <SavedQueriesView />}
      {currentView === 'reports' && <ReportsView />}
    </>
  );
}
