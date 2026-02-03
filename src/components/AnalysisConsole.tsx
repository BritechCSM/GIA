import { ConsoleView } from './ConsoleView';
import { ConnectionsView } from './ConnectionsView';
import { SavedQueriesView } from './SavedQueriesView';
import { ReportsView } from './ReportsView';

interface AnalysisConsoleProps {
  currentView: 'console' | 'connections' | 'queries' | 'reports';
}

export function AnalysisConsole({ currentView }: AnalysisConsoleProps) {
  return (
    <>
      {currentView === 'console' && <ConsoleView />}
      {currentView === 'connections' && <ConnectionsView />}
      {currentView === 'queries' && <SavedQueriesView />}
      {currentView === 'reports' && <ReportsView />}
    </>
  );
}
