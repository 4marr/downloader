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

    try {
        const url = document.getElementById('urlYtDownload').value;
        if (url.trim() === '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "URL cannot be empty!"
            });
            return;
        }

        const formatSelect = document.getElementById('format').value;
        const qualitySelect = document.getElementById('quality').value;
        const serverSelect = document.getElementById('server').value;
        const yt = `https://fastrestapis.fasturl.cloud/downup/ytdown-v1?name=${encodeURIComponent(url)}&format=${encodeURIComponent(formatSelect)}&quality=${encodeURIComponent(qualitySelect)}&server=${encodeURIComponent(serverSelect)}`;

        const response = await fetch(yt);
        const data = await response.json();

        const downloadLinks = `
        <div class="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
            <div class="mb-6">
                <h1 class="text-lg font-bold text-violet-600">${data.result.title}</h1>
                <p class="text-violet-500 mt-2">${data.result.msg}</p>
            </div>
            <div class="flex items-center mb-6 text-start">
                <img src="${data.result.author.image}" alt="Author Image" class="w-20 h-20 rounded-full mr-4 shadow-lg">
                <div>
                    <h2 class="text-lg font-semibold text-gray-800">${data.result.author.name}</h2>
                    <p><a href="${data.result.author.url}" class="text-violet-600 underline" target="_blank">Visit Channel</a></p>
                    <p class="text-gray-600">${new Intl.NumberFormat().format(data.result.author.subCount)} Subscribers</p>
                </div>
            </div>
            <div class="flex flex-col md:flex-row mb-6">
                <img src="${data.result.metadata.thumbnail}" alt="Video Thumbnail" class="w-full md:w-64 h-64 rounded-lg object-cover shadow-lg mb-4 md:mb-0 md:mr-6">
                <div class="flex-1">
                    <ul class="list-none mt-2 text-gray-700 text-start">
                        <li><strong>Duration:</strong> ${data.result.metadata.duration}</li>
                        <li><strong>Views:</strong> ${new Intl.NumberFormat().format(data.result.metadata.views)}</li>
                        <li class="line-clamp-3"><strong>Description:</strong> ${data.result.metadata.description}</li>
                        <li><strong>Upload Date:</strong> ${data.result.metadata.uploadDate}</li>
                        <li class="flex flex-col md:flex-row gap-4 mt-4">
                            <a href="${data.result.media}" download class="bg-violet-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-violet-700 transition duration-300 w-full text-center">Download ${data.result.format} ${data.result.quality}</a>
                            <a href="${data.result.url}" target="_blank" class="bg-red-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-red-700 transition duration-300 w-full text-center">Watch Video on YouTube</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`;

        document.getElementById('downloadLinks').innerHTML = downloadLinks;
    } catch (error) {
        handleFetchError(error);
    } finally {
        downloadButton.innerHTML = 'Search';
    }
}

async function transcriptVideo() {
    const transcriptButton = document.getElementById('transcriptButton');
    transcriptButton.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Transcripting...`;

    try {
        const url = document.getElementById('urlYtTranscript').value;
        if (url.trim() === '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "URL cannot be empty!"
            });
            return;
        }

        const youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;

        const ytTrans = `https://fastrestapis.fasturl.cloud/tool/yt-transcript?url=${encodeURIComponent(url)}`;

        if (youtubeRegex.test(url)) {
            const response = await fetch(ytTrans);
            const data = await response.json();

            const transcriptResult = `
        <div class="bg-gray-200 p-6 rounded-lg border border-gray-300">
        <div class="flex justify-between mb-4">
        <p class="text-xs">Transcript</p>
        <button id="copy-btn" class="flex justify-center items-center gap-2 text-xs" onclick="copyText()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M7 9.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333z"/><path d="M4.012 16.737A2 2 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1"/></g></svg>
                copy text
            </button>
            </div>
            <p id="text-to-copy" class="text-start">${data.result}</p>
        </div>`;
            document.getElementById('transcriptResult').innerHTML = transcriptResult;
        } else {
            throw new Error('Unsupported URL!, Hanya support yt');
        }
    } catch (error) {
        handleFetchError(error);
    } finally {
        transcriptButton.innerHTML = 'Transcript';
    }
}

function handleFetchError(error) {
    if (error.message === 'Unsupported URL!, Hanya support yt') {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Unsupported URL!, Hanya support Youtube"
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

document.getElementById("download").addEventListener("click", function () {
    this.classList.add("bg-violet-700", "text-white");
    document.getElementById("transcript").classList.remove("bg-violet-700", "text-white");
    toggleSections("sectionDownload", "sectionTranscript");
});

document.getElementById("transcript").addEventListener("click", function () {
    this.classList.add("bg-violet-700", "text-white");
    document.getElementById("download").classList.remove("bg-violet-700", "text-white");
    toggleSections("sectionTranscript", "sectionDownload");
});

function toggleSections(showSectionId, hideSectionId) {
    const showSection = document.getElementById(showSectionId);
    const hideSection = document.getElementById(hideSectionId);
    showSection.classList.remove("hidden");
    showSection.classList.add("block");
    hideSection.classList.remove("block");
    hideSection.classList.add("hidden");
}

function copyText() {
    // Mendapatkan elemen <p> yang berisi teks
    var text = document.getElementById("text-to-copy").innerText;

    // Menyalin teks ke clipboard
    navigator.clipboard.writeText(text).then(function () {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "Teks berhasil disalin!"
        });
    }).catch(function () {
        alert("Gagal menyalin teks.");
    });
}
