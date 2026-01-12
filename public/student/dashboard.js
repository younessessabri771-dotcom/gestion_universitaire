const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// Check authentication
if (!token || localStorage.getItem('userRole') !== 'student') {
    window.location.href = '/student/login.html';
}

// Display student name
document.getElementById('studentName').textContent = localStorage.getItem('studentName') || 'Étudiant';

// Logout function
function logout() {
    localStorage.clear();
    window.location.href = '/student/login.html';
}

// Load student data and grades
async function loadStudentData() {
    try {
        const response = await fetch(`${API_URL}/students/me/grades`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            localStorage.clear();
            window.location.href = '/student/login.html';
            return;
        }

        const data = await response.json();

        // Display student information
        document.getElementById('infoName').textContent = data.student.nom_complet;
        document.getElementById('infoEmail').textContent = data.student.email;
        document.getElementById('infoClasse').textContent = data.student.classe || 'Non assigné';

        // Display grades
        const tbody = document.getElementById('gradesTableBody');
        const noGradesMessage = document.getElementById('noGradesMessage');
        const gradesContainer = document.getElementById('gradesContainer');

        if (data.grades.length === 0) {
            gradesContainer.style.display = 'none';
            noGradesMessage.style.display = 'block';
        } else {
            gradesContainer.style.display = 'block';
            noGradesMessage.style.display = 'none';

            let gradesHTML = '';

            data.grades.forEach(gradeGroup => {
                if (gradeGroup.simple) {
                    // Simple mode: Display single grade
                    gradesHTML += `
                        <tr>
                            <td colspan="2"><strong>${gradeGroup.matiere_nom}</strong></td>
                            <td>
                                <span style="color: var(--accent-color); font-weight: 600; font-size: 1.125rem;">
                                    ${gradeGroup.simple.note}
                                </span>
                            </td>
                            <td>${new Date(gradeGroup.simple.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</td>
                        </tr>
                    `;
                } else if (gradeGroup.controls && gradeGroup.controls.length > 0) {
                    // Control mode: Display multiple controls grouped
                    const average = (gradeGroup.controls.reduce((sum, c) => sum + c.note, 0) / gradeGroup.controls.length).toFixed(2);

                    // First row: Subject name with average
                    gradesHTML += `
                        <tr style="background: rgba(99, 102, 241, 0.1);">
                            <td colspan="2"><strong style="font-size: 1.1rem;">${gradeGroup.matiere_nom}</strong></td>
                            <td colspan="2" style="text-align: right;">
                                <span style="color: var(--primary-color); font-weight: 700;">
                                    Moyenne: ${average}/20
                                </span>
                            </td>
                        </tr>
                    `;

                    // Control rows
                    gradeGroup.controls.forEach(control => {
                        gradesHTML += `
                            <tr>
                                <td style="padding-left: 2rem;">↳</td>
                                <td>${control.type}</td>
                                <td>
                                    <span style="color: var(--accent-color); font-weight: 600; font-size: 1.125rem;">
                                        ${control.note}/20
                                    </span>
                                </td>
                                <td>${new Date(control.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</td>
                            </tr>
                        `;
                    });
                }
            });

            tbody.innerHTML = gradesHTML;
        }
    } catch (error) {
        console.error('Error loading student data:', error);
        document.getElementById('gradesTableBody').innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: var(--danger-color);">
                    Erreur lors du chargement des données
                </td>
            </tr>
        `;
    }
}

// Initial load
loadStudentData();
