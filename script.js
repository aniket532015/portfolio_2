// *************************Preloader with Lottie Animation *************************
window.addEventListener('load', function() {
    // Initialize Lottie animation
    const animContainer = document.getElementById('lottie-animation');
    let animation;
    if (animContainer) {
        animation = lottie.loadAnimation({
            container: animContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            // Option 2: Coding/Developer animation from old script
            path: 'https://assets5.lottiefiles.com/packages/lf20_w51pcehl.json'
        });
    }

    const preloader = document.querySelector('.preloader');
    const minimumLoadTime = 2000; // 2 seconds

    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                if (animation) animation.destroy();
            }, 500);
        }
    }, minimumLoadTime);
});

// ************************* Particle Background System *************************
const canvas = document.getElementById('particle-canvas');
const ctx = canvas?.getContext('2d');

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

if (canvas && ctx) {
    window.addEventListener('mousemove', function(e) {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', function() {
        resizeCanvas();
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius && mouse.x !== null) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 2;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 2;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 2;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 2;
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    let isPageVisible = true;
    document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
    });

    function initParticles() {
        particles = [];
        let numberOfParticles = (canvas.width * canvas.height) / 45000;
        numberOfParticles = Math.min(numberOfParticles, 35); // Cap particles to 35 for low CPU usage

        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        const color = theme === 'dark' ? 'rgba(6, 182, 212, 0.12)' : 'rgba(79, 70, 229, 0.08)';

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.3) - 0.15;
            let directionY = (Math.random() * 0.3) - 0.15;

            particles.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connectParticles() {
        let opacityValue = 1;
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) { // Start at a + 1 to avoid self-checks
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                
                // Pre-filter with simple bounding box before executing expensive Math.sqrt
                if (Math.abs(dx) < 95 && Math.abs(dy) < 95) {
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 95) {
                        opacityValue = 1 - (distance / 95);
                        let strokeColor = theme === 'dark' 
                            ? `rgba(6, 182, 212, ${opacityValue * 0.12})` 
                            : `rgba(79, 70, 229, ${opacityValue * 0.06})`;
                        ctx.strokeStyle = strokeColor;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    function animateParticles() {
        // Stop animation loops if tab is inactive or user has scrolled down past home fold (low CPU)
        if (!isPageVisible || window.scrollY > window.innerHeight) {
            setTimeout(animateParticles, 300);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    animateParticles();
}

// ************************* Theme Toggling *************************
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Re-initialize particles with new colors
        if (typeof initParticles === 'function') {
            initParticles();
        }
    });
}

// ************************* Typing Effect *************************
const typedTextSpan = document.getElementById('typed-text');
const strings = [
    "Senior Associate DevOps Consultant",
    "Cloud Infrastructure Specialist",
    "Java Backend Developer",
    "CI/CD Pipeline Automation Expert"
];
let stringIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
    if (!typedTextSpan) return;
    const currentString = strings[stringIndex];
    
    if (isDeleting) {
        typedTextSpan.textContent = currentString.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40; // Faster deletion
    } else {
        typedTextSpan.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentString.length) {
        isDeleting = true;
        typingSpeed = 2000; // Hold at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        typingSpeed = 500; // Wait before typing next
    }

    setTimeout(type, typingSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 1000);
});

// ************************* Navbar Sticky & Active Link Highlight *************************
const menubar = document.querySelector('#menu');
const Navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');
const header = document.querySelector('.header');

if (menubar && Navbar) {
    menubar.onclick = () => {
        menubar.classList.toggle('bx-x');
        Navbar.classList.toggle('active');
    };
}

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menubar && Navbar) {
            menubar.classList.remove('bx-x');
            Navbar.classList.remove('active');
        }
    });
});

window.addEventListener('scroll', () => {
    const top = window.scrollY;
    
    // Sticky header
    if (header) {
        header.classList.toggle('sticky', top > 50);
    }

    // Active links
    sections.forEach(section => {
        const offset = section.offsetTop - 150;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ************************* DevOps Dashboard Live Metrics (GitHub API) *************************
const reposVal = document.getElementById('github-repos-val');
const followersVal = document.getElementById('github-followers-val');
const commitVal = document.getElementById('github-commit-val');
const commitSha = document.getElementById('github-commit-sha');
const statusBadge = document.getElementById('github-status-badge');
const btnConnectGithub = document.getElementById('btn-connect-github');
const cpuChart = document.getElementById('cpu-chart')?.querySelector('path');
const memChart = document.getElementById('mem-chart')?.querySelector('path');

let latestCommitData = { sha: 'a3f5b72', message: 'Upgrade UI with AI features & real-time telemetry' };
let fetchedReposList = []; // Stores real-time repo list for CLI and Chatbot

// Keep sparkline animations going for telemetry look
function updateTelemetrySparklines() {
    const generatePath = (baseY) => {
        let path = "M0,15 ";
        for (let i = 1; i <= 10; i++) {
            const x = i * 10;
            const y = baseY + (Math.random() * 8 - 4);
            path += `L${x},${y.toFixed(0)} `;
        }
        return path;
    };
    if (cpuChart) cpuChart.setAttribute('d', generatePath(14));
    if (memChart) memChart.setAttribute('d', generatePath(18));
}
setInterval(updateTelemetrySparklines, 3000);

// Simple XOR Obfuscation/Encryption Helper to protect tokens in localStorage from casual inspection
const ENCRYPTION_KEY = "AniketDevOpsSecretKey2026";

function encryptToken(text) {
    if (!text) return "";
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
        result += String.fromCharCode(charCode);
    }
    return btoa(result);
}

function decryptToken(encodedText) {
    if (!encodedText) return "";
    try {
        const text = atob(encodedText);
        let result = "";
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    } catch (e) {
        return "";
    }
}

// Connect Token Button Handler
if (btnConnectGithub) {
    // Update button text on page load
    const currentToken = localStorage.getItem('gh_token');
    if (currentToken) {
        btnConnectGithub.innerHTML = `<i class='bx bx-log-out'></i> Disconnect`;
        btnConnectGithub.title = "Disconnect Token to go back to Public read-only mode";
    }

    btnConnectGithub.addEventListener('click', () => {
        const token = localStorage.getItem('gh_token');
        if (token) {
            // Disconnect
            localStorage.removeItem('gh_token');
            btnConnectGithub.innerHTML = `<i class='bx bx-key'></i> Connect Token`;
            btnConnectGithub.title = "Connect GitHub Token to view private repos";
            showToastGlobal('GitHub token disconnected.', 'success');
            fetchGithubTelemetry();
        } else {
            // Connect
            const inputToken = prompt("Paste your GitHub Personal Access Token (PAT):\n(Requires 'repo' scope to view private repos. Token is saved securely in your browser's localStorage)");
            if (inputToken && inputToken.trim() !== '') {
                localStorage.setItem('gh_token', encryptToken(inputToken.trim()));
                btnConnectGithub.innerHTML = `<i class='bx bx-log-out'></i> Disconnect`;
                btnConnectGithub.title = "Disconnect Token to go back to Public read-only mode";
                showToastGlobal('GitHub token connected securely!', 'success');
                fetchGithubTelemetry();
            }
        }
    });
}

async function fetchGithubTelemetry() {
    const encryptedToken = localStorage.getItem('gh_token');
    const token = decryptToken(encryptedToken);
    const headers = {};
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    try {
        // 1. Fetch User Info (Authenticated /user or Public /users/aniket532015)
        const userUrl = token ? 'https://api.github.com/user' : 'https://api.github.com/users/aniket532015';
        const userRes = await fetch(userUrl, { headers });
        
        if (userRes.ok) {
            const userData = await userRes.json();
            const pubRepos = userData.public_repos || 0;
            const privRepos = userData.total_private_repos || userData.owned_private_repos || 0;
            if (reposVal) reposVal.textContent = (pubRepos + privRepos) || '24';
            if (followersVal) followersVal.textContent = userData.followers || '5';
        } else {
            // Fallback inside ok check (e.g. rate limit)
            if (reposVal) reposVal.textContent = '24';
            if (followersVal) followersVal.textContent = '5';
        }

        // 2. Fetch Latest Commit of portfolio_2
        const commitsRes = await fetch('https://api.github.com/repos/aniket532015/portfolio_2/commits?per_page=1', { headers });
        if (commitsRes.ok) {
            const commitsData = await commitsRes.json();
            if (commitsData && commitsData.length > 0) {
                const commit = commitsData[0];
                latestCommitData.sha = commit.sha.substring(0, 7);
                latestCommitData.message = commit.commit.message;
            }
        }
        // Apply commit values to UI
        if (commitVal) commitVal.textContent = latestCommitData.message;
        if (commitSha) commitSha.textContent = `SHA: ${latestCommitData.sha}`;

        // 3. Fetch Repositories List
        // Try server-side Vercel API first (which loads the GITHUB_TOKEN environment variable securely)
        let reposRes;
        try {
            reposRes = await fetch('/api/get-repos');
        } catch (e) {
            // Serverless API not available (e.g. static local run)
        }

        if (reposRes && reposRes.ok) {
            const reposData = await reposRes.json();
            fetchedReposList = reposData.map(r => ({
                name: r.name,
                isPrivate: r.private,
                description: r.description || 'No description provided.',
                url: r.url || r.html_url
            }));
            if (reposVal) reposVal.textContent = fetchedReposList.length || '24';
        } else {
            // Fallback: direct client-side fetch (uses gh_token if present in localStorage)
            const reposUrl = token 
                ? 'https://api.github.com/user/repos?visibility=all&sort=updated&per_page=100' 
                : 'https://api.github.com/users/aniket532015/repos?sort=updated&per_page=100';
                
            const directRes = await fetch(reposUrl, { headers });
            if (directRes.ok) {
                const reposData = await directRes.json();
                fetchedReposList = reposData.map(r => ({
                    name: r.name,
                    isPrivate: r.private,
                    description: r.description || 'No description provided.',
                    url: r.html_url
                }));
                if (reposVal) reposVal.textContent = fetchedReposList.length || '24';
            }
        }

        if (statusBadge) {
            statusBadge.className = 'status-badge online';
            statusBadge.innerHTML = `<span class="pulse-dot"></span> GitHub API: ${token || (reposRes && reposRes.ok) ? 'Authenticated' : 'Live'}`;
        }
    } catch (error) {
        console.error('Error fetching telemetry:', error);
        // Fallbacks on failure
        if (reposVal) reposVal.textContent = '24';
        if (followersVal) followersVal.textContent = '5';
        if (commitVal) commitVal.textContent = latestCommitData.message;
        if (commitSha) commitSha.textContent = `SHA: ${latestCommitData.sha}`;
        
        if (statusBadge) {
            statusBadge.className = 'status-badge online';
            statusBadge.innerHTML = `<span class="pulse-dot"></span> Offline Fallback`;
        }
    }
}

// Initial fetch
fetchGithubTelemetry();

// ************************* CI/CD Pipeline Animation *************************
const btnRunPipeline = document.getElementById('btn-run-pipeline');
const pipelineLogs = document.getElementById('pipeline-logs');
const steps = {
    source: document.getElementById('step-source'),
    build: document.getElementById('step-build'),
    test: document.getElementById('step-test'),
    deploy: document.getElementById('step-deploy')
};
const connectors = {
    c1: document.getElementById('conn-1'),
    c2: document.getElementById('conn-2'),
    c3: document.getElementById('conn-3')
};

function logToPipeline(message, type = 'info') {
    if (!pipelineLogs) return;
    const timestamp = new Date().toISOString().split('T')[1].substring(0, 8);
    const logLine = document.createElement('div');
    logLine.className = `log-line ${type}`;
    logLine.textContent = `[${timestamp}] ${message}`;
    pipelineLogs.appendChild(logLine);
    pipelineLogs.scrollTop = pipelineLogs.scrollHeight;
}

if (btnRunPipeline) {
    btnRunPipeline.addEventListener('click', runPipeline);
}

function runPipeline() {
    if (!btnRunPipeline) return;
    btnRunPipeline.disabled = true;
    
    // Reset classes
    Object.values(steps).forEach(s => s.className = 'pipeline-step');
    Object.values(connectors).forEach(c => c.className = 'pipeline-connector');
    if (pipelineLogs) pipelineLogs.innerHTML = '';

    logToPipeline('Pipeline triggered by User.', 'info');

    // Step 1: Source
    setTimeout(() => {
        steps.source.classList.add('active');
        logToPipeline('Cloning repository: github.com/aniket532015/portfolio_2...', 'info');
        logToPipeline(`Commit: ${latestCommitData.sha} [${latestCommitData.message}]`, 'info');
        
        setTimeout(() => {
            steps.source.classList.remove('active');
            steps.source.classList.add('success');
            connectors.c1.classList.add('active');
            logToPipeline('Repository cloned successfully. [1.2s]', 'success');
            
            // Step 2: Build
            setTimeout(() => {
                connectors.c1.classList.remove('active');
                connectors.c1.classList.add('success');
                steps.build.classList.add('active');
                logToPipeline('Building Maven artifact: portfolio-5.8.0-SNAPSHOT.jar...', 'info');
                logToPipeline('Compiling Spring Boot backend classes...', 'info');
                
                setTimeout(() => {
                    steps.build.classList.remove('active');
                    steps.build.classList.add('success');
                    connectors.c2.classList.add('active');
                    logToPipeline('JAR built successfully. Size: 21.9 MB [1.8s]', 'success');
                    
                    // Step 3: Test
                    setTimeout(() => {
                        connectors.c2.classList.remove('active');
                        connectors.c2.classList.add('success');
                        steps.test.classList.add('active');
                        logToPipeline('Running unit tests (JUnit 5)...', 'info');
                        logToPipeline('Executing integration tests for Twilio, OpenAI, and AWS SQS mock systems...', 'info');
                        
                        setTimeout(() => {
                            steps.test.classList.remove('active');
                            steps.test.classList.add('success');
                            connectors.c3.classList.add('active');
                            logToPipeline('All 42 tests PASSED. [1.5s]', 'success');
                            
                            // Step 4: Deploy
                            setTimeout(() => {
                                connectors.c3.classList.remove('active');
                                connectors.c3.classList.add('success');
                                steps.deploy.classList.add('active');
                                logToPipeline('Deploying container to AWS EC2 instance via Docker...', 'info');
                                logToPipeline('Updating AWS CloudWatch log groups and SQS listeners...', 'info');
                                
                                setTimeout(() => {
                                    steps.deploy.classList.remove('active');
                                    steps.deploy.classList.add('success');
                                    logToPipeline('Container deployed. Health check: 200 OK. [1.9s]', 'success');
                                    logToPipeline('PIPELINE SUCCESSFUL. Portfolio is live!', 'success');
                                    
                                    // Trigger Toast
                                    showToastGlobal('CI/CD Build Successful! Portfolio Deployed.', 'success');
                                    
                                    // Redirect message to real GitHub Actions
                                    setTimeout(() => {
                                        logToPipeline('Opening your real GitHub Actions pipeline runs...', 'info');
                                        setTimeout(() => {
                                            window.open('https://github.com/aniket532015/portfolio_2/actions', '_blank');
                                            btnRunPipeline.disabled = false;
                                        }, 1200);
                                    }, 1000);
                                    
                                }, 2000);
                            }, 1500);
                        }, 2000);
                    }, 1500);
                }, 2000);
            }, 1500);
        }, 1500);
    }, 500);
}

// Global Toast function
function showToastGlobal(message, type = 'success', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error'}'></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ************************* DevOps Terminal Emulator *************************
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');

if (terminalInput) {
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim();
            this.value = '';
            handleTerminalCommand(command);
        }
    });

    // Focus input when clicking anywhere in terminal
    terminalBody?.addEventListener('click', () => {
        terminalInput.focus();
    });
}

function handleTerminalCommand(cmd) {
    if (!terminalBody) return;
    
    // Add prompt line
    const promptLine = document.createElement('div');
    promptLine.className = 'terminal-output-line';
    promptLine.innerHTML = `<span class="terminal-prompt">aniket@portfolio:~$</span> <span>${escapeHTML(cmd)}</span>`;
    
    // Insert before the input line
    const inputLine = terminalBody.querySelector('.terminal-input-line');
    terminalBody.insertBefore(promptLine, inputLine);

    if (cmd === '') {
        terminalBody.scrollTop = terminalBody.scrollHeight;
        return;
    }

    const output = document.createElement('div');
    output.className = 'term-line';
    
    const args = cmd.toLowerCase().split(' ');
    const primaryCmd = args[0];

    switch(primaryCmd) {
        case 'help':
            output.innerHTML = `Available Commands:
  <span class="text-cyan">about</span>          - Short bio summary
  <span class="text-cyan">skills</span>         - List of technical skills
  <span class="text-cyan">experience</span>     - Professional employment details
  <span class="text-cyan">repos</span>          - List of live repository names (Public & Private)
  <span class="text-cyan">projects</span>       - Details on featured projects
  <span class="text-cyan">certifications</span> - List of active certifications
  <span class="text-cyan">education</span>      - Education qualifications
  <span class="text-cyan">contact</span>        - Contact information
  <span class="text-cyan">whoami</span>         - Display current user name
  <span class="text-cyan">clear</span>          - Clear terminal history
  <span class="text-cyan">sudo &lt;cmd&gt;</span>     - Execute command with root privileges`;
            break;

        case 'whoami':
            output.innerHTML = `aniket`;
            break;
            
        case 'about':
        case 'bio':
            output.innerHTML = `Senior Associate DevOps Consultant with 2+ years of experience in cloud infrastructure, CI/CD, reliability engineering, and backend Java Spring Boot. Expert in AWS, Docker, Kubernetes, and Jenkins. Specialized in automating deployments and enhancing system uptime.`;
            break;
            
        case 'skills':
            output.innerHTML = `Technical Skill Matrix:
  * <span class="text-indigo">Cloud:</span> AWS (EC2, S3, IAM, SQS, CloudWatch), GCP Basics
  * <span class="text-indigo">DevOps:</span> Jenkins, GitHub Actions, Docker, Kubernetes, Helm
  * <span class="text-indigo">IaC:</span> Terraform, Ansible
  * <span class="text-indigo">Languages:</span> Java, Python, Bash Scripting, SQL
  * <span class="text-indigo">Backend:</span> Spring Boot, MuleSoft (Mule 4)
  * <span class="text-indigo">Observability:</span> CloudWatch Logging, Alerting, Metrics`;
            break;
            
        case 'experience':
            output.innerHTML = `<span class="text-green">Senior Associate DevOps Consultant @ InvenioLSI</span> (June 2024 - Present)
  - Designed/maintained Jenkins pipelines, saving 50% deployment overhead.
  - Managed AWS cloud clusters (EC2, S3, IAM, CloudWatch groups).
  - Supported Spring Boot microservices, containerization, and troubleshooting.
  
<span class="text-green">Associate DevOps Consultant @ InvenioLSI</span> (June 2024 Initial Role)
  - Developed backend data loaders, slashing manual processing time by 40%.
  - Configured AWS CloudWatch alarms, SQS queues, and server maintenance scripts.
  - Programmed Java automation scripts and migrated integrations using Mule 4.`;
            break;

        case 'repos':
        case 'repositories':
            if (fetchedReposList.length === 0) {
                output.innerHTML = `No live repositories loaded (GitHub API limit exceeded or offline). 
To connect a token and fetch private repositories, click the <b>Connect Token</b> button on the dashboard header.`;
            } else {
                let repoLines = fetchedReposList.map(r => {
                    if (r.isPrivate) {
                        return `  * <span class="text-red">[PRIVATE]</span> <b>${escapeHTML(r.name)}</b> - ${escapeHTML(r.description)}`;
                    } else {
                        return `  * <span class="text-green">[PUBLIC]</span> <a href="${r.url}" target="_blank" class="text-cyan" style="text-decoration: underline;">${escapeHTML(r.name)}</a> - ${escapeHTML(r.description)}`;
                    }
                }).join('\n');
                output.innerHTML = `GitHub Repositories (${fetchedReposList.length} total):\n${repoLines}`;
            }
            break;
            
        case 'projects':
            output.innerHTML = `Featured Projects:
  1. <span class="text-green">AWS CI/CD Pipeline</span> - Jenkins automated deployment on AWS EC2.
  2. <span class="text-green">School ERP SaaS</span> - FastAPI, PostgreSQL, Docker, AWS infrastructure.
  3. <span class="text-green">Kubernetes Lab</span> - Multi-app orchestration with Ingress, Helm.
  4. <span class="text-green">AI Voice Approval Agent</span> - Twilio, FastAPI, AWS, OpenAI outbound voice approvals.
  5. <span class="text-green">Terraform AWS</span> - Modular IaC provisioning of secure cloud network.
  
Type <span class="text-cyan">repos</span> to list all public/private repositories currently fetched from GitHub.`;
            break;
            
        case 'certifications':
        case 'certs':
            output.innerHTML = `Active Credentials:
  [2025] AWS Cloud 101 - AWS Educate
  [2025] ITIL Certification - InvenioLSI
  [2024] MuleSoft Developer - Salesforce
  [2023] NPTEL Cloud Computing - IIT Kharagpur
  [2022] Java Programming - IIT Bombay`;
            break;
            
        case 'education':
            output.innerHTML = `<span class="text-green">GIET University</span> (2020 - 2024)
  - Bachelor of Technology in Computer Science & Engineering
  - Graduated in the top 5% of the batch.
  - Leadership: Ex-Lead @ Google DSC & GIET Data Science Club.`;
            break;
            
        case 'contact':
            output.innerHTML = `Contact Details:
  - Email:   akaniketkumar532015@gmail.com
  - Phone:   +91-9122969421
  - Web:     https://aniket.uk
  - GitHub:  https://github.com/aniket532015`;
            break;
            
        case 'clear':
            // Delete all output lines
            const outputLines = terminalBody.querySelectorAll('.terminal-output, .terminal-output-line, .term-line');
            outputLines.forEach(line => line.remove());
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
            
        case 'sudo':
            if (args[1] === 'rm' && args.includes('-rf')) {
                output.innerHTML = `<span class="text-red">[FIREWALL WARNING]</span> Access denied! Attempting to delete root files is blocked by Aniket's security groups. Nice try! 😉`;
            } else {
                output.innerHTML = `<span class="text-red">[SUDO]</span> password for anonymous: 
Permission denied. User is not in the sudoers list. This incident has been logged.`;
            }
            break;
            
        default:
            output.innerHTML = `shell: command not found: <span class="text-red">${escapeHTML(primaryCmd)}</span>. Type <span class="text-cyan">help</span> to view commands.`;
    }

    terminalBody.insertBefore(output, inputLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ************************* Floating AI Chatbot *************************
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const chatMessages = document.getElementById('chat-messages');

if (chatbotToggle && chatbotContainer) {
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('open');
    });
}

if (chatbotSend && chatbotInput) {
    chatbotSend.addEventListener('click', sendChatMessage);
    chatbotInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Quick reply click handlers
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('quick-reply-chip')) {
        const question = e.target.getAttribute('data-question');
        if (question) {
            sendUserMessage(question);
            triggerBotResponse(question);
        }
    }
});

function sendChatMessage() {
    if (!chatbotInput) return;
    const message = chatbotInput.value.trim();
    if (message === '') return;
    
    chatbotInput.value = '';
    sendUserMessage(message);
    triggerBotResponse(message);
}

function sendUserMessage(msg) {
    if (!chatMessages) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.innerHTML = `<p>${escapeHTML(msg)}</p>`;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function triggerBotResponse(userMsg) {
    if (!chatMessages) return;
    
    // Add typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble bot typing';
    typingBubble.id = 'bot-typing';
    typingBubble.innerHTML = `<p>Typing<span class="dots"></span></p>`;
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate thinking delay
    setTimeout(() => {
        // Remove typing indicator
        const indicator = document.getElementById('bot-typing');
        if (indicator) indicator.remove();

        const responseBubble = document.createElement('div');
        responseBubble.className = 'chat-bubble bot';
        
        const reply = getBotReply(userMsg.toLowerCase());
        responseBubble.innerHTML = `<p>${reply}</p>`;
        
        chatMessages.appendChild(responseBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

function getBotReply(msg) {
    if (msg.includes('skill') || msg.includes('tech') || msg.includes('stack') || msg.includes('languages')) {
        return `Aniket has a strong technical background:
        <br><br>
        <strong>Cloud:</strong> AWS (EC2, S3, IAM, CloudWatch, SQS), GCP Basics<br>
        <strong>DevOps:</strong> Jenkins, GitHub Actions, Docker, Kubernetes, Helm<br>
        <strong>IaC:</strong> Terraform, Ansible<br>
        <strong>Programming:</strong> Java, Python, Bash, SQL<br>
        <strong>Backend:</strong> Spring Boot, MuleSoft (Mule 4)`;
    }
    
    if (msg.includes('project')) {
        return `Aniket has built several impressive projects:
        <br><br>
        • <strong>AI Voice Approval Agent:</strong> Twilio, FastAPI, OpenAI & AWS integration.<br>
        • <strong>AWS CI/CD Pipeline:</strong> Automated deployment on AWS EC2 using Jenkins.<br>
        • <strong>School ERP SaaS:</strong> Multi-tenant system with FastAPI, Docker, and PostgreSQL.<br>
        • <strong>Kubernetes Lab:</strong> Application scaling and exposure with Helm & Ingress.
        <br><br>
        Try asking me <strong>"Show me your repositories"</strong> to load his real-time repository feed!`;
    }
    
    if (msg.includes('repo') || msg.includes('repository') || msg.includes('repositories') || msg.includes('private')) {
        if (fetchedReposList.length === 0) {
            return `I currently couldn't load the repository list from GitHub. This can happen if the public API rate limit is exceeded.
            <br><br>
            To securely fetch both your <strong>public and private repositories</strong>, click the <strong>Connect Token</strong> button on the dashboard header and input a Personal Access Token (PAT).`;
        } else {
            const privateCount = fetchedReposList.filter(r => r.isPrivate).length;
            const publicCount = fetchedReposList.length - privateCount;
            let reposHtml = fetchedReposList.slice(0, 10).map(r => {
                if (r.isPrivate) {
                    return `• <strong>${escapeHTML(r.name)}</strong> <span style="color: var(--accent-red); font-weight:bold;">[PRIVATE]</span> - ${escapeHTML(r.description)}`;
                } else {
                    return `• <a href="${r.url}" target="_blank" style="text-decoration: underline; color: var(--accent-cyan);">${escapeHTML(r.name)}</a> <span style="color: var(--accent-green); font-weight:bold;">[PUBLIC]</span> - ${escapeHTML(r.description)}`;
                }
            }).join('<br>');
            
            let suffix = fetchedReposList.length > 10 ? `<br>...and ${fetchedReposList.length - 10} more. Type <code>repos</code> in the terminal to view all of them!` : '';
            
            return `I've fetched <strong>${fetchedReposList.length} repositories</strong> from your GitHub account (containing ${privateCount} private and ${publicCount} public repos):
            <br><br>
            ${reposHtml}
            ${suffix}`;
        }
    }

    if (msg.includes('experience') || msg.includes('work') || msg.includes('job') || msg.includes('current')) {
        return `Aniket has transitioned through two roles at <strong>InvenioLSI</strong> (Hyderabad, India) since joining in June 2024:
        <br><br>
        1. <strong>Senior Associate DevOps Consultant</strong> (Current): Focuses on managing enterprise AWS infrastructure, designing Jenkins CI/CD pipelines (saving 50% deployment time), Docker container scaling, and keeping cloud systems highly available.<br><br>
        2. <strong>Associate DevOps Consultant</strong> (Initial): Developed backend automated financial pipelines (40% manual time reduction), created Java-based admin scripts, managed AWS SQS and CloudWatch monitoring, and built cloud-to-cloud integration endpoints with MuleSoft (Mule 4).`;
    }

    if (msg.includes('cert') || msg.includes('credential')) {
        return `Aniket holds several professional certifications:
        <br><br>
        • <strong>AWS Cloud 101</strong> (AWS Educate, 2025)<br>
        • <strong>ITIL Certification</strong> (InvenioLSI, 2025)<br>
        • <strong>MuleSoft Developer</strong> (Salesforce, 2024)<br>
        • <strong>Cloud Computing</strong> (NPTEL / IIT Kharagpur, 2023)<br>
        • <strong>Java Programming</strong> (IIT Bombay, 2022)`;
    }

    if (msg.includes('contact') || msg.includes('email') || msg.includes('phone') || msg.includes('hire')) {
        return `You can reach Aniket directly through:
        <br><br>
        • <strong>Email:</strong> <a href="mailto:akaniketkumar532015@gmail.com">akaniketkumar532015@gmail.com</a><br>
        • <strong>Phone:</strong> +91-9122969421<br>
        • <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/aniket-kumar-840b571b8/" target="_blank">linkedin.com/in/aniketkumar/</a><br>
        • <strong>GitHub:</strong> <a href="https://github.com/aniket532015" target="_blank">github.com/aniket532015</a>`;
    }

    if (msg.includes('voice') || msg.includes('twilio') || msg.includes('openai')) {
        return `His <strong>AI Voice Approval Agent</strong> is highly innovative! Built using FastAPI, Twilio, and OpenAI, it automates outbound approval calls. It initiates calls, processes verbal responses using AI, and updates system workflows based on the approval.`;
    }

    if (msg.includes('kubernetes') || msg.includes('k8s') || msg.includes('docker') || msg.includes('helm')) {
        return `In his <strong>Kubernetes Deployment Lab</strong>, Aniket set up containerized workloads with custom Deployments, Services, ConfigMaps, and Ingress controllers. He uses Helm charts for packaged deployments and orchestrates local scaling policies.`;
    }

    if (msg.includes('aws') || msg.includes('cloudwatch') || msg.includes('sqs')) {
        return `Aniket has extensive experience with AWS. At InvenioLSI, he manages EC2, S3, IAM policies, and SQS queues. He set up CloudWatch dashboards and logging metrics for proactive alerting and troubleshooting.`;
    }

    if (msg.includes('jenkins') || msg.includes('ci/cd') || msg.includes('pipeline')) {
        return `Aniket is a CI/CD specialist. He has designed pipelines that automate compilation, run test suites, and deploy to AWS, cutting deployment overhead by 50% for his development teams.`;
    }

    if (msg.includes('education') || msg.includes('university') || msg.includes('college')) {
        return `Aniket graduated with a <strong>Bachelor of Technology in Computer Science and Engineering</strong> from <strong>GIET University</strong> (2020 - 2024). He finished in the top 5% of his class and served as Lead of the Google Developer Student Club and Data Science Club.`;
    }

    return `I can help you with details about Aniket's profile. You can ask about:
    <br><br>
    • <strong>"What is his tech stack?"</strong><br>
    • <strong>"Tell me about his current job."</strong><br>
    • <strong>"Show me his projects."</strong><br>
    • <strong>"What certifications does he have?"</strong><br>
    • <strong>"How can I contact him?"</strong>`;
}

// ************************* Contact Form & Verification *************************
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const submitBtn = form.querySelector('.form-submit-btn');

    function emailValid(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v||'').trim()); }
    function phoneValid(v){ const d=(v||'').replace(/[^0-9]/g,''); return d.length>=8 && d.length<=15; }

    function setFieldError(input, msg){
        if (!input) return;
        input.classList.add('input-error','shake');
        input.addEventListener('animationend', () => input.classList.remove('shake'), { once: true });
        let hint = input.nextElementSibling;
        if (!hint || !hint.classList.contains('field-error')){
            hint = document.createElement('div');
            hint.className = 'field-error';
            input.insertAdjacentElement('afterend', hint);
        }
        hint.textContent = msg;
    }
    
    function clearFieldError(input){
        if (!input) return;
        input.classList.remove('input-error');
        const hint = input.nextElementSibling;
        if (hint && hint.classList.contains('field-error')) hint.remove();
    }

    ['name','email','phonenumber','subject','message'].forEach(n=>{
        const el = form.querySelector(`[name="${n}"]`);
        if (el) el.addEventListener('input', ()=>clearFieldError(el));
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = form.name?.value?.trim();
        const email = form.email?.value?.trim();
        const phone = form.phonenumber?.value?.trim();
        const subject = form.subject?.value?.trim();
        const message = form.message?.value?.trim();

        let firstInvalid = null;
        if (!name){ firstInvalid = firstInvalid || form.name; setFieldError(form.name,'Please enter your name.'); }
        if (!email || !emailValid(email)){ firstInvalid = firstInvalid || form.email; setFieldError(form.email,'Enter a valid email.'); }
        if (!phone || !phoneValid(phone)){ firstInvalid = firstInvalid || form.phonenumber; setFieldError(form.phonenumber,'Enter a valid phone (8-15 digits).'); }
        if (!subject){ firstInvalid = firstInvalid || form.subject; setFieldError(form.subject,'Subject is required.'); }
        if (!message){ firstInvalid = firstInvalid || form.message; setFieldError(form.message,'Please write a message.'); }

        if (firstInvalid){
            firstInvalid.focus();
            showToastGlobal('Please fix the highlighted fields.', 'error');
            return;
        }

        const formObject = { name, email, phonenumber: phone, subject, message };

        // loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.original = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Sending...</span> <i class='bx bx-loader-alt bx-spin'></i>`;
            submitBtn.classList.add('loading');
        }

        fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObject)
        })
        .then(response => { if (!response.ok) throw new Error('Failed'); return response.json(); })
        .then(data => {
            showToastGlobal(data.message || 'Message sent successfully!', 'success');
            form.reset();
            if (submitBtn){
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                submitBtn.innerHTML = `<span>Sent!</span> <i class='bx bx-check-circle'></i>`;
                setTimeout(()=>{
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtn.dataset.original || '<span>Send Message</span> <i class="bx bx-paper-plane"></i>';
                }, 1500);
            }
        })
        .catch(error => {
            console.error('Contact form error:', error);
            showToastGlobal('Failed to send the message.', 'error');
        })
        .finally(() => {
            if (submitBtn && !submitBtn.classList.contains('success')){
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.dataset.original || '<span>Send Message</span> <i class="bx bx-paper-plane"></i>';
                submitBtn.classList.remove('loading');
            }
        });
    });
});
