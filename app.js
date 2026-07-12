const CONFIG = {
  apiUrl: "https://bdqv64boid.execute-api.us-east-1.amazonaws.com/analyze"
};

const exampleTasks = [
  "Production server is down",
  "Submit tax return due today",
  "Prepare next month's budget",
  "Start AWS certification study plan",
  "Book a haircut for the weekend",
  "Answer non-urgent incoming phone calls",
  "Watch a random YouTube video",
  "Schedule a dentist appointment"
];

const quadrantConfig = {
  do_now: { title: "Urgent & important", action: "Do now" },
  schedule: { title: "Important, not urgent", action: "Schedule" },
  delegate: { title: "Urgent, less important", action: "Delegate" },
  eliminate: { title: "Not urgent or important", action: "Reconsider" }
};

const form = document.querySelector("#priority-form");
const tasksInput = document.querySelector("#tasks");
const taskCount = document.querySelector("#task-count");
const loadExampleButton = document.querySelector("#load-example");
const analyzeButton = document.querySelector("#analyze-button");
const formMessage = document.querySelector("#form-message");
const resultsPanel = document.querySelector("#results");
const resultsTemplate = document.querySelector("#results-template");

function getTasks() {
  return tasksInput.value
    .split("\n")
    .map((task) => task.trim())
    .filter(Boolean);
}

function updateTaskCount() {
  const count = getTasks().length;
  taskCount.textContent = `${count} ${count === 1 ? "task" : "tasks"}`;
}

function setLoading(isLoading) {
  analyzeButton.disabled = isLoading;
  analyzeButton.classList.toggle("loading", isLoading);
  analyzeButton.querySelector(".button-label").textContent =
    isLoading ? "Analyzing priorities..." : "Analyze my priorities";
}

function validate(tasks) {
  if (tasks.length === 0) {
    return "Add at least one task.";
  }

  if (tasks.length > 8) {
    return "Use a maximum of 8 tasks.";
  }

  return "";
}

async function requestAnalysis(payload) {
  if (!CONFIG.apiUrl) {
    return createDemoAnalysis(payload);
  }

  const response = await fetch(CONFIG.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = "The analysis service returned an error.";

    try {
      const errorPayload = await response.json();
      message = errorPayload.error || message;
    } catch {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }

    throw new Error(message);
  }

  return response.json();
}

function createDemoAnalysis({ tasks, availableHours }) {
  const demoRules = [
    {
      test: /report|tomorrow|deadline|due/i,
      urgency: 10,
      importance: 9,
      quadrant: "do_now",
      reason: "It has a clear and immediate deadline.",
      minutes: 90
    },
    {
      test: /message|email|reply/i,
      urgency: 7,
      importance: 6,
      quadrant: "delegate",
      reason: "It may need a prompt response, but it should not interrupt the highest-impact work.",
      minutes: 20
    },
    {
      test: /youtube|video|record/i,
      urgency: 5,
      importance: 8,
      quadrant: "schedule",
      reason: "It supports a meaningful goal and benefits from a dedicated time block.",
      minutes: 75
    },
    {
      test: /grocer|supermarket|shopping/i,
      urgency: 6,
      importance: 6,
      quadrant: "schedule",
      reason: "It is necessary for the week but can be planned around critical work.",
      minutes: 45
    },
    {
      test: /dentist|doctor|medical/i,
      urgency: 4,
      importance: 8,
      quadrant: "schedule",
      reason: "Health is important, and scheduling the appointment takes little time.",
      minutes: 10
    },
    {
      test: /hair|salon|barber/i,
      urgency: 2,
      importance: 3,
      quadrant: "eliminate",
      reason: "No immediate deadline or high-impact consequence was provided.",
      minutes: 10
    }
  ];

  const analyzedTasks = tasks.map((name, index) => {
    const rule = demoRules.find((item) => item.test.test(name)) || {
      urgency: 5,
      importance: 5,
      quadrant: "schedule",
      reason: "More context would improve the classification.",
      minutes: 30
    };

    return {
      id: index + 1,
      name,
      urgencyScore: rule.urgency,
      importanceScore: rule.importance,
      quadrant: rule.quadrant,
      reason: rule.reason,
      estimatedMinutes: rule.minutes
    };
  });

  analyzedTasks.sort((a, b) => {
    const quadrantWeight = { do_now: 4, delegate: 3, schedule: 2, eliminate: 1 };
    return (
      quadrantWeight[b.quadrant] - quadrantWeight[a.quadrant] ||
      b.urgencyScore + b.importanceScore - (a.urgencyScore + a.importanceScore)
    );
  });

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        summary:
          `Start with the deadline-driven task, then clear short urgent items. ` +
          `Reserve focused time for important scheduled work within your ${availableHours}-hour window.`,
        tasks: analyzedTasks,
        recommendedOrder: analyzedTasks.map((task, index) => ({
          order: index + 1,
          task: task.name,
          estimatedMinutes: task.estimatedMinutes
        })),
        mode: "demo"
      });
    }, 850);
  });
}

function renderResults(data, availableHours) {
  const fragment = resultsTemplate.content.cloneNode(true);
  const matrix = fragment.querySelector("#matrix");
  const executionList = fragment.querySelector("#execution-list");

  fragment.querySelector("#ai-summary").textContent = data.summary;
  fragment.querySelector("#available-time-label").textContent =
    `${availableHours} ${Number(availableHours) === 1 ? "hour" : "hours"} available`;

  Object.entries(quadrantConfig).forEach(([key, config]) => {
    const quadrant = document.createElement("section");
    quadrant.className = "quadrant";
    quadrant.dataset.quadrant = key;

    const matchingTasks = data.tasks.filter((task) => task.quadrant === key);

    quadrant.innerHTML = `
      <div class="quadrant-header">
        <span class="quadrant-title">${escapeHtml(config.title)}</span>
        <span class="quadrant-action">${escapeHtml(config.action)}</span>
      </div>
    `;

    if (matchingTasks.length === 0) {
      const empty = document.createElement("p");
      empty.className = "quadrant-empty";
      empty.textContent = "No tasks in this quadrant.";
      quadrant.appendChild(empty);
    } else {
      matchingTasks.forEach((task) => {
        const card = document.createElement("article");
        card.className = "task-card";
        card.innerHTML = `
          <div class="task-name">${escapeHtml(task.name)}</div>
          <div class="task-scores">
            <span>Urgency ${task.urgencyScore}/10</span>
            <span>Importance ${task.importanceScore}/10</span>
          </div>
          <p class="task-reason">${escapeHtml(task.reason)}</p>
        `;
        quadrant.appendChild(card);
      });
    }

    matrix.appendChild(quadrant);
  });

  data.recommendedOrder.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span class="execution-task">${escapeHtml(item.task)}</span>
      <span class="execution-duration">${item.estimatedMinutes} min</span>
    `;
    executionList.appendChild(listItem);
  });

  resultsPanel.replaceChildren(fragment);

  const copyButton = resultsPanel.querySelector("#copy-results");
  copyButton.addEventListener("click", async () => {
    const text = buildCopyText(data);
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Copied";
    window.setTimeout(() => {
      copyButton.textContent = "Copy plan";
    }, 1600);
  });

  if (data.mode === "demo") {
    formMessage.textContent =
      "Demo mode is active. Add your Lambda Function URL in app.js to use Amazon Bedrock.";
  } else {
    formMessage.textContent = "";
  }
}

function buildCopyText(data) {
  const lines = ["Priority Compass AI", "", data.summary, "", "Recommended order:"];

  data.recommendedOrder.forEach((item) => {
    lines.push(`${item.order}. ${item.task} (${item.estimatedMinutes} min)`);
  });

  return lines.join("\n");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

tasksInput.addEventListener("input", updateTaskCount);

loadExampleButton.addEventListener("click", () => {
  tasksInput.value = exampleTasks.join("\n");
  updateTaskCount();
  tasksInput.focus();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const tasks = getTasks();
  const validationMessage = validate(tasks);
  formMessage.textContent = validationMessage;

  if (validationMessage) {
    return;
  }

  const availableHours = document.querySelector("#available-hours").value;
  const mainGoal = document.querySelector("#main-goal").value.trim();

  setLoading(true);

  try {
    const data = await requestAnalysis({
      tasks,
      availableHours: Number(availableHours),
      mainGoal
    });

    renderResults(data, availableHours);
  } catch (error) {
    console.error(error);
    formMessage.textContent =
      error.message || "We could not analyze the tasks. Please try again.";
  } finally {
    setLoading(false);
  }
});

updateTaskCount();
