var modal2 = document.getElementById("blog-modal");
var close_modal2 = modal2.querySelector('.close-modal-blog')
var bg_modal2 = modal2.querySelector('.bg-modal-blog')
document.querySelectorAll('.js-blog').forEach(d => d.addEventListener("click", (event) => {
    modal2.style.display = "flex";
}))
 
close_modal2.addEventListener('click', function (){
    modal2.style.display = "none";
})

bg_modal2.addEventListener('click', function (){
    modal2.style.display = "none";
})

