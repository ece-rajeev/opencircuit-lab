/* =========================================================
   PROJECT DATA
   Add a new project by pushing another object into this array —
   the grid, filters and modal all render from this.
========================================================= */
const PROJECTS = [
  {
    id: "smart-home",
    name: "Smart Home Automation",
    icon: "ESP",
    categories: ["esp32", "iot"],
    board: "ESP32",
    summary: "WiFi ke through appliances ko app ya voice se ON/OFF karna, ek relay module ke zariye.",
    overview: "Yeh project ek ESP32 ko WiFi se connect karta hai aur ek 4-channel relay module ke through home appliances (bulb, fan, plug) ko control karta hai. ESP32 par ek lightweight web server chalta hai jisse phone ke browser ya ek simple app se command bhej sakte hain. Manual switch bhi diya gaya hai taaki relay app ke bina bhi chal sake.",
    components: ["ESP32 Dev Board", "4-Channel Relay Module", "230V AC Bulb Socket", "Push Button (manual override)", "5V/2A Power Supply"],
    demoType: "toggle",
  },
  {
    id: "weather-station",
    name: "Weather Station",
    icon: "WX",
    categories: ["arduino", "sensor"],
    board: "Arduino Uno",
    summary: "DHT11 sensor se temperature aur humidity padhna, OLED display par live dikhana.",
    overview: "DHT11 sensor Arduino ke digital pin se data leta hai — temperature aur humidity — aur ek 0.96\" OLED screen par har 2 second mein refresh karke dikhata hai. Isko easily extend karke SD card logging ya IoT dashboard tak bhi bhej sakte hain.",
    components: ["Arduino Uno", "DHT11 Temp/Humidity Sensor", "0.96\" OLED Display (I2C)", "10k Pull-up Resistor", "Breadboard + jumpers"],
    demoType: "sensor",
  },
  {
    id: "obstacle-robot",
    name: "Obstacle Avoiding Robot",
    icon: "BOT",
    categories: ["arduino", "robotics", "sensor"],
    board: "Arduino Uno",
    summary: "Ultrasonic sensor se distance measure karke robot khud path badalta hai.",
    overview: "HC-SR04 ultrasonic sensor front mein laga hai jo continuously distance measure karta hai. Agar koi obstacle threshold distance ke andar aata hai, motor driver (L298N) motors ko reverse/turn command deta hai taaki robot rasta badal le. Poora logic Arduino Uno par chalta hai.",
    components: ["Arduino Uno", "HC-SR04 Ultrasonic Sensor", "L298N Motor Driver", "2x Gear Motors + Wheels", "Battery Pack (7.4V)"],
    demoType: "distance",
  },
  {
    id: "plant-monitor",
    name: "IoT Plant Monitor",
    icon: "ESP",
    categories: ["esp32", "iot", "sensor"],
    board: "ESP32",
    summary: "Soil moisture sensor se mitti ki nami track karke IoT dashboard par bhejna.",
    overview: "Ek capacitive soil moisture sensor mitti mein lagaya jaata hai, jiski reading ESP32 ADC pin se li jaati hai. ESP32 WiFi se yeh data cloud dashboard (jaise Blynk ya ThingSpeak) par bhejta hai, aur agar moisture ek threshold se neeche jaata hai to alert/notification trigger hoti hai.",
    components: ["ESP32 Dev Board", "Capacitive Soil Moisture Sensor", "Mini Water Pump (optional auto-watering)", "Relay Module", "Waterproof enclosure"],
    demoType: "sensor",
  },
  {
    id: "security-alarm",
    name: "Home Security Alarm",
    icon: "PIR",
    categories: ["arduino", "sensor"],
    board: "Arduino Uno",
    summary: "PIR motion sensor se movement detect hote hi buzzer aur LED alert trigger hota hai.",
    overview: "PIR sensor infrared body-heat motion detect karta hai. Jaise hi motion detect hota hai, Arduino ek buzzer aur red LED ko turant ON kar deta hai, aur kuch second baad auto-reset ho jaata hai. Isko easily GSM module se link karke SMS alert bhi bhej sakte hain.",
    components: ["Arduino Uno", "PIR Motion Sensor", "Active Buzzer", "Red Status LED", "9V Battery"],
    demoType: "motion",
  },
  {
    id: "bt-car",
    name: "Bluetooth Controlled Car",
    icon: "BT",
    categories: ["arduino", "robotics"],
    board: "Arduino Uno",
    summary: "HC-05 Bluetooth module se phone ke through car ko drive karna.",
    overview: "HC-05 Bluetooth module Arduino se serial communication karta hai. Phone par ek simple Bluetooth-controller app se forward/back/left/right commands bhejte hain, jo Arduino L298N motor driver ko commands mein convert karke motors chalata hai.",
    components: ["Arduino Uno", "HC-05 Bluetooth Module", "L298N Motor Driver", "4x DC Gear Motors", "Chassis + Battery Pack"],
    demoType: "car",
  },
];

const CATEGORY_LABEL = { arduino: "Arduino", esp32: "ESP32", sensor: "Sensor", iot: "IoT", robotics: "Robotics" };

/* =========================================================
   RENDER: PROJECT CARDS
========================================================= */
const grid = document.getElementById("projectGrid");

function renderCards(filter = "all") {
  grid.innerHTML = "";
  const list = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.categories.includes(filter));

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="card-top">
        <div class="card-icon">${p.icon}</div>
        <div class="card-tags">${p.categories.map(c => `<span class="tag">${CATEGORY_LABEL[c]}</span>`).join("")}</div>
      </div>
      <div class="card-title">${p.name}</div>
      <p class="card-desc">${p.summary}</p>
      <div class="card-foot">
        <span>${p.board}</span>
        <span>View details &rarr;</span>
      </div>
    `;
    card.addEventListener("click", () => openModal(p.id));
    card.addEventListener("keydown", e => { if (e.key === "Enter") openModal(p.id); });
    grid.appendChild(card);
  });
}
renderCards();

/* =========================================================
   FILTER BAR
========================================================= */
document.getElementById("filterBar").addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
  btn.classList.add("is-active");
  renderCards(btn.dataset.filter);
});

/* =========================================================
   CIRCUIT DIAGRAM (block-level, auto-generated per project)
========================================================= */
function circuitBlockSVG(board, parts) {
  const w = 560, h = 300;
  const mcuW = 150, mcuH = 90, mcuX = w / 2 - mcuW / 2, mcuY = h / 2 - mcuH / 2;

  const left = parts.filter((_, i) => i % 2 === 0);
  const right = parts.filter((_, i) => i % 2 === 1);
  const maxSide = Math.max(left.length, right.length, 1);

  // shrink box size/gap as more components get added, so up to ~5 per side still fit
  const boxW = maxSide <= 2 ? 150 : maxSide === 3 ? 140 : 130;
  const boxH = maxSide <= 2 ? 54 : maxSide === 3 ? 44 : maxSide === 4 ? 38 : 30;
  const gapY = maxSide <= 2 ? 24 : maxSide === 3 ? 16 : maxSide === 4 ? 10 : 6;
  const fontSize = maxSide <= 3 ? 11 : 10;
  const colGapX = 40;

  function stack(items, side) {
    const n = items.length;
    if (n === 0) return "";
    const totalH = n * boxH + (n - 1) * gapY;
    const startY = h / 2 - totalH / 2;
    const x = side === "left" ? mcuX - colGapX - boxW : mcuX + mcuW + colGapX;
    return items.map((label, i) => {
      const y = startY + i * (boxH + gapY);
      const midY = y + boxH / 2;
      const lineStartX = side === "left" ? x + boxW : x;
      const lineEndX = side === "left" ? mcuX : mcuX + mcuW;
      const mcuTargetY = mcuY + mcuH / 2 + (i - (n - 1) / 2) * Math.min(18, mcuH / (n + 1));
      return `
        <line class="wire" x1="${lineStartX}" y1="${midY}" x2="${lineEndX}" y2="${mcuTargetY}" />
        <circle class="pad2" cx="${lineStartX}" cy="${midY}" r="3.5" />
        <rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="6" class="part-box" />
        <text x="${x + boxW / 2}" y="${midY + 4}" class="part-label" text-anchor="middle" style="font-size:${fontSize}px;">${escapeXml(label).slice(0, 22)}</text>
      `;
    }).join("");
  }

  if (parts.length === 0) {
    return `
      <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .mcu-box{ fill: rgba(94,234,212,0.08); stroke: #5EEAD4; stroke-width:1.6; }
          .mcu-label{ fill: #5EEAD4; font-family: 'JetBrains Mono', monospace; font-size:13px; font-weight:700; }
          .empty-note{ fill: #9FB0A6; font-family: 'JetBrains Mono', monospace; font-size:12px; }
        </style>
        <rect x="${mcuX}" y="${mcuY}" width="${mcuW}" height="${mcuH}" rx="8" class="mcu-box" />
        <text x="${mcuX + mcuW / 2}" y="${mcuY + mcuH / 2 + 5}" class="mcu-label" text-anchor="middle">${board}</text>
        <text x="${w/2}" y="${mcuY + mcuH + 40}" class="empty-note" text-anchor="middle">Select components below to wire them in</text>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .wire{ stroke: var(--copper, #C98A4B); stroke-width:1.6; }
        .pad2{ fill: var(--copper, #C98A4B); }
        .part-box{ fill: rgba(232,228,216,0.04); stroke: rgba(232,228,216,0.25); stroke-width:1; }
        .part-label{ fill: #E8E4D8; font-family: 'JetBrains Mono', monospace; }
        .mcu-box{ fill: rgba(94,234,212,0.08); stroke: #5EEAD4; stroke-width:1.6; }
        .mcu-label{ fill: #5EEAD4; font-family: 'JetBrains Mono', monospace; font-size:13px; font-weight:700; }
      </style>
      ${stack(left, "left")}
      ${stack(right, "right")}
      <rect x="${mcuX}" y="${mcuY}" width="${mcuW}" height="${mcuH}" rx="8" class="mcu-box" />
      <text x="${mcuX + mcuW / 2}" y="${mcuY + mcuH / 2 + 5}" class="mcu-label" text-anchor="middle">${board}</text>
    </svg>
  `;
}

function circuitDiagram(project) {
  return circuitBlockSVG(project.board, project.components.slice(1, 5));
}

/* =========================================================
   BUILD TAB — pick components, watch the block diagram
   update live. Pool = project's own parts + common extra
   modules, so you can experiment beyond the default build.
========================================================= */
const COMPONENT_POOL = [
  "LED (Status Indicator)",
  "Push Button",
  "Buzzer",
  "Relay Module",
  "DHT11 Temp/Humidity Sensor",
  "Ultrasonic Sensor (HC-SR04)",
  "PIR Motion Sensor",
  "Soil Moisture Sensor",
  "OLED Display (I2C)",
  "Bluetooth Module (HC-05)",
  "Motor Driver (L298N)",
  "Servo Motor",
  "Water Pump",
  "Battery Pack",
];

function buildComponentList(project) {
  const own = project.components.slice(1); // exclude the board itself
  const seen = new Set(own.map(c => c.toLowerCase()));
  const extras = COMPONENT_POOL.filter(c => !seen.has(c.toLowerCase()));
  return { defaults: own, all: [...own, ...extras] };
}

function renderBuildPanel(project) {
  const { defaults, all } = buildComponentList(project);
  const defaultSet = new Set(defaults);

  panelBuild.innerHTML = `
    <div class="build-layout">
      <p class="build-hint">Components ko check/uncheck karo — neeche block diagram usi hisaab se live update hoga (max 8 tak, taaki diagram readable rahe).</p>
      <div class="component-checklist" id="buildChecklist">
        ${all.map((label, i) => `
          <label>
            <input type="checkbox" data-label="${escapeXml(label)}" ${defaultSet.has(label) ? "checked" : ""}>
            <span>${escapeXml(label)}</span>
          </label>
        `).join("")}
      </div>
      <div class="build-count" id="buildCount"></div>
      <div class="circuit-box" id="buildDiagram"></div>
    </div>
  `;

  const checklist = document.getElementById("buildChecklist");
  const diagramBox = document.getElementById("buildDiagram");
  const countLabel = document.getElementById("buildCount");
  const MAX_PARTS = 8;

  function currentSelection() {
    return Array.from(checklist.querySelectorAll("input:checked")).map(i => i.dataset.label);
  }

  function refresh() {
    const selected = currentSelection();
    countLabel.textContent = `${selected.length} / ${MAX_PARTS} components wired`;
    diagramBox.innerHTML = circuitBlockSVG(project.board, selected);
    checklist.querySelectorAll("input:not(:checked)").forEach(i => {
      i.disabled = selected.length >= MAX_PARTS;
    });
  }

  checklist.addEventListener("change", refresh);
  refresh();
}

/* =========================================================
   CODE TAB — a tiny, honest simulation.
   It only understands digitalWrite(pin, HIGH/LOW) and delay(ms)
   statements inside void loop(){...}. It does NOT compile real
   C++ — it just plays those two statement types back in order
   so an LED on screen reacts to the code you write.
========================================================= */
function extractFunctionBody(code, fnPattern) {
  const startMatch = code.match(new RegExp(fnPattern + "\\s*\\([^)]*\\)\\s*{"));
  if (!startMatch) return null;
  const startIdx = startMatch.index + startMatch[0].length;
  let depth = 1, i = startIdx;
  while (i < code.length && depth > 0) {
    if (code[i] === "{") depth++;
    else if (code[i] === "}") depth--;
    i++;
  }
  return code.slice(startIdx, i - 1);
}

function parseCodeOps(body) {
  const ops = [];
  const re = /digitalWrite\s*\(\s*([^,]+),\s*(HIGH|LOW)\s*\)|delay\s*\(\s*(\d+)\s*\)/gi;
  let m;
  while ((m = re.exec(body)) !== null) {
    if (m[2]) ops.push({ type: "write", pin: m[1].trim(), state: m[2].toUpperCase() });
    else if (m[3]) ops.push({ type: "delay", ms: parseInt(m[3], 10) });
  }
  return ops;
}

const DEFAULT_SKETCH = `void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}`;

function renderCodePanel(project) {
  panelCode.innerHTML = `
    <div class="code-layout">
      <p class="build-hint">Arduino-style code likho — sirf <b>digitalWrite()</b> aur <b>delay()</b> statements loop() ke andar samjhe jaate hain. Run dabao aur LED ko react karte dekho. Yeh real compiler nahi hai, ek chhoti si simulation hai.</p>
      <textarea id="codeEditor" class="code-editor" spellcheck="false">${escapeXml(DEFAULT_SKETCH)}</textarea>
      <div class="demo-btn-row">
        <button class="demo-btn" id="codeRunBtn">Run &#9654;</button>
        <button class="demo-btn" id="codeStopBtn">Stop &#9632;</button>
        <button class="demo-btn" id="codeResetBtn">Reset Template</button>
      </div>
      <div class="code-sim">
        <svg viewBox="0 0 100 100" width="70" height="70">
          <circle cx="50" cy="42" r="26" fill="rgba(232,228,216,0.08)" stroke="#E8E4D8" stroke-width="2" id="codeLedCircle"/>
          <line x1="38" y1="70" x2="62" y2="70" stroke="#9FB0A6" stroke-width="4" stroke-linecap="round"/>
          <line x1="41" y1="78" x2="59" y2="78" stroke="#9FB0A6" stroke-width="4" stroke-linecap="round"/>
        </svg>
        <div class="code-console" id="codeConsole"><p><span class="prompt">&gt;</span> Ready. Press Run to simulate.</p></div>
      </div>
    </div>
  `;

  const editor = document.getElementById("codeEditor");
  const ledCircle = document.getElementById("codeLedCircle");
  const consoleBox = document.getElementById("codeConsole");
  const runBtn = document.getElementById("codeRunBtn");
  const stopBtn = document.getElementById("codeStopBtn");
  const resetBtn = document.getElementById("codeResetBtn");

  let session = 0;

  function log(msg) {
    consoleBox.innerHTML += `<p><span class="prompt">&gt;</span> ${escapeXml(msg)}</p>`;
    consoleBox.scrollTop = consoleBox.scrollHeight;
  }

  function setLed(on) {
    ledCircle.setAttribute("fill", on ? "rgba(94,234,212,0.55)" : "rgba(232,228,216,0.08)");
    ledCircle.setAttribute("stroke", on ? "#5EEAD4" : "#E8E4D8");
  }

  function run() {
    session++;
    const mySession = session;
    consoleBox.innerHTML = "";
    const loopBody = extractFunctionBody(editor.value, "void\\s+loop") || editor.value;
    const ops = parseCodeOps(loopBody);

    if (ops.length === 0) {
      log("loop() mein koi digitalWrite()/delay() statement nahi mila. Sample template try karo.");
      return;
    }
    log(`Simulation start — loop() mein ${ops.length} statements mile, ${ops.length > 1 ? "har cycle repeat hoga." : ""}`);

    let i = 0;
    function step() {
      if (session !== mySession) return;
      const op = ops[i % ops.length];
      i++;
      if (op.type === "write") {
        setLed(op.state === "HIGH");
        log(`digitalWrite(${op.pin}, ${op.state})`);
        setTimeout(step, 150);
      } else {
        const waited = Math.min(op.ms, 1500);
        log(`delay(${op.ms}ms)${waited !== op.ms ? " — sped up for demo" : ""}`);
        setTimeout(step, waited);
      }
    }
    step();
  }

  function stop() {
    session++;
    log("Simulation stopped.");
    setLed(false);
  }

  runBtn.addEventListener("click", run);
  stopBtn.addEventListener("click", stop);
  resetBtn.addEventListener("click", () => { editor.value = DEFAULT_SKETCH; });
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* =========================================================
   DEMOS — one interactive simulation per demoType
========================================================= */
const DEMO_BUILDERS = {
  toggle(project) {
    return `
      <div class="demo-box">
        <p style="margin:0 0 10px;">Relay switch ko toggle karke bulb ki state dekho — jaisे ESP32 app se command milne par relay switch hota hai.</p>
        <svg id="bulbSvg" viewBox="0 0 100 100" width="90" height="90">
          <circle cx="50" cy="42" r="26" fill="rgba(232,228,216,0.08)" stroke="#E8E4D8" stroke-width="2" id="bulbCircle"/>
          <line x1="38" y1="70" x2="62" y2="70" stroke="#9FB0A6" stroke-width="4" stroke-linecap="round"/>
          <line x1="41" y1="78" x2="59" y2="78" stroke="#9FB0A6" stroke-width="4" stroke-linecap="round"/>
        </svg>
        <div class="demo-btn-row">
          <button class="demo-btn" id="toggleBtn">Toggle Relay</button>
        </div>
        <p class="demo-readout" id="toggleReadout">STATE: OFF</p>
      </div>
    `;
  },
  sensor(project) {
    const unit = project.id === "weather-station" ? "°C" : "%";
    const label = project.id === "weather-station" ? "Temperature" : "Soil Moisture";
    return `
      <div class="demo-box">
        <p style="margin:0 0 10px;">"Refresh Reading" dabao — sensor ek naya simulated reading bhejega, jaise real hardware har cycle mein karta hai.</p>
        <p class="demo-readout" style="font-size:22px;" id="sensorReadout">${label}: -- ${unit}</p>
        <div class="demo-btn-row">
          <button class="demo-btn" id="sensorBtn">Refresh Reading</button>
        </div>
      </div>
    `;
  },
  distance(project) {
    return `
      <div class="demo-box">
        <p style="margin:0 0 10px;">Slider se obstacle ki distance set karo aur dekho robot kab "STOP" karta hai aur kab "GO".</p>
        <div class="demo-controls">
          <label for="distSlider">Distance (cm)</label>
          <input type="range" id="distSlider" min="2" max="100" value="50">
          <span class="demo-readout" id="distValue">50 cm</span>
        </div>
        <p class="demo-readout" id="distStatus" style="font-size:18px; margin-top:12px;">STATUS: GO</p>
      </div>
    `;
  },
  motion(project) {
    return `
      <div class="demo-box">
        <p style="margin:0 0 10px;">"Simulate Motion" dabao — PIR sensor trigger hote hi buzzer aur LED alert on ho jaate hain, 3 second baad auto-reset.</p>
        <div class="demo-btn-row">
          <button class="demo-btn" id="motionBtn">Simulate Motion</button>
        </div>
        <p class="demo-readout" id="motionStatus" style="font-size:18px; margin-top:12px;">STATUS: IDLE</p>
      </div>
    `;
  },
  car(project) {
    return `
      <div class="demo-box">
        <p style="margin:0 0 10px;">Arrow buttons se Bluetooth car ko drive karo — jaise phone app se HC-05 ko command jaati hai.</p>
        <div style="width:160px; height:160px; background: rgba(232,228,216,0.04); border:1px solid rgba(232,228,216,0.2); border-radius:8px; position:relative; margin: 10px 0;">
          <div id="carDot" style="width:16px; height:16px; border-radius:4px; background:#5EEAD4; position:absolute; left:72px; top:72px; transition: left .15s ease, top .15s ease;"></div>
        </div>
        <div class="demo-btn-row">
          <button class="demo-btn" id="carUp">&uarr; Forward</button>
          <button class="demo-btn" id="carDown">&darr; Back</button>
          <button class="demo-btn" id="carLeft">&larr; Left</button>
          <button class="demo-btn" id="carRight">&rarr; Right</button>
        </div>
      </div>
    `;
  },
};

const DEMO_INIT = {
  toggle() {
    let on = false;
    const btn = document.getElementById("toggleBtn");
    const readout = document.getElementById("toggleReadout");
    const circle = document.getElementById("bulbCircle");
    btn.addEventListener("click", () => {
      on = !on;
      readout.textContent = "STATE: " + (on ? "ON" : "OFF");
      circle.setAttribute("fill", on ? "rgba(94,234,212,0.55)" : "rgba(232,228,216,0.08)");
      circle.setAttribute("stroke", on ? "#5EEAD4" : "#E8E4D8");
    });
  },
  sensor(project) {
    const btn = document.getElementById("sensorBtn");
    const readout = document.getElementById("sensorReadout");
    const unit = project.id === "weather-station" ? "°C" : "%";
    const label = project.id === "weather-station" ? "Temperature" : "Soil Moisture";
    const base = project.id === "weather-station" ? 28 : 45;
    btn.addEventListener("click", () => {
      const val = (base + (Math.random() * 10 - 5)).toFixed(1);
      readout.textContent = `${label}: ${val} ${unit}`;
    });
  },
  distance() {
    const slider = document.getElementById("distSlider");
    const value = document.getElementById("distValue");
    const status = document.getElementById("distStatus");
    function update() {
      const d = Number(slider.value);
      value.textContent = d + " cm";
      const stop = d < 15;
      status.textContent = "STATUS: " + (stop ? "STOP — obstacle detected" : "GO");
      status.style.color = stop ? "#FF6B5E" : "#5EEAD4";
    }
    slider.addEventListener("input", update);
    update();
  },
  motion() {
    const btn = document.getElementById("motionBtn");
    const status = document.getElementById("motionStatus");
    btn.addEventListener("click", () => {
      status.textContent = "STATUS: ALARM TRIGGERED";
      status.style.color = "#FF6B5E";
      setTimeout(() => {
        status.textContent = "STATUS: IDLE";
        status.style.color = "#5EEAD4";
      }, 3000);
    });
  },
  car() {
    const dot = document.getElementById("carDot");
    let x = 72, y = 72;
    const step = 20, min = 0, max = 144;
    function move(dx, dy) {
      x = Math.max(min, Math.min(max, x + dx));
      y = Math.max(min, Math.min(max, y + dy));
      dot.style.left = x + "px";
      dot.style.top = y + "px";
    }
    document.getElementById("carUp").addEventListener("click", () => move(0, -step));
    document.getElementById("carDown").addEventListener("click", () => move(0, step));
    document.getElementById("carLeft").addEventListener("click", () => move(-step, 0));
    document.getElementById("carRight").addEventListener("click", () => move(step, 0));
  },
};

/* =========================================================
   MODAL
========================================================= */
const overlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalEyebrow = document.getElementById("modalEyebrow");
const panelOverview = document.getElementById("panelOverview");
const panelCircuit = document.getElementById("panelCircuit");
const panelBuild = document.getElementById("panelBuild");
const panelCode = document.getElementById("panelCode");
const panelDemo = document.getElementById("panelDemo");

function openModal(id) {
  const project = PROJECTS.find(p => p.id === id);
  if (!project) return;

  modalTitle.textContent = project.name;
  modalEyebrow.textContent = "// " + project.categories.join("_");

  panelOverview.innerHTML = `
    <p>${project.overview}</p>
    <ul class="spec-list">
      ${project.components.map(c => `<li><b>&bull;</b> ${c}</li>`).join("")}
    </ul>
  `;

  panelCircuit.innerHTML = `
    <p style="margin-bottom:10px;">Block-level wiring diagram — connections simplified for clarity, exact pin mapping depends on your board revision.</p>
    <div class="circuit-box">${circuitDiagram(project)}</div>
  `;

  renderBuildPanel(project);
  renderCodePanel(project);

  panelDemo.innerHTML = DEMO_BUILDERS[project.demoType](project);
  DEMO_INIT[project.demoType](project);

  // reset to first tab
  document.querySelectorAll(".mtab").forEach(t => t.classList.remove("is-active"));
  document.querySelector('.mtab[data-tab="overview"]').classList.add("is-active");
  document.querySelectorAll(".mpanel").forEach(p => p.classList.remove("is-active"));
  panelOverview.classList.add("is-active");

  overlay.classList.add("is-open");
}

function closeModal() {
  overlay.classList.remove("is-open");
  const stopBtn = document.getElementById("codeStopBtn");
  if (stopBtn) stopBtn.click();
}

document.getElementById("modalClose").addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

document.querySelector(".modal-tabs").addEventListener("click", e => {
  const tab = e.target.closest(".mtab");
  if (!tab) return;
  document.querySelectorAll(".mtab").forEach(t => t.classList.remove("is-active"));
  tab.classList.add("is-active");
  document.querySelectorAll(".mpanel").forEach(p => p.classList.remove("is-active"));
  document.querySelector(`.mpanel[data-panel="${tab.dataset.tab}"]`).classList.add("is-active");
});

/* =========================================================
   HERO STAT COUNTERS
========================================================= */
document.querySelectorAll(".stat-num").forEach(el => {
  const target = Number(el.dataset.count);
  let cur = 0;
  const step = Math.max(1, Math.round(target / 30));
  const iv = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(iv); }
    el.textContent = cur;
  }, 40);
});

/* =========================================================
   CONTACT FORM
   Messages are collected via an external Typeform — clicking the
   button below just opens it in a new tab. To swap in a different
   form service (Formspree, EmailJS, etc.), replace the href on
   #openFormBtn in index.html instead of editing this block.
========================================================= */
const openFormBtn = document.getElementById("openFormBtn");
if (openFormBtn) {
  openFormBtn.addEventListener("click", () => {
    const body = document.getElementById("terminalBody");
    body.innerHTML += `<p><span class="prompt">&gt;</span> Opening contact form in a new tab...</p>`;
    body.scrollTop = body.scrollHeight;
  });
}

/* footer year */
document.getElementById("year").textContent = new Date().getFullYear();
