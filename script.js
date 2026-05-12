document.addEventListener('DOMContentLoaded', () => {
    let allExercises = [];
    let userPlan = [];

    const grid = document.getElementById('exercise-grid');
    const planGrid = document.getElementById('my-plan-grid');
    const regForm = document.getElementById('regForm');

    regForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!regForm.checkValidity()) {
            regForm.classList.add('shake-anim');
            setTimeout(() => regForm.classList.remove('shake-anim'), 500);
            return;
        }

        const formData = new FormData(regForm);
        const userName = formData.get('name');

        alert(`Профіль для ${userName} успішно створено! Пошта валідна.`);
        regForm.reset();
    });

    async function getExercises() {
        try {
            const response = await fetch('data.json');
            allExercises = await response.json();
            renderCards(allExercises);
        } catch (e) {
            grid.innerHTML = "<p>Помилка зв'язку з базою даних.</p>";
        }
    }

    function renderCards(data) {
        grid.innerHTML = data.map((ex, index) => `
            <article class="exercise-card" style="animation-delay: ${index * 0.1}s">
                <img src="${ex.image}" alt="${ex.name}" style="width:100%; height:200px; object-fit:cover;">
                <section class="card-body">
                    <h3>${ex.name}</h3>
                    <p><em>Тип: ${ex.type}</em></p>
                    <button class="action-btn" onclick="addToPlan(event, ${ex.id})">Додати в план +</button>
                </section>
            </article>
        `).join('');
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const type = btn.dataset.type;
            const filtered = type === 'all'
                ? allExercises
                : allExercises.filter(e => e.type === type);

            renderCards(filtered);
        });
    });

    window.addToPlan = (event, id) => {
        const btn = event.currentTarget;
        const exercise = allExercises.find(e => e.id === id);

        if (userPlan.some(e => e.id === id)) return alert("Вправа вже в плані!");

        btn.classList.add('clicked');
        btn.textContent = "Додано! ✓";
        setTimeout(() => {
            btn.classList.remove('clicked');
            btn.textContent = "Додати в план +";
        }, 600);

        userPlan.push(exercise);
        updatePlanUI();
    };

    function updatePlanUI() {
        if (userPlan.length === 0) return;
        planGrid.innerHTML = userPlan.map(ex => `
            <article class="exercise-card">
                <section class="card-body">
                    <h3>${ex.name}</h3>
                    <button class="action-btn" style="background:var(--error); box-shadow: 0 4px 0 #b91c1c;" onclick="removeFromPlan(${ex.id})">Видалити</button>
                </section>
            </article>
        `).join('');
    }

    window.removeFromPlan = (id) => {
        userPlan = userPlan.filter(e => e.id !== id);
        if (userPlan.length === 0) {
            planGrid.innerHTML = '<p class="empty-info">Ви ще не обрали жодної вправи.</p>';
        } else {
            updatePlanUI();
        }
    };

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const target = link.dataset.page;
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(`${target}-page`).classList.add('active');
        });
    });

    getExercises();
});
