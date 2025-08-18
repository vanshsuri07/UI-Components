
import type { Meta, StoryObj } from "@storybook/react-vite";
import  {InputField}  from "./Inputfield"

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  args: {
    label: "Username",
    placeholder: "Enter username",
    helperText: "This is a helper text",
  },
};
export default meta;

type Story = StoryObj<typeof InputField>;

export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const WithError: Story = {
  args: {
    invalid: true,
    errorMessage: "This field is required",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
    helperText: "Must be at least 6 characters",
  },
};
