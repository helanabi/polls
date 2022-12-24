import cons from "./spa-utils/cons.js";
import { link, router } from "./spa-utils/router.js";
import pollList from "./poll-list.js";
import signup from "./signup.js";

function header() {
    return cons("header",
		cons("h1", "Polls"),
		cons("span", "Create and vote on polls"),
		cons("ul",
		     cons("li", link("/", "Home")),
		     cons("li", link("/signup", "Sign up"))));
}

function notfound() {
    return cons("h2", "Page Not Found");
}

const routes = new Map()
      .set(/\/$/, pollList)
      .set(/\/signup$/, signup)
      .set(/\//, notfound);

document.body.append(
    header(),
    router(routes));
