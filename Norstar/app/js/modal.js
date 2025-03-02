
let blog_container = document.querySelector('.tf-blog')
let title = blog_container.querySelectorAll('.js-blog')
var modal = document.getElementById("myModal");
var close_modal = modal.querySelector('.close-modal')
var bg_modal = modal.querySelector('.close-modal')
blog_container.querySelectorAll('.js-blog').forEach(d => d.addEventListener("click", (event) => {
    document.querySelector('body').classList.add('active_blog')
    modal.style.display = "block";
}))
 
close_modal.addEventListener('click', function (){
    modal.style.display = "none";
})

bg_modal.addEventListener('click', function (){
    modal.style.display = "none";
})

