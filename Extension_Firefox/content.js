(async function () {
    const images = document.querySelectorAll('zoomable-img > img');
    if (!images.length) return;

    const MIME_EXT = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/avif': '.avif',
        'image/bmp': '.bmp',
        'image/svg+xml': '.svg'
    };

    function extFromUrl(url) {
        const m = new URL(url).pathname.match(/\.([a-z0-9]+)$/i);
        return m ? '.' + m[1].toLowerCase() : '';
    }

    // --- Notification container (styles unchanged from your working version) ---
    let imgLinks = document.createElement('div');
    Object.assign(imgLinks.style, {
        position: 'fixed', top: '16px', right: '16px',
        maxWidth: '220px', maxHeight: '60vh', overflowY: 'auto',
        borderRadius: '8px', background: 'rgba(30, 30, 30, 0.92)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        color: '#eee',
        font: '13px/1.5 -apple-system, "Segoe UI", Roboto, sans-serif',
        padding: '10px 12px', zIndex: '999999'
    });

    let header = document.createElement('div');
    header.textContent = 'Images';
    Object.assign(header.style, {
        fontWeight: '600', fontSize: '12px', color: '#999',
        textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px'
    });
    imgLinks.appendChild(header);

    let closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    Object.assign(closeBtn.style, {
        position: 'absolute', top: '1px', right: '10px',
        background: 'none', border: 'none', color: '#999',
        fontSize: '16px', cursor: 'pointer', padding: '0 4px'
    });
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = '#fff');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = '#999');
    closeBtn.addEventListener('click', () => imgLinks.remove());
    imgLinks.appendChild(closeBtn);

    document.body.appendChild(imgLinks);

    function delay(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }

    // --- Sequential downloads via the extension API ---
    for (let i = 0; i < images.length; i++) {
        let url = new URL(images[i].currentSrc || images[i].src, document.baseURI).href;

        // Extension from the URL path; fall back to sniffing the MIME type
        let ext = extFromUrl(url);
        if (!ext) {
            try {
                const blob = await (await fetch(url, { cache: 'force-cache' })).blob();
                ext = MIME_EXT[blob.type] || '';
            } catch (e) {
                // cross-origin fetch blocked: leave extension off rather than guess wrong
            }
        }

        let imgNum = i + 1;
        let name = (imgNum < 10 ? `Image 0${imgNum}` : `Image ${imgNum}`) + ext;

        let link = document.createElement('a');
        link.innerText = name;
        link.href = url;
        Object.assign(link.style, {
            display: 'block', padding: '5px 8px', marginBottom: '4px',
            borderRadius: '4px', color: '#7cb7ff',
            textDecoration: 'none', fontSize: '13px'
        });
        link.addEventListener('mouseenter', () => link.style.background = 'rgba(255,255,255,0.08)');
        link.addEventListener('mouseleave', () => link.style.background = 'transparent');
        imgLinks.appendChild(link);

        browser.runtime.sendMessage({ type: "download", url, filename: name });
        await delay(300); // downloads API benefits from a slightly wider gap
    }
})();