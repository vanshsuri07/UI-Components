import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { InputField } from "./Inputfield";

describe("InputField", () => {
  test("renders label and input", () => {
    render(<InputField label="Username" placeholder="Enter username" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  test("displays helper text", () => {
    render(<InputField helperText="Must be 3–15 characters." />);
    expect(screen.getByText("Must be 3–15 characters.")).toBeInTheDocument();
  });

  test("shows error message when invalid", () => {
    render(
      <InputField
        invalid
        errorMessage="Username must be between 3–15 characters."
      />
    );
    expect(
      screen.getByText("Username must be between 3–15 characters.")
    ).toBeInTheDocument();
  });

  test("toggles password visibility", () => {
    render(<InputField type="password" placeholder="Enter password" />);
    const input = screen.getByPlaceholderText("Enter password") as HTMLInputElement;
    const toggleBtn = screen.getByRole("button");

    
    expect(input.type).toBe("password");

    fireEvent.click(toggleBtn);
    expect(input.type).toBe("text");

    
    fireEvent.click(toggleBtn);
    expect(input.type).toBe("password");
  });

  test("calls onChange when typing", () => {
    const handleChange = jest.fn();
    render(<InputField placeholder="Type here" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Type here");

    fireEvent.change(input, { target: { value: "Hello" } });
    expect(handleChange).toHaveBeenCalled();
  });
});
