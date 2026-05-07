(function() {
    // ========== ДАНІ ==========
    var currentUser = null;
    var jobs = [];
    var filteredJobs = [];
    var savedJobs = [];
    var currentPage = 1;
    const itemsPerPage = 8;
    var currentStep = 1;

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
        const totalEl = document.getElementById('jobsTotalCount');
        if (totalEl) totalEl.innerHTML = `${jobs.length} вакансій по всій Україні`;
    }

    function loadUser() {
        const saved = localStorage.getItem('fastik_user');
        if (saved) {
            currentUser = JSON.parse(saved);
            const nameEl = document.getElementById('candidateName');
            const avatarEl = document.getElementById('candidateAvatar');
            if (nameEl) nameEl.textContent = currentUser.name || 'Владислав Тараненко';
            if (avatarEl) avatarEl.textContent = (currentUser.name?.charAt(0) || 'В');
        }
    }

    function loadJobs() {
        const saved = localStorage.getItem('fastik_jobs');
        if (saved) jobs = JSON.parse(saved);
        else { jobs = [...defaultJobs]; saveJobs(); }
        filteredJobs = [...jobs];
    }

    function saveJobs() { localStorage.setItem('fastik_jobs', JSON.stringify(jobs)); }

    function loadCandidateData() {
        const saved = localStorage.getItem('fastik_candidate');
        if (saved) {
            const data = JSON.parse(saved);
            const titleEl = document.getElementById('candidateTitle');
            const locationEl = document.getElementById('candidateLocation');
            const viewsEl = document.getElementById('jobViewsCount');
            const invitesEl = document.getElementById('invitesCount');
            if (titleEl) titleEl.textContent = data.title || 'Junior Frontend Developer';
            if (locationEl) locationEl.innerHTML = `📍 ${data.city || 'Київ'}, ${data.relocation === 'yes' ? 'готовий до переїзду' : ''}`;
            if (viewsEl) viewsEl.textContent = data.views || 42;
            if (invitesEl) invitesEl.textContent = data.invites || 8;
        }
        const savedAlerts = localStorage.getItem('fastik_job_alerts');
        if (savedAlerts) renderAlerts(JSON.parse(savedAlerts));
    }

    function renderAlerts(alerts) {
        const container = document.getElementById('jobAlertsList');
        if (!container) return;
        if (!alerts || alerts.length === 0) { 
            container.innerHTML = '<div class="alert-item">Немає підписок</div>'; 
            return; 
        }
        container.innerHTML = alerts.map(a => `<div class="alert-item"><span>${a.category} • ${a.city}</span><button onclick="removeAlert(${a.id})">✖</button></div>`).join('');
    }

    function removeAlert(id) { 
        let a = JSON.parse(localStorage.getItem('fastik_job_alerts')||'[]'); 
        a = a.filter(al=>al.id!==id); 
        localStorage.setItem('fastik_job_alerts',JSON.stringify(a)); 
        renderAlerts(a); 
    }

    function searchJobs() { applyFilters(); }
    function filterJobs() { applyFilters(); }

    function applyFilters() {
        let result = [...jobs];
        const query = document.getElementById('jobSearchInput')?.value.toLowerCase() || '';
        if (query) result = result.filter(j => j.title.toLowerCase().includes(query) || j.company.toLowerCase().includes(query));
        const loc = document.getElementById('jobLocationInput')?.value.toLowerCase() || '';
        if (loc) result = result.filter(j => j.location.toLowerCase().includes(loc));
        const cat = document.getElementById('jobCategoryFilter')?.value || 'all';
        if (cat !== 'all') result = result.filter(j => j.category === cat);
        const sal = document.getElementById('jobSalaryFilter')?.value || 'all';
        if (sal !== 'all') {
            if (sal === '0-15000') result = result.filter(j => parseInt(j.salary) < 15000);
            else if (sal === '15000-25000') result = result.filter(j => parseInt(j.salary) >= 15000 && parseInt(j.salary) <= 25000);
            else if (sal === '25000-40000') result = result.filter(j => parseInt(j.salary) >= 25000 && parseInt(j.salary) <= 40000);
            else if (sal === '40000+') result = result.filter(j => parseInt(j.salary) >= 40000);
        }
        const exp = document.getElementById('jobExperienceFilter')?.value || 'all';
        if (exp !== 'all') result = result.filter(j => j.experience.includes(exp === 'no' ? '0' : exp === '1-3' ? '1' : exp === '3-5' ? '3' : '5'));
        filteredJobs = result;
        currentPage = 1;
        renderJobs();
    }

    function sortAndRenderJobs() {
        const sort = document.getElementById('sortJobs')?.value || 'date';
        if (sort === 'salary-desc') filteredJobs.sort((a,b)=>parseInt(b.salary)-parseInt(a.salary));
        else if (sort === 'salary-asc') filteredJobs.sort((a,b)=>parseInt(a.salary)-parseInt(b.salary));
        else filteredJobs.sort((a,b)=>b.id-a.id);
        renderJobs();
    }

    function renderJobs() {
        const container = document.getElementById('jobsList');
        if (!container) return;
        const start = (currentPage-1)*itemsPerPage;
        const paginated = filteredJobs.slice(start, start+itemsPerPage);
        const countEl = document.getElementById('jobsCount');
        if (countEl) countEl.innerHTML = `Знайдено ${filteredJobs.length} вакансій`;
        if (paginated.length === 0) { 
            container.innerHTML = '<div class="empty-state">😕 Вакансій не знайдено</div>'; 
            const pagEl = document.getElementById('jobsPagination');
            if (pagEl) pagEl.innerHTML = '';
            return; 
        }
        container.innerHTML = paginated.map(job => `
            <div class="job-card">
                <div class="job-header-info"><div><div class="job-title">${job.title}</div><div class="job-company">🏢 ${job.company}</div></div><div class="job-salary">💰 ${job.salary}</div></div>
                <div class="job-details"><span class="job-detail">📍 ${job.location}</span><span class="job-detail">📅 ${job.experience}</span><span class="job-detail">⏰ ${job.employment}</span></div>
                <div class="job-description">${job.description.substring(0,100)}...</div>
                <div class="job-footer"><div class="job-date">🕐 ${job.date}</div><div class="job-actions"><button class="save-job-btn" onclick="toggleSaveJob(${job.id})">${job.isSaved ? '❤️' : '🤍'}</button><button class="apply-btn" onclick="applyForJob(${job.id})">Відгукнутися</button></div></div>
            </div>
        `).join('');
        const total = Math.ceil(filteredJobs.length/itemsPerPage);
        let p = ''; 
        for(let i=1;i<=total;i++) p += `<button class="${i===currentPage?'active':''}" onclick="goToPage(${i})">${i}</button>`;
        const pagEl = document.getElementById('jobsPagination');
        if (pagEl) pagEl.innerHTML = p;
    }

    function goToPage(p) { currentPage = p; renderJobs(); window.scrollTo({top:0}); }
    
    function toggleSaveJob(id) { 
        const j = jobs.find(j=>j.id===id); 
        if(j){ j.isSaved=!j.isSaved; saveJobs(); renderJobs(); showToast(j.isSaved?'Збережено':'Видалено'); } 
    }
    
    function applyForJob(id) { showToast('Відгук надіслано!'); }
    
    function showToast(msg) { 
        const t = document.createElement('div'); 
        t.style.cssText='position:fixed;bottom:20px;right:20px;background:#002f34;color:#fff;padding:10px 20px;border-radius:8px;z-index:9999'; 
        t.textContent=msg; 
        document.body.appendChild(t); 
        setTimeout(()=>t.remove(),2000); 
    }

    function setupFilters() {
        const inp = document.getElementById('jobSearchInput');
        if(inp) inp.addEventListener('keypress',e=>{if(e.key==='Enter')searchJobs();});
        const loc = document.getElementById('jobLocationInput');
        if(loc) loc.addEventListener('keypress',e=>{if(e.key==='Enter')searchJobs();});
    }

    function openResumeModal() { 
        const modal = document.getElementById('resumeModal');
        if (modal) modal.style.display = 'flex'; 
        currentStep = 1; 
        updateSteps(); 
    }
    
    function updateSteps() {
        for(let i=1;i<=4;i++){ 
            const s=document.querySelector(`.step[data-step="${i}"]`); 
            const c=document.getElementById(`resumeStep${i}`); 
            if(s) i===currentStep?s.classList.add('active'):s.classList.remove('active'); 
            if(c) i===currentStep?c.classList.add('active'):c.classList.remove('active'); 
        }
        const p=document.getElementById('prevBtn'), n=document.getElementById('nextBtn'), s=document.getElementById('submitBtn');
        if(!p || !n || !s) return;
        if(currentStep===1){ p.style.display='none'; n.style.display='inline-block'; s.style.display='none'; }
        else if(currentStep===4){ p.style.display='inline-block'; n.style.display='none'; s.style.display='inline-block'; }
        else{ p.style.display='inline-block'; n.style.display='inline-block'; s.style.display='none'; }
    }
    
    function nextStep(){ if(currentStep<4){ currentStep++; updateSteps(); } }
    function prevStep(){ if(currentStep>1){ currentStep--; updateSteps(); } }
    
    function addExperience(){ 
        const d=document.getElementById('experienceList'); 
        if(!d) return;
        const div=document.createElement('div'); 
        div.className='experience-item'; 
        div.innerHTML='<button class="remove-item" onclick="this.parentElement.remove()">✖</button><input type="text" placeholder="Компанія" class="form-input" style="margin-bottom:8px"><input type="text" placeholder="Посада" class="form-input" style="margin-bottom:8px"><div style="display:flex;gap:8px"><input type="text" placeholder="Рік початку"><input type="text" placeholder="Рік закінчення"></div>'; 
        d.appendChild(div); 
    }
    
    function addEducation(){ 
        const d=document.getElementById('educationList'); 
        if(!d) return;
        const div=document.createElement('div'); 
        div.className='education-item'; 
        div.innerHTML='<button class="remove-item" onclick="this.parentElement.remove()">✖</button><input type="text" placeholder="Заклад" class="form-input" style="margin-bottom:8px"><input type="text" placeholder="Спеціальність" class="form-input" style="margin-bottom:8px"><input type="text" placeholder="Рік" class="form-input">'; 
        d.appendChild(div); 
    }
    
    function addLanguage(){ 
        const d=document.getElementById('languagesList'); 
        if(!d) return;
        const div=document.createElement('div'); 
        div.className='language-item'; 
        div.innerHTML='<input type="text" placeholder="Мова" value="Англійська"><select><option>Рідна</option><option>Вільно</option><option>Середній</option></select><button class="remove-item" onclick="this.parentElement.remove()">✖</button>'; 
        d.appendChild(div); 
    }

    function saveResume() {
        const titleEl = document.getElementById('resumeTitle');
        const cityEl = document.getElementById('resumeCity');
        const relocationEl = document.getElementById('resumeRelocation');
        const salaryEl = document.getElementById('resumeSalary');
        const employmentEl = document.getElementById('resumeEmployment');
        const aboutEl = document.getElementById('resumeAbout');
        
        const resume = { 
            title: titleEl?.value || '', 
            city: cityEl?.value || '', 
            relocation: relocationEl?.value || 'no', 
            salary: salaryEl?.value || '', 
            employment: employmentEl?.value || 'full', 
            about: aboutEl?.value || '', 
            views: 42, 
            invites: 8 
        };
        localStorage.setItem('fastik_candidate', JSON.stringify(resume));
        const titleDisplay = document.getElementById('candidateTitle');
        if (titleDisplay) titleDisplay.textContent = resume.title || 'Junior Frontend Developer';
        closeModal('resumeModal');
        showToast('Резюме збережено!');
    }

    function showJobAlerts() { 
        const modal = document.getElementById('alertsModal');
        if (modal) modal.style.display = 'flex'; 
    }
    
    function saveAlertSettings() {
        const cat = document.getElementById('alertCategory')?.value || 'all';
        const city = document.getElementById('alertCity')?.value || '';
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
                    if (avatar) {
                        avatar.style.backgroundImage = `url(${ev.target.result})`;
                        avatar.style.backgroundSize = 'cover';
                        avatar.innerHTML = '';
                        localStorage.setItem('fastik_avatar', ev.target.result);
                        showToast('Аватар оновлено!');
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    function closeModal(id) { 
        const m = document.getElementById(id); 
        if (m) m.style.display = 'none'; 
    }

    // Робимо функції глобальними для HTML
    window.searchJobs = searchJobs;
    window.filterJobs = filterJobs;
    window.sortAndRenderJobs = sortAndRenderJobs;
    window.toggleSaveJob = toggleSaveJob;
    window.applyForJob = applyForJob;
    window.goToPage = goToPage;
    window.openResumeModal = openResumeModal;
    window.nextStep = nextStep;
    window.prevStep = prevStep;
    window.addExperience = addExperience;
    window.addEducation = addEducation;
    window.addLanguage = addLanguage;
    window.saveResume = saveResume;
    window.showJobAlerts = showJobAlerts;
    window.saveAlertSettings = saveAlertSettings;
    window.viewSavedJobs = viewSavedJobs;
    window.editAvatar = editAvatar;
    window.removeAlert = removeAlert;
    window.closeModal = closeModal;

    // ЗАПУСК
    initJobSearch();
})();