import makeDict from "./spa-utils/dict.js";

export const { dict, setLang } =  makeDict("en", {
    home: { en: "Home", ar: "الرئيسية" },
    signup: { en: "Sign up", ar: "التسجيل" },
    login: { en: "Log in", ar: "الدخول" },
    title: {
	en: "Create and vote on polls",
	ar: "أنشئ و صوت على استطلاعات الرأي"
    }
});
