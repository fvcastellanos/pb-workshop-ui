import { render, screen } from "@testing-library/react";
import Alert from "../Alert";

describe("Alert Component Test Suite", () => {

    test("Test Alert component to be displayed", async () => {

        render(<Alert variant='danger' show={true} message={'test message'} />);

        const component = await screen.findByTestId('alert-component');

        expect(component).toBeInTheDocument();

    })
})