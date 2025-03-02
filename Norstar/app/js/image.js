var posts = document.querySelector('.wrapper-image-box-style2');
var post = posts.querySelectorAll('.image-box-style2');
console.log(post.length);
var i;
for (i = 0; i < post.length; i++) {
    post[i].addEventListener("mouseover", function() {
        this.classList.add("toggle");
        console.log(this.querySelector('img').src);
        src = this.querySelector('img').src;
        posts.style.backgroundImage = "url(" + src;
        console.log(this.querySelector('img').src);
    });
}

for (i = 0; i < post.length; i++) {
    post[i].addEventListener("mouseout", function() {
        this.classList.remove("toggle");
       
    });
}

