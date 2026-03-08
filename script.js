let allIssuesData = [];
const STATUS_STYLES = {
    open: {
        border: 'border-t-emerald-500',
        dot: 'text-emerald-500',
        bg: 'bg-emerald-50',
        icon: `<img src="/assets/Open-Status.png" class="w-4 h-4"/>`
    },
    closed: {
        border: 'border-t-purple-500', 
        dot: 'text-purple-500',
        bg: 'bg-purple-50',
        icon: `<img src="/assets/close.png" class="w-4 h-4"/>`
    },
    aperture: {
        border: 'border-t-blue-500',
        dot: 'text-blue-500',
        bg: 'bg-blue-50',
        icon: `<img src="/assets/aperture.png" class="w-4 h-4"/>`
    }
};

function handleLogin() {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;

    if (user === "admin" && pass === "admin123") {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-page').classList.remove('hidden');
        fetchAllIssues();
    } else {
        alert("Invalid credentials! Use admin / admin123");
    }
}

async function fetchAllIssues() {
    toggleLoader(true);
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const result = await res.json();
        
        if (result.success && result.data.length > 0) {
            allIssuesData = result.data;
        } else {
            generateDummyData();
        }
    } catch (err) {
        generateDummyData();
    } finally {
        setTimeout(() => {
            renderIssues(allIssuesData);
            toggleLoader(false);
        }, 500);
    }
}

function generateDummyData() {
    allIssuesData = Array.from({ length: 50 }, (_, i) => ({
        id: `LAB-${1000 + i}`,
        title: "Fix Navigation Menu On Mobile Devices",
        description: "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.",
        status: i % 3 === 2 ? "closed" : "open",
        author: "john_doe",
        priority: (i % 3 === 0) ? "high" : (i % 3 === 1 ? "medium" : "low"),
        label: i % 4 === 0 ? "BUG" : "ENHANCEMENT",
        createdAt: "2024-01-15T10:00:00.000Z"
    }));
}

function renderIssues(issues) {
    const grid = document.getElementById('issues-grid');
    document.getElementById('issue-count').innerText = `${issues.length} Issues`;
    grid.innerHTML = "";

    issues.forEach(issue => {
        const statusKey = issue.status.toLowerCase();
        const style = STATUS_STYLES[statusKey] || STATUS_STYLES.open;
        
        const priorityColors = {
            high: 'bg-rose-100 text-rose-600',
            medium: 'bg-amber-100 text-amber-600',
            low: 'bg-slate-100 text-slate-500'
        };

        const isBug = issue.label === "BUG";
        const labelHTML = isBug 
            ? `<span class="bg-rose-50 text-rose-400 text-[9px] px-2 py-1 rounded font-bold border border-rose-100">🤖 BUG</span>
               <span class="bg-amber-50 text-amber-400 text-[9px] px-2 py-1 rounded font-bold border border-amber-100">⚙️ HELP WANTED</span>`
            : `<span class="bg-emerald-50 text-emerald-500 text-[9px] px-2 py-1 rounded font-bold border border-emerald-100">✨ ENHANCEMENT</span>`;

        const card = document.createElement('div');
        card.className = `bg-white p-5 rounded-lg border border-slate-100 border-t-4 ${style.border} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full`;
        
        card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <div class="${style.dot}">
                    ${style.icon}
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded font-bold uppercase ${priorityColors[issue.priority.toLowerCase()]}">
                    ${issue.priority}
                </span>
            </div>
            <h3 class="font-bold text-slate-800 text-sm mb-2 line-clamp-2">${issue.title}</h3>
            <p class="text-xs text-slate-400 mb-4 line-clamp-2">${issue.description}</p>
            <div class="flex gap-2 mb-6">
                ${labelHTML}
            </div>
            <div class="mt-auto pt-4 border-t border-slate-50">
                <p class="text-[10px] font-medium text-slate-300">#${issue.id.slice(-4)} by <span class="text-slate-500">${issue.author}</span></p>
                <p class="text-[10px] font-bold text-slate-300">${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
        `;
        
   
    });
}

function searchIssues() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const filteredIssues = allIssuesData.filter(issue => {
        return (
            issue.title.toLowerCase().includes(query) || 
            issue.description.toLowerCase().includes(query) ||
            issue.id.toLowerCase().includes(query) ||
            issue.author.toLowerCase().includes(query)
        );
    });

    if (filteredIssues.length > 0) {
        renderIssues(filteredIssues);
    } else {
      
        document.getElementById('issues-grid').innerHTML = `
            <div class="col-span-full text-center py-20">
                <p class="text-slate-400">No issues found matching "${query}"</p>
            </div>
        `;
        document.getElementById('issue-count').innerText = "0 Issues";
    }
}


function filterIssues(status, btn) {

    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active-tab');
        b.classList.add('text-slate-400'); 
    });

    btn.classList.add('active-tab');
    btn.classList.remove('text-slate-400');

    const filtered = status === 'all' 
        ? allIssuesData 
        : allIssuesData.filter(i => i.status.toLowerCase() === status.toLowerCase());
    
    renderIssues(filtered);
}
function openModal(issue) {
    const modal = document.getElementById('issue-modal');
    document.getElementById('modal-title').innerText = issue.title;
    document.getElementById('modal-desc').innerText = issue.description;
    const statusBadge = document.getElementById('modal-status');
    statusBadge.innerText = issue.status === 'open' ? 'Opened' : 'Closed';
    statusBadge.className = `px-3 py-1 rounded-full text-xs font-bold text-white ${issue.status === 'open' ? 'bg-[#00b894]' : 'bg-[#6c5ce7]'}`;
    const formattedDate = new Date(issue.createdAt).toLocaleDateString('en-GB');
    document.getElementById('modal-meta').innerText = `• Opened by ${issue.author} • ${formattedDate}`;
    document.getElementById('modal-author').innerText = issue.author;

    const priorityBadge = document.getElementById('modal-priority');
    priorityBadge.innerText = issue.priority.toUpperCase();
  
    let pColor = 'bg-slate-400';
    if(issue.priority.toLowerCase() === 'high') pColor = 'bg-[#ff4d4d]';
    if(issue.priority.toLowerCase() === 'medium') pColor = 'bg-[#f0932b]';
    
    priorityBadge.className = `inline-block px-5 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-wider ${pColor}`;

    const labelContainer = document.getElementById('modal-labels');
    if(issue.label === "BUG") {
        labelContainer.innerHTML = `
            <span class="bg-[#fff2f2] text-[#ff4d4d] text-[10px] px-3 py-1 rounded-lg font-bold border border-[#ffcccc] flex items-center gap-1">🤖 BUG</span>
            <span class="bg-[#fff9eb] text-[#f0932b] text-[10px] px-3 py-1 rounded-lg font-bold border border-[#ffeaa7] flex items-center gap-1">⚙️ HELP WANTED</span>
        `;
    } else {
        labelContainer.innerHTML = `
            <span class="bg-[#ebfaf0] text-[#00b894] text-[10px] px-3 py-1 rounded-lg font-bold border border-[#c2f0d1] flex items-center gap-1">✨ ENHANCEMENT</span>
        `;
    }
    
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('issue-modal').classList.add('hidden');
}

function toggleLoader(show) {
    document.getElementById('loader').classList.toggle('hidden', !show);
    document.getElementById('issues-grid').classList.toggle('hidden', show);
}