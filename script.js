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

    const nodes = [];
    const leftSide = document.querySelector('.left-side');
    const connectionCanvas = document.createElement('canvas'); // Create a canvas for lines
    leftSide.appendChild(connectionCanvas);
    connectionCanvas.style.position = 'absolute';
    connectionCanvas.style.top = '0';
    connectionCanvas.style.left = '0';
    connectionCanvas.width = leftSide.clientWidth;
    connectionCanvas.height = leftSide.clientHeight;

    const ctx = connectionCanvas.getContext('2d');
    const initialNodeCount = 100; // Increased initial number of nodes
    const nodeSize = 4; // Size of each node, smaller than before
    const minNodeDistance = 50; // Minimum distance between nodes

    // Function to create and spawn nodes
    function createNode(leftPosition, topPosition) {
        const node = document.createElement('div');
        node.classList.add('moving-node');
        node.style.left = leftPosition;
        node.style.top = topPosition;
        nodes.push({
            element: node,
            velocityX: (Math.random() - 0.5) * 0.25, // Slower movement
            velocityY: (Math.random() - 0.5) * 0.25 // Slower movement
        });
        leftSide.appendChild(node);
    }

    // Check for minimum distance before creating a new node
    function canSpawnNode(newX, newY) {
        return nodes.every(node => {
            const nodeX = parseFloat(node.element.style.left) + nodeSize / 2;
            const nodeY = parseFloat(node.element.style.top) + nodeSize / 2;
            const distance = Math.hypot(nodeX - newX, nodeY - newY);
            return distance >= minNodeDistance; // Check distance
        });
    }

    // Function to spawn nodes in a more spread-out manner
    function spawnInitialNodes() {
        for (let i = 0; i < initialNodeCount; i++) {
            let leftPosition, topPosition;
            do {
                leftPosition = Math.random() * (leftSide.clientWidth - nodeSize) + 'px';
                topPosition = Math.random() * (leftSide.clientHeight - nodeSize) + 'px';
            } while (!canSpawnNode(parseFloat(leftPosition) + nodeSize / 2, parseFloat(topPosition) + nodeSize / 2)); // Ensure minimum distance
            createNode(leftPosition, topPosition);
        }
    }

    spawnInitialNodes();

    function maintainMinDistance(node) {
        const currentLeft = parseFloat(node.element.style.left);
        const currentTop = parseFloat(node.element.style.top);

        nodes.forEach(otherNode => {
            if (node !== otherNode) {
                const otherLeft = parseFloat(otherNode.element.style.left);
                const otherTop = parseFloat(otherNode.element.style.top);
                const distance = Math.hypot(currentLeft - otherLeft, currentTop - otherTop);

                if (distance < minNodeDistance) {
                    const angle = Math.atan2(currentTop - otherTop, currentLeft - otherLeft);
                    const moveDistance = (minNodeDistance - distance) / 2; // Move half the distance to maintain minimum spacing

                    // Adjust positions
                    node.element.style.left = currentLeft + Math.cos(angle) * moveDistance + 'px';
                    node.element.style.top = currentTop + Math.sin(angle) * moveDistance + 'px';
                }
            }
        });
    }

    function updateNodes() {
        nodes.forEach((node, index) => {
            // Move node based on velocity
            const currentLeft = parseFloat(node.element.style.left);
            const currentTop = parseFloat(node.element.style.top);

            // Update positions
            node.element.style.left = currentLeft + node.velocityX + 'px';
            node.element.style.top = currentTop + node.velocityY + 'px';

            // Maintain minimum distance from other nodes
            maintainMinDistance(node);

            // Remove node if it exits the viewport
            if (
                currentLeft < -10 || currentLeft > leftSide.clientWidth + 10 || // Left or right
                currentTop < -10 || currentTop > leftSide.clientHeight + 10 // Top or bottom
            ) {
                leftSide.removeChild(node.element);
                nodes.splice(index, 1); // Remove from the array
                // Spawn a new node to replace the deleted one
                let leftPosition, topPosition;
                do {
                    leftPosition = Math.random() * (leftSide.clientWidth - nodeSize) + 'px';
                    topPosition = Math.random() * (leftSide.clientHeight - nodeSize) + 'px';
                } while (!canSpawnNode(parseFloat(leftPosition) + nodeSize / 2, parseFloat(topPosition) + nodeSize / 2)); // Ensure minimum distance
                createNode(leftPosition, topPosition);
            }
        });
    }

    function drawConnections() {
        ctx.clearRect(0, 0, connectionCanvas.width, connectionCanvas.height); // Clear the canvas

        ctx.strokeStyle = 'rgba(55, 55, 55, 0.5)'; // Set line color with transparency
        ctx.lineWidth = 1; // Set line width

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];

                const xA = parseFloat(nodeA.element.style.left) + nodeSize / 2; // Center of node A
                const yA = parseFloat(nodeA.element.style.top) + nodeSize / 2; // Center of node A
                const xB = parseFloat(nodeB.element.style.left) + nodeSize / 2; // Center of node B
                const yB = parseFloat(nodeB.element.style.top) + nodeSize / 2; // Center of node B

                // Draw line if nodes are within a certain distance
                const distance = Math.hypot(xB - xA, yB - yA);
                if (distance < 100) { // Change this value for more/less connectivity
                    ctx.beginPath();
                    ctx.moveTo(xA, yA);
                    ctx.lineTo(xB, yB);
                    ctx.stroke();
                }
            }
        }
    }

    // Update function
    function animate() {
        updateNodes();
        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();
});