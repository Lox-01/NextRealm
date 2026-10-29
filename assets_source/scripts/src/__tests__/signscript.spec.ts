import { Mock } from 'vitest';
import { signscriptPage } from '../signscript';

describe('signscriptPage', () => {

  const clientId = 'client-njlxmlu92zo';
  beforeEach(() => {
    // Set up the DOM structure needed for testing
    document.body.innerHTML = `
      <input id="client_id" />
      <input id="username_signup" />
      <input id="username_login" />
    `;

    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'client_id') return null; // Simulate no existing client_id
      return null;
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { });

    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      }),
    ) as Mock;
  });

  it('generates a client_id if not already present in localStorage', () => {
    signscriptPage();

    // Expect setItem to have been called to store the generated client_id
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'client_id',
      expect.stringMatching(/^client-[a-z0-9]{11}$/),
    );
  });

  it('sets the client_id value in all inputs with id #client_id', () => {
    signscriptPage();

    const clientIdInput = document.getElementById('client_id') as HTMLInputElement;
    expect(clientIdInput.value).toMatch(/^client-[a-z0-9]{11}$/);
  });

  it('adds event listener to the signup button', () => {
    const signup = document.getElementById('username_signup') as HTMLInputElement;
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(clientId); // Mock client_id
    signscriptPage();

    signup.value = 'test_user';
    signup.click(); // Simulate a click

    expect(global.fetch).toHaveBeenCalledWith('/signup', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test_user',
        client_id: clientId,
      }),
    }));
  });

  it('adds event listener to the login button', () => {
    const login = document.getElementById('username_login') as HTMLInputElement;
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(clientId); // Mock client_id
    signscriptPage();

    login.value = 'test_user_login';
    login.click(); // Simulate a click

    expect(global.fetch).toHaveBeenCalledWith('/login', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test_user_login',
        client_id: clientId,
      }),
    }));
  });
});