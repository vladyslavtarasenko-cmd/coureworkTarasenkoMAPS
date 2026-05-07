// ========== ДАНІ ==========
let currentUser = null;
let jobs = [];
let filteredJobs = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentStep = 1;
let resumeData = {
    experiences: [],
    educations: [],
    skills: [],
    languages: [{ name: 'Українська', level: 'Рідна' }]
};

// Демо-вакансії
const defaultJobs = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "TechInnovate",
        companyLogo: "T",
        salary: "45 000 - 60 000 грн",
        location: "Київ (гібрид)",
        experience: "2-3 роки",
        employment: "Повна зайнятість",
        description: "Розробка сучасних веб-додатків на React. Робота в команді професіоналів.",
        requirements: "React, JavaScript, HTML/CSS, знання Git",
        date: "2 години тому",
        category: "it",
        isSaved: false
    },
    {
        id: 2,
        title: "Sales Manager",
        company: "GlobalTrade",
        companyLogo: "G",
        salary: "35 000 - 50 000 грн + бонуси",
        location: "Одеса",
        experience: "1-3 роки",
        employment: "Повна зайнятість",
        description: "Активні продажі B2B сегменту. Робота з клієнтами.",
        requirements: "Досвід продажів, комунікабельність",
        date: "5 годин тому",
        category: "sales",
        isSaved: false
    },
    {
        id: 3,
        title: "HR Generalist",
        company: "PeopleFirst",
        companyLogo: "P",
        salary: "30 000 - 40 000 грн",
        location: "Львів",
        experience: "2 роки",
        employment: "Повна зайнятість",
        description: "Повний цикл підбору персоналу, адаптація, навчання.",
        requirements: "Досвід у HR, знання Трудового кодексу",
        date: "вчора",
        category: "admin",
        isSaved: false
    },
    {
        id: 4,
        title: "UI/UX Designer",
        company: "CreativeLab",
        companyLogo: "C",
        salary: "40 000 - 55 000 грн",
        location: "Віддалено",
        experience: "2-4 роки",
        employment: "Віддалена робота",
        description: "Дизайн мобільних та веб-застосунків. Створення прототипів.",
        requirements: "Figma, Adobe XD, портфоліо",
        date: "2 дні тому",
        category: "it",
        isSaved: false
    },
    {
        id: 5,
        title: "Java Developer",
        company: "SoftServe",
        companyLogo: "S",
        salary: "50 000 - 70 000 грн",
        location: "Дніпро",
        experience: "3+ роки",
        employment: "Повна зайнятість",
        description: "Розробка бекенду на Spring Boot.",
        requirements: "Java, Spring, SQL, мікросервіси",
        date: "3 дні тому",
        category: "it",
        isSaved: false
    },
    {
        id: 6,
        title: "Менеджер з логістики",
        company: "LogistiX",
        companyLogo: "L",
        salary: "25 000 - 35 000 грн",
        location: "Харків",
        experience: "1 рік",
        employment: "Повна зайнятість",
        description: "Координація перевезень, робота з документами.",
        requirements: "Знання логістики, уважність",
        date: "5 днів тому",
        category: "transport",
        isSaved: false
    },
    {
        id: 7,
        title: "Content Manager",
        company: "MediaWorks",
        companyLogo: "M",
        salary: "20 000 - 28 000 грн",
        location: "Київ",
        experience: "0-1 рік",
        employment: "Повна зайнятість",
        description: "Написання статей, ведення соцмереж.",
        requirements: "Грамотність, креативність",
        date: "тиждень тому",
        category: "admin",
        isSaved: false
    },
    {
        id: 8,
        title: "Project Manager",
        company: "AgileTeam",
        companyLogo: "A",
        salary: "55 000 - 75 000 грн",
        location: "Київ",
        experience: "4+ роки",
        employment: "Повна зайнятість",
        description: "Управління IT проектами, комунікація з командою.",
        requirements: "Agile, Scrum, Jira",
        date: "тиждень тому",
        category: "it",
        isSaved: false
    }
];

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    loadJobs();
    loadCandidateData();
    renderJobs();
    setupFilters();
});

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
    if (saved) {
        jobs = JSON.parse(saved);
    } else {
        jobs = defaultJobs;
        saveJobs();
    }
    filteredJobs = [...jobs];
}

function saveJobs() {
    localStorage.setItem('fastik_jobs', JSON.stringify(jobs));
}

function loadCandidateData() {
    const saved = localStorage.getItem('fastik_candidate');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('candidateTitle').textContent = data.title || 'Junior Frontend Developer';
        document.getElementById('jobViewsCount').textContent = data.views || 42;
        document.getElementById('invitesCount').textContent = data.invites || 8;
    }
}

// ========== ПОШУК ТА ФІЛЬТРИ ==========
function searchJobs() {
    const query = document.getElementById('jobSearchInput').value.toLowerCase();
    const location = document.getElementById('jobLocationInput').value.toLowerCase();
    
    filteredJobs = jobs.filter(job => {
        const matchTitle = job.title.toLowerCase().includes(query);
        const matchCompany = job.company.toLowerCase().includes(query);
        const matchLocation = location ? job.location.toLowerCase().includes(location) : true;
        return (matchTitle || matchCompany) && matchLocation;
    });
    
    applyFilters();
}

function filterJobs() {
    applyFilters();
}

function applyFilters() {
    let result = [...jobs];
    
    const category = document.getElementById('jobCategoryFilter').value;
    if (category !== 'all') {
        result = result.filter(job => job.category === category);
    }
    
    const salaryFilter = document.getElementById('jobSalaryFilter').value;
    if (salaryFilter !== 'all') {
        const [min, max] = salaryFilter.split('-');
        if (max) {
            result = result.filter(job => {
                const salaryNum = parseInt(job.salary.split(' ')[0]);
                return salaryNum >= parseInt(min) && salaryNum <= parseInt(max);
            });
        } else if (salaryFilter === '40000+') {
            result = result.filter(job => parseInt(job.salary.split(' ')[0]) >= 40000);
        }
    }
    
    const experience = document.getElementById('jobExperienceFilter').value;
    if (experience !== 'all') {
        result = result.filter(job => {
            if (experience === 'no') return job.experience === 'Без досвіду' || job.experience === '0-1 рік';
            if (experience === '1-3') return job.experience.includes('1') || job.experience.includes('2');
            if (experience === '3-5') return job.experience.includes('3') || job.experience.includes('4');
            if (experience === '5+') return job.experience.includes('5+') || job.experience.includes('4+');
            return true;
        });
    }
    
    filteredJobs = result;
    currentPage = 1;
    renderJobs();
}

function sortAndRenderJobs() {
    const sortBy = document.getElementById('sortJobs').value;
    
    if (sortBy === 'date') {
        // Залишаємо як є
    } else if (sortBy === 'salary-desc') {
        filteredJobs.sort((a, b) => {
            const salaryA = parseInt(a.salary.split(' ')[0]) || 0;
            const salaryB = parseInt(b.salary.split(' ')[0]) || 0;
            return salaryB - salaryA;
        });
    } else if (sortBy === 'salary-asc') {
        filteredJobs.sort((a, b) => {
            const salaryA = parseInt(a.salary.split(' ')[0]) || 0;
            const salaryB = parseInt(b.salary.split(' ')[0]) || 0;
            return salaryA - salaryB;
        });
    }
    
    renderJobs();
}

function setupFilters() {
    document.getElementById('jobSearchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchJobs();
    });
    document.getElementById('jobLocationInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchJobs();
    });
}

// ========== РЕНДЕР ВАКАНСІЙ ==========
function renderJobs() {
    const container = document.getElementById('jobsList');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filteredJobs.slice(start, end);
    
    document.getElementById('jobsCount').textContent = `Знайдено ${filteredJobs.length} вакансій`;
    
    if (paginated.length === 0) {
        container.innerHTML = '<div class="empty-state">😕 Вакансій не знайдено. Спробуйте змінити параметри пошуку.</div>';
        document.getElementById('jobsPagination').innerHTML = '';
        return;
    }
    
    container.innerHTML = paginated.map(job => `
        <div class="job-card" onclick="viewJobDetail(${job.id})">
            <div class="job-header-info">
                <div>
                    <div class="job-title">${job.title}</div>
                    <div class="job-company">🏢 ${job.company}</div>
                </div>
                <div class="job-salary">💰 ${job.salary}</div>
            </div>
            <div class="job-details">
                <span class="job-detail">📍 ${job.location}</span>
                <span class="job-detail">📅 ${job.experience}</span>
                <span class="job-detail">⏰ ${job.employment}</span>
            </div>
            <div class="job-description">${job.description.substring(0, 100)}${job.description.length > 100 ? '...' : ''}</div>
            <div class="job-footer">
                <div class="job-date">🕐 ${job.date}</div>
                <div class="job-actions" onclick="event.stopPropagation()">
                    <button class="save-job-btn" onclick="toggleSaveJob(${job.id})">${job.isSaved ? '❤️' : '🤍'}</button>
                    <button class="apply-btn" onclick="applyForJob(${job.id})">Відгукнутися</button>
                </div>
            </div>
        </div>
    `).join('');
    
    renderPagination();
}

function renderPagination() {
    const container = document.getElementById('jobsPagination');
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    container.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function viewJobDetail(jobId) {
    alert(`Функція перегляду вакансії #${jobId} в розробці`);
}

function toggleSaveJob(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        job.isSaved = !job.isSaved;
        saveJobs();
        renderJobs();
        showNotification(job.isSaved ? 'Вакансію збережено' : 'Видалено зі збережених');
    }
}

function applyForJob(jobId) {
    alert('Ваш відгук надіслано роботодавцю! Очікуйте на відповідь.');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #002f34;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeInOut 2s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// ========== РЕЗЮМЕ ==========
function openResumeModal() {
    document.getElementById('resumeModal').style.display = 'flex';
    currentStep = 1;
    updateSteps();
}

function updateSteps() {
    for (let i = 1; i <= 4; i++) {
        const step = document.querySelector(`.step[data-step="${i}"]`);
        const content = document.getElementById(`resumeStep${i}`);
        if (step) {
            if (i === currentStep) step.classList.add('active');
            else step.classList.remove('active');
        }
        if (content) {
            if (i === currentStep) content.classList.add('active');
            else content.classList.remove('active');
        }
    }
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    } else if (currentStep === 4) {
        prevBtn.style.display = 'inline-block';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        prevBtn.style.display = 'inline-block';
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

function nextStep() {
    if (currentStep < 4) {
        currentStep++;
        updateSteps();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateSteps();
    }
}

function addExperience() {
    const expDiv = document.createElement('div');
    expDiv.className = 'experience-item';
    expDiv.innerHTML = `
        <button class="remove-item" onclick="this.parentElement.remove()">✖</button>
        <input type="text" placeholder="Назва компанії" class="form-input" style="margin-bottom: 8px;">
        <input type="text" placeholder="Посада" class="form-input" style="margin-bottom: 8px;">
        <div style="display: flex; gap: 8px;">
            <input type="text" placeholder="Рік початку" style="flex:1; padding:8px; border:1px solid #ddd; border-radius:6px;">
            <input type="text" placeholder="Рік закінчення" style="flex:1; padding:8px; border:1px solid #ddd; border-radius:6px;">
        </div>
    `;
    document.getElementById('experienceList').appendChild(expDiv);
}

function addEducation() {
    const eduDiv = document.createElement('div');
    eduDiv.className = 'education-item';
    eduDiv.innerHTML = `
        <button class="remove-item" onclick="this.parentElement.remove()">✖</button>
        <input type="text" placeholder="Назва закладу" class="form-input" style="margin-bottom: 8px;">
        <input type="text" placeholder="Спеціальність" class="form-input" style="margin-bottom: 8px;">
        <input type="text" placeholder="Рік закінчення" class="form-input">
    `;
    document.getElementById('educationList').appendChild(eduDiv);
}

function addLanguage() {
    const langDiv = document.createElement('div');
    langDiv.className = 'language-item';
    langDiv.innerHTML = `
        <input type="text" placeholder="Мова" value="Англійська">
        <select>
            <option>Рідна</option>
            <option>Вільно</option>
            <option>Середній</option>
            <option>Початковий</option>
        </select>
        <button class="remove-item" onclick="this.parentElement.remove()">✖</button>
    `;
    document.getElementById('languagesList').appendChild(langDiv);
}

function saveResume() {
    const resume = {
        title: document.getElementById('resumeTitle').value,
        city: document.getElementById('resumeCity').value,
        relocation: document.getElementById('resumeRelocation').value,
        salary: document.getElementById('resumeSalary').value,
        employment: document.getElementById('resumeEmployment').value,
        about: document.getElementById('resumeAbout').value
    };
    
    localStorage.setItem('fastik_candidate', JSON.stringify(resume));
    document.getElementById('candidateTitle').textContent = resume.title || 'Junior Frontend Developer';
    
    closeModal('resumeModal');
    showNotification('Резюме успішно збережено!');
}

function showJobAlerts() {
    alert('Налаштування сповіщень про нові вакансії буде доступно найближчим часом');
}

function viewSavedJobs() {
    const saved = jobs.filter(j => j.isSaved);
    if (saved.length === 0) {
        alert('У вас поки немає збережених вакансій');
    } else {
        filteredJobs = saved;
        renderJobs();
    }
}

function editAvatar() {
    alert('Функція зміни аватара буде доступна найближчим часом');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function changeLanguage() {
    const select = document.getElementById('langSelect');
    if (select) {
        alert(`Мову змінено на ${select.options[select.selectedIndex].text}`);
    }
}