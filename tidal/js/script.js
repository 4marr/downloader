async function searchUrl() {
    const downloadButton = document.getElementById('urlButton');
    downloadButton.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Searching...`;

    try {
        const url = document.getElementById('urlTidal').value;
        if (url.trim() === '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "URL cannot be empty!"
            });
            return;
        }

        const qualitySelect = document.getElementById('quality').value;
        const tidalUrl = `https://fastrestapis.fasturl.cloud/downup/tidaldown?url=${encodeURIComponent(url)}&quality=${encodeURIComponent(qualitySelect)}`;

        let response, data;
        let downloadLinks = '';  // Initialize downloadLinks

        if (url.includes('tidal.com')) {
            function formatDuration(seconds) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
            }
            response = await fetch(tidalUrl);
            data = await response.json();
            const { metadata, downloadUrl } = data.result;
            const { title, duration, copyright, audioQuality, audioModes, artists, album } = metadata;

            // Generate artist images HTML
            let artistImages = '';
            artists.forEach(artist => {
                artistImages += `
                    <img src="${artist.picture}" alt="${artist.name}" class="relative inline-block h-8 w-8 rounded-full border-2 border-white object-cover object-center hover:z-10 focus:z-10">`;
            });

            // Generate artist names HTML
            const artistNames = artists.map(artist => artist.name).join(', ');

            downloadLinks = `
            <div class="w-full bg-gray-800 rounded-lg shadow-lg p-6 card">
                <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <!-- Album Cover -->
                    <img src="${album.cover}" alt="Album Cover" class="w-full md:w-48 h-48 object-cover rounded-lg shadow-md">

                    <!-- Track Details -->
                    <div class="flex flex-col">
                        <h1 class="text-4xl font-bold text-white mb-2">${title}</h1>
                        <p class="text-lg text-gray-300 mb-4 italic">from the Soundtrack "${album.title}"</p>
<div class="flex items-center gap-2 mb-4">
                        <!-- Artist Images -->
                        <div class="flex items-center -space-x-4">
                            ${artistImages}
                        </div>

                        <!-- Artist Names -->
                        <div class="text-xs text-start text-white">
                            ${artistNames}
                        </div>
                        </div>

                        <!-- Metadata -->
                        <div class="text-sm text-start text-gray-400 mb-2">
                            <p><strong>Duration:</strong> ${formatDuration(duration)}</p>
                            <p><strong>Copyright:</strong> ${copyright}</p>
                            <p><strong>Audio Quality:</strong> ${audioQuality}</p>
                            <p><strong>Audio Mode:</strong> ${audioModes.join(', ')}</p>
                        </div>

                        <!-- Download Button -->
                        <a href="${downloadUrl}" class="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full mt-4 transition-colors">Download FLAC</a>
                    </div>
                </div>

                <!-- Link to Track on Tidal -->
                <div class="text-center mt-8">
                    <a href="${metadata.url}" target="_blank" class="text-blue-400 hover:underline text-lg text-center">Listen on Tidal</a>
                </div>
            </div>`;
            console.log('URL:', url);
            console.log('Response:', response);
            console.log('Data:', data);
            console.log('Download Links:', downloadLinks);
            document.getElementById('downloadLinks').innerHTML = downloadLinks;
        }
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

const drawer = document.getElementById("drawer")
const drawerButton = document.getElementById("header-drawer-button")

drawerButton.addEventListener('click', function () {
    drawer.classList.toggle('open');
    drawerButton.classList.toggle('open');
});
