/**
 * EDVERA Diagnostic SPA Logic
 * Handles state, transitions, and scoring for the pre-diagnostic assessment.
 * Updated to include detailed questions (8-10 per track), timing analysis, and detailed result visualization.
 */

document.addEventListener('DOMContentLoaded', () => {
    // === State ===
    const state = {
        step: 'welcome', // welcome, track, question, results
        user: { name: '', email: '', age: '' },
        track: null,
        currentQuestionIndex: 0,
        answers: [],
        startTime: null,
        endTime: null,
        score: {
            correct: 0,
            thinkingStyle: ''
        }
    };

    // === Data: Questions (Expanded) ===
    const tracks = {
        explorer: {
            id: 'explorer',
            title: 'Explorer',
            icon: '🧭',
            desc: 'New to coding. I want to test my logic and problem-solving intuition.',
            questions: [
                { id: 'e1', text: 'Identify the pattern: Triangle, Square, Circle, Triangle, Square, [?]', options: ['Circle', 'Triangle', 'Square', 'Pentagon'], correct: 0, type: 'logic' },
                { id: 'e2', text: 'A robot is at (0,0) facing North. It moves: Forward 2, Turn Right, Forward 1. Where is it now?', options: ['(1, 2)', '(2, 1)', '(1, 1)', '(0, 2)'], correct: 0, type: 'spatial' },
                { id: 'e3', text: 'If Switch A turns on the Fan, Switch B turns on the Light, and Switch C turns OFF everything... what happens if you press A, then B, then C?', options: ['Fan and Light are ON', 'Only Fan is ON', 'Everything is OFF', 'Only Light is ON'], correct: 2, type: 'causal' },
                { id: 'e4', text: 'Which number is missing? 2, 4, 8, 16, [?]', options: ['18', '24', '32', '20'], correct: 2, type: 'pattern' },
                { id: 'e5', text: 'You have balls of size 5, 2, 8, 1. If you sort them smallest to largest, which is second?', options: ['1', '2', '5', '8'], correct: 1, type: 'order' },
                { id: 'e6', text: 'If "Red" means "Stop" and "Green" means "Go", what does "Red + Green" logically imply?', options: ['Go Fast', 'Confusion / Error', 'Slow Down', 'Turn Left'], correct: 1, type: 'logic' },
                { id: 'e7', text: 'Complete the sequence: Mon, Wed, Fri, [?]', options: ['Sat', 'Sun', 'Tue', 'Thu'], correct: 1, type: 'pattern' },
                { id: 'e8', text: 'A box has 3 red balls and 2 blue balls. You take 3 balls out. At least one MUST be:', options: ['Blue', 'Red', 'Green', 'Yellow'], correct: 1, type: 'probability' }
            ]
        },
        builder: {
            id: 'builder',
            title: 'Builder',
            icon: '🔨',
            desc: 'I have some coding experience (Scratch/Python). I want to test my core concepts.',
            questions: [
                { id: 'b1', text: 'Loop: "Repeat 3 times: Say \'Hello\'". How many times is \'Hello\' said?', options: ['1', '3', '4', 'Infinite'], correct: 1, type: 'iteration' },
                { id: 'b2', text: 'Variable x = 5. x = x + 2. x = x * 2. What is the final value of x?', options: ['14', '12', '10', '7'], correct: 0, type: 'variable' },
                { id: 'b3', text: 'Logic: If (raining is TRUE) OR (snowing is TRUE), wear coat. It is NOT raining, but it IS snowing. Do you wear a coat?', options: ['Yes', 'No', 'Maybe', 'Error'], correct: 0, type: 'boolean' },
                { id: 'b4', text: 'Debugging: You want a character to jump. Code: "Move Up, Wait 1s, Move Down". What happens if you remove "Wait 1s"?', options: ['It jumps higher', 'It doesn\'t move', 'It jumps too fast to see', 'It moves down first'], correct: 2, type: 'debug' },
                { id: 'b5', text: 'What will this print? For i from 1 to 3: Print(i * 10)', options: ['1, 2, 3', '10, 20, 30', '10, 10, 10', '30'], correct: 1, type: 'iteration' },
                { id: 'b6', text: 'Pseudocode: If (Store is Open AND I have Money) then Buy Candy. Store is Open is FALSE. Do I buy candy?', options: ['Yes', 'No', 'Maybe', 'Only if I have money'], correct: 1, type: 'logic' },
                { id: 'b7', text: 'Which is the correct way to check if x equals 10?', options: ['x = 10', 'x == 10', 'x equals 10', 'check x 10'], correct: 1, type: 'syntax' },
                { id: 'b8', text: 'You have a list [apple, banana, cherry]. What is at index 1?', options: ['apple', 'banana', 'cherry', 'error'], correct: 1, type: 'indexing' },
                { id: 'b9', text: 'Function add(a, b) returns a + b. What is add(3, add(1, 2))?', options: ['3', '5', '6', '9'], correct: 2, type: 'function' }
            ]
        },
        thinker: {
            id: 'thinker',
            title: 'Thinker',
            icon: '🧠',
            desc: 'I am experienced. I want to test my system design and problem decomposition skills.',
            questions: [
                { id: 't1', text: 'Design: Elevator system for 100 floors. What is the FIRST critical decision?', options: ['Button color', 'Dispatcher Algorithm & Capacity', 'Motor speed', 'Music selection'], correct: 1, type: 'systems' },
                { id: 't2', text: 'Optimization: Fastest way to find a card in a SORTED deck?', options: ['Linear Search (Check each)', 'Binary Search (Split halves)', 'Random Search', 'Bubble Sort'], correct: 1, type: 'algo' },
                { id: 't3', text: 'Debug: A user reports a bug that "sometimes" happens. First step?', options: ['Rewrite code', 'Tell them to refresh', 'Reproduce consistency', 'Ignore'], correct: 2, type: 'engineering' },
                { id: 't4', text: 'Concept: What is an "Edge Case"?', options: ['A design style', 'Rare input that might break logic', 'Last line of code', 'Syntax Error'], correct: 1, type: 'concept' },
                { id: 't5', text: 'Recursion: What happens if a function calls itself without a base case?', options: ['It works faster', 'Stack Overflow / Crash', 'It stops automatically', 'It returns null'], correct: 1, type: 'recursion' },
                { id: 't6', text: 'Data Structures: You need First-In-First-Out (FIFO) behavior. Which structure?', options: ['Stack', 'Queue', 'Array', 'Graph'], correct: 1, type: 'structure' },
                { id: 't7', text: 'Logic: !(A OR B) is equivalent to:', options: ['!A AND !B', '!A OR !B', 'A AND B', 'A NAND B'], correct: 0, type: 'boolean' },
                { id: 't8', text: 'Efficiency: Loop A runs N times. Loop B runs N*N times. For large N, which is slower?', options: ['Loop A', 'Loop B', 'Same speed', 'Depends on computer'], correct: 1, type: 'complexity' },
                { id: 't9', text: 'Architecture: Why separate Frontend and Backend?', options: ['To clearer code', 'Scalability & Security', 'It is required by law', 'To use more files'], correct: 1, type: 'architecture' },
                { id: 't10', text: 'Git: What does "Merge Conflict" mean?', options: ['Two branches have competing changes', 'Git is broken', 'Repo is full', 'Files are deleted'], correct: 0, type: 'version-control' },
                // New Python Questions
                { id: 'tp1', text: 'Python: What acts as a placeholder for a block of code that hasn\'t been written yet?', options: ['pass', 'break', 'continue', 'null'], correct: 0, type: 'python-syntax' },
                { id: 'tp2', text: 'Python: output of print([x for x in range(3)])?', options: ['0 1 2', '[0, 1, 2]', '[1, 2, 3]', '(0, 1, 2)'], correct: 1, type: 'python-logic' },
                { id: 'tp3', text: 'Python: Which data type is IMMUTABLE?', options: ['List', 'Dictionary', 'Set', 'Tuple'], correct: 3, type: 'python-concept' },
                { id: 'tp4', text: 'Python: What does the __init__ method primarily do?', options: ['Terminates program', 'Initializes object attributes', 'Imports modules', 'Loops'], correct: 1, type: 'python-oop' }
            ]
        }
    };

    // === DOM Elements ===
    const app = document.getElementById('app');

    // === Helper: Fade Transition ===
    function transitionTo(html) {
        app.style.opacity = '0';
        setTimeout(() => {
            app.innerHTML = html;
            app.style.opacity = '1';
        }, 300);
    }

    // === Step 1: Welcome ===
    function renderWelcome() {
        const html = `
            <div class="screen active text-center">
                <h1 class="headline-lg fade-up">Let's understand how you think.</h1>
                <p class="subtext fade-up delay-1" style="margin: 0 auto 3rem auto;">
                    A cognitive assessment of your logic, reasoning, and pattern recognition. No prior study required.
                </p>
                <form id="welcome-form" class="fade-up delay-2" style="max-width: 400px; margin: 0 auto;">
                    <div class="form-group">
                        <input type="text" id="input-name" class="input-minimal" placeholder="Your Name" required autocomplete="off">
                    </div>
                    <div class="form-group">
                        <input type="email" id="input-email" class="input-minimal" placeholder="Parent's Email" required autocomplete="off">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Begin Assessment</button>
                </form>
            </div>
        `;
        transitionTo(html);

        setTimeout(() => {
            const form = document.getElementById('welcome-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('input-name').value;
                const email = document.getElementById('input-email').value;
                if (name && email) {
                    state.user.name = name;
                    state.user.email = email;
                    renderTrackSelection();
                }
            });
        }, 350);
    }

    // === Step 2: Track Selection ===
    function renderTrackSelection() {
        const html = `
            <div class="screen active">
                <h2 class="headline-lg fade-up text-center">Select your path.</h2>
                <p class="subtext fade-up delay-1 text-center" style="margin: 0 auto;">Which description fits you best?</p>
                
                <div class="track-grid fade-up delay-2">
                    <div class="track-card" onclick="window.selectTrack('explorer')">
                        <div class="track-icon" style="background:#E0F2FE; color:#0284C7; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">🧭</div>
                        <h3 style="font-size:1.25rem; margin-bottom:0.5rem; color: #0B1C2D;">Explorer</h3>
                        <p class="text-muted" style="font-size:0.9rem;">${tracks.explorer.desc}</p>
                    </div>
                    <div class="track-card" onclick="window.selectTrack('builder')">
                        <div class="track-icon" style="background:#FEF3C7; color:#D97706; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">🔨</div>
                        <h3 style="font-size:1.25rem; margin-bottom:0.5rem; color: #0B1C2D;">Builder</h3>
                        <p class="text-muted" style="font-size:0.9rem;">${tracks.builder.desc}</p>
                    </div>
                    <div class="track-card" onclick="window.selectTrack('thinker')">
                        <div class="track-icon" style="background:#F3E8FF; color:#7C3AED; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">🧠</div>
                        <h3 style="font-size:1.25rem; margin-bottom:0.5rem; color: #0B1C2D;">Thinker</h3>
                        <p class="text-muted" style="font-size:0.9rem;">${tracks.thinker.desc}</p>
                    </div>
                </div>
            </div>
        `;
        transitionTo(html);
    }

    // Global handler
    window.selectTrack = (trackId) => {
        const selectedTrack = tracks[trackId];
        // Clone and Shuffle questions for randomization
        const questions = [...selectedTrack.questions].sort(() => Math.random() - 0.5);
        
        state.track = {
            ...selectedTrack,
            questions: questions
        };
        state.currentQuestionIndex = 0;
        state.answers = [];
        state.startTime = new Date(); // Start finding time
        renderQuestion();
    };

    // === Step 3: Question ===
    function renderQuestion() {
        const track = state.track;
        const qIndex = state.currentQuestionIndex;
        const total = track.questions.length;
        const question = track.questions[qIndex];
        const progress = ((qIndex) / total) * 100;

        const html = `
            <div class="screen active">
                <div class="progress-container fade-up">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                
                <p class="text-muted fade-up" style="margin-bottom:1rem; font-size:0.9rem; letter-spacing:0.05em; text-transform:uppercase;">Question ${qIndex + 1} of ${total}</p>
                
                <h3 class="question-text fade-up delay-1">${question.text}</h3>
                
                <div class="options-list fade-up delay-2">
                    ${question.options.map((opt, i) => `
                        <button class="option-btn" onclick="window.handleAnswer(${i})">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        transitionTo(html);
    }

    window.handleAnswer = (optionIndex) => {
        const btns = document.querySelectorAll('.option-btn');
        btns.forEach(b => b.classList.remove('selected'));
        btns[optionIndex].classList.add('selected');

        const question = state.track.questions[state.currentQuestionIndex];
        const isCorrect = (optionIndex === question.correct);

        state.answers.push({
            questionId: question.id,
            answer: optionIndex,
            correct: isCorrect,
            type: question.type // Store type for analysis
        });

        if (isCorrect) state.score.correct++;

        setTimeout(() => {
            state.currentQuestionIndex++;
            if (state.currentQuestionIndex < state.track.questions.length) {
                renderQuestion();
            } else {
                state.endTime = new Date(); // Capture end time
                renderResults();
            }
        }, 400);
    };

    // === Step 4: Deep Analysis Results ===
    function renderResults() {
        // --- Core Calculations ---
        const total = state.track.questions.length;
        const score = state.score.correct;
        const percent = Math.round((score / total) * 100);

        // Time Analysis
        const timeDiff = (state.endTime - state.startTime) / 1000;
        const minutes = Math.floor(timeDiff / 60);
        const seconds = Math.floor(timeDiff % 60);
        const avgTime = Math.round(timeDiff / total);

        // --- Deep Category Analysis ---
        // Map types to broader cognitive categories
        const categoryMap = {
            'Cognitive Logic': ['logic', 'causal', 'order', 'probability', 'boolean', 'spatial'],
            'Algorithmic Thinking': ['pattern', 'iteration', 'recursion', 'algo', 'complexity'],
            'Technical & Syntax': ['variable', 'syntax', 'indexing', 'function', 'python-syntax', 'python-logic', 'python-concept', 'python-oop'],
            'Systems Architecture': ['debug', 'systems', 'engineering', 'concept', 'structure', 'architecture', 'version-control']
        };

        const catScores = {
            'Cognitive Logic': { total: 0, correct: 0, color: '#0B1C2D' },
            'Algorithmic Thinking': { total: 0, correct: 0, color: '#C5A065'},
            'Technical & Syntax': { total: 0, correct: 0, color: '#4B5563' },
            'Systems Architecture': { total: 0, correct: 0, color: '#10B981' }
        };

        // Populate scores
        state.answers.forEach(a => {
            let placed = false;
            for (const [catName, types] of Object.entries(categoryMap)) {
                if (types.includes(a.type)) {
                    catScores[catName].total++;
                    if (a.correct) catScores[catName].correct++;
                    placed = true;
                    break;
                }
            }
            // Fallback for any missed types
            if (!placed) {
                if (!catScores['Cognitive Logic'].total) catScores['Cognitive Logic'].total++; // simplistic fallback
            }
        });

        // --- Archetype & Narrative ---
        let mainArchetype = "The Methodical Thinker";
        if (state.track.id === 'explorer') {
            if (percent > 85) mainArchetype = "Natural Logician";
            else if (percent > 60) mainArchetype = "Intuitive Analyst";
            else mainArchetype = "Creative Intuit";
        } else if (state.track.id === 'builder') {
            if (percent > 85) mainArchetype = "Core Architect";
            else if (percent > 60) mainArchetype = "Applied Developer";
            else mainArchetype = "Emerging Coder";
        } else {
            if (percent > 85) mainArchetype = "Systems Visionary";
            else if (percent > 60) mainArchetype = "Full-Stack Strategist";
            else mainArchetype = "Technical Specialist";
        }

        // Generate Insights
        let strengthsList = [];
        let areasToImprove = [];
        const renderedBars = [];

        for (const [cat, data] of Object.entries(catScores)) {
            if (data.total > 0) {
                const catPercent = Math.round((data.correct / data.total) * 100);
                renderedBars.push(renderBar(cat, catPercent, data.color));
                
                if (catPercent >= 80) strengthsList.push(cat);
                else if (catPercent <= 50) areasToImprove.push(cat);
            }
        }

        if (strengthsList.length === 0) strengthsList.push("Persistence", "Focus");
        if (areasToImprove.length === 0) areasToImprove.push("Advanced System Scaling");

        // --- Helper for Bar Render ---
        function renderBar(label, val, color) {
            return `
            <div style="margin-bottom: 0.8rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.2rem; font-size:0.85rem; color:#4B5563;">
                    <span>${label}</span>
                    <span>${val}%</span>
                </div>
                <div style="height: 6px; background: #E5E7EB; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${val}%; height: 100%; background: ${color}; transition: width 1s ease;"></div>
                </div>
            </div>`;
        }

        const html = `
            <div class="screen active">
                <div class="results-header fade-up">
                    <p class="text-muted" style="text-transform:uppercase; letter-spacing:0.1rem; font-size:0.8rem; margin-bottom:0.5rem;">Diagnostic Report</p>
                    <h2 class="headline-lg" style="margin-bottom:0.5rem; background: linear-gradient(135deg, #0B1C2D 0%, #1e40af 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${mainArchetype}</h2>
                    <p class="subtext text-center" style="margin: 0 auto 2rem auto; font-size:1rem; max-width:600px;">
                        ${state.user.name}, you generated a score of <strong>${score}/${total}</strong>. 
                        Your profile suggests strong aptitude in <strong>${strengthsList[0]}</strong>.
                    </p>
                </div>

                <div class="results-grid fade-up delay-1" style="gap: 2rem;">
                    
                    <!-- 1. Key Metrics -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                        <div class="metric-card" style="background:white; padding:1.2rem; border-radius:8px; text-align:center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6;">
                            <div style="font-size:0.75rem; color:#6B7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Total Score</div>
                            <div style="font-size:2rem; font-weight:800; color:#0B1C2D; line-height:1;">${score}</div>
                            <div style="font-size:0.8rem; color:#9CA3AF;">out of ${total}</div>
                        </div>
                        <div class="metric-card" style="background:white; padding:1.2rem; border-radius:8px; text-align:center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6;">
                            <div style="font-size:0.75rem; color:#6B7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Avg Response</div>
                            <div style="font-size:2rem; font-weight:800; color:#0B1C2D; line-height:1;">${avgTime}s</div>
                            <div style="font-size:0.8rem; color:#9CA3AF;">per question</div>
                        </div>
                         <div class="metric-card" style="background:white; padding:1.2rem; border-radius:8px; text-align:center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6;">
                             <div style="font-size:0.75rem; color:#6B7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Accuracy</div>
                            <div style="font-size:2rem; font-weight:800; color:#10B981; line-height:1;">${percent}%</div>
                            <div style="font-size:0.8rem; color:#9CA3AF;">overall</div>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem; align-items:start;">
                        <!-- 2. Competency Graph -->
                        <div style="background:white; padding:1.5rem; border-radius:8px; border:1px solid #F3F4F6;">
                            <h4 style="font-size:1rem; margin-bottom:1.2rem; color:#111827; font-weight:600;">Cognitive Breakdown</h4>
                            ${renderedBars.join('')}
                        </div>

                        <!-- 3. Insights -->
                        <div>
                             <h4 style="font-size:1rem; margin-bottom:1rem; color:#111827; font-weight:600;">Analysis & Feedback</h4>
                             <div style="margin-bottom:1.5rem;">
                                <div style="display:flex; align-items:center; margin-bottom:0.5rem;">
                                    <div style="width:24px; height:24px; background:#ECFDF5; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-right:0.8rem; color:#059669; font-size:0.9rem;">✔</div>
                                    <span style="font-weight:600; color:#059669; font-size:0.95rem;">Proficiencies</span>
                                </div>
                                <p style="font-size:0.9rem; color:#4B5563; line-height:1.5; margin-left:2.3rem;">
                                    You show excellent meaningful grasp of <strong>${strengthsList.join(' and ')}</strong>. This indicates a strong foundation for complex problem solving.
                                </p>
                             </div>

                             <div style="margin-bottom:1rem;">
                                <div style="display:flex; align-items:center; margin-bottom:0.5rem;">
                                    <div style="width:24px; height:24px; background:#FEF2F2; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-right:0.8rem; color:#DC2626; font-size:0.9rem;">↗</div>
                                    <span style="font-weight:600; color:#DC2626; font-size:0.95rem;">Focus Areas</span>
                                </div>
                                <p style="font-size:0.9rem; color:#4B5563; line-height:1.5; margin-left:2.3rem;">
                                    To advance further, focus on sharpening your <strong>${areasToImprove.join(' and ')}</strong>. Systematic practice in these areas will yield rapid result improvements.
                                </p>
                             </div>
                        </div>
                    </div>

                    <!-- 4. Trajectory -->
                    <div style="background: linear-gradient(to right, #F0F9FF, #E0F2FE); padding:1.5rem; border-radius:8px; border:1px solid #BAE6FD;">
                        <h4 style="font-size:1.1rem; color:#0369A1; margin-bottom:0.5rem; font-weight:700;">Recommended Learning Path: ${mainArchetype}</h4>
                        <p style="font-size:0.95rem; color:#0C4A6E; margin-bottom:0; line-height:1.6;">
                            Based on your data, we recommend a curriculum that leverages your strength in <strong>${strengthsList[0]}</strong> to fast-track your learning, while using targeted modules to master <strong>${areasToImprove[0] || 'advanced concepts'}</strong>.
                        </p>
                    </div>

                    <!-- CTA -->
                    <div style="text-align:center; margin-top:1rem;">
                        <a href="mailto:admissions@edvera.org?subject=Assessment%20Result:%20${mainArchetype}%20-%20${state.user.name}&body=I've%20completed%20the%20diagnostic.%20Score:%20${score}/${total}.%20Strengths:%20${strengthsList.join(', ')}." class="btn btn-primary" style="width:100%; max-width:400px; padding:1rem; border-radius:50px;">
                            Book Consultation with Faculty &rarr;
                        </a>
                        <p style="font-size:0.8rem; color:#9CA3AF; margin-top:1rem;">Results ID: ${Date.now().toString(36).toUpperCase()}</p>
                    </div>

                </div>
            </div>
        `;
        transitionTo(html);
    }

    // Init
    setTimeout(() => {
        document.querySelector('.diagnostic-container').classList.add('loaded');
        renderWelcome();
    }, 100);
});
