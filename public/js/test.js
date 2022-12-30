function prep() {
    localStorage.clear();
    localStorage.setItem("testing", "running");
}

function loggedOutView() {
    console.assert(document.querySelector('a[href="/signup"]')
		   ?.textContent.includes("Sign up"),
		   "Sign up link does not exist");

    console.assert(document.querySelector('a[href="/login"]')
		   ?.textContent.includes("Log in"),
		   "Log in link does not exist");

    console.assert(!document.querySelector("header button")
		   ?.textContent.includes("Log out"),
		   "Log out button appears while not logged in");

    console.assert(!document.querySelector("form"),
		  "A form is shown while not logged in");
}


setTimeout(() => {
    if (!localStorage.getItem("testing")) {
	prep();
	location.reload();
	return;
    }

    console.log("TESTING");
    
    loggedOutView();
    
    console.log("FINISHED");
    localStorage.clear();
}, 3000);
