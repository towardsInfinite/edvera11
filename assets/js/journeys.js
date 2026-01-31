document.addEventListener('DOMContentLoaded', () => {
    // --- Data Source ---
    // Flattened logic: We only care about Verticals. 
    // Content is now just a list of stages per vertical.
    // I will merge the previous data into a single continuous sequence per vertical.

    const journeysData = {
        verticals: [
            { id: 'foundations', name: 'Foundations' },
            { id: 'programming', name: 'Programming' },
            { id: 'mathematics', name: 'Mathematics (Gr 1-10 & Boards)' },
            { id: 'gen-ai', name: 'GenAI (No-Code)' },
            { id: 'ai-ml', name: 'AI & ML' },
            { id: 'international', name: 'International Curricula' }
        ],
        // Pre-merged content
        content: {
            'foundations': [
                {
                    label: 'Stage 0',
                    title: 'Logic Foundations',
                    desc: 'Understanding how computers think and follow instructions.',
                    goal: 'Build precision and step-by-step reasoning.',
                    tags: ['Concept', 'Reasoning']
                },
                {
                    label: 'Stage 1',
                    title: 'Block Sequencing',
                    desc: 'Arranging commands to complete simple digital tasks.',
                    goal: 'See cause and effect in action.',
                    tags: ['Practice', 'Concept']
                },
                {
                    label: 'Stage 2',
                    title: 'Pattern Recognition',
                    desc: 'Identifying repeating structures in problems.',
                    goal: 'Spot similarities to solve puzzles faster.',
                    tags: ['Reasoning', 'Practice']
                },
                {
                    label: 'Stage 3',
                    title: 'Algorithmic Thinking',
                    desc: 'Breaking big problems into small, solvable steps.',
                    goal: 'Plan solutions before acting.',
                    tags: ['Concept', 'Reasoning']
                },
                {
                    label: 'Stage 4',
                    title: 'Visual Logic',
                    desc: 'Using flowcharts to map out decision paths.',
                    goal: 'Visualize how choices lead to outcomes.',
                    tags: ['Practice', 'Concept']
                },
                {
                    label: 'Stage 5',
                    title: 'Basic Automation',
                    desc: 'Creating simple loops to repeat actions.',
                    goal: 'Reduce effort through smart repetition.',
                    tags: ['Project', 'Practice']
                }
            ],
            'programming': [
                {
                    label: 'Stage 0',
                    title: 'Syntax Basics',
                    desc: 'Learning the grammar of text-based languages.',
                    goal: 'Write error-free basic commands.',
                    tags: ['Concept', 'Practice']
                },
                {
                    label: 'Stage 1',
                    title: 'Control Flow',
                    desc: 'Directing programs using conditions and loops.',
                    goal: 'Make programs make decisions.',
                    tags: ['Reasoning', 'Practice']
                },
                {
                    label: 'Stage 2',
                    title: 'Data Structures',
                    desc: 'Organizing information in lists and dictionaries.',
                    goal: 'Store and retrieve data efficiently.',
                    tags: ['Concept', 'Project']
                },
                {
                    label: 'Stage 3',
                    title: 'Modular Design',
                    desc: 'Writing reusable functions and modules.',
                    goal: 'Keep code clean and organized.',
                    tags: ['Concept', 'Practice']
                },
                {
                    label: 'Stage 4',
                    title: 'Object-Oriented Logic',
                    desc: 'Modeling real-world entities in code.',
                    goal: 'Structure complex systems intuitively.',
                    tags: ['Reasoning', 'Concept']
                },
                {
                    label: 'Stage 5',
                    title: 'API Integration',
                    desc: 'Connecting applications to external data services.',
                    goal: 'Build dynamic, connected software.',
                    tags: ['Project', 'Practice']
                }
            ],
            'mathematics': [
                {
                    label: 'Stage 0',
                    title: 'Primary Numeracy (Gr 1-3)',
                    desc: 'Deepening number sense, operations, and mental math.',
                    goal: 'Master the building blocks of calculation.',
                    tags: ['Concept', 'Mental Math']
                },
                {
                    label: 'Stage 1',
                    title: 'Applied Logic (Gr 4-5)',
                    desc: 'Introduction to fractions, decimals, and word problems.',
                    goal: 'Apply math to real-world scenarios.',
                    tags: ['Reasoning', 'Practice']
                },
                {
                    label: 'Stage 2',
                    title: 'Pre-Algebra (Gr 6-7)',
                    desc: 'Understanding variables, negative numbers, and ratios.',
                    goal: 'Thinking in abstract terms.',
                    tags: ['Concept', 'Algebra']
                },
                {
                    label: 'Stage 3',
                    title: 'Geometry & Logic (Gr 8)',
                    desc: 'Space, shape properties, and deductive reasoning.',
                    goal: 'Visualize proof and structure.',
                    tags: ['Geometry', 'Reasoning']
                },
                {
                    label: 'Stage 4',
                    title: 'Core Boards Prep (Gr 9)',
                    desc: 'Advanced Algebra, Quadratics, and Statistics for GCSE/IGCSE.',
                    goal: 'Solve complex, multi-step problems significantly.',
                    tags: ['Practice', 'Assessment']
                },
                {
                    label: 'Stage 5',
                    title: 'Board Mastery (Gr 10)',
                    desc: 'Comprehensive review of Trigonometry, Calculus intro, and Exam technique.',
                    goal: 'Achieve top-tier grades in International Boards.',
                    tags: ['Assessment', 'mastery']
                }
            ],
            'gen-ai': [
                {
                    label: 'Stage 0',
                    title: 'AI Literacy',
                    desc: 'Understanding LLMs, Diffusion models, and how they work.',
                    goal: 'Demystify the "Magic" of AI.',
                    tags: ['Concept', 'Theory']
                },
                {
                    label: 'Stage 1',
                    title: 'Prompt Engineering',
                    desc: 'Crafting precise inputs to get expert-level outputs.',
                    goal: 'Control AI behavior with words.',
                    tags: ['Practice', 'Skills']
                },
                {
                    label: 'Stage 2',
                    title: 'AI Tool Chain',
                    desc: 'Mastering tools for Image, Video, and Text generation.',
                    goal: 'Produce creative assets at speed.',
                    tags: ['Project', 'Tools']
                },
                {
                    label: 'Stage 3',
                    title: 'No-Code Agents',
                    desc: 'Building custom GPTs and chatbots without writing code.',
                    goal: 'Create autonomous helpers.',
                    tags: ['Project', 'Automation']
                },
                {
                    label: 'Stage 4',
                    title: 'Workflow Automation',
                    desc: 'Connecting AI to apps (Zapier/Make) for business logic.',
                    goal: 'Automate complex real-world tasks.',
                    tags: ['Practice', 'Workflow']
                }
            ],
            'ai-ml': [
                {
                    label: 'Stage 0',
                    title: 'Data Literacy',
                    desc: 'Understanding how machines learn from information.',
                    goal: 'Distinguish data quality and bias.',
                    tags: ['Concept', 'Reasoning']
                },
                {
                    label: 'Stage 1',
                    title: 'Model Training',
                    desc: 'Feeding data to algorithms to create predictions.',
                    goal: 'Teach a computer to recognize patterns.',
                    tags: ['Practice', 'Project']
                },
                {
                    label: 'Stage 2',
                    title: 'Neural Networks',
                    desc: 'Simulating brain-like connections for deep learning.',
                    goal: 'Understand the architecture of AI.',
                    tags: ['Concept', 'Advanced']
                },
                {
                    label: 'Stage 3',
                    title: 'Computer Vision',
                    desc: 'Enabling machines to "see" and interpret images.',
                    goal: 'Build systems that recognize objects.',
                    tags: ['Project', 'Practice']
                },
                {
                    label: 'Stage 4',
                    title: 'NLP Fundamentals',
                    desc: 'Teaching computers to understand human language.',
                    goal: 'Create chatbots and text analyzers.',
                    tags: ['Reasoning', 'Project']
                }
            ],
            'international': [
                {
                    label: 'Stage 0',
                    title: 'Curriculum Alignment',
                    desc: 'Mapping personal goals to IB/A-Level standards.',
                    goal: 'Focus efforts where they count most.',
                    tags: ['Reasoning', 'Assessment']
                },
                {
                    label: 'Stage 1',
                    title: 'Exam Strategy',
                    desc: 'Mastering the format and timing of assessments.',
                    goal: 'Perform under pressure with confidence.',
                    tags: ['Practice', 'Assessment']
                },
                {
                    label: 'Stage 2',
                    title: 'University Portfolio',
                    desc: 'Showcasing projects alongside academic scores.',
                    goal: 'Prove capability beyond the test.',
                    tags: ['Project', 'Concept']
                }
            ]
        }
    };

    // --- State ---
    const state = {
        vertical: 'foundations'
    };

    // --- Elements ---
    const elements = {
        verticalTabs: document.getElementById('vertical-tabs'),
        railDots: document.getElementById('rail-dots'),
        railFill: document.getElementById('rail-fill'),
        cardsContainer: document.getElementById('cards-container')
    };

    // --- Initialization ---
    function init() {
        renderVerticalTabs();
        updateView();
    }

    // --- Renders ---
    function renderVerticalTabs() {
        elements.verticalTabs.innerHTML = '';
        journeysData.verticals.forEach(v => {
            const btn = document.createElement('button');
            btn.className = `v-tab ${v.id === state.vertical ? 'active' : ''}`;
            btn.textContent = v.name;
            btn.addEventListener('click', () => {
                if (state.vertical === v.id) return;
                state.vertical = v.id;
                updateView();
            });
            elements.verticalTabs.appendChild(btn);
        });
    }

    function updateView() {
        // Re-render controls to update active states
        Array.from(elements.verticalTabs.children).forEach(btn => {
            btn.classList.toggle('active', btn.textContent === getVerticalName(state.vertical));
        });

        // Content Transition
        const content = journeysData.content[state.vertical];

        // 1. Fade out existing
        elements.cardsContainer.style.opacity = '0';
        elements.railDots.style.opacity = '0';

        setTimeout(() => {
            if (content) {
                renderStages(content);
            } else {
                renderEmptyState();
            }

            // 2. Fade in
            elements.cardsContainer.style.opacity = '1';
            elements.railDots.style.opacity = '1';
        }, 220); // Match CSS transition duration
    }

    function renderStages(stages) {
        elements.cardsContainer.innerHTML = '';
        elements.railDots.innerHTML = '';
        elements.railFill.style.height = '0%'; // Reset fill

        stages.forEach((stage, index) => {
            // DOT
            const dot = document.createElement('div');
            dot.className = 'rail-dot';
            dot.dataset.index = index;
            dot.addEventListener('click', () => scrollToStage(index));
            elements.railDots.appendChild(dot);

            // CARD
            const card = document.createElement('div');
            card.className = 'stage-card';
            card.id = `stage-${index}`;
            card.innerHTML = `
                <div class="stage-header">
                    <span class="stage-label">${stage.label}</span>
                    <h3 class="stage-title">${stage.title}</h3>
                    <p class="stage-desc">${stage.desc}</p>
                    <div class="stage-goal-box">
                        <p class="stage-goal"><strong>Goal:</strong> ${stage.goal}</p>
                    </div>
                </div>
                <div class="stage-tags">
                    ${stage.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            `;
            elements.cardsContainer.appendChild(card);
        });

        // Re-init observer for new elements
        initObserver();
    }

    function renderEmptyState() {
        elements.cardsContainer.innerHTML = `
            <div class="empty-state" style="padding: 2rem; text-align: center; color: var(--color-text-muted);">
                <p>No roadmap currently available.</p>
            </div>
        `;
        elements.railDots.innerHTML = '';
    }

    // --- Helpers ---
    function getVerticalName(id) {
        return journeysData.verticals.find(v => v.id === id)?.name;
    }

    function scrollToStage(index) {
        const card = document.getElementById(`stage-${index}`);
        if (card) {
            const offset = 180; // Adjusted for sticky header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = card.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // --- Intersection Observer for Rail ---
    function initObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.id.split('-')[1]);
                    updateRailState(index);

                    // Active class on card
                    document.querySelectorAll('.stage-card').forEach(c => c.classList.remove('active'));
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stage-card').forEach(card => observer.observe(card));
    }

    function updateRailState(activeIndex) {
        const dots = document.querySelectorAll('.rail-dot');
        const count = dots.length;

        dots.forEach((dot, i) => {
            if (i <= activeIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });

        if (count > 1) {
            const pct = (activeIndex / (count - 1)) * 100;
            elements.railFill.style.height = `${pct}%`;
        } else {
            // If only 1 item, fill it completely if active
            elements.railFill.style.height = activeIndex === 0 ? '100%' : '0%';
        }
    }

    // Start
    init();
});
