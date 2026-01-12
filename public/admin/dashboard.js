const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let currentEditingStudent = null;

// Check authentication
if (!token || localStorage.getItem('userRole') !== 'admin') {
    window.location.href = '/admin/login.html';
}

// Display admin email
document.getElementById('adminEmail').textContent = localStorage.getItem('userEmail') || 'Admin';

// Show alert
function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alert-container');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    alertContainer.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => alertContainer.innerHTML = '', 5000);
}

// Logout
function logout() {
    localStorage.clear();
    window.location.href = '/admin/login.html';
}

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
    });
});

// ===== GRADE MODE SWITCHING =====
document.querySelectorAll('input[name="gradeMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const mode = e.target.value;
        const simpleField = document.getElementById('simpleGradeField');
        const controlTypeField = document.getElementById('controlTypeField');
        const controlNoteField = document.getElementById('controlNoteField');

        if (mode === 'simple') {
            simpleField.style.display = 'block';
            controlTypeField.style.display = 'none';
            controlNoteField.style.display = 'none';
        } else {
            simpleField.style.display = 'none';
            controlTypeField.style.display = 'block';
            controlNoteField.style.display = 'block';
        }
    });
});

// ===== CLASSES =====
async function loadClasses() {
    try {
        const response = await fetch(`${API_URL}/classes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const classes = await response.json();

        const tbody = document.getElementById('classesTableBody');
        if (classes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Aucune classe</td></tr>';
        } else {
            tbody.innerHTML = classes.map(c => `
                <tr>
                    <td>${c.id}</td>
                    <td><strong>${c.nom}</strong></td>
                    <td>${new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                        <button onclick="deleteClass(${c.id})" class="btn btn-danger" style="padding: 0.5rem 1rem;">Supprimer</button>
                    </td>
                </tr>
            `).join('');
        }

        // Update class dropdowns
        updateClassDropdowns(classes);
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

async function deleteClass(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette classe ?')) return;

    try {
        const response = await fetch(`${API_URL}/classes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            showAlert('Classe supprimée avec succès', 'success');
            loadClasses();
            loadStudents();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Erreur lors de la suppression');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur');
    }
}

document.getElementById('addClassForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nom = document.getElementById('className').value;

    try {
        const response = await fetch(`${API_URL}/classes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nom })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Classe ajoutée avec succès', 'success');
            document.getElementById('className').value = '';
            loadClasses();
        } else {
            showAlert(data.error || 'Erreur lors de l\'ajout');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur');
    }
});

// ===== STUDENTS =====
async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const students = await response.json();

        const tbody = document.getElementById('studentsTableBody');
        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Aucun étudiant</td></tr>';
        } else {
            tbody.innerHTML = students.map(s => `
                <tr>
                    <td>${s.id}</td>
                    <td><strong>${s.nom_complet}</strong></td>
                    <td>${s.email}</td>
                    <td>${s.classe_nom || '<em style="color: var(--text-muted);">Non assigné</em>'}</td>
                    <td>
                        <button onclick="editStudent(${s.id})" class="btn btn-primary" style="padding: 0.5rem 1rem; margin-right: 0.5rem;">Modifier</button>
                        <button onclick="deleteStudent(${s.id})" class="btn btn-danger" style="padding: 0.5rem 1rem;">Supprimer</button>
                    </td>
                </tr>
            `).join('');
        }

        // Update student dropdown for grades
        const gradeStudentSelect = document.getElementById('gradeStudent');
        gradeStudentSelect.innerHTML = '<option value="">Sélectionner un étudiant</option>' +
            students.map(s => `<option value="${s.id}">${s.nom_complet} (${s.email})</option>`).join('');
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

async function deleteStudent(id) {
    if (!confirm('Voulez-vous vraiment supprimer cet étudiant ?')) return;

    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            showAlert('Étudiant supprimé avec succès', 'success');
            loadStudents();
            loadGrades();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Erreur lors de la suppression');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur');
    }
}

function editStudent(id) {
    fetch(`${API_URL}/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(students => {
            const student = students.find(s => s.id === id);
            if (student) {
                document.getElementById('editStudentId').value = student.id;
                document.getElementById('editStudentName').value = student.nom_complet;
                document.getElementById('editStudentEmail').value = student.email;
                document.getElementById('editStudentClass').value = student.classe_id || '';
                document.getElementById('editModal').style.display = 'flex';
            }
        });
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

document.getElementById('editStudentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editStudentId').value;
    const nom_complet = document.getElementById('editStudentName').value;
    const email = document.getElementById('editStudentEmail').value;
    const classe_id = document.getElementById('editStudentClass').value || null;

    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nom_complet, email, classe_id })
        });

        if (response.ok) {
            showAlert('Étudiant modifié avec succès', 'success');
            closeEditModal();
            loadStudents();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Erreur lors de la modification');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur');
    }
});

document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nom_complet = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;
    const classe_id = document.getElementById('studentClass').value || null;

    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nom_complet, email, password, classe_id })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Étudiant ajouté avec succès', 'success');
            document.getElementById('studentName').value = '';
            document.getElementById('studentEmail').value = '';
            document.getElementById('studentPassword').value = '';
            document.getElementById('studentClass').value = '';
            loadStudents();
        } else {
            showAlert(data.error || 'Erreur lors de l\'ajout');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur');
    }
});

// ===== MATIERES =====
async function loadMatieres() {
    try {
        const response = await fetch(`${API_URL}/matieres`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const matieres = await response.json();

        const tbody = document.getElementById('matieresTableBody');
        if (matieres.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Aucune matière</td></tr>';
        } else {
            tbody.innerHTML = matieres.map(m => `
                <tr>
                    <td>${m.id}</td>
                    <td><strong>${m.nom}</strong></td>
                    <td>${new Date(m.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                        <button onclick="deleteMatiere(${m.id})" class="btn btn-danger" style="padding: 0.5rem 1rem;">Supprimer</button>
                    </td>
                </tr>
            `).join('');
        }

        // Update matiere dropdown for grades
        const gradeMatiereSelect = document.getElementById('gradeMatiere');
        gradeMatiereSelect.innerHTML = '<option value="">Sélectionner une matière</option>' +
            matieres.map(m => `<option value="${m.id}">${m.nom}</option>`).join('');
    } catch (error) {
        console.error('Error loading matieres:', error);
    }
}

async function deleteMatiere(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette matière ?')) return;

    try {
        const response = await fetch(`${API_URL}/matieres/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            showAlert('Matière supprimée avec succès', 'success');
            loadMatieres();
            loadGrades();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Erreur lors de la suppression');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur');
    }
}

document.getElementById('addMatiereForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nom = document.getElementById('matiereName').value;

    try {
        const response = await fetch(`${API_URL}/matieres`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nom })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Matière ajoutée avec succès', 'success');
            document.getElementById('matiereName').value = '';
            loadMatieres();
        } else {
            showAlert(data.error || 'Erreur lors de l\'ajout');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur');
    }
});

// ===== GRADES =====
async function loadGrades() {
    try {
        const response = await fetch(`${API_URL}/grades`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const grades = await response.json();

        const tbody = document.getElementById('gradesTableBody');
        if (grades.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Aucune note</td></tr>';
        } else {
            tbody.innerHTML = grades.map(g => {
                const noteDisplay = g.type_controle
                    ? `<strong>${g.type_controle}:</strong> ${g.note_numerique}`
                    : g.note;
                return `
                    <tr>
                        <td>${g.id}</td>
                        <td><strong>${g.nom_complet}</strong></td>
                        <td>${g.email}</td>
                        <td>${g.matiere_nom}</td>
                        <td><span style="color: var(--accent-color); font-weight: 600;">${noteDisplay}</span></td>
                        <td>
                            <button onclick="deleteGrade(${g.id})" class="btn btn-danger" style="padding: 0.5rem 1rem;">Supprimer</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading grades:', error);
    }
}

async function deleteGrade(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette note ?')) return;

    try {
        const response = await fetch(`${API_URL}/grades/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            showAlert('Note supprimée avec succès', 'success');
            loadGrades();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Erreur lors de la suppression');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur');
    }
}

document.getElementById('addGradeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const etudiant_id = document.getElementById('gradeStudent').value;
    const matiere_id = document.getElementById('gradeMatiere').value;
    const mode = document.querySelector('input[name="gradeMode"]:checked').value;

    let bodyData = { etudiant_id, matiere_id };

    if (mode === 'simple') {
        const note = document.getElementById('gradeNote').value;
        if (!note) {
            showAlert('Veuillez entrer une note');
            return;
        }
        bodyData.note = note;
    } else {
        const type_controle = document.getElementById('gradeControlType').value;
        const note_numerique = document.getElementById('gradeNoteNumerique').value;
        if (!type_controle || !note_numerique) {
            showAlert('Veuillez sélectionner le type de contrôle et entrer une note');
            return;
        }
        bodyData.type_controle = type_controle;
        bodyData.note_numerique = parseFloat(note_numerique);
    }

    try {
        const response = await fetch(`${API_URL}/grades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();

        if (response.ok) {
            showAlert(data.message || 'Note ajoutée avec succès', 'success');
            document.getElementById('gradeStudent').value = '';
            document.getElementById('gradeMatiere').value = '';
            document.getElementById('gradeNote').value = '';
            document.getElementById('gradeControlType').value = '';
            document.getElementById('gradeNoteNumerique').value = '';
            loadGrades();
        } else {
            showAlert(data.error || 'Erreur lors de l\'ajout');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur');
    }
});

// Update class dropdowns
function updateClassDropdowns(classes) {
    const studentClassSelect = document.getElementById('studentClass');
    const editStudentClassSelect = document.getElementById('editStudentClass');

    const options = '<option value="">Aucune</option>' +
        classes.map(c => `<option value="${c.id}">${c.nom}</option>`).join('');

    studentClassSelect.innerHTML = options;
    editStudentClassSelect.innerHTML = options;
}

// Initial load
loadClasses();
loadStudents();
loadMatieres();
loadGrades();
