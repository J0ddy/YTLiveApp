// Set your API key and channel ID
const apiKey = process.env.API_KEY;
const channelId = process.env.CHANNEL_ID;

if (!apiKey || !channelId) {
    const mainHeader = document.getElementById('main-header');
    const errorElement = document.createElement('h3');
    errorElement.textContent = 'Error: API key or channel ID not set.';
    errorElement.style.color = '#ff9999';
    mainHeader.appendChild(errorElement);
    const liveContainer = document.getElementById('live-container');
    liveContainer.style.display = 'none';
    console.error('Error: API key or channel ID not set.')
}

// Set API endpoints to get live, scheduled, and past livestreams
const liveEndpoint = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&eventType=live&type=video`;
const scheduledEndpoint = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&eventType=upcoming&type=video`;
const pastEndpoint = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&eventType=completed&type=video`;

// Get container elements
const liveNowContainer = document.getElementById('live-now');
const liveSoonContainer = document.getElementById('live-soon');
const livePastContainer = document.getElementById('live-past');

// Define caching variables
const cacheTimeout = 60000; // Cache timeout in milliseconds
let cacheExpireTime = 0; // Time when cache will expire
let cacheData = null; // Cached API response data

// Define rate-limiting variables
const rateLimit = 10; // Request limit per minute
const rateLimitInterval = 60000 / rateLimit; // Interval between requests
let requestCount = 0; // Number of requests made within current interval

// Function to create video element
function createVideoElement(item) {
    // Get video id, title, thumbnail, and date/time
    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const thumbnail = item.snippet.thumbnails.medium.url;
    const liveBroadcastContent = item.snippet.liveBroadcastContent;
    const publishedAt = new Date(item.snippet.publishedAt);
    const timeZone = publishedAt
        .toLocaleTimeString('en-US', {timeZoneName: 'short'})
        .split(' ')[2];

    // Get scheduled start time if available
    let scheduledStartTime;
    if (item.snippet.hasOwnProperty('scheduledStartTime')) {
        scheduledStartTime = new Date(item.snippet.scheduledStartTime);
    }

    // Create video element
    const videoElement = document.createElement('div');
    videoElement.classList.add('video');

    // Create thumbnail image element
    const thumbnailElement = document.createElement('img');
    thumbnailElement.src = thumbnail;

    // Create link element
    const linkElement = document.createElement('a');
    linkElement.href = `https://www.youtube.com/watch?v=${videoId}`;
    linkElement.target = '_blank';

    // Create title element
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    // Create date/time element
    const datetimeElement = document.createElement('span');
    const options = {
        timeZone: 'UTC',
        hour12: true,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };

    if (liveBroadcastContent === 'upcoming') {
        if (scheduledStartTime) {
            datetimeElement.textContent = `Scheduled for ${scheduledStartTime.toLocaleString('en-US', options)} ${timeZone}`;
        } else {
            datetimeElement.textContent = 'Scheduled time not available';
        }
    } else {
        datetimeElement.textContent = `${publishedAt.toLocaleString('en-US', options)} ${timeZone}`;
    }

    // Append thumbnail, title, and date/time to link element
    linkElement.appendChild(thumbnailElement);
    linkElement.appendChild(titleElement);
    linkElement.appendChild(datetimeElement);

    // Append link element to video
    videoElement.appendChild(linkElement);

    return videoElement;
}

// Function to display videos in container
function displayVideos(response) {
    // Check if response is defined and has items
    if (response && response.liveNow && response.liveNow.items && response.liveSoon && response.liveSoon.items && response.past && response.past.items) {
        // Display live videos in liveNowContainer
        if (response.liveNow.items.length > 0) {
            response
                .liveNow
                .items
                .forEach((item) => {
                    const videoElement = createVideoElement(item);
                    liveNowContainer.appendChild(videoElement);
                });
        } else {
            liveNowContainer.textContent = 'No live videos currently.';
        }

        // Display scheduled videos in liveSoonContainer
        if (response.liveSoon.items.length > 0) {
            response
                .liveSoon
                .items
                .forEach((item) => {
                    const videoElement = createVideoElement(item);
                    liveSoonContainer.appendChild(videoElement);
                });
        } else {
            liveSoonContainer.textContent = 'No scheduled livestreams. Stay tuned!';
        }

        // Display past videos in livePastContainer
        if (response.past.items.length > 0) {
            response
                .past
                .items
                .forEach((item) => {
                    const videoElement = createVideoElement(item);
                    livePastContainer.appendChild(videoElement);
                });
        } else {
            livePastContainer.textContent = 'No past livestreams.';
        }

    } else {
        console.error('Error displaying videos:', response);
        liveNowContainer.textContent = 'Error displaying videos. Please try again later.';
        liveSoonContainer.textContent = 'Error displaying videos. Please try again later.';
        livePastContainer.textContent = 'Error displaying videos. Please try again later.';
    }
}

// Function to fetch data from API and cache it in localStorage
function fetchData() {
    // Check if API key and channel ID are set
    if (!apiKey || !channelId) {
        return;
    }
    // Check if API response is cached in localStorage
    const cachedResponse = localStorage.getItem('apiResponse');
    if (cachedResponse) {
        // Parse cached response and display videos in container
        try {
            displayVideos(JSON.parse(cachedResponse));
        } catch (error) {
            console.error('Error parsing cached response:', error);
            localStorage.removeItem('apiResponse');
            fetchData();
        }
    } else {
        // Fetch data from API and cache response in localStorage
        Promise.all([
            fetch(liveEndpoint).then((response) => response.json()),
            fetch(scheduledEndpoint).then((response) => response.json()),
            fetch(pastEndpoint).then((response) => response.json())
        ]).then(([liveNow, liveSoon, past]) => {
            const apiResponse = {
                liveNow,
                liveSoon,
                past
            };
            localStorage.setItem('apiResponse', JSON.stringify(apiResponse));
            displayVideos(apiResponse);
        }).catch((error) => {
            console.error('Error fetching data from API:', error);
            liveNowContainer.textContent = 'Error fetching data. Please try again later.';
            liveSoonContainer.textContent = 'Error fetching data. Please try again later.';
            livePastContainer.textContent = 'Error fetching data. Please try again later.';
        });
    }
}
// Call fetchData function to display videos in container
fetchData();

// Add a the channel name and a subscribe button to the page if the channel ID is set
if (channelId) {
    // Create subscribe button element
    const header = document.getElementById('main-header');
    let channelInfo = document.createElement('div');
    channelInfo.setAttribute('id', 'channel-info');
    channelInfo.setAttribute('class', 'g-ytsubscribe');
    channelInfo.setAttribute('data-channelid', channelId);
    channelInfo.setAttribute('data-layout', 'full');
    channelInfo.setAttribute('data-count', 'default');
    channelInfo.setAttribute('data-theme', 'dark');
    header.appendChild(channelInfo);
}