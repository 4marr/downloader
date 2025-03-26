async function searchVideo() {
    const downloadButton = document.getElementById('searchButton');
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
        const url = document.getElementById('urlSosmed').value;
        if (url.trim() === '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "URL cannot be empty!"
            });
            return;
        }

        const spotify = `https://fastrestapis.fasturl.cloud/downup/spotifydown?url=${encodeURIComponent(url)}`;
        const spotifySearch = `https://spotifyapi.caliphdev.com/api/search/tracks?q=${encodeURIComponent(url)}`;
        const spotifyPlaylist = `https://spotifyapi.caliphdev.com/api/info/playlist?url=${encodeURIComponent(url)}`;

        let response, data;
        let downloadLinks = '';  // Initialize downloadLinks

        if (url.includes("spotify.com/track")) {
            response = await fetch(spotify);
            data = await response.json();
            downloadLinks += `<div class="mt-10">
                        <div>
                            <img src="${data.result.metadata.cover}" alt="" class="w-48 h-48 object-cover mx-auto rounded-lg">
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold">${data.result.metadata.title}</h2>
                            <p class="text-sm">${data.result.metadata.artists}</p>
                        </div>
                        <div class="mt-7">
                            <a href="${data.result.link}" class="text-green-700 bg-[#F0F0F5] rounded-full py-2 px-3 text-lg">Download</a>
                        </div>
                    </div>`;
        } else if (url.includes("spotify.com/playlist")) {
            response = await fetch(spotifyPlaylist);
            data = await response.json();
            downloadLinks += `
                <div class="mt-10 mb-7">
                        <div>
                            <img src="${data.thumbnail}" alt="" class="w-48 h-48 object-cover mx-auto rounded-lg">
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold">${data.name}</h2>
                            <p class="text-sm">${data.by}</p>
                        </div>
                    </div>
                    `;
            data.tracks.forEach((item) => {
                downloadLinks += `
            <div class="text-start grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#f0f0f5] rounded-lg card">
                <div class="flex gap-2 md:col-span-2">
                    <div>
                        <img src="${item.thumbnail}" alt="" class="w-12 h-12 object-cover rounded-lg">
                    </div>
                    <div class="text-xs">
                        <p class="flex font-semibold gap-2 text-lg">${item.title}</p>
                        <p>${item.artist} - ${item.album}</p>
                    </div>
                </div>
                <div class="hidden md:flex items-center">
                    <p>${item.duration}</p>
                </div>
                <div class="flex justify-end">
                    <button class="inline-flex items-center px-7 py-2 leading-6 text-sm shadow-default rounded-md text-white bg-green-700 hover:bg-green-400 transition ease-in-out duration-150 fetch-button" data-id="${item.id}" data-target="${item.id}">Fetch</button>
                </div>
            </div>`
            });
        } else if (url.includes("spotify.com/album")) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Album not supported yet!"
            });
        } else {
            response = await fetch(spotifySearch);
            data = await response.json();
            data.forEach((item) => {
                downloadLinks += `<div id="${item.id}" class="text-start grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#f0f0f5] rounded-lg card">
                <div class="flex gap-2 md:col-span-2">
                    <div>
                        <img src="${item.thumbnail}" alt="" class="w-12 h-12 object-cover rounded-lg">
                    </div>
                    <div class="text-xs">
                        <p class="flex font-semibold gap-2 text-lg">${item.title}</p>
                        <p>${item.artist} - ${item.album}</p>
                    </div>
                </div>
                <div class="hidden md:flex items-center">
                    <p>${item.duration}</p>
                </div>
                <div class="flex justify-end">
                    <button class="inline-flex items-center px-7 py-2 leading-6 text-sm shadow-default rounded text-white bg-green-700 hover:bg-green-400 transition ease-in-out duration-150 fetch-button" data-id="${item.id}" data-target="${item.id}">Fetch</button>
                </div>
            </div>`;
            });
        }
        console.log('URL:', url);
        console.log('Response:', response);
        console.log('Data:', data);
        console.log('Download Links:', downloadLinks);
        document.getElementById('downloadLinks').innerHTML += downloadLinks;

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
                const id = this.getAttribute('data-id');
                const targetDiv = this.getAttribute('data-target');
                await fetchAndDisplay(id, targetDiv);
            });
        });

        async function fetchAndDisplay(id, targetDiv) {
            try {
                const fetchData = `https://fastrestapis.fasturl.cloud/downup/spotifydown?url=https://open.spotify.com/track/${encodeURIComponent(id)}`;
                let response = await fetch(fetchData);
                let data = await response.json();
                console.log(data);

                    const fetchResult = `
                        <div class="w-full bg-white rounded-lg shadow-lg p-6 card">
                            <div class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                                <!-- Album Cover -->
                                <img src="${data.result.metadata.cover}" alt="Album Cover" class="w-full md:w-48 h-full object-cover rounded-lg shadow-md">

                                <!-- Track Details -->
                                <div class="flex flex-col">
                                    <h1 class="text-lg text-center font-bold text-black mb-2">${data.result.metadata.title}</h1>
                                    <!-- Artist Names -->
                                    <div class="text-center text-black mb-4">
                                        ${data.result.metadata.artists}
                                    </div>

                                    <!-- Download Button -->
                                    <a href="${data.result.link}" class="text-green-700 text-center bg-[#F0F0F5] rounded-full py-2 px-4">Download</a>
                                </div>
                            </div>
                        </div>`;
                        document.getElementById(targetDiv).innerHTML += fetchResult;
                } catch (error) {
                    console.log(error.message);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Terjadi Error, pastikan link yg ingin di download bukanlah private atau coba lagi nanti."
                    });
                } finally {
                    document.getElementById(targetDiv).querySelector('.fetch-button').innerHTML = 'Fetch';
                }
            }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi Error, pastikan link yg ingin di download bukanlah private atau coba lagi nanti."
        });
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
