let notes_container =  document.querySelector('[data-notes-container]')
let notes = localStorage.getItem('notes') ?  localStorage.getItem('notes') : ""
let mood = document.querySelector("[data-mode]")
let btns_delete = [...document.querySelectorAll("[data-remove]")]
let add_btn = document.querySelector('[data-addBtn]')
let edit_btns =[...document.querySelectorAll('[data-edit]')]
let ok_btns = [...document.querySelectorAll('[data-save]')]
let edit_delete_togglers = [...document.querySelectorAll('[data-toggle-edit]')]

if (notes.length > 0) {
    
    JSON.parse(notes).forEach(note => {
            create_note(note.title , note.body , true)
    })
}

let mode = localStorage.getItem('mode') ? localStorage.getItem('mode') : "dark"

if (mode === "light") {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark")
    }
}




mood.addEventListener('click', ()=> {
    document.body.classList.toggle('dark')
    mood.querySelector('.toggler-container').classList.toggle('active')
    document.body.classList.contains('dark') ? localStorage.setItem('mode' , 'dark') : localStorage.setItem('mode' , 'light')
})

edit_delete_toggle(edit_delete_togglers)
delete_listeners(btns_delete)
edit_listeners(edit_btns)
ok_listeners(ok_btns)
body_text_listener()
title_text_listener()



add_btn.addEventListener('click', () => create_note())

function create_note(title='' , body='' , retrevie = false) {
     cloned_note = document.querySelector('template').content.cloneNode(true)
     notes_container.prepend(cloned_note)
     let new_note = notes_container.querySelector('[data-note]')
     new_note.removeAttribute('data-temp')
     btns_delete.push( notes_container.querySelector('[data-remove]'))
     edit_btns.push(notes_container.querySelector('[data-edit]'))
     ok_btns.push(notes_container.querySelector('[data-save]'))
     edit_delete_togglers.push(notes_container.querySelector('[data-toggle-edit]'))
     delete_listeners(btns_delete)
     edit_delete_toggle(edit_delete_togglers)
     edit_listeners(edit_btns)
     ok_listeners(ok_btns)
     title_text_listener()
     body_text_listener()
     notes_container.querySelector('[data-title]').innerText = title
     notes_container.querySelector('[data-note-body]').innerText = body
     if (retrevie === false) {
        notes_container.querySelector('[data-toggle-edit]').classList.toggle('active')
        notes_container.querySelector('[data-title]').innerText = title ? title : "Add Title"
        new_note.querySelector('[data-note-body]').focus()
        new_note.querySelector('[data-note-body]').setAttribute("contenteditable", true)
        notes_container.querySelector('[data-title]').setAttribute("contenteditable", true)
     }
     
}


function edit_listeners(edit_btns) {
    edit_btns.forEach(btn => btn.addEventListener('click' ,edit) )
}

function edit(e) {
    e.target.closest('[data-note]').querySelector('[data-title]').setAttribute('contenteditable','true')
    e.target.closest('[data-note]').querySelector('[data-note-body]').setAttribute('contenteditable','true')
}

function ok_listeners(ok_btns) {
    ok_btns.forEach(ok_btn => ok_btn.addEventListener('click', ok))
}
function ok(e) {
    
    let title = e.target.closest('[data-note]').querySelector('[data-title]')
    let body = e.target.closest('[data-note]').querySelector('[data-note-body]')
    if (body.textContent.length === 0 ) {
        e.target.closest('[data-note]').querySelector("[data-remove]").click()
        return
    }
    if (title.textContent.length < 1) {
        title.textContent = "Note"
    }
    title.setAttribute('contenteditable','false')
    body.setAttribute('contenteditable','false')
    
    let old_notes = JSON.parse(localStorage.getItem('notes')) ? JSON.parse(localStorage.getItem('notes')) : []

    localStorage.setItem('notes',JSON.stringify([...old_notes , {"title":title.textContent , "body":body.textContent}]))

}

function delete_listeners(delete_btns) {
    delete_btns.forEach(delete_btn => delete_btn.addEventListener('click',delete_note))
}

function delete_note(e) {
    title = e.target.closest('[data-note]').querySelector('data-title')
    body = e.target.closest('[data-note]').querySelector('data-note-body')
    
    let new_notes = JSON.parse(localStorage.getItem('notes')).filter(note => note.title === title && note.body === body)
    localStorage.setItem('notes'  , JSON.stringify(new_notes))
    e.target.closest('[data-note]').remove()
}


function edit_delete_toggle(togglers) {
    togglers.forEach(toggler => toggler.addEventListener('click',toggle))
    
}

function toggle(e) {
    e.target.closest('[data-toggle-edit]').classList.toggle('active')
    
}


function body_text_listener() {
    
    document.querySelectorAll('[data-note-body]').forEach(note_body => {
        note_body.addEventListener('keydown',limit_body_text)
      
    })

}
function limit_body_text(e) {
    if (!(e.code === 'Delete' || e.code === 'Backspace' || e.code === "ArrowUp" || e.code === "ArrowDown"|| e.code === "ArrowLeft" || e.code === "ArrowRight")) {
        if (e.target.textContent.length > 370) {
            e.preventDefault()
        }
    }

}
function title_text_listener() {
    document.querySelectorAll('[data-title]').forEach(note_title => note_title.addEventListener('keydown',limit_title_text))    
}
function limit_title_text(e) {
    if (!(e.code === 'Delete' || e.code === 'Backspace' || e.code === "ArrowUp" || e.code === "ArrowDown"|| e.code === "ArrowLeft" || e.code === "ArrowRight")) {
        if (e.target.textContent.length > 20) {
            e.preventDefault()
        }
    }

}
