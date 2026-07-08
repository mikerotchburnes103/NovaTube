class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-text">
          <div className="text-center p-8 bg-surface rounded-xl max-w-md">
            <div className="icon-circle-alert text-4xl text-primary mb-4 mx-auto"></div>
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-textMuted mb-6 text-sm">We couldn't load the player properly.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [inputUrl, setInputUrl] = React.useState('');
  const [currentVideoId, setCurrentVideoId] = React.useState('');
  const [error, setError] = React.useState('');
  const [history, setHistory] = React.useState([]);
  const [activeMetadata, setActiveMetadata] = React.useState(null);

  React.useEffect(() => {
      try {
          const savedHistory = localStorage.getItem('novaTubeHistory');
          if (savedHistory) {
              setHistory(JSON.parse(savedHistory));
          }
      } catch (e) {
          console.error("Could not load history", e);
      }
  }, []);

  const updateHistoryData = (videoId, updates) => {
      setHistory(prev => {
          const itemIndex = prev.findIndex(item => item.videoId === videoId);
          let newHistory = [...prev];
          
          if (itemIndex > -1) {
              newHistory[itemIndex] = { ...newHistory[itemIndex], ...updates };
          } else {
              newHistory = [{ videoId, timestamp: Date.now(), progressTime: 0, ...updates }, ...newHistory].slice(0, 30);
          }
          
          try {
              localStorage.setItem('novaTubeHistory', JSON.stringify(newHistory));
          } catch (e) {
              console.error("Could not save history", e);
          }
          return newHistory;
      });
  };

  const addToHistory = (videoId) => {
      setHistory(prev => {
          const item = prev.find(i => i.videoId === videoId);
          const filtered = prev.filter(i => i.videoId !== videoId);
          const newItem = item ? { ...item, timestamp: Date.now() } : { videoId, timestamp: Date.now(), progressTime: 0 };
          const newHistory = [newItem, ...filtered].slice(0, 30);
          
          try {
              localStorage.setItem('novaTubeHistory', JSON.stringify(newHistory));
          } catch (e) {}
          return newHistory;
      });
  };

  const clearHistory = () => {
      setHistory([]);
      try {
          localStorage.removeItem('novaTubeHistory');
      } catch (e) {
          console.error("Could not clear history", e);
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    
    const id = extractVideoId(inputUrl);
    if (id) {
        setCurrentVideoId(id);
        addToHistory(id);
        setError('');
    } else {
        setError('Invalid YouTube URL or ID.');
    }
  };

  const clearVideo = () => {
      setCurrentVideoId('');
      setInputUrl('');
      setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" data-name="app" data-file="app.js">
      {/* YouTube Style Navbar */}
      <header className="sticky top-0 z-20 bg-background px-4 py-2 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-4 w-1/4">
            <button className="p-2 hover:bg-surface rounded-full hidden sm:block">
                <div className="icon-menu text-xl"></div>
            </button>
            <div className="flex items-center gap-1 font-bold text-xl cursor-pointer tracking-tight" onClick={clearVideo}>
                <div className="icon-youtube text-3xl text-primary flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="Logo" className="h-6" />
                </div>
                <span className="hidden sm:inline">NovaTube</span>
            </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl flex items-center justify-center px-4">
            <form onSubmit={handleSubmit} className="flex w-full">
                <div className="relative flex w-full">
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => {
                            setInputUrl(e.target.value);
                            if(error) setError('');
                        }}
                        placeholder="Search or paste URL"
                        className="w-full bg-[#121212] border border-[#303030] rounded-l-full px-4 py-2 text-text placeholder-textMuted focus:outline-none focus:border-blue-500 focus:ml-0"
                    />
                </div>
                <button 
                    type="submit" 
                    className="bg-surface hover:bg-surfaceHover border border-l-0 border-[#303030] px-5 py-2 rounded-r-full transition-colors flex items-center justify-center"
                    title="Search"
                >
                    <div className="icon-search text-xl"></div>
                </button>
                <button type="button" className="ml-4 p-2.5 bg-[#181818] hover:bg-surfaceHover rounded-full hidden sm:block">
                    <div className="icon-mic text-xl"></div>
                </button>
            </form>
        </div>

        {/* Right Actions */}
        <div className="w-1/4 flex justify-end items-center gap-3">
            <button className="p-2 hover:bg-surface rounded-full hidden sm:block">
                <div className="icon-video text-xl"></div>
            </button>
            <button className="p-2 hover:bg-surface rounded-full hidden sm:block">
                <div className="icon-bell text-xl"></div>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-sm font-semibold flex items-center justify-center cursor-pointer ml-2">
                U
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation (Desktop) */}
          <aside className="w-60 bg-background hidden xl:block flex-shrink-0 px-3 py-2 overflow-y-auto">
              <div className="flex flex-col gap-1 pb-4 border-b border-[#303030]">
                  <button onClick={clearVideo} className={`flex items-center gap-4 px-3 py-2.5 rounded-lg ${!currentVideoId ? 'bg-surface' : 'hover:bg-surface'}`}>
                      <div className="icon-house text-xl"></div>
                      <span className="font-medium text-sm">Home</span>
                  </button>
                  <button className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-surface">
                      <div className="icon-youtube text-xl"></div>
                      <span className="font-medium text-sm">Shorts</span>
                  </button>
                  <button className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-surface">
                      <div className="icon-library text-xl"></div>
                      <span className="font-medium text-sm">Subscriptions</span>
                  </button>
              </div>
              <div className="flex flex-col gap-1 py-4">
                  <h3 className="px-3 font-semibold mb-1">You</h3>
                  <button className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-surface">
                      <div className="icon-history text-xl"></div>
                      <span className="font-medium text-sm">History</span>
                  </button>
              </div>
          </aside>

          {/* Video / Home Content */}
          <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6">
            {error && (
                <div className="w-full max-w-4xl mx-auto mb-6 text-red-400 bg-red-500/10 p-3 rounded-lg flex items-center gap-2">
                    <div className="icon-circle-alert"></div>
                    {error}
                </div>
            )}

            {!currentVideoId ? (
                <div className="w-full max-w-7xl mx-auto">
                    {history.length > 0 ? (
                        <History 
                            history={history} 
                            onSelectVideo={(id) => {
                                setCurrentVideoId(id);
                                addToHistory(id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} 
                            onClearHistory={clearHistory}
                            layout="grid"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-textMuted">
                            <div className="icon-search text-6xl mb-4 opacity-50"></div>
                            <h2 className="text-2xl font-bold text-text mb-2">Search or paste a link</h2>
                            <p>Enter a YouTube URL above to start watching privately.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
                    {/* Primary Watch Column */}
                    <div className="flex-1 min-w-0">
                        <Player 
                            videoId={currentVideoId} 
                            savedTime={history.find(h => h.videoId === currentVideoId)?.progressTime || 0}
                            onTimeUpdate={(time) => {
                                updateHistoryData(currentVideoId, { progressTime: time });
                            }}
                        />
                        <VideoDetails 
                            videoId={currentVideoId} 
                            onMetadataLoaded={(data) => {
                                setActiveMetadata(data);
                                updateHistoryData(currentVideoId, { title: data.title, author: data.author });
                            }}
                        />
                    </div>
                    
                    {/* Secondary Up-Next Column */}
                    <div className="w-full lg:w-[402px] flex-shrink-0 lg:pl-6 pt-6 lg:pt-0">
                        <History 
                            history={history} 
                            onSelectVideo={(id) => {
                                setCurrentVideoId(id);
                                addToHistory(id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} 
                            onClearHistory={clearHistory}
                            layout="sidebar"
                        />
                    </div>
                </div>
            )}
          </main>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);