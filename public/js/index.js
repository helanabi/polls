import cons from "./spa-utils/cons.js";
import { link, router } from "./spa-utils/router.js";
import * as api from "./api.js";
import dict from "./dict.js";
import home from "./home.js";
import login from "./login.js";
import signup from "./signup.js";
import verify from "./verify.js";

function header(userLoggedIn, setUser) {
    function handleLang(event) {
	dict.setLang(event.target.value);
    }
    
    const links = cons("ul", cons("li", link("/", dict.get("home"))));

    if (!userLoggedIn) {
	links.append(
	    cons("li", link("/signup", dict.get("signup"))),
	    cons("li", link("/login", dict.get("login"))));
    } else {
	links.append(
	    cons("button", { onclick: () => setUser(null) }, "Log out"));
    }

    links.append(
 	cons("select", { onchange: handleLang },
	     cons("option", { value: "en" }, "English"),
	     cons("option", { value: "ar" }, "العربية")));
    
    return cons("header",
		cons("h1", "Polls"),
		cons("span", dict.get("title")),
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
	shared.toggleHomeView?.();
    }

    shared.showNotif = (msg, type) => {
	alert(msg);
    };

    const routes = new Map()
	  .set(/\/$/, () => home(shared))
	  .set(/\/login$/, () => login(setUser))
	  .set(/\/signup$/, signup)
	  .set(/\/verify(\?|$)/, () => verify(shared))
	  .set(/\//, notfound);

    const container = new DocumentFragment();
    let currentHeader = header(false);
    const notif = cons("div", { hidden: "" });
    const storedUser = localStorage.getItem("user"); 

    if (storedUser) {
	notif.removeAttribute("hidden");
	notif.textContent = "Authenticating user...";

	api.request("/api/auth", { payload: storedUser })
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
