"use client"

import { useState } from "react"
import { InputFieldDemo } from "./components/InputField/Inputfield"
import { DataTableDemo } from "./components/DataTable/datatable"
import "./App.css"
import StarsCanvas from "./components/Animation"

export default function App() {
  const [showTable, setShowTable] = useState(false)

  return (
    <>
      {!showTable ? (
        <>
          
          <StarsCanvas />
          <InputFieldDemo onSuccess={() => setShowTable(true)} />
        </>
      ) : (
        <DataTableDemo />
      )}
    </>
  )
}
