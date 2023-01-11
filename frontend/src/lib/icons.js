import spinner from "../icons/spinner-solid.svg";
import poll from "../icons/square-poll-horizontal-solid.svg";

const icons = { spinner, poll };

function parse(svg) {
    return new DOMParser()
	.parseFromString(svg, "image/svg+xml")
	.documentElement;
}

export default function icon(name) {
    return icons[name] && parse(icons[name]);
}
