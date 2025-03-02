var tabs = document.getElementById('tab--container').children;
var tabcontents = document.getElementById('tab--content').children;

var myFunction = function() {
	var tabchange = this.mynum;
	for(var int=0;int<tabcontents.length;int++){
		tabcontents[int].className = ' tabcontent';
		tabs[int].className = 'icetab';
	}
	tabcontents[tabchange].classList.add('tab-active');
	this.classList.add('active');
}	

for(var index=0;index<tabs.length;index++){
	tabs[index].mynum=index;
	tabs[index].addEventListener('mouseover', myFunction, false);
}