
const tbody = document.querySelector('tbody');
const nameInput = document.querySelector('#name');
const courseInput = document.querySelector('#course');
const rollnoInput = document.querySelector('#rollno');
const addButton = document.querySelector('button');

addButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const course = courseInput.value;
    const rollno = rollnoInput.value;
    
    console.log('Adding new student:', name, course, rollno);
    try {
        const response = await axios.post('http://localhost:3000/students', {
            name: name,
            course: course,
            rollno: rollno
        });

        const newStudent = response.data;
        console.log('New student added:', newStudent); 
        appendRow(newStudent.id,name, course, rollno);
    
        nameInput.value = '';
        courseInput.value = '';
        rollnoInput.value = '';
    } catch (error) {
        console.error('Error adding new student:', error);
    }
});

async function fetchStudents() {
    try {
        const response = await axios.get('http://localhost:3000/students');
        const students = response.data;
        console.log('Fetched students:', students);
        tbody.innerHTML = '';

        students.forEach(student => {
            appendRow(student.id,student.name, student.course, student.rollno);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function appendRow(id,name, course, rollno) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = name;
    const courseCell = document.createElement('td');
    courseCell.textContent = course;
    const rollnoCell = document.createElement('td');
    rollnoCell.textContent = rollno;
    const editbutton=document.createElement('button');
    editbutton.textContent='Edit';
    const deletebutton=document.createElement('button');
    deletebutton.textContent='Delete';
    editbutton.addEventListener('click', () => {
        editStudent(id,name, course, rollno);
    });

    deletebutton.addEventListener('click', () => {
        deleteStudent(id,name, course, rollno);
    });

    row.appendChild(nameCell);
    row.appendChild(courseCell);
    row.appendChild(rollnoCell);
    row.appendChild(editbutton);
    row.appendChild(deletebutton);
    tbody.appendChild(row);
}

async function editStudent(id,name, course, rollno) {
    const newName = prompt('Enter new name:', name);
    const newCourse = prompt('Enter new course:', course);
    const newRollno = prompt('Enter new roll no:', rollno);

    try {
        const response = await axios.put(`http://localhost:3000/students/${id}`, {
            name: newName,
            course: newCourse,
            rollno: newRollno
        });

        const updatedStudent = response.data;
        console.log('Student updated:', updatedStudent);

        fetchStudents();
    } catch (error) {
        console.error('Error updating student:', error);
    }
}

async function deleteStudent(id,name, course, rollno) {
    const confirmation = confirm(`Are you sure you want to delete ${name}?`);

    if (confirmation) {
        try {
            console.log(id);
            await axios.delete(`http://localhost:3000/students/${id}`);
            console.log('Student deleted:', name);
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    }
}


fetchStudents();
