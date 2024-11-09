document.addEventListener("DOMContentLoaded", (event) => {
    const signup = document.getElementById("signup");
    const login = document.getElementById("login");
    signup.addEventListener("click", () => {
        const username = document.getElementById("username").value;
        let body = JSON.stringify({"username":username});
        fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })
        .catch(error => console.error('Error:', error));
    });
    login.addEventListener("click", () => {
        const username = document.getElementById("username").value;
        let body = JSON.stringify({"username":username});
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })
        .catch(error => console.error('Error:', error));
    });
});