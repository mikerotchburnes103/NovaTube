function History({ history, onSelectVideo, onClearHistory, layout = 'grid' }) {
    if (!history || history.length === 0) return null;

    const isSidebar = layout === 'sidebar';

    return (
        <div className={`w-full ${isSidebar ? '' : 'mt-8 animate-fade-in'}`} data-name="history" data-file="components/History.js">
            {isSidebar ? (
                <div className="flex items-center gap-3 mb-4 overflow-x-auto hide-scrollbar pb-2">
                    <button className="bg-text text-background px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">All</button>
                    <button className="bg-surface hover:bg-surfaceHover text-text px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Related</button>
                    <button className="bg-surface hover:bg-surfaceHover text-text px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Recently uploaded</button>
                </div>
            ) : (
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                        <div className="icon-history"></div>
                        Watch History
                    </h2>
                    <button 
                        onClick={onClearHistory}
                        className="text-sm text-textMuted hover:text-red-400 transition-colors flex items-center gap-1 bg-surface px-3 py-1.5 rounded-full"
                    >
                        <div className="icon-trash text-xs"></div>
                        Clear all
                    </button>
                </div>
            )}
            
            <div className={`${isSidebar ? 'flex flex-col gap-2' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
                {history.map((item) => (
                    <div 
                        key={item.videoId} 
                        className={`group cursor-pointer ${isSidebar ? 'flex gap-2' : 'flex flex-col gap-3'}`}
                        onClick={() => onSelectVideo(item.videoId)}
                    >
                        <div className={`relative bg-surface rounded-lg overflow-hidden flex-shrink-0 ${isSidebar ? 'w-[168px] h-[94px]' : 'w-full aspect-video'}`}>
                            <img 
                                src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`} 
                                alt="Video thumbnail"
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.src = `https://img.youtube.com/vi/${item.videoId}/default.jpg`;
                                }}
                            />
                            
                            {item.progressTime > 0 && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-surfaceHover/50">
                                    <div className="h-full bg-primary" style={{ width: '100%' }}></div>
                                </div>
                            )}
                        </div>
                        <div className={`flex flex-col ${isSidebar ? 'flex-1 py-0.5' : 'py-1'}`}>
                            <h3 className={`font-medium text-text line-clamp-2 leading-tight mb-1 ${isSidebar ? 'text-[14px]' : 'text-sm'}`} title={item.title || `Video ${item.videoId}`}>
                                {item.title || `Video ${item.videoId}`}
                            </h3>
                            <div className={`text-textMuted flex flex-col ${isSidebar ? 'text-[12px]' : 'text-xs'} mt-0.5`}>
                                <span>{item.author || "YouTube Channel"}</span>
                                <span className="flex items-center gap-1 mt-0.5">
                                    {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                        {isSidebar && (
                            <button className="opacity-0 group-hover:opacity-100 p-1 flex-shrink-0 self-start text-textMuted hover:text-text transition-opacity">
                                <div className="icon-more-vertical text-lg"></div>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}