// UI切り替え
const dashboardBtn = document.getElementById("dashboard-btn");
const chatBtn = document.getElementById("chat-btn");
const networkBtn = document.getElementById("network-btn");
const sections = document.querySelectorAll("main > section");

function switchUI(buttonId) {
  const buttons = [dashboardBtn, chatBtn, networkBtn];
  buttons.forEach((btn) => btn.classList.remove("active"));
  document.getElementById(buttonId).classList.add("active");

  sections.forEach((section) => section.classList.remove("active"));
  const activeSection = buttonId.split("-")[0];
  document.getElementById(activeSection).classList.add("active");
}

dashboardBtn.addEventListener("click", () => switchUI("dashboard-btn"));
chatBtn.addEventListener("click", () => switchUI("chat-btn"));
networkBtn.addEventListener("click", () => switchUI("network-btn"));

// 感情トラッカー
const emotionButtons = document.querySelectorAll(".emotion");
let currentEmotion = 3;

emotionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentEmotion = parseInt(button.dataset.value);
    updateEmotionUI();
  });
});

function updateEmotionUI() {
  emotionButtons.forEach((button) => {
    const value = parseInt(button.dataset.value);
    button.style.opacity = value <= currentEmotion ? "1" : "0.3";
  });
}

updateEmotionUI();

// 簡易AI洞察
const diaryText = document.getElementById("diary-text");
const aiInsightText = document.getElementById("ai-insight-text");

diaryText.addEventListener("input", () => {
  if (diaryText.value.length > 10) {
    setTimeout(() => {
      aiInsightText.textContent = generateSimpleInsight(diaryText.value);
    }, 1000);
  }
});

function generateSimpleInsight(text) {
  const insights = [
    "あなたの思考には深い洞察が含まれています。",
    "最近、音楽が気分に良い影響を与えているようです。",
    "仕事に関する考察が増えています。新しい方向性を模索中でしょうか？",
    "自己改善への意欲が感じられます。具体的な行動計画を立ててみてはいかがでしょうか。",
    "定期的な振り返りが習慣化されつつあります。素晴らしい傾向です。",
  ];
  return insights[Math.floor(Math.random() * insights.length)];
}

// チャット機能
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendMessage = document.getElementById("send-message");

sendMessage.addEventListener("click", () => {
  if (userInput.value.trim() !== "") {
    addMessage("user", userInput.value);
    setTimeout(() => {
      addMessage("ai", generateAIResponse(userInput.value));
    }, 1000);
    userInput.value = "";
  }
});

function addMessage(sender, message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
  const responses = [
    "なるほど、興味深い視点ですね。もう少し詳しく教えていただけますか？",
    "その考えは、あなたの長期的な目標とどのように関連していますか？",
    "そのアイデアを実現するために、具体的にどのような行動を取れそうですか？",
    "その経験から学んだことは、今後どのように活かせそうですか？",
    "その感情の根源には、どのような思考や経験があるのでしょうか？",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// ネットワーク図（簡易版）
const networkContainer = document.getElementById("network-container");
const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");
const filterSelect = document.getElementById("filter-select");

let networkScale = 1;

function createSimpleNetwork() {
  const svg = d3
    .select("#network-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");

  const nodes = [
    { id: "思考", group: 1 },
    { id: "感情", group: 2 },
    { id: "行動", group: 3 },
    { id: "音楽", group: 4 },
    { id: "仕事", group: 5 },
  ];

  const links = [
    { source: "思考", target: "感情" },
    { source: "感情", target: "行動" },
    { source: "音楽", target: "感情" },
    { source: "仕事", target: "思考" },
    { source: "行動", target: "仕事" },
  ];

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(200, 200));

  const link = svg
    .append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6);

  const node = svg
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", (d) => d3.schemeCategory10[d.group]);

  node.append("title").text((d) => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });
}

createSimpleNetwork();

zoomIn.addEventListener("click", () => {
  networkScale *= 1.2;
  updateNetworkScale();
});

zoomOut.addEventListener("click", () => {
  networkScale *= 0.8;
  updateNetworkScale();
});

function updateNetworkScale() {
  d3.select("#network-container svg").attr(
    "transform",
    `scale(${networkScale})`
  );
}

filterSelect.addEventListener("change", (event) => {
  console.log(`Filter changed to: ${event.target.value}`);
  // ここで実際のフィルタリングロジックを実装します
});

// 初期表示
switchUI("dashboard-btn");
