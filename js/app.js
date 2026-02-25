// js/app.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            views.forEach(view => view.classList.remove('active'));

            // Add active class to clicked nav
            item.classList.add('active');

            // Show corresponding view
            const targetId = `view-${item.dataset.target}`;
            const targetView = document.getElementById(targetId);
            if (targetView) targetView.classList.add('active');

            // Special initialization if needed
            if (item.dataset.target === 'syllabus') {
                renderSyllabus('physics'); // default render
            }
        });
    });

    // --- Syllabus Tracker Logic ---
    const syllabusData = {
        physics: [
            { id: 1, title: 'Thermodynamics', status: 'pending' },
            { id: 2, title: 'Static Electricity', status: 'in-progress' },
            { id: 3, title: 'Modern Physics', status: 'completed' },
            { id: 4, title: 'Current Electricity', status: 'pending' }
        ],
        maths: [
            { id: 5, title: 'Integration', status: 'pending' },
            { id: 6, title: 'Differentiation', status: 'completed' },
            { id: 7, title: 'Conics', status: 'pending' }
        ],
        chemistry: [
            { id: 8, title: 'Organic Chemistry', status: 'in-progress' },
            { id: 9, title: 'Quantitative Chemistry', status: 'pending' }
        ],
        english: [],
        bangla: [],
        biology: [],
        ict: []
    };

    const syllabusTabs = document.querySelectorAll('#syllabus-subjects .tab-btn');
    const syllabusList = document.getElementById('syllabus-list');

    syllabusTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            syllabusTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderSyllabus(tab.dataset.subject);
        });
    });

    function renderSyllabus(subject) {
        syllabusList.innerHTML = '';
        const topics = syllabusData[subject] || [];

        topics.forEach((topic, index) => {
            const topicEl = document.createElement('div');
            topicEl.className = `syllabus-topic ${topic.status}`;
            topicEl.style.animationDelay = `${index * 0.05}s`;
            topicEl.classList.add('fade-in');

            topicEl.innerHTML = `
                <div class="topic-info">
                    <h4>${topic.title}</h4>
                    <span class="topic-status">${topic.status.replace('-', ' ')}</span>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <select class="status-dropdown" data-subject="${subject}" data-id="${topic.id}">
                        <option value="pending" ${topic.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in-progress" ${topic.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${topic.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    <button class="btn btn-sm btn-danger delete-topic-btn" data-subject="${subject}" data-id="${topic.id}" style="padding: 0.5rem;"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;

            syllabusList.appendChild(topicEl);
        });

        if (topics.length === 0) {
            syllabusList.innerHTML = '<p class="text-muted text-center py-4">No topics added for this subject yet.</p>';
        }

        // Add event listeners to dropdowns
        document.querySelectorAll('.status-dropdown').forEach(dropdown => {
            dropdown.addEventListener('change', (e) => {
                const newStatus = e.target.value;
                const subj = e.target.dataset.subject;
                const id = parseInt(e.target.dataset.id);

                // Update Data
                const t = syllabusData[subj].find(t => t.id === id);
                if (t) t.status = newStatus;

                // Re-render
                renderSyllabus(subj);
                updateDashboardStats();
            });
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-topic-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('.delete-topic-btn');
                const subj = targetBtn.dataset.subject;
                const id = parseInt(targetBtn.dataset.id);

                const index = syllabusData[subj].findIndex(t => t.id === id);
                if (index > -1) {
                    syllabusData[subj].splice(index, 1);
                    renderSyllabus(subj);
                    updateDashboardStats();
                }
            });
        });
    }

    const addTopicForm = document.getElementById('add-topic-form');
    if (addTopicForm) {
        addTopicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('topic-input');
            const activeTab = document.querySelector('.tab-btn.active');

            if (input.value.trim() !== '' && activeTab) {
                const subject = activeTab.dataset.subject;
                if (!syllabusData[subject]) syllabusData[subject] = [];

                syllabusData[subject].push({
                    id: Date.now(),
                    title: input.value.trim(),
                    status: 'pending'
                });

                input.value = '';
                renderSyllabus(subject);
                updateDashboardStats();
            }
        });
    }

    // --- Marks Entry Logic ---
    const marksData = [
        { subject: 'Physics', type: 'Half Yearly', score: 82, colorClass: 'text-success' },
        { subject: 'Chemistry', type: 'Mock Test', score: 35, colorClass: 'text-danger' },
        { subject: 'Maths', type: 'Mock Test', score: 65, colorClass: 'text-warning' }
    ];

    const marksForm = document.getElementById('marks-form');
    const recentMarksList = document.getElementById('recent-marks-list');

    function renderMarks() {
        recentMarksList.innerHTML = '';
        marksData.forEach((mark, index) => {
            const markEl = document.createElement('div');
            markEl.className = 'mark-item fade-in';
            markEl.style.animationDelay = `${index * 0.1}s`;

            markEl.innerHTML = `
                <div>
                    <h4>${mark.subject}</h4>
                    <span class="text-muted" style="font-size:0.85rem">${mark.type}</span>
                </div>
                <div class="mark-score ${mark.colorClass}">${mark.score}%</div>
            `;
            recentMarksList.appendChild(markEl);
        });
    }

    if (marksForm) {
        marksForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const subject = document.getElementById('mark-subject').value;
            const type = document.getElementById('mark-type').value;
            const gotten = parseInt(document.getElementById('mark-gotten').value);
            const total = parseInt(document.getElementById('mark-total').value);

            const percentage = Math.round((gotten / total) * 100);

            let colorClass = 'text-danger';
            if (percentage >= 80) colorClass = 'text-success';
            else if (percentage >= 50) colorClass = 'text-warning';

            marksData.unshift({ subject, type, score: percentage, colorClass });

            renderMarks();
            updateDashboardStats();
            updateInsights();

            marksForm.reset();

            // Show temporary success feedback
            const btn = marksForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
            btn.style.backgroundColor = 'var(--clr-success-green-dark)';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
            }, 2000);
        });
    }

    // --- Study Timer Logic ---
    let timerInterval = null;
    let timerSeconds = 0;
    let isTimerRunning = false;
    const studyLog = [];

    const timerDisplay = document.getElementById('study-timer');
    const timerToggleBtn = document.getElementById('timer-toggle-btn');
    const timerResetBtn = document.getElementById('timer-reset-btn');

    function formatTime(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function updateTimerDisplay() {
        if (timerDisplay) {
            timerDisplay.innerText = formatTime(timerSeconds);
        }
    }

    if (timerToggleBtn && timerResetBtn) {
        timerToggleBtn.addEventListener('click', () => {
            if (isTimerRunning) {
                // Pause
                clearInterval(timerInterval);
                isTimerRunning = false;
                timerToggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
                timerToggleBtn.classList.replace('btn-warning', 'btn-primary');
            } else {
                // Start
                isTimerRunning = true;
                timerToggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
                timerToggleBtn.classList.remove('btn-primary');
                // Create a temporary warning class for active state
                timerToggleBtn.classList.add('btn-warning');
                timerToggleBtn.style.backgroundColor = 'var(--clr-warning)';
                timerToggleBtn.style.color = 'black';

                timerInterval = setInterval(() => {
                    timerSeconds++;
                    updateTimerDisplay();
                }, 1000);
            }
        });

        timerResetBtn.addEventListener('click', () => {
            if (timerSeconds > 0) {
                // Save session
                studyLog.push({
                    date: new Date().toISOString(),
                    durationSeconds: timerSeconds
                });

                // Reset
                clearInterval(timerInterval);
                isTimerRunning = false;
                timerSeconds = 0;
                updateTimerDisplay();

                timerToggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
                timerToggleBtn.classList.add('btn-primary');
                timerToggleBtn.classList.remove('btn-warning');
                timerToggleBtn.style.backgroundColor = '';
                timerToggleBtn.style.color = '';

                // Feedback
                const originalText = timerResetBtn.innerHTML;
                timerResetBtn.innerHTML = '<i class="fa-solid fa-check"></i> Logged!';
                setTimeout(() => {
                    timerResetBtn.innerHTML = originalText;
                }, 2000);
            }
        });
    }

    // --- Exams Tracker Logic ---
    const examsData = [
        { id: 1, subject: 'Physics', title: 'Pre-Test', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { id: 2, subject: 'Chemistry', title: 'Practical Exam', date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { id: 3, subject: 'Maths', title: 'Chapter 4 Quiz', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    ];

    const examsForm = document.getElementById('exams-form');
    const upcomingExamsList = document.getElementById('upcoming-exams-list');

    function renderExams() {
        if (!upcomingExamsList) return;
        upcomingExamsList.innerHTML = '';

        // Sort exams by closest date
        examsData.sort((a, b) => new Date(a.date) - new Date(b.date));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        examsData.forEach((exam, index) => {
            const examDate = new Date(exam.date);
            const diffTime = examDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Skip past exams
            if (diffDays < 0) return;

            const isUrgent = diffDays <= 7;

            const examEl = document.createElement('div');
            examEl.className = 'exam-item fade-in';
            examEl.style.animationDelay = `${index * 0.1}s`;

            // Format Date (e.g. Oct 15)
            const dateStr = examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            examEl.innerHTML = `
            <div class="exam-date-badge ${isUrgent ? 'urgent' : ''}">
                <span class="days">${diffDays}</span>
                <span class="label">Days</span>
            </div>
            <div class="exam-info">
                <h4>${exam.subject} ${exam.title ? `<span class="text-muted" style="font-weight:normal; font-size:0.9rem">| ${exam.title}</span>` : ''}</h4>
                <p><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i> ${dateStr}</p>
            </div>
            <button class="btn btn-danger delete-exam-btn" data-id="${exam.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
            upcomingExamsList.appendChild(examEl);
        });

        if (upcomingExamsList.children.length === 0) {
            upcomingExamsList.innerHTML = '<p class="text-muted text-center py-4">No upcoming exams. You\'re all caught up!</p>';
        }

        // Update dashboard urgent exam if applicable
        updateDashboardUrgentExam();
    }

    if (examsForm) {
        examsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const subject = document.getElementById('exam-subject').value;
            const title = document.getElementById('exam-title').value;
            const date = document.getElementById('exam-date').value;

            const newExam = {
                id: Date.now(),
                subject,
                title,
                date
            };

            examsData.push(newExam);
            renderExams();

            examsForm.reset();

            // Show temporary success feedback
            const btn = examsForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
            btn.style.backgroundColor = 'var(--clr-success-green-dark)';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
            }, 2000);
        });
    }

    // Event Delegation for Delete Buttons
    if (upcomingExamsList) {
        upcomingExamsList.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-exam-btn');
            if (deleteBtn) {
                const examId = parseInt(deleteBtn.dataset.id);
                const index = examsData.findIndex(ex => ex.id === examId);
                if (index > -1) {
                    examsData.splice(index, 1);
                    renderExams();
                }
            }
        });
    }

    // --- Dashboard Focus Logic ---
    const focusData = [
        { id: 1, title: 'Read Physics Ch 4' },
        { id: 2, title: 'Solve 10 Math problems' }
    ];

    const focusList = document.getElementById('focus-list');
    const focusForm = document.getElementById('focus-form');

    function renderFocus() {
        if (!focusList) return;
        focusList.innerHTML = '';

        focusData.forEach(item => {
            const focusEl = document.createElement('div');
            focusEl.className = 'focus-item';
            focusEl.innerHTML = `
            <i class="fa-regular fa-circle-check" style="color: var(--clr-success-green)"></i>
            <div class="focus-text">
                <h4>${item.title}</h4>
            </div>
            <button class="btn btn-sm btn-danger delete-focus-btn" data-id="${item.id}" style="padding: 0.25rem 0.5rem;"><i class="fa-solid fa-xmark"></i></button>
        `;
            focusList.appendChild(focusEl);
        });

        if (focusData.length === 0) {
            focusList.innerHTML = '<p class="text-muted text-center" style="padding: 1rem;">No focus items for today. Add one below!</p>';
        }
    }

    if (focusForm) {
        focusForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('focus-input');
            if (input.value.trim() !== '') {
                focusData.push({
                    id: Date.now(),
                    title: input.value.trim()
                });
                input.value = '';
                renderFocus();
            }
        });
    }

    if (focusList) {
        focusList.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-focus-btn');
            if (deleteBtn) {
                const id = parseInt(deleteBtn.dataset.id);
                const index = focusData.findIndex(f => f.id === id);
                if (index > -1) {
                    focusData.splice(index, 1);
                    renderFocus();
                }
            }
        });
    }

    // --- Dashboard & Insights Updates ---
    function updateDashboardUrgentExam() {
        const welcomeP = document.querySelector('.welcome-card p');
        if (!welcomeP) return;

        const upcoming = examsData.filter(ex => new Date(ex.date) >= new Date().setHours(0, 0, 0, 0))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (upcoming.length > 0) {
            const nextExam = upcoming[0];
            const diffTime = new Date(nextExam.date).getTime() - new Date().setHours(0, 0, 0, 0);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            welcomeP.innerHTML = `You have <strong>${diffDays} days</strong> until your ${nextExam.subject}${nextExam.title ? ` ${nextExam.title}` : ''} Exam. Keep the flow going!`;
        } else {
            welcomeP.innerHTML = `You have <strong>no upcoming exams</strong>. Enjoy the flow!`;
        }
    }

    function updateDashboardStats() {
        // Real implementation would calculate properly
        // This is a minimal mock function just to show reactivity 
        let completed = 0; let total = 0;
        Object.values(syllabusData).forEach(subj => {
            subj.forEach(t => { total++; if (t.status === 'completed') completed++; });
        });
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        const syllabusStat = document.querySelector('.syllabus-icon + .stat-info p');
        if (syllabusStat) syllabusStat.innerText = `${percent}% Completed`;

        // Calculate average score
        if (marksData.length > 0) {
            const totalScore = marksData.reduce((acc, curr) => acc + curr.score, 0);
            const avgScore = Math.round(totalScore / marksData.length);
            const avgStat = document.querySelector('.avg-icon + .stat-info p');
            if (avgStat) {
                let grade = 'F';
                if (avgScore >= 80) grade = 'A';
                else if (avgScore >= 60) grade = 'B';
                else if (avgScore >= 40) grade = 'C';

                let color = 'var(--clr-danger)';
                if (avgScore >= 80) color = 'var(--clr-success-green)';
                else if (avgScore >= 50) color = 'var(--clr-warning)';

                avgStat.innerHTML = `<span style="color: ${color}">${avgScore}% (${grade})</span>`;
            }
        }
    }

    function updateInsights() {
        const insightCard = document.querySelector('.insight-card');
        if (!insightCard || marksData.length === 0) return;

        // Calculate averages per subject
        const averages = {};
        const counts = {};

        marksData.forEach(m => {
            if (!averages[m.subject]) { averages[m.subject] = 0; counts[m.subject] = 0; }
            averages[m.subject] += m.score;
            counts[m.subject]++;
        });

        let weakestSubject = '';
        let lowestAvg = Infinity;

        for (const subj in averages) {
            const avg = Math.round(averages[subj] / counts[subj]);
            if (avg < lowestAvg) {
                lowestAvg = avg;
                weakestSubject = subj;
            }
        }

        const insightBody = insightCard.querySelector('.insight-body');
        if (insightBody && weakestSubject) {
            insightBody.innerHTML = `
        <p class="insight-summary">Based on your overall scores, <strong>${weakestSubject}</strong> 
            currently requires more attention. Your running average is <span class="text-danger" style="font-weight:bold;">${lowestAvg}%</span>.</p>

        <h4 class="tips-title">Personalized Tips:</h4>
        <ul class="tips-list">
            <li><i class="fa-solid fa-check-circle text-success"></i> Review your weakest chapters in ${weakestSubject} for 30 minutes today.</li>
            <li><i class="fa-solid fa-check-circle text-success"></i> Solve 10 previous exam problems to understand typical questions.</li>
            <li><i class="fa-solid fa-check-circle text-success"></i> Complete 1 pending topic in ${weakestSubject} from the Syllabus Tracker.</li>
        </ul>
    `;
        }
    }

    // Initialize views
    renderMarks();
    renderExams();
    renderFocus();
    updateDashboardStats();
    updateInsights();

    // Refresh insights button interaction
    document.getElementById('refresh-insights')?.addEventListener('click', function () {
        this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
        setTimeout(() => {
            this.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Analysis Refreshed!';
            setTimeout(() => {
                this.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Refresh Analysis';
            }, 2000);
        }, 1500);
    });
});
