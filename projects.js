document.addEventListener('DOMContentLoaded', () => {
    let nodes = [];
    const leftSide = document.querySelector('.projects-page');
    const connectionCanvas = document.createElement('canvas');
    let ctx;
    const nodeSize = 4; // Size of each node

    // Initialize canvas and context
    function initCanvas() {
        connectionCanvas.style.position = 'absolute';
        connectionCanvas.style.top = '0';
        connectionCanvas.style.left = '0';
        connectionCanvas.style.zIndex = '1';
        connectionCanvas.width = window.innerWidth;
        connectionCanvas.height = window.innerHeight;
        ctx = connectionCanvas.getContext('2d');
        document.body.insertBefore(connectionCanvas, document.body.firstChild);
    }

    // Spawn nodes based on window size
    function spawnNodes() {
        // Calculate the number of nodes based on window size
        const width = leftSide.clientWidth;
        const height = leftSide.clientHeight;
        const area = width * height;
    
        // Determine the number of nodes (max 300 nodes for larger areas)
        const maxNodes = Math.min(Math.floor(area / 100), 300);
        const minNodeDistance = Math.max(nodeSize * 2, width / 15);
    
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
                if (distance < 250) { // Connection threshold
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

    function createFrameGrid() {
        const gridContainer = document.querySelector('.grid-container');
        const projects = [
            {
                name: "OpenGL Renderer",
                date: "March - May 2024",
                image: "https://class.coolsquad.xyz/u/1727540135.png",
                skills: ["C++", "OpenGL"],
                description: "An advanced OpenGL renderer capable of handling complex 3D scenes with realistic lighting and shadows."
            },
            {
                name: "SDL2 Chess",
                date: "March - May 2024",
                image: "https://class.coolsquad.xyz/u/1727540248.png",
                skills: ["C++", "SDL2", "Evercade"],
                description: "A fully functional chess game implemented using SDL2, compatible with the Evercade gaming system."
            },
            // Add more projects as needed
        ];

        gridContainer.innerHTML = ''; // Clear existing content

        projects.forEach(project => {
            const frame = document.createElement('div');
            frame.className = 'frame';
            frame.innerHTML = `
                <img src="${project.image}" alt="${project.name}">
                <div class="frame-content">
                    <div class="frame-name">${project.name}</div>
                    <div class="frame-date">${project.date}</div>
                    <div class="frame-description">${project.description}</div>
                    <div class="frame-skills">
                        ${project.skills.map(skill => `<div class="skill">${skill}</div>`).join('')}
                    </div>
                </div>
            `;
            gridContainer.appendChild(frame);
        });
    }

    function adjustGridLayout() {
        const gridContainer = document.querySelector('.grid-container');
        const containerWidth = gridContainer.offsetWidth;
        const frameWidth = 250; // Minimum width of each frame
        const gap = 20; // Gap between frames
        const columns = Math.max(1, Math.floor((containerWidth + gap) / (frameWidth + gap)));
        gridContainer.style.gridTemplateColumns = `repeat(${columns}, minmax(${frameWidth}px, 1fr))`;
    }

    // Initialize
    function init() {
        initCanvas();
        spawnNodes();
        createFrameGrid();
        animate();
    }

    // Handle window resize
    function onResize() {
        connectionCanvas.width = window.innerWidth;
        connectionCanvas.height = window.innerHeight;
    }

    window.addEventListener('load', init);
    window.addEventListener('resize', onResize);
});