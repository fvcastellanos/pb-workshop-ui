import { render, screen } from "@testing-library/react";
import Login from "../Login";

describe("Login Component Test", () => {

    it("Test when component is rendered", async () => {

        render(<Login />);

        const component = await screen.findByTestId('login-component');
        const loginLink = await screen.findByTestId('login-link');

        expect(component).toBeInTheDocument();
        expect(loginLink).toBeInTheDocument();
    });
})