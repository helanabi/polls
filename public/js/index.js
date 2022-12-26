import cons from "./spa-utils/cons.js";
import { link, router } from "./spa-utils/router.js";
import home from "./home.js";
import login from "./login.js";
import signup from "./signup.js";

function header(userLoggedIn) {
    const links = cons("ul", cons("li", link("/", "Home")));

    if (!userLoggedIn) {
	links.append(
	    cons("li", link("/signup", "Sign up")),
	    cons("li", link("/login", "Log in")));
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
	shared.user = user;
	currentHeader.replaceWith(currentHeader = header(Boolean(user)));
    }

    const container = new DocumentFragment();
    let currentHeader = header(Boolean(shared.user));

    const routes = new Map()
	  .set(/\/$/, () => home(shared))
	  .set(/\/login$/, () => login(setUser))
	  .set(/\/signup$/, signup)
	  .set(/\//, notfound);

    container.append(
	currentHeader,
	router(routes));

    return container;
}

document.body.replaceChildren(app());
