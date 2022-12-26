import cons from "./spa-utils/cons.js";
import { link, router } from "./spa-utils/router.js";
import * as api from "./api.js";
import home from "./home.js";
import login from "./login.js";
import signup from "./signup.js";

function header(userLoggedIn, setUser) {
    const links = cons("ul", cons("li", link("/", "Home")));

    if (!userLoggedIn) {
	links.append(
	    cons("li", link("/signup", "Sign up")),
	    cons("li", link("/login", "Log in")));
    } else {
	links.append(
	    cons("button", { onclick: () => setUser(null) }, "Log out"));
    }
    
    return cons("header",
		cons("h1", "Polls"),
		cons("span", "Create and vote on polls"),
		links);
}

function notfound() {
    return cons("h2", "Page Not Found");
}   

function app() {
    const shared = {};

    function setUser(user) {
	if (user)
	    localStorage.setItem("user", JSON.stringify(user));
	else
	    localStorage.removeItem("user");
	
	shared.user = user;
	api.setToken(user?.token);

	currentHeader.replaceWith(
	    currentHeader = header(Boolean(user), setUser));

	shared.toggleHomeView();
    }

    const routes = new Map()
	  .set(/\/$/, () => home(shared))
	  .set(/\/login$/, () => login(setUser))
	  .set(/\/signup$/, signup)
	  .set(/\//, notfound);

    const container = new DocumentFragment();
    let currentHeader = header(false);
    const notif = cons("div", { hidden: "" });
    const storedUser = localStorage.getItem("user"); 

    if (storedUser) {
	notif.removeAttribute("hidden");
	notif.textContent = "Authenticating user...";
	
	api.authenticate(storedUser)
	    .then(() => {
		setUser(JSON.parse(storedUser));
		notif.setAttribute("hidden", "");
	    })
	    .catch(err => {
		console.error(err = err.toString());
		notif.textContent = err;
	    });
    }

    container.append(currentHeader, notif, router(routes));
    return container;
}

document.body.replaceChildren(app());
