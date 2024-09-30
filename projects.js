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

    const gridContainer = document.querySelector('.grid-container');
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close');
    const projects = [
        {
            name: "OpenGL Renderer",
            date: "March - May 2024",
            image: "https://class.coolsquad.xyz/u/1727540135.png",
            video: "https://class.coolsquad.xyz/u/1727432173.mp4",
            skills: ["C++", "OpenGL", "Visual Studio", "Github"],
            briefDescription: "An advanced OpenGL renderer for complex 3D scenes.",
            description: "The OpenGL Renderer project, completed between March and May 2024, involved developing an advanced OpenGL renderer capable of rendering complex 3D scenes. The primary objective was to create an efficient rendering pipeline that could handle dynamic lighting, shadows, and multiple textures. This project served as a deep dive into graphics programming using C++ and OpenGL, where I learned how to effectively implement shaders, manage vertex data, and optimize rendering for real-time performance. \n Throughout the project, Visual Studio was used as the main IDE for writing, debugging, and refining the code. By leveraging its debugging tools, I was able to overcome issues such as memory leaks and inefficient rendering loops, which greatly improved the renderer's overall performance. \n Github was critical for version control, allowing me to track my progress and manage the various iterations of the renderer as I implemented new features like lighting models and texture mapping. This provided an excellent opportunity to practice industry-standard workflows such as branching, committing, and merging code changes. \n The project not only improved my knowledge of 3D rendering techniques but also solidified my understanding of C++ in high-performance computing environments. It challenged me to think critically about optimization and resource management, which are essential when dealing with real-time graphics.",
            githubLink: "https://github.com/JackRowe/OpenGL_Shooter"
        },
        {
            name: "SDL2 Chess",
            date: "March - May 2024",
            image: "https://class.coolsquad.xyz/u/1727540248.png",
            video: "https://class.coolsquad.xyz/u/1727433231.mp4",
            skills: ["C++", "SDL2", "Evercade", "Visual Studio", "Github"],
            briefDescription: "A fully functional chess game using SDL2.",
            description: "SDL2 Chess is a fully functional chess game I developed between March and May 2024, using the SDL2 library. The game features all standard chess mechanics and was built with C++ to run on multiple platforms. My goal for this project was to create a complete chess game with an intuitive user interface, allowing players to engage in local multiplayer matches. \n I used SDL2 to handle the game's graphical rendering, input management, and audio output. This project also involved implementing a basic chess engine, which could validate moves, enforce rules, and manage the game state efficiently. Visual Studio provided a robust environment for managing the game’s architecture, debugging gameplay issues, and fine-tuning the graphical interface to ensure a smooth user experience. \n In addition to coding, I used Github to maintain version control, managing different branches for various features such as AI integration and UI updates. This ensured an organized development process and allowed me to keep the codebase clean and easy to maintain. \n Through developing SDL2 Chess, I deepened my understanding of game development with SDL2 and strengthened my ability to work with low-level graphics libraries. The project also provided a great platform to explore turn-based game logic and state management.",
            githubLink: "https://github.com/JackRowe/BespokePlatformDevelopment"
        },
        {
            name: "Sky Patrol",
            date: "January - Febuary 2024",
            image: "https://class.coolsquad.xyz/u/1727653811.png",
            video: "https://staffs-daforum-1.s3.eu-west-2.amazonaws.com/monthly_2024_02/1df98748-2628-4ae7-bc4f-a86a015e0397(1).mp4.de020506b694815e9e9b7b4f7ab4c75e.mp4",
            skills: ["Unreal Engine", "Visual Scripting"],
            briefDescription: "",
            description: "Sky Patrol is a game development project I completed in early 2024 using Unreal Engine, with a focus on visual scripting. The game revolves around aerial patrol missions, where players navigate a flying vehicle through different environments, facing various obstacles and challenges. The gameplay emphasizes precise control and quick decision-making, requiring players to master the flight mechanics. \n This project marked my first major experience with Unreal Engine’s Blueprints visual scripting system. By using Blueprints, I was able to develop complex game mechanics without writing traditional code, which helped me better understand game logic and event-driven programming. I created features like player movement, obstacle spawning, and trigger-based events, ensuring smooth and responsive gameplay. \n Through this process, I gained a solid understanding of how Unreal Engine handles game mechanics, asset management, and performance optimization. Visual scripting provided a highly accessible way to experiment with different gameplay ideas and refine the overall experience without the overhead of writing code. \n The experience I gained from working on Sky Patrol allowed me to develop a deeper understanding of how to organize and execute game logic efficiently. It also reinforced the importance of rapid iteration, testing, and debugging in order to create a polished, fluid gaming experience.",
        },
        {
            name: "Lost in Orbit",
            date: "January - Febuary 2024",
            image: "https://class.coolsquad.xyz/u/1727655615.png",
            video: "https://staffs-daforum-1.s3.eu-west-2.amazonaws.com/monthly_2024_02/1709211074.mp4.9e9d6ab8d4a54851da9df3a0d88b4bc9.mp4",
            skills: ["Unity", "C#", "Visual Studio", "Github"],
            briefDescription: "",
            description: "Lost in Orbit was a game development project that I worked on in early 2024, using Unity and C# as the primary technologies. The game features a space-themed adventure where players navigate a character through a variety of challenging environments in outer space, with a focus on physics-based movement and precise control. \n This project allowed me to deepen my understanding of Unity, specifically its 2D physics engine, while also refining my skills in C# for scripting game mechanics. I implemented features such as player movement, obstacle generation, and collision detection, ensuring that the gameplay felt both engaging and challenging. \n Visual Studio was used extensively throughout the project for writing and debugging C# code. It played a critical role in helping me to streamline the development process, particularly with its debugging tools that allowed me to quickly identify and resolve issues related to gameplay, such as adjusting movement physics and optimizing performance. \n Github was another essential tool during the development of Lost in Orbit. It was used to track progress, manage version control, and collaborate with potential future contributors. By utilizing branches and commits effectively, I was able to maintain a clear development history and ensure smooth updates throughout the project. \n Through this project, I further solidified my understanding of key game development concepts in Unity and C#, such as object-oriented programming, scene management, and physics-based gameplay. The experience of breaking down complex tasks into smaller components and testing them iteratively was invaluable in ensuring a polished final product.",
            githubLink: "https://github.com/JackRowe/CSforGameEngines"
        },
        {
            name: "Flappy Circle",
            date: "November 2023",
            image: "https://class.coolsquad.xyz/u/1727624442.png",
            video: "https://class.coolsquad.xyz/u/1727623851.mp4",
            skills: ["C++", "Visual Studio", "Github"],
            description: "This project was an introductory experience in C++, Visual Studio, and Github. Throughout it, I built a simple yet engaging game called Flappy Circle, which draws inspiration from the classic Flappy Bird gameplay mechanics. The goal of the project was to not only familiarize myself with core programming concepts but also to implement practical game development skills such as object-oriented design, collision detection, and basic game physics. \n The development process involved using Visual Studio as the primary IDE to write and debug the C++ code. Through using Visual Studio's wide array of debugging tools, I was able to quickly identify and fix issues related to gameplay, such as detecting edge cases in collision handling and refining movement physics to create a more fluid user experience. \n Alongside C++, this project also introduced me to Github, which I utilised to manage any changes I made, or reverts needed. It also allowed me to keep a clear and concise project history. While not strictly necessary for a project of this scope and scale, it was a nice introduction to industry-standard software and practices. \n The game features a circular character controlled by the player, navigating through obstacles as they attempt to achieve a high score. I implemented a variety of basic game mechanics, such as gravity simulation, jump mechanics, and obstacle generation, which collectively emulate the classic 'flappy' gameplay. \n Through the development of Flappy Circle, I honed my understanding of C++ fundamentals, such as control structures, functions, and memory management. In addition, I learned how to break down a game development project into smaller, manageable components, and how to effectively test and debug each part to ensure smooth gameplay.",
            githubLink: "https://github.com/JackRowe/prog-fund-assessment-2"
        },
        
        // Add more projects as needed
    ];

    function createProjectFrames() {
        projects.forEach(project => {
            const frame = document.createElement('div');
            frame.className = 'frame';
            frame.innerHTML = `
                <img src="${project.image}" alt="${project.name}">
                <div class="frame-content">
                    <div class="frame-name">${project.name}</div>
                    <div class="frame-date">${project.date}</div>
                    <div class="frame-skills">
                        ${project.skills.map(skill => `<div class="skill">${skill}</div>`).join('')}
                    </div>
                </div>
            `;
            frame.addEventListener('click', () => openModal(project));
            gridContainer.appendChild(frame);
        });
    }

    function openModal(project) {
        const videoElement = document.getElementById('projectVideo');
        videoElement.src = project.video;
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true;
        document.getElementById('modalProjectName').textContent = project.name;
        document.getElementById('modalProjectDate').textContent = project.date;
        
        // Split description by '. \n' to create paragraphs
        const descriptionHTML = project.description.split('. \n').join('.</p><p>'); // Split and wrap in paragraph tags
        document.getElementById('modalProjectDescription').innerHTML = `<p>${descriptionHTML}</p>`;
        
        document.getElementById('modalProjectSkills').innerHTML = project.skills.map(skill => `<div class="skill">${skill}</div>`).join('');
        
        const githubLinkElement = document.getElementById('modalGithubLink');
        if (project.githubLink) {
            githubLinkElement.href = project.githubLink;
            githubLinkElement.textContent = "View on GitHub";
            githubLinkElement.style.display = "inline-block";
        } else {
            githubLinkElement.style.display = "none";
            document.getElementById('noGithubMessage').style.display = "block";
        }
        
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }    

    function closeModal() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const videoElement = document.getElementById('projectVideo');
        videoElement.pause();
        videoElement.currentTime = 0;
        document.getElementById('noGithubMessage').style.display = "none";
    }

    closeBtn.onclick = closeModal;
    window.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    };

    // Initialize
    function init() {
        initCanvas();
        spawnNodes();
        createProjectFrames();
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