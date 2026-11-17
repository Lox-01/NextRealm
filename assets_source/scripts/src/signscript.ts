export function signscriptPage(): void {
    function getClientId(): string {
        let client_id = localStorage.getItem('client_id');
        if (!client_id) {
            client_id = 'client-' + Math.random().toString(36).slice(2, 13).padEnd(11, '0');
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

    const submit = (path: '/signup' | '/login', input: HTMLInputElement) => {
        const username = input.value.trim();
        if (!username) return;
        const body = new URLSearchParams({ username, client_id });
        fetch(path, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString()
        }).catch((error) => console.error('Error:', error));
    };

    signup?.addEventListener("click", () => submit('/signup', signup));
    login?.addEventListener("click", () => submit('/login', login));
}