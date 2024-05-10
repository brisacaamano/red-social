const urlBase = "https://jsonplaceholder.typicode.com/posts";
let post = [];

function getData() {
    fetch(urlBase)
        .then(res => res.json())
        .then(data => {
            post = data;
            renderPostList();
        })
        .catch(error => console.error("Se produjo un error", error));
}
getData();

function renderPostList() {
    const postList = document.getElementById("postList");
    postList.innerHTML = "";

    post.forEach(post => {
        const listItem = document.createElement("li");
        listItem.classList.add("postItem");
        listItem.innerHTML = `
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})">Editar</button>
        <button onclick="deletePost(${post.id})">Eliminar</button>
        
        <div id="editForm-${post.id}" class="editForm" style="display:none">
            <label for="editTitle">Título:</label>
            <input id="editTitle-${post.id}" value="${post.title}" type="text" required>
            <label for="editBody">Comentario:</label>
            <textarea id="editBody-${post.id}" type="text" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})">Actualizar</button>
        </div>
        `;
        postList.appendChild(listItem);
    })
}

function postData() {
    const postTitleInput = document.getElementById("postTitle");
    const postBodyInput = document.getElementById("postBody");
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if (postTitle.trim() == "" || postBody.trim() == "") {
        alert("Los datos son inválidos");
        return;
    }

    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1,
        }),
        headers: {
            "content-type": "application/json; charset=UTF-8",
        },
    })
        .then(res => res.json())
        .then(data => {
            post.unshift(data);
            renderPostList();
            postTitleInput.value = "";
            postBodyInput.value = "";
        })
        .catch(error => console.error("Se produjo un error al crear el posteo: ", error));
}

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == "none") ? "block" : "none";
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            userId: 1,
        }),
        headers: {
            "content-type": "application/json; charset=UTF-8",
        },
    })
        .then(res => res.json())
        .then(data => {
            const index = post.findIndex(post => post.id === data.id);
            if(index != -1){
                post[index] = data;
            }else{
                alert("Se produjo un error al actualizar el posteo");
            }
            renderPostList();
        })
        .catch(error => console.error("Se produjo un error al actualizar el posteo: ", error));
}

function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE',
    })
    .then(res => {
        if(res.ok){
            post = post.filter(post => post.id != id);
            renderPostList();
        }else{
            alert("Se produjo un error al eliminar el posteo");
        }
    })
    .catch(error => console.error('Se produjo un error al eliminar el posteo: ', error));
}