/**
 * ED-LAB: Skulpt (Python 3) + Ace Editor (Reliable)
 */

const editor = ace.edit("editor");
// Theme set by Theme Sync at bottom
editor.session.setMode("ace/mode/python");

// --- Options for Alignment & Feel ---
editor.setOptions({
    fontSize: "16px",
    fontFamily: "'Fira Code', 'Consolas', monospace",
    showPrintMargin: false, // No vertical line
    showGutter: true,
    highlightActiveLine: true,
    wrap: true,
    scrollPastEnd: 0.5
});

// Force clean startup layout
setTimeout(() => {
    editor.resize(true);
    editor.scrollToLine(1, true, true, () => { });
}, 100);

// Default Template
const DEFAULT_CODE = `print("Hi Champ, Welcome to EDVERA")`;

editor.setValue(DEFAULT_CODE, -1);

// --- Event Binding ---
document.getElementById('btn-run').addEventListener('click', runPython);
document.getElementById('btn-save').addEventListener('click', saveFile);
document.getElementById('btn-clear').addEventListener('click', clearOutput);

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// --- Logic ---

function runPython() {
    const code = editor.getValue();
    const canvasDiv = document.getElementById('canvas-target');
    const tabCanvasBtn = document.getElementById('tab-canvas');

    // 1. CLEAR EVERYTHING (Orphan Removal)
    document.getElementById('output-console').innerHTML = ''; // Clear console

    // Clear the legitimate target
    if (canvasDiv) canvasDiv.innerHTML = '';

    // DESTROY ANY ROGUE CANVASES that Skulpt might have attached to body
    // This is the fix for "Two Turtles" / "Ghost Canvas"
    document.querySelectorAll('canvas').forEach(el => {
        // If it's not inside our target, kill it.
        if (!canvasDiv.contains(el)) {
            el.remove();
        }
    });

    // Detect Turtle usage
    const isTurtle = code.includes('turtle');

    log(">> Running...", "system");

    if (isTurtle) {
        // Show Canvas Tab logic
        tabCanvasBtn.style.display = 'block';

        // STRICT SWITCH
        document.getElementById('view-console').style.display = 'none';
        document.getElementById('view-canvas').style.display = 'flex';

        // Update Tabs
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        // Manually active "Canvas"
        // Note: we can't easily select by dataset in this snippet without querySelector
        // so we trust the visual toggle
    } else {
        // STRICT SWITCH
        document.getElementById('view-canvas').style.display = 'none';
        document.getElementById('view-console').style.display = 'flex';
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-tab="console"]').classList.add('active');
    }

    // 2. Configure Skulpt
    // 2. Measure Container
    const container = document.getElementById('canvas-target');
    const rect = container.getBoundingClientRect();

    // 3. Reset & Configure Turtle
    // We update the existing object or create a new config, but we DO NOT delete it
    // as that removes the internal prototype methods Skulpt needs.
    if (!Sk.TurtleGraphics) {
        Sk.TurtleGraphics = {};
    }

    Sk.TurtleGraphics.target = 'canvas-target';
    Sk.TurtleGraphics.width = rect.width;
    Sk.TurtleGraphics.height = rect.height;

    // 4. Configure & Execute
    Sk.configure({
        output: (text) => log(text),
        read: builtinRead,
        __future__: Sk.python3
    });

    Sk.misceval.asyncToPromise(() => {
        return Sk.importMainWithBody("<stdin>", false, code, true);
    }).then(
        () => log(">> Execution Finished.", "system"),
        (err) => {
            log(err.toString(), "error");
            switchTab('console'); // Switch back to show error
        }
    );
}

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function log(text, type = "normal") {
    const consoleDiv = document.getElementById('output-console');
    if (!consoleDiv) return;

    // Ignore empty newlines sometimes sent by Skulpt
    if (text === "\n") return;

    const div = document.createElement('div');
    div.className = `console-line ${type}`;
    div.textContent = text;
    consoleDiv.appendChild(div);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

function clearOutput() {
    document.getElementById('output-console').innerHTML = '';
    document.getElementById('canvas-target').innerHTML = '';
}

function switchTab(tabName) {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tabName);
    });
    // Layers
    document.querySelectorAll('.view-layer').forEach(v => {
        v.classList.toggle('active', v.id === `view-${tabName}`);
    });
}

function saveFile() {
    const code = editor.getValue();
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "my_code.py";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// --- Theme Sync ---
function updateEditorTheme(theme) {
    // "tomorrow_night" matches the soft dark requirement better than Monokai
    // "textmate" is a standard clean light theme
    const aceTheme = theme === 'dark' ? "ace/theme/tomorrow_night" : "ace/theme/textmate";
    editor.setTheme(aceTheme);
}

window.addEventListener('themeChanged', (e) => {
    updateEditorTheme(e.detail.theme);
});

// Initial Load
const initialTheme = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
updateEditorTheme(initialTheme);


