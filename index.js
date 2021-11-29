var temp_employees = []
var count_emp_check=0;
var count_paf_check=0;
var id_position=73;
var assigned_paf = []

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

// INICIA TABLA LISTADO TEMPORAL

add_events_temp_table = () => {
    const botones = document.querySelectorAll(".check_temp_table");
    botones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.target.checked ? count_emp_check+=1 : count_emp_check-=1
            if (count_emp_check>0) {
                document.getElementById("list_pafs").style.display='block'
            } else {
                document.getElementById("list_pafs").style.display='none'
                document.getElementById("ListPAFS").classList.remove("show")
            }
        });
    });
}

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
                    <td><input class="form-check-input check_temp_table" name="${element.shortname}" type="checkbox" value="" id="check${element.id_employee}"></td>
                </tr>
                `
    });  
    table += `<tr>
                    <td colspan="7" style="text-align: center;display: none;" id="row_loading">
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
    add_events_temp_table()
}

// TERMINA TABLA LISTADO TEMPORAL

// INICIA TABLA PAF-TYPE

const add_events_PAF = () => {
    document.getElementById("body").addEventListener("click", (e) => {
        if (!['LI', 'INPUT', 'LABEL'].includes(e.target.tagName)) {
            document.getElementById("ListPAFS").classList.remove("show")
        }
    })
    const lob_checks = document.querySelectorAll(".paf_check");

    lob_checks.forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.target.checked ? count_paf_check+=1 : count_paf_check-=1
            if (count_paf_check>0) {
                document.getElementById("assign").style.display='block'
            } else {
                document.getElementById("assign").style.display='none'
            }
        });
    });
}

function render_PAF_list(paf_types) {
    var list = `<div><ul class="list-group overflow-auto" style="position: absolute;max-width: 260px; max-height: 160px;">`
    paf_types.forEach(element => {
        let disabled = element.id_PAFType == 25 ?'':'disabled'
        list +=`<li class="list-group-item" style="font-size: .75rem;"><input class="paf_check form-check-input me-1" name=${element.PAFType} type="checkbox" value=${element.id_PAFType} aria-label="..." id="Check${element.id_PAFType}" ${disabled}>
        <label class="form-check-label" for="Check${element.id_PAFType}">${element.PAFType}</label></li>`
    }); 
    list += '</ul></div>'
    document.getElementById("ListPAFS").innerHTML = list
}

const get_paf_type_list = async () => {
    let response = await fetch(`http://127.0.0.1:8000/paf/?option=3&id_position=${id_position}`)
    let paf_types = await response.json()
    render_PAF_list(paf_types)
    add_events_PAF()
}

get_paf_type_list()
// TERMINA TABLA PAF-TYPE

// INICIA ASSIGN BUTTON
function render_modal() {
    let modal = ''
    assigned_paf.forEach(element => {
        modal += `
                <tr>
                <th scope="row">${element.name}</th>
                <td>${element.paf}</td>
                <td><img src="https://img.icons8.com/flat-round/30/000000/checkmark.png"></td>
                </tr>
                `
    });
    document.getElementById("modal_paf").innerHTML= modal
}

document.getElementById('assign').addEventListener("click", () => {
    assigned_paf = []
    const employees =document.querySelectorAll(".check_temp_table")
    const pafs =document.querySelectorAll(".paf_check")
    employees.forEach( employee => {
        if (employee.checked) {
            pafs.forEach( paf => {
                if (paf.checked) {
                    var obj = new Object();
                    obj.id_employee = employee.id.replace("check", "") ;
                    obj.name = employee.name ;
                    obj.id_PAFType= paf.id.replace("Check", "")
                    obj.paf = paf.name ;
                    assigned_paf.push(obj)
                }
            })
        }
    })
    render_modal()
})

// TERMINA ASSIGN BUTTON

// INICIA FORMS PAFTYPES

const render_position_description = async (id_position) => {
    let loader = `<div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                    </div>
                </div>`
    document.getElementById("position_information").innerHTML = loader
    let response = await fetch(`http://127.0.0.1:8000/paf/?option=5&id_position=${id_position}`)
    let position_description = await response.json()
    let description = ` <div class="form-floating">
                        <input type="text" name="department" class="form-control"  id="floatingInputdepartment" data-value=${position_description[0].id_department} value="${position_description[0].department}" readonly>
                        <label for="floatingInputdepartment">Department</label>
                        </div>
                        <div class="form-floating">
                        <input type="text" name="area" class="form-control"   id="floatingInputarea" data-value=${position_description[0].id_area} value="${position_description[0].area}" readonly>
                        <label for="floatingInputarea">Area</label>
                        </div>
                        <div class="form-floating">
                        <input type="text" name="group" class="form-control" id="floatingInputgroup" data-value=${position_description[0].id_group} value="${position_description[0].group}" readonly>
                        <label for="floatingInputgroup">Group</label>
                        </div>
                        `
    document.getElementById("position_information").innerHTML = description
}

const addPaf_events = (id_PAFType) => {
    var form = document.getElementById("Form25")
    document.getElementById("Form25").addEventListener('submit', (e)=>{
        e.preventDefault();
        var formData = new FormData(form)
        var json = {};
        formData.forEach((value, key) => {
            if (key == 'position') {
                let datalist = document.getElementById("PositionsdatalistOptions").childNodes
                for (let i = 0; i < datalist.length; i++) {
                    if (datalist[i].value === value) {
                        json[key] = datalist[i].dataset.value;
                    }
                } 
            } else if(key =='supervisor'){
                let datalist = document.getElementById("SupervisordatalistOptions").childNodes
                for (let i = 0; i < datalist.length; i++) {
                    if (datalist[i].value === value) {
                        json[key] = datalist[i].dataset.value;
                    }
                }
            } else if(['group','department','area'].includes(key)){
                let a=1 // se agrega manual
            } else {
                json[key] = value
            }    
        })
        json["department"] = document.getElementById("floatingInputdepartment").getAttribute('data-value')
        json["area"] = document.getElementById("floatingInputarea").getAttribute('data-value')
        json["group"] = document.getElementById("floatingInputgroup").getAttribute('data-value');
        json["id_PAFType"]= id_PAFType
        create_paf(json)
    })
    document.getElementById("PositionDataList").addEventListener("change", (e) => {
        var target = e.target.value
        if(target !==''){
            var datalist = document.getElementById('PositionsdatalistOptions').childNodes;
            for (var i = 0; i < datalist.length; i++) {
                if (datalist[i].value == target) {
                    render_position_description(datalist[i].dataset.value);
                    break;
                }
            }

        }
    })
    
}

const render_datalist = (array) => {
    let datalist = ''
    array.forEach(element => {
        datalist += `<option data-value=${element.value} value="${element.text}">`
    });
    return datalist
}

const get_ESC_weeklyHours = async ()  => {
    let input = `
            <label for="input_WH" class="form-label">New Weekly Hours</label>
            <input type="number" name="weekly_hours" class="form-control" id="input_WH" required>
            `
    document.getElementById("input_weekly_hours").innerHTML = input
}

const get_ESC_comments = async ()  => {
    let input = `
            <label for="texarea_coments" class="form-label">Comments</label>
            <textarea class="form-control" name="comments" id="texarea_coments" rows="3" required></textarea>
            `
    document.getElementById("input_comments").innerHTML = input
}

const get_ESC_supervisor = async ()  => {
    let response = await fetch(`http://127.0.0.1:8000/paf/?option=4&value=supervisor`)
    let ESC_supervisor = await response.json()
    let data = render_datalist(ESC_supervisor)
    let datalist = `
            <label for="exampleDataList" class="form-label">New Supervisor</label>
            <input class="form-control" name="supervisor" list="SupervisordatalistOptions" id="exampleDataList" placeholder="Type to search..." required>
            <datalist id="SupervisordatalistOptions">
            ${data}
            </datalist>
            `
    document.getElementById("datalist_supervisor").innerHTML = datalist
}

const get_ESC_positions = async ()  => {
    let response = await fetch(`http://127.0.0.1:8000/paf/?option=4&value=position`)
    let ESC_positions = await response.json()
    let data = render_datalist(ESC_positions)
    let datalist = `
            <label for="exampleDataList" class="form-label">New Position</label>
            <input class="form-control" name="position" list="PositionsdatalistOptions" id="PositionDataList" placeholder="Type to search..." required>
            <datalist id="PositionsdatalistOptions">
            ${data}
            </datalist>
            `
    document.getElementById("datalist_positions").innerHTML = datalist
}

const render_form = () => {
    formPAFType = `
            <form id="Form25">
            <div class="mb-3">
                <label for="InputEffectiveDate" class="form-label">Effective Date</label>
                <input type="date" class="form-control" name="date" id="InputEffectiveDate" aria-describedby="DescriptionDate" required>
                <div id="DescriptionDate" class="form-text">The modification will be effective as of this date.</div>
            </div>
            <div class="mb-3" id="datalist_positions">
                <button class="btn btn-primary" type="button" disabled>
                <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                Loading...
                </button>
            </div>
            <div class="mb-3" id="position_information">
            </div>
            <div class="mb-3" id="datalist_supervisor">
                <button class="btn btn-primary" type="button" disabled>
                <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                Loading...
                </button>
            </div>
            </div>
                <div class="mb-3" id="input_weekly_hours">
                <button class="btn btn-primary" type="button" disabled>
                <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                Loading...
                </button>
            </div>
            </div>
                <div class="mb-3" id="input_comments">
                <button class="btn btn-primary" type="button" disabled>
                <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                Loading...
                </button>
            </div>
            <input type="submit" class="btn btn-primary" value="Continue">
        </form>
        `
        document.getElementById("PAFInformation").innerHTML = formPAFType
}

const render_PAF_information = async (id_PAFType) => {
    
    if (id_PAFType=25) {
        await render_form()
        await get_ESC_positions()
        await get_ESC_supervisor()
        await get_ESC_weeklyHours()
        await get_ESC_comments()
        await addPaf_events(id_PAFType)
    } 
}

const get_paf_information = () => {
    const pafs =document.querySelectorAll(".paf_check")
    let PAFType = [25]
     pafs.forEach( paf => {
         if (paf.checked) {
             let id_paf_type=  parseInt(paf.id.replace("Check", ""))
             PAFType.push(id_paf_type)
         }
     })
    PAFType.forEach(element => {
        render_PAF_information(element)
    })
}

const emptydata = () => {
    document.getElementById("employeeDataList").setAttribute("disabled", "")
    document.getElementById("assign").style.display='none'
    document.getElementById("list_pafs").style.display='none'
    document.getElementById("ListPAFS").classList.remove("show")
    temp_employees = []
    const pafs =document.querySelectorAll(".form-check-input")
    pafs.forEach( paf => {
        paf.setAttribute("disabled", "")
    })
}

document.getElementById("modal-button").addEventListener("click", () => {
    emptydata()
    get_paf_information()
})

get_paf_information()
// TERMINA FORMS PAFTYPES

// INICIA CREAR PAF

const insert_paf_db = async (obj) => {
    let post_param = `${obj.id_PAFType}|-|${obj.date}|-|${obj.position}|-|${obj.department}|-|${obj.area}|-|${obj.group}|-|${obj.supervisor}|-|${obj.weekly_hours}|-|${obj.comments}`
    let response = await fetch(`http://127.0.0.1:8000/paf/?option=7&post_param=${post_param}`)
    let PAF_RESULT = await response.json()
    console.log(PAF_RESULT)
}

const render_PAF_Modal = async (obj) => {
    let response = await fetch(`http://127.0.0.1:8000/paf/?option=6&id_pafType=${obj.id_PAFType}`)
    let authorization = await response.json()
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let need = authorization[0].count == 0 ? 'not' :''
    if (obj.date <= date) {
        let modal = `<p class="text-center fw-bold">This PAF does ${need} need authorization, it will be applied automatically.</p>`
        document.getElementById("modal-body-paf").innerHTML= modal
    } else if (obj.date > date) {
        let modal = `<p class="text-center fw-bold">This process does ${need} need authorization, it will be applied on the future date indicated.</p>`
        document.getElementById("modal-body-paf").innerHTML= modal
    }
}

const create_paf = async (obj) => {
    var myModal = await new bootstrap.Modal(document.getElementById('CreatePAFModal'), {keyboard: false})
    await myModal.show()
    await render_PAF_Modal(obj)
    await insert_paf_db(obj)
}
// TERMINA CREAR PAF