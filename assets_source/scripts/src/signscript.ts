export function signscriptPage(): void {
    function getClientId(): string {
        let client_id = localStorage.getItem('client_id');
        if (!client_id) {
            client_id = 'client-' + Math.random().toString(36).substr(2, 16);
            localStorage.setItem('client_id', client_id);
        }
        return client_id;
    }

    const client_id = getClientId();

    document.querySelectorAll("#client_id").forEach((element) => {
        if (element instanceof HTMLInputElement) {
            element.value = client_id;
        }
    });

    const signup = document.getElementById("username_signup") as HTMLInputElement | null;
    const login = document.getElementById("username_login") as HTMLInputElement | null;

    if (signup) {
        signup.addEventListener("click", () => {
            const username = (document.getElementById("username_signup") as HTMLInputElement).value;
            const body = JSON.stringify({ "username": username, "client_id": client_id });

            fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body
            }).catch((error) => console.error('Error:', error));
        });
    }

    if (login) {
        login.addEventListener("click", () => {
            const username = (document.getElementById("username_login") as HTMLInputElement).value;
            const body = JSON.stringify({ "username": username, "client_id": client_id });

            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body
            }).catch((error) => console.error('Error:', error));
        });
    }
}