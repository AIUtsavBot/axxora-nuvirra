const companies = [
  {
    id: "nuvirra",
    name: "Nuvirra",
    summary:
      "Nuvirra is positioned here as a modern utensil and cookware own-brand. The dashboard brings website inquiries, WhatsApp shopping help, Instagram content conversations, email support, and marketplace follow-ups into one shared brand view.",
    health: "91% response continuity",
    stats: [
      { label: "Unified users", value: "186", delta: "+17 this week" },
      { label: "Messages synced", value: "2,914", delta: "Content and support traffic both rising" },
      { label: "Platforms live", value: "5", delta: "Website, WhatsApp, Instagram, Email, Marketplace" },
      { label: "Open escalations", value: "11", delta: "Mostly product-fit and tracking questions" }
    ],
    context: [
      {
        title: "Brand tone",
        detail: "Friendly, modern, engaging, and slightly premium. Responses should help home cooks and families feel confident about product choice."
      },
      {
        title: "Core catalog",
        detail: "Kitchen utensils, cookware, and daily-use kitchen products. Customers often ask for comparisons, use cases, and care guidance before buying."
      },
      {
        title: "Agent workflow",
        detail: "Questions route across content creation, product discovery, order creation, order tracking, and customer support. Product information is expected to stay consistent across channels."
      }
    ],
    priorities: [
      { title: "Keep product details consistent between Instagram content and website listings", level: "High" },
      { title: "Reduce repeat delivery-status questions on WhatsApp and email", level: "Medium" },
      { title: "Turn browsing users into order-ready leads with clearer cookware recommendations", level: "Low" }
    ],
    users: [
      {
        id: "ananya",
        name: "Ananya Rao",
        value: "High intent",
        intent: "Cookware comparison before purchase",
        journey: "Choosing first premium set",
        lastSeen: "18 Apr, 11:20 AM",
        note: "Ananya discovered Nuvirra on Instagram, checked the website, and moved to WhatsApp for product advice. The team should keep recommendations aligned and avoid repeating the same comparison points.",
        tags: ["Cookware", "Lead", "Instagram source", "Needs recommendation"],
        platforms: {
          Website: [
            { side: "inbound", time: "2026-04-18T09:08:00", displayTime: "18 Apr, 09:08 AM", author: "Ananya", text: "I am comparing your everyday cookware options. Which one is best for daily Indian cooking?" },
            { side: "outbound", time: "2026-04-18T09:14:00", displayTime: "18 Apr, 09:14 AM", author: "Nuvirra Bot", text: "I can help you compare by usage, family size, and stove type. I have saved your query for follow-up." }
          ],
          WhatsApp: [
            { side: "inbound", time: "2026-04-18T10:02:00", displayTime: "18 Apr, 10:02 AM", author: "Ananya", text: "I saw your cookware reel. Which product would you suggest for someone setting up a new kitchen?" },
            { side: "outbound", time: "2026-04-18T10:10:00", displayTime: "18 Apr, 10:10 AM", author: "Sales Desk", text: "For a new kitchen, we usually recommend a starter combination built around everyday cookware and essential utensils. I am sending the most practical options first." }
          ],
          Instagram: [
            { side: "inbound", time: "2026-04-17T20:41:00", displayTime: "17 Apr, 08:41 PM", author: "Ananya", text: "Loved the aesthetic of your cookware post. Is it made for regular home cooking or more for display?" },
            { side: "outbound", time: "2026-04-17T20:46:00", displayTime: "17 Apr, 08:46 PM", author: "Social Team", text: "It is designed for daily use while still looking premium on the counter. We can guide you to the right products based on your cooking style." }
          ],
          Email: [],
          Marketplace: []
        }
      },
      {
        id: "rahul",
        name: "Rahul Mehta",
        value: "Order-ready",
        intent: "Order creation and bundle clarification",
        journey: "Ready to buy after product Q&A",
        lastSeen: "18 Apr, 09:50 AM",
        note: "Rahul has moved from product discovery into purchase mode. The order flow should collect complete details once and then hand off cleanly for order creation.",
        tags: ["Order", "Bundle buyer", "WhatsApp assist"],
        platforms: {
          Website: [
            { side: "inbound", time: "2026-04-18T08:34:00", displayTime: "18 Apr, 08:34 AM", author: "Rahul", text: "Do you have a cookware and utensil combination that works for a family of four?" }
          ],
          WhatsApp: [
            { side: "inbound", time: "2026-04-18T09:22:00", displayTime: "18 Apr, 09:22 AM", author: "Rahul", text: "I want to place an order today. What details do you need from me to create it correctly?" },
            { side: "outbound", time: "2026-04-18T09:28:00", displayTime: "18 Apr, 09:28 AM", author: "Order Desk", text: "We will collect product choice, quantity, phone number, email, and delivery details first so your order can be created without back-and-forth." },
            { side: "outbound", time: "2026-04-18T09:50:00", displayTime: "18 Apr, 09:50 AM", author: "Order Desk", text: "Your request is marked order-ready once all required information is confirmed in one thread." }
          ],
          Instagram: [],
          Email: [],
          Marketplace: []
        }
      },
      {
        id: "megha",
        name: "Megha Sinha",
        value: "Repeat customer",
        intent: "Order tracking and support",
        journey: "Post-purchase follow-up",
        lastSeen: "17 Apr, 07:45 PM",
        note: "Megha is asking for tracking updates across channels. Support should use any available email, phone number, or username to resolve status quickly without forcing her to repeat herself.",
        tags: ["Tracking", "Support", "Repeat buyer", "Needs closure"],
        platforms: {
          Website: [],
          WhatsApp: [
            { side: "inbound", time: "2026-04-17T18:52:00", displayTime: "17 Apr, 06:52 PM", author: "Megha", text: "Can you check the status of my Nuvirra order using my phone number? I have not received an update today." },
            { side: "outbound", time: "2026-04-17T18:58:00", displayTime: "17 Apr, 06:58 PM", author: "Support Desk", text: "Yes, we can track using phone number, email, or username. I am checking the latest status now." }
          ],
          Instagram: [],
          Email: [
            { side: "inbound", time: "2026-04-17T19:45:00", displayTime: "17 Apr, 07:45 PM", author: "Megha", text: "Following up here as well. Please confirm if the shipment has moved from processing to dispatch." }
          ],
          Marketplace: [
            { side: "outbound", time: "2026-04-17T07:20:00", displayTime: "17 Apr, 07:20 AM", author: "Marketplace Ops", text: "We received the tracking request and have linked it to your existing Nuvirra support thread." }
          ]
        }
      },
      {
        id: "vivaan",
        name: "Vivaan Kapoor",
        value: "Content lead",
        intent: "Product-led content inquiry",
        journey: "Content to commerce path",
        lastSeen: "18 Apr, 12:05 PM",
        note: "Vivaan engages mainly through content. This is a good example of how Nuvirra's content-creation workflow should still connect into product and commerce conversations.",
        tags: ["Content", "Instagram", "Awareness", "Potential conversion"],
        platforms: {
          Website: [],
          WhatsApp: [],
          Instagram: [
            { side: "inbound", time: "2026-04-18T11:44:00", displayTime: "18 Apr, 11:44 AM", author: "Vivaan", text: "Can you share more posts around modern kitchen setups using your utensils and cookware?" },
            { side: "outbound", time: "2026-04-18T12:05:00", displayTime: "18 Apr, 12:05 PM", author: "Content Team", text: "Absolutely. We create post ideas, hooks, captions, and image prompts around daily-use kitchen products and premium modern setups." }
          ],
          Email: [],
          Marketplace: []
        }
      }
    ]
  }
];

const state = {
  activeCompanyId: companies[0].id,
  activeUserId: companies[0].users[0].id,
  platformFilter: "All",
  search: ""
};

const companyName = document.getElementById("companyName");
const companySummary = document.getElementById("companySummary");
const companyHealth = document.getElementById("companyHealth");
const companyList = document.getElementById("companyList");
const statsGrid = document.getElementById("statsGrid");
const contextList = document.getElementById("contextList");
const priorityList = document.getElementById("priorityList");
const platformFilters = document.getElementById("platformFilters");
const userList = document.getElementById("userList");
const activeUserName = document.getElementById("activeUserName");
const activeUserValue = document.getElementById("activeUserValue");
const activeUserIntent = document.getElementById("activeUserIntent");
const activeUserJourney = document.getElementById("activeUserJourney");
const activeUserLastSeen = document.getElementById("activeUserLastSeen");
const activeUserNote = document.getElementById("activeUserNote");
const tagList = document.getElementById("tagList");
const timeline = document.getElementById("timeline");
const platformBoards = document.getElementById("platformBoards");
const userSearch = document.getElementById("userSearch");

const priorityClassMap = {
  High: "high",
  Medium: "medium",
  Low: "low"
};

function getActiveCompany() {
  return companies.find((company) => company.id === state.activeCompanyId);
}

function getAllPlatforms(company) {
  const platformSet = new Set();
  company.users.forEach((user) => {
    Object.keys(user.platforms).forEach((platform) => platformSet.add(platform));
  });
  return Array.from(platformSet);
}

function getVisibleUsers(company) {
  return company.users.filter((user) => {
    const haystack = `${user.name} ${user.intent} ${user.journey} ${user.note} ${user.tags.join(" ")}`.toLowerCase();
    const matchesSearch = !state.search || haystack.includes(state.search.toLowerCase());
    const matchesPlatform =
      state.platformFilter === "All" ||
      (user.platforms[state.platformFilter] && user.platforms[state.platformFilter].length > 0);

    return matchesSearch && matchesPlatform;
  });
}

function getActiveUser(company) {
  const users = getVisibleUsers(company);
  const activeFromVisible = users.find((user) => user.id === state.activeUserId);
  return activeFromVisible || users[0] || company.users[0];
}

function getTimelineEntries(user) {
  return Object.entries(user.platforms)
    .flatMap(([platform, messages]) =>
      messages.map((message) => ({
        ...message,
        platform
      }))
    )
    .sort((a, b) => new Date(b.time) - new Date(a.time));
}

function renderCompanies() {
  companyList.innerHTML = "";

  companies.forEach((company) => {
    const button = document.createElement("button");
    button.className = `company-button${company.id === state.activeCompanyId ? " active" : ""}`;
    button.innerHTML = `
      <strong>${company.name}</strong>
      <span>${company.summary.slice(0, 92)}...</span>
      <small>${company.health}</small>
    `;
    button.addEventListener("click", () => {
      state.activeCompanyId = company.id;
      state.activeUserId = company.users[0].id;
      state.platformFilter = "All";
      state.search = "";
      userSearch.value = "";
      render();
    });
    companyList.appendChild(button);
  });
}

function renderCompanyOverview(company) {
  companyName.textContent = company.name;
  companySummary.textContent = company.summary;
  companyHealth.textContent = company.health;

  statsGrid.innerHTML = company.stats
    .map(
      (item) => `
        <article class="stat-card">
          <p class="eyebrow">${item.label}</p>
          <div class="metric">${item.value}</div>
          <div class="delta">${item.delta}</div>
        </article>
      `
    )
    .join("");

  contextList.innerHTML = company.context
    .map(
      (item) => `
        <article class="context-card">
          <strong>${item.title}</strong>
          <p>${item.detail}</p>
        </article>
      `
    )
    .join("");

  priorityList.innerHTML = company.priorities
    .map(
      (item) => `
        <article class="priority-card">
          <div>
            <strong>${item.title}</strong>
            <p>Visible to all teams handling this company</p>
          </div>
          <span class="priority-level ${priorityClassMap[item.level]}">${item.level}</span>
        </article>
      `
    )
    .join("");
}

function renderPlatformFilters(company) {
  const platforms = ["All", ...getAllPlatforms(company)];

  platformFilters.innerHTML = "";
  platforms.forEach((platform) => {
    const button = document.createElement("button");
    button.className = `filter-chip${platform === state.platformFilter ? " active" : ""}`;
    button.textContent = platform;
    button.addEventListener("click", () => {
      state.platformFilter = platform;
      render();
    });
    platformFilters.appendChild(button);
  });
}

function renderUsers(company) {
  const users = getVisibleUsers(company);
  const activeUser = getActiveUser(company);

  if (activeUser) {
    state.activeUserId = activeUser.id;
  }

  if (!users.length) {
    userList.innerHTML = `
      <div class="empty-state">
        No users match the current search or platform filter.
      </div>
    `;
    return;
  }

  userList.innerHTML = "";

  users.forEach((user) => {
    const availablePlatforms = Object.entries(user.platforms)
      .filter(([, messages]) => messages.length > 0)
      .map(([platform]) => platform);

    const button = document.createElement("button");
    button.className = `user-card${user.id === state.activeUserId ? " active" : ""}`;
    button.innerHTML = `
      <div class="user-card-header">
        <div>
          <strong>${user.name}</strong>
          <p>${user.intent}</p>
        </div>
        <span class="value-pill">${user.value}</span>
      </div>
      <div class="user-card-footer">
        <small>${user.lastSeen}</small>
        <small>${availablePlatforms.join(" • ")}</small>
      </div>
    `;
    button.addEventListener("click", () => {
      state.activeUserId = user.id;
      render();
    });
    userList.appendChild(button);
  });
}

function renderActiveUser(company) {
  const user = getActiveUser(company);
  if (!user) {
    return;
  }

  activeUserName.textContent = user.name;
  activeUserValue.textContent = user.value;
  activeUserIntent.textContent = user.intent;
  activeUserJourney.textContent = user.journey;
  activeUserLastSeen.textContent = user.lastSeen;
  activeUserNote.textContent = user.note;

  tagList.innerHTML = user.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");

  const entries = getTimelineEntries(user);
  timeline.innerHTML = entries
    .map(
      (entry) => `
        <article class="timeline-card">
          <div class="message-row">
            <strong>${entry.platform}</strong>
            <span>${entry.displayTime}</span>
          </div>
          <p><strong>${entry.author}</strong></p>
          <p>${entry.text}</p>
        </article>
      `
    )
    .join("");

  const boards = getAllPlatforms(company)
    .map((platform) => {
      const messages = user.platforms[platform] || [];

      if (!messages.length) {
        return `
          <article class="board">
            <div class="board-header">
              <div>
                <h4>${platform}</h4>
                <span class="channel-pill">No live thread</span>
              </div>
            </div>
            <div class="empty-state">No messages for this user on ${platform} yet.</div>
          </article>
        `;
      }

      const cards = messages
        .map(
          (message) => `
            <article class="message-card ${message.side}">
              <div class="message-row">
                <strong>${message.author}</strong>
                <span>${message.displayTime}</span>
              </div>
              <p class="message">${message.text}</p>
            </article>
          `
        )
        .join("");

      return `
        <article class="board">
          <div class="board-header">
            <div>
              <h4>${platform}</h4>
              <span class="channel-pill">${messages.length} messages</span>
            </div>
          </div>
          <div class="message-stack">${cards}</div>
        </article>
      `;
    })
    .join("");

  platformBoards.innerHTML = boards;
}

function render() {
  const company = getActiveCompany();
  renderCompanies();
  renderCompanyOverview(company);
  renderPlatformFilters(company);
  renderUsers(company);
  renderActiveUser(company);
}

userSearch.addEventListener("input", (event) => {
  state.search = event.target.value.trim();
  render();
});

render();
