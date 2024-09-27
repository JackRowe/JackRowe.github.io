document.addEventListener('DOMContentLoaded', () => {
    const videos = [
        { src: "https://class.coolsquad.xyz/u/1727432173.mp4", name: "OpenGL Renderer", date: "March - May 2024" },
        { src: "https://class.coolsquad.xyz/u/1727433231.mp4", name: "SDL2 Chess", date: "March - May 2024" },
    ];

    let currentVideoIndex = -1;
    let activeVideoElement = document.getElementById('backgroundVideo1');
    let inactiveVideoElement = document.getElementById('backgroundVideo2');

    function selectRandomVideo() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * videos.length);
        } while (newIndex === currentVideoIndex);
        
        currentVideoIndex = newIndex;
        const selectedVideo = videos[currentVideoIndex];

        inactiveVideoElement.src = selectedVideo.src;
        inactiveVideoElement.load();

        inactiveVideoElement.oncanplay = () => {
            inactiveVideoElement.play();
            inactiveVideoElement.classList.add('active');
            activeVideoElement.classList.remove('active');

            document.getElementById('projectName').textContent = selectedVideo.name;
            document.getElementById('projectDate').textContent = selectedVideo.date;

            [activeVideoElement, inactiveVideoElement] = [inactiveVideoElement, activeVideoElement];
        };
    }

    window.addEventListener('load', selectRandomVideo);
    setInterval(selectRandomVideo, 30000);

    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Light/Dark mode toggle
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');

        // Update the toggle button image based on the current theme
        if (body.classList.contains('light-mode')) {
            themeToggle.src = 'images/dark.png'; // Use light mode icon
        } else {
            themeToggle.src = 'images/light.png'; // Use dark mode icon
        }
    });
});