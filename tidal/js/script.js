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
                        document.getElementById('downloadLinks').innerHTML = "";

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

        let response = await fetch(tidalUrl);
        let data = await response.json();
        const { metadata, downloadUrl } = data.result;
        const { title, duration, copyright, audioQuality, audioModes, artists, album } = metadata;

        // Generate artist names HTML
        const artistNames = artists.map(artist => artist.name).join(', ');

        const downloadLinks = `
        <div class="w-full bg-gray-800 rounded-lg shadow-lg p-6 card">
            <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <!-- Album Cover -->
                <img src="${album.cover}" alt="Album Cover" class="w-full md:w-48 h-48 object-cover rounded-lg shadow-md">

                <!-- Track Details -->
                <div class="flex flex-col">
                    <h1 class="text-4xl font-bold text-white mb-2">${title}</h1>
                    <p class="text-lg text-gray-300 mb-4 italic">from the Soundtrack "${album.title}"</p>

                    <!-- Artist Names -->
                    <div class="text-lg text-white mb-4">
                        ${artistNames}
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
        document.getElementById('downloadLinks').innerHTML += downloadLinks;
    } catch (error) {
        handleFetchError(error);
    } finally {
        downloadButton.innerHTML = 'Search';
    }
}

async function searchTitle() {
    const downloadButton = document.getElementById('titleButton');
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
                        document.getElementById('downloadLinks').innerHTML = "";

    try {
        const url = document.getElementById('titleTidal').value;
        if (url.trim() === '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "URL cannot be empty!"
            });
            return;
        }

        const tidalTitle = `https://fastrestapis.fasturl.cloud/music/tidal?name=${encodeURIComponent(url)}`;

        let response = await fetch(tidalTitle);
        let data = await response.json();
        let items = data.result.items;
        let downloadLinks = '';  // Initialize downloadLinks

        items.forEach(item => {
            const { album, title, artist, explicit, audioQuality, duration } = item;
            const explicitTag = explicit ? `<span class="p-1 bg-gray-200 rounded font-normal text-xs">E</span>` : "";

            downloadLinks += `
            <div class="text-start grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#f0f0f5] rounded-lg card">
                <div class="flex gap-2">
                    <div>
                        <img src="${album.cover}" alt="" class="w-12 h-12 object-cover rounded-lg">
                    </div>
                    <div class="text-xs">
                        <p class="flex font-semibold gap-2 text-sm">${title}
                            ${explicitTag}
                            <span class="p-1 bg-gray-200 rounded font-normal text-xs">${audioQuality}</span>
                        </p>
                        <p>${artist.name}</p>
                    </div>
                </div>
                <div>
                    <p>${formatDuration(duration)}</p>
                </div>
                <div>
                    <button class="py-2 px-3 bg-slate-700 text-white rounded fetch-button" data-url="${item.url}" data-quality="${audioQuality}">Fetch</button>
                </div>
            </div>`;
        });

        console.log('URL:', url);
        console.log('Response:', response);
        console.log('Data:', data);
        console.log('Download Links:', downloadLinks);
        document.getElementById('downloadLinks').innerHTML += downloadLinks;

        // Add event listeners to fetch buttons
        document.querySelectorAll('.fetch-button').forEach(button => {
            button.addEventListener('click', async function () {
                this.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Fetching...`;
                const fetchUrl = `https://fastrestapis.fasturl.cloud/downup/tidaldown?url=${encodeURIComponent(this.dataset.url)}&quality=${encodeURIComponent(this.dataset.quality)}`;
                try {
                    const fetchResponse = await fetch(fetchUrl);
                    const fetchData = await fetchResponse.json();
                    const { metadata, downloadUrl } = fetchData.result;
                    const { title, duration, copyright, audioQuality, audioModes, artists, album } = metadata;
                    // Generate artist names HTML
                    const artistNames = artists.map(artist => artist.name).join(', ');

                    const fetchResult = `
                    <div class="fixed top-0 left-0 w-full h-full bg-gray-800/20 rounded-lg shadow-lg p-14 card z-50" id="fetchResult">
                        <div class="w-full bg-white rounded-lg shadow-lg p-6 card">
                            <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                                <!-- Album Cover -->
                                <img src="${album.cover}" alt="Album Cover" class="w-full md:w-48 h-48 object-cover rounded-lg shadow-md">

                                <!-- Track Details -->
                                <div class="flex flex-col">
                                    <h1 class="text-4xl font-bold text-white mb-2">${title}</h1>
                                    <p class="text-lg text-gray-300 mb-4 italic">from the Soundtrack "${album.title}"</p>
                                    <!-- Artist Names -->
                                    <div class="text-lg text-white mb-4">
                                        ${artistNames}
                                    </div>

                                    <!-- Metadata -->
                                    <div class="text-sm text-start text-gray-400 mb-2">
                                        <p><strong>Duration:</strong> ${formatDuration(duration)}</p>
                                        <p><strong>Copyright:</strong> ${copyright}</p>
                                        <p><strong>Audio Quality:</strong> ${audioQuality}</p>
                                        <p><strong>Audio Mode:</strong> ${audioModes.join(', ')}</p>
                                    </div>

                                    <!-- Download Button -->
                                    <a href="${downloadUrl}" class="inline-block text-center bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-full mt-4 transition-colors">Download FLAC</a>
                                </div>
                            </div>

                            <!-- Link to Track on Tidal -->
                            <div class="text-center mt-4">
                                <a href="${metadata.url}" target="_blank" class="text-blue-400 hover:underline text-lg text-center">Listen on Tidal</a>
                            </div>
                        </div>
                    </div>`;
                    document.getElementById('downloadLinks').innerHTML += fetchResult;

                    // Add event listener to hide the absolute div when clicked
                    document.getElementById('fetchResult').addEventListener('click', function () {
                        this.style.display = 'none';
                    });
                } catch (error) {
                    console.log(error.message);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Terjadi Error, pastikan link yg ingin di download bukanlah private atau coba lagi nanti."
                    });
                } finally {
                    this.innerHTML = 'Fetch';
                }
            });
        });
    } catch (error) {
        handleFetchError(error);
    } finally {
        downloadButton.innerHTML = 'Search';
    }
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function handleFetchError(error) {
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
}

const drawer = document.getElementById("drawer");
const drawerButton = document.getElementById("header-drawer-button");

drawerButton.addEventListener('click', function () {
    drawer.classList.toggle('open');
    drawerButton.classList.toggle('open');
});

document.getElementById("url").addEventListener("click", function () {
    this.classList.add("bg-slate-700", "text-white");
    document.getElementById("title").classList.remove("bg-slate-700", "text-white");
    toggleSections("sectionUrl", "sectionTitle");
});

document.getElementById("title").addEventListener("click", function () {
    this.classList.add("bg-slate-700", "text-white");
    document.getElementById("url").classList.remove("bg-slate-700", "text-white");
    toggleSections("sectionTitle", "sectionUrl");
});

function toggleSections(showSectionId, hideSectionId) {
    const showSection = document.getElementById(showSectionId);
    const hideSection = document.getElementById(hideSectionId);
    showSection.classList.remove("hidden");
    showSection.classList.add("block");
    hideSection.classList.remove("block");
    hideSection.classList.add("hidden");
}
