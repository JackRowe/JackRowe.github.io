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
            briefDescription: "",
            description: "OpenGL was a project I was quite excited for as I had a piqued interest in the subject of graphics programming. Being relatively confident in my C++ proficiency I dove straight into working with the API. \n There were a multitude of aspects to implement for even a simple renderer, the one I’m most proud of was my own .obj loader. Alongside this I also created a custom model class which I am able to load the vertices, indices and normals into. Another aspect of the renderer I tried to add was lighting, however, I struggled greatly with this and only managed a crude implementation of the lighting. Though, from this I developed a better understanding of rendering pipelines and how to efficiently manage assets. While the lighting system was not as refined as I hoped, I still gained valuable insight into how various rendering techniques are implemented in modern engines. \n Another challenge I faced was optimizing the performance of the renderer. As the scene complexity grew, I had to ensure that my code was efficient and that resources were managed properly, which led me to learn more about memory management and buffer handling in OpenGL. \n Overall, this project greatly enhanced my understanding of both the fundamentals and the intricacies of graphics programming, giving me a solid foundation to build on for future endeavors in rendering and engine development.",
            githubLink: "https://github.com/JackRowe/OpenGL_Shooter"
        },
        {
            name: "SDL2 Chess",
            date: "March - May 2024",
            image: "https://class.coolsquad.xyz/u/1727540248.png",
            video: "https://class.coolsquad.xyz/u/1727433231.mp4",
            skills: ["C++", "SDL2", "Evercade", "Visual Studio", "Github"],
            briefDescription: "",
            description: "One of my more unique projects for a couple of reasons, most notably because it required building for the Evercade. This involved a rather tedious process of compiling the solution on a Linux distribution, transferring the files to the Evercade, and then running specific commands to get the application running. \n While the process was cumbersome, it provided invaluable experience in using Linux, Docker, and Makefiles to build projects. \n Regarding the project itself, I am particularly proud of the technical aspects of my chess implementation. I used bitboards—64-bit binary literals—to represent each unique piece type on the board, as well as the potential moves for any piece from any square. \n This approach dramatically increased the efficiency of move generation compared to traditional methods that use 2D or 1D arrays to represent the board. \n Additionally, I found myself enjoying SDL2 much more than OpenGL, which I was working with simultaneously. SDL2 felt far more straightforward and simple to use. \n In conclusion, this project not only helped me enhance my technical skills in chess programming and performance optimization but also gave me practical experience with Linux environments and the challenges of building for unique hardware platforms like the Evercade.",
            githubLink: "https://github.com/JackRowe/BespokePlatformDevelopment"
        },
        {
            name: "Sky Patrol",
            date: "January - Febuary 2024",
            image: "https://class.coolsquad.xyz/u/1727653811.png",
            video: "https://staffs-daforum-1.s3.eu-west-2.amazonaws.com/monthly_2024_02/1df98748-2628-4ae7-bc4f-a86a015e0397(1).mp4.de020506b694815e9e9b7b4f7ab4c75e.mp4",
            skills: ["Unreal Engine", "Visual Scripting"],
            briefDescription: "",
            description: "Through college, I had a wealth of experiences with Unreal Engine 4 so this project was not my first foray into Unreal. However, it was a first for Unreal Engine 5. A key focus of this project was quick mechanics prototyping. I quickly designed, implemented and tested a variety of different mechanics for use with Unreal’s blueprinting. \n Alongside designing mechanics, I also did a good deal of map and level design. While not specifically my focus area I managed to construct a single, well laid out, if not rather long level which the player experiences. This is combined with a slow increase in difficulty over the course of the level provides an engaging experience for the player. \n Notably, I did not use Git or any kind of version control for this project. This is because I had not been introduced to using Git within a game engine. This proved itself as an issue, as during the project I could’ve made great use of branches and version control. Especially so, as I completely shifted the direction of the project half way through and had no real way of managing it. \n All in all, I managed to easily become accustomed to the Unreal Engine 5 workflow and quickly iterate on game mechanics. Resulting in a project that is feature dense. While it’s only a single, rather long level, the feedback I received was that it was an enjoyable and engaging experience. Though, multiple did note the lack of any explicit tutorial.",
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
            description: "Flappy Circle was an introductory project to C++, Visual Studio and Github. Of which the aim was to become familiar with the basic functionality of all three. The game itself is heavily derivative from the classic Flappy genre of mobile games as the scope of this would provide ample opportunity to work with a variety of C++ libraries. Some of the key features I had to implement were: simple collision detection, obstacle generation and the player movement, all whilst relying on object oriented design to provide a guide to my implementation. \n Throughout this project I was using Visual Studio for the first time to quickly write, and debug my C++ code. As all projects do I ran into a multitude of bugs, but through usage of stack tracing, break points and other debugging features I managed to keep major delays to a minimum. \n This also serves as one of my first interactions with Git and Github. As I was inexperienced with Git at this stage, I did not make full use of Git’s capabilities, only really using it for its version control. \n Overall, Flappy Circle as a first project provided ample hands-on experience with C++, Visual Studio and Github. Dramatically increasing my proficiency with the language and tools.",
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