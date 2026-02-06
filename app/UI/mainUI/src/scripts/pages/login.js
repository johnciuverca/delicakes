import { onReady, setActiveNavLink } from "../common";
function getRoleValue() {
    const roleEl = document.getElementById("role");
    if (!(roleEl instanceof HTMLSelectElement)) {
        return "";
    }
    return roleEl.value;
}
function getPasswordValue(form) {
    const input = form.querySelector('input[name="psw"]');
    return input?.value ?? "";
}
onReady(() => {
    setActiveNavLink();
    const loginForm = document.querySelector(".login-form");
    if (!loginForm)
        return;
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const role = getRoleValue();
        const inputPassword = getPasswordValue(loginForm);
        fetch("/expense-tracker", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                role,
                psw: inputPassword,
            }),
        })
            .then(async (res) => {
            if (!res.redirected && res.status === 200) {
                const data = (await res.json());
                document.cookie = `auth=${data.authCookie}; path=/`;
                window.location.href = "/expense-tracker";
                return;
            }
            if (res.status === 401) {
                alert("Unauthorized: Incorrect password.");
                return;
            }
            alert("Login failed. Please try again.");
        })
            .catch(() => {
            alert("Login failed. Please try again.");
        });
    });
});
//# sourceMappingURL=login.js.map