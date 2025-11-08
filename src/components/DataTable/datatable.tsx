"use client"

import { useState, useMemo, memo, useCallback } from "react"

interface Column<T> {
  key: string
  title: string
  dataIndex: keyof T
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  selectable?: boolean
  onRowSelect?: (selectedRows: T[]) => void
  onDelete?: (ids: (number | string)[]) => void
}

// Memoized DataTable component
const DataTableComponent = <T extends { id: number | string }>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  onDelete,
}: DataTableProps<T>) => {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set())
  const [search, setSearch] = useState("")

  // Memoize filtered data
  const filteredData = useMemo(() => 
    data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    ), [data, search]
  )

  // Memoize sorted data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (!sortKey) return 0
      const aValue = a[sortKey as keyof T]
      const bValue = b[sortKey as keyof T]
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }
      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [filteredData, sortKey, sortOrder])

  // Memoize callbacks
  const toggleRow = useCallback((id: number | string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
    if (onRowSelect) {
      onRowSelect(data.filter((item) => newSelected.has(item.id)))
    }
  }, [selectedRows, data, onRowSelect])

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(Array.from(selectedRows))
      setSelectedRows(new Set())
    }
  }, [onDelete, selectedRows])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 text-gray-400">
        <span className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></span>
        Loading data...
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
     
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder=" Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={`Search`}
          className="px-3 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {selectable && selectedRows.size > 0 && (
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Delete {selectedRows.size} Selected
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
            <tr>
              {selectable && <th className="px-4 py-3">Select</th>}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium ${
                    col.sortable ? "cursor-pointer hover:text-blue-400" : ""
                  }`}
                  onClick={() => {
                    if (!col.sortable) return
                    if (sortKey === col.dataIndex) {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    } else {
                      setSortKey(String(col.dataIndex))
                      setSortOrder("asc")
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    {col.title}
                    {col.sortable && sortKey === col.dataIndex && (
                      <span>{sortOrder === "asc" ? "⬆️" : "⬇️"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-800/50" : "bg-gray-900/30"
                  } border-t border-gray-700 hover:bg-gray-700/50 transition`}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-500"
                        checked={selectedRows.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {String(row[col.dataIndex])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center py-6 text-gray-400"
                >
                   No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Export memoized version
export const DataTable = memo(DataTableComponent) as typeof DataTableComponent


export const DataTableDemo = () => {
  const [data, setData] = useState([
    { id: 1, name: "Alice", age: 25, email: "alice@mail.com" },
    { id: 2, name: "Bob", age: 30, email: "bob@mail.com" },
    { id: 3, name: "Charlie", age: 22, email: "charlie@mail.com" },
  ])

  const [darkMode, setDarkMode] = useState(true)

  const columns: Column<{ id: number; name: string; age: number; email: string }>[] = [
    { key: "name", title: "Name", dataIndex: "name", sortable: true },
    { key: "age", title: "Age", dataIndex: "age", sortable: true },
    { key: "email", title: "Email", dataIndex: "email" },
  ]

  const handleAdd = () => {
    const id = data.length ? data[data.length - 1].id + 1 : 1
    const newUser = {
      id,
      name: `User ${id}`,
      age: 20 + Math.floor(Math.random() * 10),
      email: `user${id}@mail.com`,
    }
    setData([...data, newUser])
  }

  const handleDelete = (ids: (number | string)[]) => {
    setData(data.filter((row) => !ids.includes(row.id)))
  }

  return (
    <div
      className={`p-6 min-h-screen flex flex-col gap-6 max-w-8xl mx-auto transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
    >
     
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📊 User Data</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-md border bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-200 dark:text-black transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

     
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className={`px-4 py-2 rounded-md ${
            darkMode
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          + Add User
        </button>
      </div>

     
      <DataTable
        data={data}
        columns={columns}
        selectable
        onDelete={handleDelete}
        onRowSelect={(rows) => console.log("Selected Rows:", rows)}
      />
    </div>
  )
}
