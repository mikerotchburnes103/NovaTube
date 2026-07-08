function VideoDetails({ videoId, onMetadataLoaded }) {
    const [details, setDetails] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [expanded, setExpanded] = React.useState(false);

    React.useEffect(() => {
        if (!videoId) return;
        let isMounted = true;
        setLoading(true);
        fetchVideoDetails(videoId).then(data => {
            if (isMounted) {
                setDetails(data);
                setLoading(false);
                setExpanded(false);
                if(onMetadataLoaded) onMetadataLoaded(data);
            }
        });
        return () => { isMounted = false; };
    }, [videoId]);

    if (loading) {
        return (
            <div className="w-full mt-3 animate-pulse" data-name="video-details-loading" data-file="components/VideoDetails.js">
                <div className="h-7 bg-surface rounded-md w-3/4 mb-3"></div>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface rounded-full"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-surface rounded w-32"></div>
                            <div className="h-3 bg-surface rounded w-20"></div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-9 bg-surface rounded-full w-32"></div>
                        <div className="h-9 bg-surface rounded-full w-24"></div>
                        <div className="h-9 bg-surface rounded-full w-24"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!details) return null;

    return (
        <div className="w-full mt-3" data-name="video-details" data-file="components/VideoDetails.js">
            <h1 className="text-xl font-bold text-text mb-2 tracking-tight">
                {details.title}
            </h1>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
                {/* Channel Info & Subscribe */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surfaceHover overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer">
                        {details.avatarUrl ? (
                            <img src={details.avatarUrl} alt={details.author} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg font-medium text-text uppercase">{details.author.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex flex-col justify-center cursor-pointer">
                        <h3 className="font-bold text-text text-[15px] leading-tight">{details.author}</h3>
                        <p className="text-xs text-textMuted leading-tight mt-0.5">{details.subscriberCount}</p>
                    </div>
                    <button className="bg-[#f1f1f1] hover:bg-[#d9d9d9] text-[#0f0f0f] text-sm font-medium px-4 py-2 rounded-full transition-colors ml-2">
                        Subscribe
                    </button>
                </div>

                {/* Actions (Like, Share, Save) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar mt-1 lg:mt-0">
                    <div className="flex items-center bg-[#272727] hover:bg-[#3f3f3f] rounded-full transition-colors">
                        <button className="flex items-center gap-1.5 px-3.5 py-1.5 border-r border-white/20">
                            <div className="icon-thumbs-up text-lg"></div>
                            <span className="font-medium text-sm">{details.likes}</span>
                        </button>
                        <button className="px-3.5 py-1.5 hover:bg-[#3f3f3f] rounded-r-full transition-colors">
                            <div className="icon-thumbs-down text-lg"></div>
                        </button>
                    </div>
                    <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] px-4 py-1.5 rounded-full transition-colors">
                        <div className="icon-share text-lg"></div>
                        <span className="font-medium text-sm">Share</span>
                    </button>
                    <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] px-4 py-1.5 rounded-full transition-colors hidden sm:flex">
                        <div className="icon-download text-lg"></div>
                        <span className="font-medium text-sm">Download</span>
                    </button>
                    <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] w-9 h-9 justify-center rounded-full transition-colors">
                        <div className="icon-ellipsis text-lg"></div>
                    </button>
                </div>
            </div>

            {/* Description Box */}
            <div 
                className={`mt-3 bg-[#272727] hover:bg-[#3f3f3f] transition-colors rounded-xl p-3 text-sm cursor-pointer ${expanded ? '' : 'line-clamp-3'}`}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="font-semibold text-text mb-1 flex items-center gap-2">
                    <span>{details.views} views</span>
                    <span>{details.date}</span>
                </div>
                <div className="text-text whitespace-pre-wrap">
                    {details.description || "Watching on NovaTube. No cookies, no tracking."}
                    <br/><br/>
                    {details.comments} Comments reported by YouTube.
                    <br/><br/>
                    {expanded && (
                        <span className="text-textMuted mt-4 block">
                            Show less
                        </span>
                    )}
                </div>
                {!expanded && <span className="font-bold text-text mt-1 block">...more</span>}
            </div>
        </div>
    );
}