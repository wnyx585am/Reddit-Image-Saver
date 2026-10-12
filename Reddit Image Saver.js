javascript:(function () {
    let images = document.querySelectorAll('zoomable-img > img');

    // --- Notification container ---
    let imgLinks = document.createElement('div');
    imgLinks.id = 'imgLinks';
    Object.assign(imgLinks.style, {
        position: 'fixed',
        top: '16px',
        right: '16px',
        maxWidth: '220px',
        maxHeight: '60vh',
        overflowY: 'auto',
        borderRadius: '8px',
        background: 'rgba(30, 30, 30, 0.92)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        color: '#eee',
        font: '13px/1.5 -apple-system, "Segoe UI", Roboto, sans-serif',
        padding: '10px 12px',
        zIndex: '999999'
    });

    // --- Header bar ---
    let header = document.createElement('div');
    header.textContent = 'Images';
    Object.assign(header.style, {
        fontWeight: '600',
        fontSize: '12px',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '6px'
    });
    imgLinks.appendChild(header);

    // --- Close button ---
    let closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '1px',
        right: '10px',
        background: 'none',
        border: 'none',
        color: '#999',
        fontSize: '16px',
        cursor: 'pointer',
        padding: '0 4px'
    });
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = '#fff');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = '#999');
    closeBtn.addEventListener('click', () => imgLinks.remove());
    imgLinks.appendChild(closeBtn);

    document.body.appendChild(imgLinks);

    // --- Helpers ---
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function processImage(img, i) {
        let imgNum = i + 1;
        let name = imgNum < 10 ? `Image 0${imgNum}` : `Image ${imgNum}`;

        let link = document.createElement('a');
        link.innerText = name;
        link.setAttribute('download', name);
        Object.assign(link.style, {
            display: 'block',
            padding: '5px 8px',
            marginBottom: '4px',
            borderRadius: '4px',
            color: '#7cb7ff',
            textDecoration: 'none',
            fontSize: '13px'
        });
        link.addEventListener('mouseenter', () => link.style.background = 'rgba(255, 255, 255, 0.08)');
        link.addEventListener('mouseleave', () => link.style.background = 'transparent');

        imgLinks.appendChild(link);

        const res = await fetch(img.src);
        const blob = await res.blob();

        const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });

        link.href = dataUrl;
        link.click();
        await delay(150); // breathing room between downloads
    }

    // --- Sequential processing: image 1 finishes before image 2 starts ---
    (async () => {
        for (let i = 0; i < images.length; i++) {
            await processImage(images[i], i);
        }
    })();
})();