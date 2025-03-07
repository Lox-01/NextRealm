document.addEventListener("DOMContentLoaded", (event) => {
    function getClientId() {
        let client_id = localStorage.getItem('client_id');
        if (!client_id) {
            client_id = 'client-'+Math.random().toString(36).substr(2, 16);
            localStorage.setItem('client_id', client_id);
        }
        return client_id;
    }
    let client_id = getClientId();
    for (const element of document.querySelectorAll("#client_id")) {
        (element as HTMLInputElement).value = client_id;
    }
    const signup = document.getElementById("username_signup");
    const login = document.getElementById("username_login");
    if (signup) {
        signup.addEventListener("click", () => {
            const username = (document.getElementById("username") as HTMLInputElement).value;
            let body = JSON.stringify({"username":username, "client_id":client_id});
            fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body
            })
            .catch(error => console.error('Error:', error));
        });
    }
    if (login) {
        login.addEventListener("click", () => {
            const username = (document.getElementById("username") as HTMLInputElement).value;
            let body = JSON.stringify({"username":username, "client_id":client_id});
            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body
            })
            .catch(error => console.error('Error:', error));
        });
    }
});
