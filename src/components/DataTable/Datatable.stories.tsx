import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTableDemo } from "./datatable"

const meta: Meta<typeof DataTableDemo> = {
  title: "Components/DataTable",
  component: DataTableDemo,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof DataTableDemo>

export const Default: Story = {
  render: () => <DataTableDemo />,
}
