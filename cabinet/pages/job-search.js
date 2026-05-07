// ========== ДАНІ ==========
let currentUser = null;
let jobs = [];
let filteredJobs = [];
let savedJobs = [];
let currentPage = 1;
const itemsPerPage = 8;
let currentStep = 1;

const defaultJobs = [
    { id: 1, title: "Frontend Developer", company: "TechInnovate", salary: "45 000 - 60 000 грн", location: "Київ", experience: "2-3 роки", employment: "Повна", description: "Розробка на React", date: "2 год тому", category: "it", isSaved: false },
    { id: 2, title: "Sales Manager", company: "GlobalTrade", salary: "35 000 - 50 000 грн", location: "Одеса", experience: "1-3 роки", employment: "Повна", description: "Активні продажі", date: "5 год тому", category: "sales", isSaved: false },
    { id: 3, title: "HR Generalist", company: "PeopleFirst", salary: "30 000 - 40 000 грн", location: "Львів", experience: "2 роки", employment: "Повна", description: "Підбір персоналу", date: "вчора", category: "admin", isSaved: false },
    { id: 4, title: "UI/UX Designer", company: "CreativeLab", salary: "40 000 - 55 000 грн", location: "Віддалено", experience: "2-4 роки", employment: "Віддалена", description: "Дизайн інтерфейсів", date: "2 дні тому", category: "it", isSaved: false },
    { id: 5, title: "Java Developer", company: "SoftServe", salary: "50 000 - 70 000 грн", location: "Дніпро", experience: "3+ роки", employment: "Повна", description: "Розробка на Spring", date: "3 дні тому", category: "it", isSaved: false }
];

function initJobSearch() {
    loadUser();
    loadJobs();
    loadCandidateData();
    renderJobs();
    setupFilters();
    document.getElementById('jobsTotalCount').innerHTML = `${jobs.length} вакансій по всій Україні`;
}

function loadUser() {
    const saved = localStorage.getItem('fastik_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        document.getElementById('candidateName').textContent = currentUser.name || 'Владислав Тараненко';
        document.getElementById('candidateAvatar').textContent = (currentUser.name?.charAt(0) || 'В');
    }
}

function loadJobs() {
    const saved = localStorage.getItem('fastik_jobs');
    if (saved) jobs = JSON.parse(saved);
    else { jobs = defaultJobs; saveJobs(); }
    filteredJobs = [...jobs];
}

function saveJobs() { localStorage.setItem('fastik_jobs', JSON.stringify(jobs)); }

function loadCandidateData() {
    const saved = localStorage.getItem('fastik_candidate');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('candidateTitle').textContent = data.title || 'Junior Frontend Developer';
        document.getElementById('candidateLocation').innerHTML = `📍 ${data.city || 'Київ'}, ${data.relocation === 'yes' ? 'готовий до переїзду' : ''}`;
        document.getElementById('jobViewsCount').textContent = data.views || 42;
        document.getElementById('invitesCount').textContent = data.invites || 8;
    }
    const savedAlerts = localStorage.getItem('fastik_job_alerts');
    if (savedAlerts) renderAlerts(JSON.parse(savedAlerts));
}

function renderAlerts(alerts) {
    const container = document.getElementById('jobAlertsList');
    if (!container) return;
    if (!alerts || alerts.length === 0) { container.innerHTML = '<div class="alert-item">Немає підписок</div>'; return; }
    container.innerHTML = alerts.map(a => `<div class="alert-item"><span>${a.category} • ${a.city}</span><button onclick="removeAlert(${a.id})">✖</button></div>`).join('');
}

function removeAlert(id) { let a = JSON.parse(localStorage.getItem('fastik_job_alerts')||'[]'); a = a.filter(al=>al.id!==id); localStorage.setItem('fastik_job_alerts',JSON.stringify(a)); renderAlerts(a); }

function searchJobs() { applyFilters(); }
function filterJobs() { applyFilters(); }

function applyFilters() {
    let result = [...jobs];
    const query = document.getElementById('jobSearchInput').value.toLowerCase();
    if (query) result = result.filter(j => j.title.toLowerCase().includes(query) || j.company.toLowerCase().includes(query));
    const loc = document.getElementById('jobLocationInput').value.toLowerCase();
    if (loc) result = result.filter(j => j.location.toLowerCase().includes(loc));
    const cat = document.getElementById('jobCategoryFilter').value;
    if (cat !== 'all') result = result.filter(j => j.category === cat);
    const sal = document.getElementById('jobSalaryFilter').value;
    if (sal !== 'all') {
        if (sal === '0-15000') result = result.filter(j => parseInt(j.salary) < 15000);
        else if (sal === '15000-25000') result = result.filter(j => parseInt(j.salary) >= 15000 && parseInt(j.salary) <= 25000);
        else if (sal === '25000-40000') result = result.filter(j => parseInt(j.salary) >= 25000 && parseInt(j.salary) <= 40000);
        else if (sal === '40000+') result = result.filter(j => parseInt(j.salary) >= 40000);
    }
    const exp = document.getElementById('jobExperienceFilter').value;
    if (exp !== 'all') result = result.filter(j => j.experience.includes(exp === 'no' ? '0' : exp === '1-3' ? '1' : exp === '3-5' ? '3' : '5'));
    filteredJobs = result;
    currentPage = 1;
    renderJobs();
}

function sortAndRenderJobs() {
    const sort = document.getElementById('sortJobs').value;
    if (sort === 'salary-desc') filteredJobs.sort((a,b)=>parseInt(b.salary)-parseInt(a.salary));
    else if (sort === 'salary-asc') filteredJobs.sort((a,b)=>parseInt(a.salary)-parseInt(b.salary));
    else filteredJobs.sort((a,b)=>b.id-a.id);
    renderJobs();
}

function renderJobs() {
    const container = document.getElementById('jobsList');
    const start = (currentPage-1)*itemsPerPage;
    const paginated = filteredJobs.slice(start, start+itemsPerPage);
    document.getElementById('jobsCount').innerHTML = `Знайдено ${filteredJobs.length} вакансій`;
    if (paginated.length === 0) { container.innerHTML = '<div class="empty-state">😕 Вакансій не знайдено</div>'; document.getElementById('jobsPagination').innerHTML = ''; return; }
    container.innerHTML = paginated.map(job => `
        <div class="job-card">
            <div class="job-header-info"><div><div class="job-title">${job.title}</div><div class="job-company">🏢 ${job.company}</div></div><div class="job-salary">💰 ${job.salary}</div></div>
            <div class="job-details"><span class="job-detail">📍 ${job.location}</span><span class="job-detail">📅 ${job.experience}</span><span class="job-detail">⏰ ${job.employment}</span></div>
            <div class="job-description">${job.description.substring(0,100)}...</div>
            <div class="job-footer"><div class="job-date">🕐 ${job.date}</div><div class="job-actions"><button class="save-job-btn" onclick="toggleSaveJob(${job.id})">${job.isSaved ? '❤️' : '🤍'}</button><button class="apply-btn" onclick="applyForJob(${job.id})">Відгукнутися</button></div></div>
        </div>
    `).join('');
    const total = Math.ceil(filteredJobs.length/itemsPerPage);
    let p = ''; for(let i=1;i<=total;i++) p += `<button class="${i===currentPage?'active':''}" onclick="goToPage(${i})">${i}</button>`;
    document.getElementById('jobsPagination').innerHTML = p;
}

function goToPage(p) { currentPage = p; renderJobs(); window.scrollTo({top:0}); }
function toggleSaveJob(id) { const j = jobs.find(j=>j.id===id); if(j){ j.isSaved=!j.isSaved; saveJobs(); renderJobs(); showToast(j.isSaved?'Збережено':'Видалено'); } }
function applyForJob(id) { showToast('Відгук надіслано!'); }
function showToast(msg) { const t = document.createElement('div'); t.style.cssText='position:fixed;bottom:20px;right:20px;background:#002f34;color:#fff;padding:10px 20px;border-radius:8px;z-index:9999'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2000); }

function setupFilters() {
    const inp = document.getElementById('jobSearchInput');
    if(inp) inp.addEventListener('keypress',e=>{if(e.key==='Enter')searchJobs();});
    const loc = document.getElementById('jobLocationInput');
    if(loc) loc.addEventListener('keypress',e=>{if(e.key==='Enter')searchJobs();});
}

function openResumeModal() { document.getElementById('resumeModal').style.display='flex'; currentStep=1; updateSteps(); }
function updateSteps() {
    for(let i=1;i<=4;i++){ const s=document.querySelector(`.step[data-step="${i}"]`); const c=document.getElementById(`resumeStep${i}`); if(s) i===currentStep?s.classList.add('active'):s.classList.remove('active'); if(c) i===currentStep?c.classList.add('active'):c.classList.remove('active'); }
    const p=document.getElementById('prevBtn'), n=document.getElementById('nextBtn'), s=document.getElementById('submitBtn');
    if(currentStep===1){ p.style.display='none'; n.style.display='inline-block'; s.style.display='none'; }
    else if(currentStep===4){ p.style.display='inline-block'; n.style.display='none'; s.style.display='inline-block'; }
    else{ p.style.display='inline-block'; n.style.display='inline-block'; s.style.display='none'; }
}
function nextStep(){ if(currentStep<4){ currentStep++; updateSteps(); } }
function prevStep(){ if(currentStep>1){ currentStep--; updateSteps(); } }
function addExperience(){ const d=document.getElementById('experienceList'); const div=document.createElement('div'); div.className='experience-item'; div.innerHTML='<button class="remove-item" onclick="this.parentElement.remove()">✖</button><input type="text" placeholder="Компанія" class="form-input" style="margin-bottom:8px"><input type="text" placeholder="Посада" class="form-input" style="margin-bottom:8px"><div style="display:flex;gap:8px"><input type="text" placeholder="Рік початку"><input type="text" placeholder="Рік закінчення"></div>'; d.appendChild(div); }
function addEducation(){ const d=document.getElementById('educationList'); const div=document.createElement('div'); div.className='education-item'; div.innerHTML='<button class="remove-item" onclick="this.parentElement.remove()">✖</button><input type="text" placeholder="Заклад" class="form-input" style="margin-bottom:8px"><input type="text" placeholder="Спеціальність" class="form-input" style="margin-bottom:8px"><input type="text" placeholder="Рік" class="form-input">'; d.appendChild(div); }
function addLanguage(){ const d=document.getElementById('languagesList'); const div=document.createElement('div'); div.className='language-item'; div.innerHTML='<input type="text" placeholder="Мова" value="Англійська"><select><option>Рідна</option><option>Вільно</option><option>Середній</option></select><button class="remove-item" onclick="this.parentElement.remove()">✖</button>'; d.appendChild(div); }

function saveResume() {
    const resume = { title: document.getElementById('resumeTitle').value, city: document.getElementById('resumeCity').value, relocation: document.getElementById('resumeRelocation').value, salary: document.getElementById('resumeSalary').value, employment: document.getElementById('resumeEmployment').value, about: document.getElementById('resumeAbout').value, views: 42, invites: 8 };
    localStorage.setItem('fastik_candidate', JSON.stringify(resume));
    document.getElementById('candidateTitle').textContent = resume.title || 'Junior Frontend Developer';
    closeModal('resumeModal');
    showToast('Резюме збережено!');
}

function showJobAlerts() { document.getElementById('alertsModal').style.display = 'flex'; }
function saveAlertSettings() {
    const cat = document.getElementById('alertCategory').value;
    const city = document.getElementById('alertCity').value;
    const alerts = JSON.parse(localStorage.getItem('fastik_job_alerts')||'[]');
    alerts.push({ id: Date.now(), category: cat, city: city });
    localStorage.setItem('fastik_job_alerts', JSON.stringify(alerts));
    renderAlerts(alerts);
    closeModal('alertsModal');
    showToast('Сповіщення налаштовано!');
}

function viewSavedJobs() {
    const saved = jobs.filter(j => j.isSaved);
    if (saved.length === 0) showToast('Немає збережених вакансій');
    else { filteredJobs = saved; renderJobs(); }
}

function editAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const avatar = document.getElementById('candidateAvatar');
                avatar.style.backgroundImage = `url(${ev.target.result})`;
                avatar.style.backgroundSize = 'cover';
                avatar.innerHTML = '';
                localStorage.setItem('fastik_avatar', ev.target.result);
                showToast('Аватар оновлено!');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function closeModal(id) { const m = document.getElementById(id); if(m) m.style.display = 'none'; }

initJobSearch();