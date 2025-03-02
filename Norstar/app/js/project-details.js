var modal = document.getElementById("project-modal");
var close_modal = modal.querySelector('.close-modal-project')
var bg_modal = modal.querySelector('.bg-modal-project')
document.querySelectorAll('.js-project').forEach(d => d.addEventListener("click", (event) => {
    modal.style.display = "flex"; 
}))
 
close_modal.addEventListener('click', function (){
    modal.style.display = "none";
})

bg_modal.addEventListener('click', function (){
    modal.style.display = "none";
})

