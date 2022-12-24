import cons from "./spa-utils/cons.js";
import { link } from "./spa-utils/router.js";
import pollList from "./poll-list.js";

function header() {
    return cons("header",
		cons("h1", "Polls"),
		cons("span", "Create and vote on polls"),
		cons("ul",
		     cons("li", link("/", "Home"))));
}

document.body.append(
    header(),
    pollList());
