function Player({ videoId, savedTime = 0, onTimeUpdate }) {
    if (!videoId) return null;

    React.useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== 'https://www.youtube-nocookie.com') return;
            try {
                const data = JSON.parse(event.data);
                if (data.event === 'infoDelivery' && data.info && data.info.currentTime) {
                    onTimeUpdate(Math.floor(data.info.currentTime));
                }
            } catch (e) {}
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onTimeUpdate]);

    const scriptTag = "<script>/* enablejsapi=1 handles delivery */<" + "/script>";
    const srcDocContent = `
        <style>
            *{padding:0;margin:0;overflow:hidden}
            html,body{height:100%;background:#000;font-family:Roboto,sans-serif;}
            .thumb{position:absolute;width:100%;top:0;bottom:0;margin:auto;object-fit:cover;height:100%}
            .play-btn{position:absolute;width:68px;height:48px;top:50%;left:50%;transform:translate(-50%, -50%);transition:transform 0.2s;filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));}
            a:hover .play-btn{transform:translate(-50%, -50%) scale(1.1)}
            .progress{position:absolute;bottom:0;left:0;height:4px;background:rgba(255,255,255,0.2);width:100%;}
            .progress-bar{height:100%;background:#ff0000;width:0%;}
            .resume-text{position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.7);color:white;padding:4px 8px;border-radius:4px;font-size:12px;display:${savedTime > 0 ? 'block' : 'none'};}
        </style>
        <a href="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&start=${savedTime}">
            <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'" class="thumb" alt="Video Thumbnail">
            <div class="resume-text">Resume from ${Math.floor(savedTime/60)}:${(savedTime%60).toString().padStart(2, '0')}</div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" class="play-btn" alt="Play">
        </a>
        ${scriptTag}
    `;

    return (
        <div className="w-full animate-fade-in" data-name="player" data-file="components/Player.js">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?start=${savedTime}&autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
                    srcDoc={srcDocContent}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <div className="mt-4 flex items-center justify-between text-textMuted text-sm px-2 font-medium">
                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                    <div className="icon-shield-check"></div>
                    <span>Secure Proxy Mode</span>
                </div>
            </div>
        </div>
    );
}