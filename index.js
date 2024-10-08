document.addEventListener('DOMContentLoaded', () => {
    const videos = [
        { src: "https://class.coolsquad.xyz/u/1727432173.mp4", name: "OpenGL Renderer", date: "March - May 2024" },
        { src: "https://class.coolsquad.xyz/u/1727433231.mp4", name: "SDL2 Chess", date: "March - May 2024" },
        { src: "https://class.coolsquad.xyz/u/1727623851.mp4", name: "Flappy Circle", date: "November 2023" },
        { src: "https://staffs-daforum-1.s3.eu-west-2.amazonaws.com/monthly_2024_02/1df98748-2628-4ae7-bc4f-a86a015e0397(1).mp4.de020506b694815e9e9b7b4f7ab4c75e.mp4", name: "Sky Patrol", date: "January - Febuary 2024" },
        { src: "https://staffs-daforum-1.s3.eu-west-2.amazonaws.com/monthly_2024_02/1709211074.mp4.9e9d6ab8d4a54851da9df3a0d88b4bc9.mp4", name: "Lost in Orbit", date: "January - Febuary 2024" },
    ];

    let currentVideoIndex = -1;
    let activeVideoElement = document.getElementById('backgroundVideo1');
    let inactiveVideoElement = document.getElementById('backgroundVideo2');
    let nodes = [];
    const leftSide = document.querySelector('.left-side');
    const connectionCanvas = document.createElement('canvas');
    let ctx;
    const nodeSize = 4; // Size of each node

    // Initialize canvas and context
    function initCanvas() {
        connectionCanvas.style.position = 'absolute';
        connectionCanvas.style.top = '0';
        connectionCanvas.style.left = '0';
        connectionCanvas.width = leftSide.clientWidth;
        connectionCanvas.height = leftSide.clientHeight;
        ctx = connectionCanvas.getContext('2d');
        leftSide.appendChild(connectionCanvas);
    }

    // Handle video selection
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

    // Spawn nodes based on window size
    function spawnNodes() {
        // Calculate the number of nodes based on window size
        const width = leftSide.clientWidth;
        const height = leftSide.clientHeight;
        const area = width * height;

        // Determine the number of nodes (max 150 nodes for larger areas)
        const maxNodes = Math.min(Math.floor(area / 2000), 150); // Example: 1 node for every 400px², capped at 150 nodes
        const minNodeDistance = Math.max(nodeSize * 2, width / 15); // Ensure nodes are not too close in smaller areas

        nodes.forEach(node => leftSide.removeChild(node.element)); // Clear previous nodes
        nodes = []; // Reset nodes array

        // Create nodes
        for (let i = 0; i < maxNodes; i++) {
            spawnNode(minNodeDistance);
        }
    }

    // Spawn a single node
    function spawnNode(minNodeDistance) {
        let leftPosition, topPosition;
        let attempts = 0;

        do {
            leftPosition = Math.random() * (leftSide.clientWidth - nodeSize) + 'px';
            topPosition = Math.random() * (leftSide.clientHeight - nodeSize) + 'px';
            attempts++;
            if (attempts > 100) return; // Exit after too many attempts
        } while (!canSpawnNode(parseFloat(leftPosition) + nodeSize / 2, parseFloat(topPosition) + nodeSize / 2, minNodeDistance));

        createNode(leftPosition, topPosition);
    }

    // Create a node
    function createNode(leftPosition, topPosition) {
        const node = document.createElement('div');
        node.classList.add('moving-node');
        node.style.left = leftPosition;
        node.style.top = topPosition;
        nodes.push({
            element: node,
            velocityX: (Math.random() - 0.5) * 0.25,
            velocityY: (Math.random() - 0.5) * 0.25
        });
        leftSide.appendChild(node);
    }

    // Check minimum distance before spawning new node
    function canSpawnNode(newX, newY, minNodeDistance) {
        return nodes.every(node => {
            const nodeX = parseFloat(node.element.style.left) + nodeSize / 2;
            const nodeY = parseFloat(node.element.style.top) + nodeSize / 2;
            const distance = Math.hypot(nodeX - newX, nodeY - newY);
            return distance >= minNodeDistance;
        });
    }

    // Update node positions
    function updateNodes() {
        nodes.forEach((node, index) => {
            const currentLeft = parseFloat(node.element.style.left);
            const currentTop = parseFloat(node.element.style.top);
            node.element.style.left = currentLeft + node.velocityX + 'px';
            node.element.style.top = currentTop + node.velocityY + 'px';

            // Remove node if it exits the viewport
            if (currentLeft < -10 || currentLeft > leftSide.clientWidth + 10 ||
                currentTop < -10 || currentTop > leftSide.clientHeight + 10) {
                leftSide.removeChild(node.element);
                nodes.splice(index, 1);
                spawnNode(Math.max(nodeSize * 2, leftSide.clientWidth / 15)); // Spawn new node
            }
        });
    }

    // Draw connections between nodes
    function drawConnections() {
        ctx.clearRect(0, 0, connectionCanvas.width, connectionCanvas.height);
    
        // Check if light mode is active
        const isLightMode = document.body.classList.contains('light-mode');
    
        // Set connection line color based on the mode
        ctx.strokeStyle = isLightMode ? 'rgba(230, 230, 230, 0.5)' : 'rgba(25, 25, 25, 0.5)'; 
        ctx.lineWidth = 1;
    
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];
                const xA = parseFloat(nodeA.element.style.left) + nodeSize / 2;
                const yA = parseFloat(nodeA.element.style.top) + nodeSize / 2;
                const xB = parseFloat(nodeB.element.style.left) + nodeSize / 2;
                const yB = parseFloat(nodeB.element.style.top) + nodeSize / 2;
    
                const distance = Math.hypot(xB - xA, yB - yA);
                if (distance < 100) { // Connection threshold
                    ctx.beginPath();
                    ctx.moveTo(xA, yA);
                    ctx.lineTo(xB, yB);
                    ctx.stroke();
                }
            }
        }
    }

    // Handle window resize
    function onResize() {
        connectionCanvas.width = leftSide.clientWidth;
        connectionCanvas.height = leftSide.clientHeight;
        spawnNodes(); // Recalculate and spawn nodes on resize
    }

    // Debounce resize event
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(onResize, 100);
    });

    // Main animation loop
    function animate() {
        updateNodes();
        drawConnections();
        requestAnimationFrame(animate);
    }

    // Initialize
    window.addEventListener('load', () => {
        initCanvas();
        spawnNodes(); // Initial node spawning
        selectRandomVideo();
        setInterval(selectRandomVideo, 30000);
        animate();
    });
});
