async function searchVideo() {
    const downloadButton = document.getElementById('searchBuuton');
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
        const url = document.getElementById('urlSosmed').value;
        if (url.trim() === '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "URL cannot be empty!"
            });
            return;
        }

        const spotify = `https://fastrestapis.fasturl.cloud/downup/ytdown-v1?name=${encodeURIComponent(url)}&format=${encodeURIComponent(formatSelect)}&quality=${encodeURIComponent(qualitySelect)}&server=${encodeURIComponent(serverSelect)}`;

        let response, data;
        let downloadLinks = '';  // Initialize downloadLinks

        response = await fetch(yt);
        data = await response.json();
        downloadLinks += `
        <div class="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
  <!-- Title and Message -->
  <div class="mb-6">
    <h1 class="text-lg font-bold text-violet-600">${data.result.title}</h1>
    <p class="text-violet-500 mt-2">${data.result.msg}</p>
  </div>

  <!-- Author Section -->
  <div class="flex items-center mb-6 text-start">
    <!-- Author Image -->
    <img src="${data.result.author.image}" alt="Author Image" class="w-20 h-20 rounded-full mr-4 shadow-lg">

    <!-- Author Info -->
    <div>
      <h2 class="text-lg font-semibold text-gray-800">${data.result.author.name}</h2>
      <p><a href="${data.result.author.url}" class="text-violet-600 underline" target="_blank">Visit Channel</a></p>
      <p class="text-gray-600">${new Intl.NumberFormat().format(data.result.author.subCount)} Subscribers</p>
    </div>
  </div>

  <!-- Video Section -->
  <div class="flex flex-col md:flex-row mb-6">
    <!-- Thumbnail -->
    <img src="${data.result.metadata.thumbnail}" alt="Video Thumbnail" class="w-full md:w-64 h-64 rounded-lg object-cover shadow-lg mb-4 md:mb-0 md:mr-6">

    <!-- Video Info -->
    <div class="flex-1">
      <ul class="list-none mt-2 text-gray-700 text-start">
        <li><strong>Duration:</strong> ${data.result.metadata.duration}</li>
        <li><strong>Views:</strong> ${new Intl.NumberFormat().format(data.result.metadata.views)}</li>

        <!-- Description with truncation -->
        <li class="line-clamp-3"><strong>Description:</strong> ${data.result.metadata.description}</li>
        <li><strong>Upload Date:</strong> ${data.result.metadata.uploadDate}</li>
        <li class="flex flex-col md:flex-row gap-4 mt-4">
          <!-- Download Link -->
          <a href="${data.result.media}" download class="bg-violet-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-violet-700 transition duration-300 w-full text-center">Download ${data.result.format} ${data.result.quality}</a>

          <!-- Watch Video Link -->
          <a href="${data.result.url}" target="_blank" class="bg-red-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-red-700 transition duration-300 w-full text-center">Watch Video on YouTube</a>
        </li>
      </ul>
    </div>
  </div>
</div>`
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

const drawer = document.getElementById("drawer")
const drawerButton = document.getElementById("header-drawer-button")

drawerButton.addEventListener('click', function () {
    drawer.classList.toggle('open');
    drawerButton.classList.toggle('open');
});
