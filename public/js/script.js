async function searchVideo() {
    const downloadButton = document.querySelector('button');
    downloadButton.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...`;

    try {
        function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        const randomString = generateRandomString(8);
        const url = document.getElementById('urlSosmed').value;
        if (url.trim() === '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "URL cannot be empty!"
            });
            return;
        }
        const youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
        const supportedUrls = ['instagram.com', 'tiktok.com', 'youtube.com', 'youtu.be', 'facebook.com', 'fb.watch', 'reel', 'x.com', 'twitter.com'];

        // if (!supportedUrls.some(supportedUrl => url.includes(supportedUrl)) && !youtubeRegex.test(url)) {
        //     alert('Unsupported URL!, Hanya support fb/ig/tt/yt');
        //     return;
        // }

        const ig = `https://api.ryzendesu.vip/api/downloader/igdl?url=${encodeURIComponent(url)}`;
        const tt = `https://api.nyxs.pw/dl/tiktok?url=${encodeURIComponent(url)}`;
        const yt = `https://api.nyxs.pw/dl/yt-direct?url=${encodeURIComponent(url)}`;
        const twit = `https://api.ryzendesu.vip/api/downloader/twitter?url=${encodeURIComponent(url)}`
        const fb = `https://api.ryzendesu.vip/api/downloader/fbdl?url=${encodeURIComponent(url)}`;
        const searchYt = `https://itzpire.com/search/youtube?query=${encodeURIComponent(url)}`;

        let response, data;
        let downloadLinks = '';  // Initialize downloadLinks

        if (url.includes('instagram.com')) {
            response = await fetch(ig);
            data = await response.json();
            data.data.forEach((item, index) => {
                downloadLinks += `
                <img src="${item.thumbnail}" alt="thumbnail" id="thumbnail" class="my-4" />
                <a href="${item.url}" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" download>Download File ${index + 1}</a>`;
            });
        } else if (url.includes('tiktok.com')) {
            response = await fetch(tt);
            data = await response.json();

            if (data.result.type === 'image') {
                data.result.images.forEach((imageUrl, index) => {
                    downloadLinks += `
                    <img src="${imageUrl}" alt="thumbnail" id="thumbnail" class="my-4" />
                    <a href="${imageUrl}" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" download="${randomString}.jpg">Download Image ${index + 1}</a>`;
                });
                downloadLinks += `<a href="${data.result.audio}" target="_blank" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" download>Download Music Audio</a>`;
            } else {
                downloadLinks += `
                    <p>${data.result.desc}</p>
                    <a href="${data.result.video}" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" target="_blank" download>Download Video</a>
                    <a href="${data.result.videoHD}" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" target="_blank" download>Download Video HD</a>
                    <a href="${data.result.videoWatermark}" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" target="_blank" download>Download Video With Watermark</a>
                    <a href="${data.result.music}" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" target="_blank" download>Download Music Audio</a>
                `;
            }
        } else if (youtubeRegex.test(url)) {
            response = await fetch(yt);
            data = await response.json();

            downloadLinks += `
            <img src="${data.result.thumbnail}" alt="thumbnail" id="thumbnail" class="my-4" />
            <p>${data.result.title}</p>
            <a href="${data.result.urlVideo}" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" target="_blank" download="${data.title}">Download Video</a>
            <a href="${data.result.urlAudio}" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" target="_blank" download>Download Music Audio</a>
        `;
        } else if (/(reel|fb|facebook\.com|fb\.watch)/i.test(url)) {
            response = await fetch(fb);
            data = await response.json();

            downloadLinks += `<img src="${data.data[0].thumbnail} alt="thumbnail" />`
            data.data.forEach((item) => {
                downloadLinks += `<a href="${item.url}" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" download>Download Video ${item.resolution}</a>`;
            });

        } else if (url.includes('x.com') || url.includes('twitter.com')) {
            response = await fetch(twit);
            data = await response.json();

            if (data.type === 'image') {
                data.media.forEach((imageUrl, index) => {
                    downloadLinks += `<a href="${imageUrl}" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" download>Download Image ${index + 1}</a>`;
                });
            } else {
                data.media.forEach((videoUrl, index) => {
                    downloadLinks += `<a href="${videoUrl.url}" class="flex text-center my-2 items-center justify-center px-4 py-2 leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150" download>Download video quality ${videoUrl.quality}p</a>`;
                });
            }
        } else {
            response = await fetch(searchYt);
            data = await response.json();

            downloadLinks += `<p>Download video atau audio menggunakan judul atau title masih dalam tahap pengmbangan!</p>`
        }
        console.log('URL:', url);
        console.log('Response:', response);
        console.log('Data:', data);
        console.log('Download Links:', downloadLinks);
        document.getElementById('downloadLinks').innerHTML = downloadLinks;
    } catch (error) {
        if (error.message === 'Unsupported URL!, Hanya support fb/ig/tt/yt') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Unsupported URL!, Hanya support Tiktok/YouTube/Instagram/Twitter/Facebook"
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Terjadi Error, pastikan link yg ingin di download bukanlah private atau coba lagi nanti."
            });
        }
        console.log(error.message);
    } finally {
        downloadButton.innerHTML = 'Search';
    }
}
