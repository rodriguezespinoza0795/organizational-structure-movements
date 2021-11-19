var temp_employees = []

// INICIA CARGA DE FILTRO EMPLEADOS

const get_employee_list = async () => {
    let response = await fetch('http://127.0.0.1:8000/paf/?option=1')
    let employees = await response.json()
    await render_employeeList(employees)
    await displayLoading()
    await add_events_filters()
}

const render_employeeList = (employees) => {
    let employeelist = ''
    employees.forEach(element => {
        employeelist += `<option value=${element.id_employee}>${element.shortname}</option>`
    });
    document.getElementById("employeelistOptions").innerHTML = employeelist
}

function displayLoading() {
    document.getElementById("Loadingemployeelist").style.display = "none"
    document.getElementById("employeeDataList").style.display = "block"
}

add_events_filters = () => {
    document.getElementById("listPeople").addEventListener("change",(e)=>{
        if(e.target.value!=='') {
            get_employee_information(e.target.value)
        }
    });
}

get_employee_list()

// TERMINA CARGA DE FILTRO EMPLEADOS

// INICIA LISTADO TEMPORAL

function render_table() {
    let table = ''
    temp_employees.forEach(element => {
        element = JSON.parse(element)
        table +=`<tr>
                    <th scope="row">${element.id_employee}</th>
                    <td>${element.shortname}</td>
                    <td><img src=${element.path_image} alt=${element.shortName} width="30" height="30"></td>
                    <td>${element.position}</td>
                    <td>${element.supervisor}</td>
                    <td>${element.weeklyHours}</td>
                </tr>
                `
    });  
    table += `<tr>
                    <td colspan="6" style="text-align: center;display: none;" id="row_loading">
                    <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </td>
                </tr>`
    document.getElementById("table").innerHTML = table;
}
const get_employee_information = async (id_employee) => {
    document.getElementById("row_loading").style.display= "table-cell"
    let response = await fetch(`http://127.0.0.1:8000/paf/?option=2&id_employee=${id_employee}`)
    let information = await response.json()
    let employee_object = JSON.stringify(information[0])
    if(!temp_employees.includes(employee_object)){
        temp_employees.push(employee_object)
    } 
    render_table()
}




// TERMINA LISTADO TEMPORAL