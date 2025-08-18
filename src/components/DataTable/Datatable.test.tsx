import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { DataTableDemo } from "./datatable"

describe("DataTable Component", () => {
  test("renders table with data", () => {
    render(<DataTableDemo />)

    expect(screen.getByText("📊 User Data")).toBeInTheDocument()
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
  })

  test("adds a new user when 'Add User' is clicked", () => {
    render(<DataTableDemo />)

    const addButton = screen.getByText(/Add User/i)
    fireEvent.click(addButton)

    expect(screen.getByText("User 4")).toBeInTheDocument()
  })

  test("selects a row", () => {
    render(<DataTableDemo />)

    const checkboxes = screen.getAllByRole("checkbox")
    fireEvent.click(checkboxes[0]) 

    expect(checkboxes[0]).toBeChecked()
  })

  test("deletes selected rows", () => {
    render(<DataTableDemo />)

    const checkboxes = screen.getAllByRole("checkbox")
    fireEvent.click(checkboxes[0])

    
    const deleteButton = screen.getByText(/Delete 1 Selected/i)
    fireEvent.click(deleteButton)

    expect(screen.queryByText("Alice")).not.toBeInTheDocument()
  })

  test("sorts data by Age", () => {
    render(<DataTableDemo />)

    const ageHeader = screen.getByText("Age")
    fireEvent.click(ageHeader) 

    const rows = screen.getAllByRole("row")
    expect(rows[1]).toHaveTextContent("Charlie") 

    fireEvent.click(ageHeader) 
    const rowsDesc = screen.getAllByRole("row")
    expect(rowsDesc[1]).toHaveTextContent("Bob") 
  })
})
