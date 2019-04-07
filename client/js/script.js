

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    $.ajax({
        method: `POST`,
        url: `http://localhost:3000/google`,
        data: {
            id_token
        }
    })
    .done((response)=> {
        $(`#login`).hide()
        $(`#action-btn`).show()
        console.log(response)
        localStorage.setItem('token', response.token)
        localStorage.setItem('_id', response.userDetails._id)
        todo()
    })
    .fail((err)=> {
        console.log(err.responseJSON)
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    $(`#login`).show()
    $(`#action-btn`).hide()
    $(`#todo`).hide()
    $(`#zero-todo`).hide()
}

function manualLogin() {
    event.preventDefault()
    $.ajax({
        method : `POST`,
        url: `http://localhost:3000/login`,
        data : {
            email : $(`#email`).val(),
            password : $(`#password`).val(),
        },
    })
    .done((response)=> {
        $(`#login`).hide()
        $(`#action-btn`).show()
        $(`#todo`).show()
        console.log(response);
        localStorage.setItem('token', response.token)
        localStorage.setItem('_id', response.userDetails._id)
        todo()
    })
    .fail((err)=> {
        swal("sorry, buddy...", "username/password is incorrect", "warning");
        console.log(err.responseJSON);
    })
}

function register() {
    
    event.preventDefault()
    let firstName = $(`#first_name`).val()
    let lastName = $(`#last_name`).val()
    let email = $(`#new-email`).val()
    let password = $(`#new-password`).val()
    
    $.ajax({
        url: `http://localhost:3000/register`,
        method : `POST`,
        data: {
            firstName,
            lastName,
            email,
            password
        }
    })
    .done((response)=> {
        console.log(response);
        $(`#register`).hide()
        $(`#login`).show()
    })
    .fail((err)=> {
      
        swal("sorry, buddy...", err.responseJSON.msg, "warning");
    })
    
}

function todo() {

    $(`#todo-content`).empty()
    $(`#description`).empty()
    let id = localStorage.getItem(`_id`)
    $.ajax({
        url: `http://localhost:3000/todo/${id}`,
        method: `GET`,
        headers : {
            token : localStorage.getItem(`token`)
        }
    })
    .done((response)=> {
        
        if (response.length == 0) {
            $(`#todo`).hide()
            $(`#zero-todo`).show()
        } else {
            $(`#todo`).show()
            $(`#zero-todo`).hide()
            response.forEach(list => {
                let label;
                let completeDate;

                if (list.status == false) {
                    label = ` <label>
                                <input type="checkbox" class="filled-in" onclick="changeStatus('${list._id}')"/>
                                <span>Uncompleted</span>
                              </label>`
                } else {
                    label = ` <label>
                                <input type="checkbox" class="filled-in" checked="checked" onclick="changeStatus('${list._id}')"/>
                                <span>Completed</span>
                            </label>`
                }

                if (list.completedAt !== null) {
                    completeDate = new Date(list.completedAt).toDateString()
                } else {
                    completeDate = null
                }

                $(`#todo-content`).append(
                    ` <tr>
                         <td>${label}</td>
                         <td>${list.title}</td>
                         <td>${new Date(list.createdAt).toDateString()}</td>
                         <td>${completeDate}</td>
                          <td>${list.description}</td>
                          <td>${new Date(list.dueDate).toDateString()}</td>
                          <td>${list.dueTime}</td>
                          <td> <a class="btn-floating btn-small waves-effect waves-light red" onclick="deleteTodo('${list._id}')"><i class="material-icons">delete</i></a></td>
                      </tr>`
                )
            })

            $(`#todo-content`).show()
            $(`#description`).show()
        }
        console.log(response);
    })
    .fail((err)=> {
        console.log(err.responseJSON);
    })
}

function addTodo() {
    $.ajax({
        url : `http://localhost:3000/todo/create`,
        method : `POST`,
        data : { title : $(`#title`).val(),
                description : $(`textarea#description`).val(),
                status : false,
                dueDate : new Date($(`#dueDate`).val()),
                dueTime : $(`#dueTime`).val(),
                createdAt : new Date,
                completedAt : null,
                userId : localStorage.getItem(`_id`)},
        headers : {  token : localStorage.getItem(`token`) }
    })
    .done((response)=> {

        let {status, title, createdAt, description, completedAt, dueDate} = response.todoDetails
        
        if (status == true) {
            status = ` <label>
                            <input type="checkbox" class="filled-in" checked="checked" />
                            <span>Completed</span>
                       </label>`
        } else {
            status = ` <label>
                            <input type="checkbox" class="filled-in"/>
                            <span>Uncompleted</span>
                       </label>`
        }
        console.log(completedAt)
        $(`#todo-content`).append(
           ` <tr>
                <td>${status}</td>
                <td>${title}</td>
                <td>${new Date(createdAt).toDateString()}</td>
                <td>${completedAt}</td>
                 <td>${description}</td>
                 <td>${new Date(dueDate).toDateString()}</td>
                 <td><a class="btn-floating btn-small waves-effect waves-light red")><i class="material-icons">delete</i></a></td>
             </tr>`
         )
        todo()
        console.log(response);
    })
    .fail((err)=> {
        console.log(err.responseJSON);  
    })

}

function changeStatus(idTodo) {
   $.ajax({
       url: `http://localhost:3000/todo/${idTodo}/update`,
       method : `PUT`,
       headers : {
        token : localStorage.getItem(`token`)
       }
   })
   .done((response)=> {
       todo()
       console.log(response);
   })
   .fail((err)=> {
       console.log(err.responseJSON);
   })
}

function deleteTodo(idTodo) {

    $.ajax({
        url: `http://localhost:3000/todo/${idTodo}/delete`,
        method : `DELETE`,
        headers : {
            token : localStorage.getItem(`token`)
        }
    })
    .done((response)=> {
        todo()
        console.log(response);
    })
    .fail((err)=> {
        console.log(err.responseJSON)
    })
}

$(document).ready(function() {
    let token = localStorage.getItem(`token`)
    
    if (token) {
        $(`#zero-todo`).hide()
        $(`#todo`).show()
        $(`#register`).hide()
        $(`#login`).hide()
        $(`#action-btn`).show()
        todo()
        $(`#logout-btn`).on(`click`, function(){
            $(`#action-btn`).hide()
            $(`#login`).show()
            signOut()
            localStorage.removeItem(`token`)
            localStorage.removeItem(`_id`)
        })
    } else {
        $(`#zero-todo`).hide()
        $(`#login`).show()
        $(`#todo`).hide()
        $(`#register`).hide()
        $(`#action-btn`).hide()
    }
        $(`#back-btn`).on(`click`, function(){
            $(`#register`).hide()
            $(`#login`).show()
        })
        $(`#register-btn`).on(`click`, function(){
            $(`#login`).hide()
            $(`#register`).show()
        })
    
});
        
