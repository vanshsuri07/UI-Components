"use client"

import { useState, lazy, Suspense } from "react"
import { InputFieldDemo } from "./components/InputField/Inputfield"
import "./App.css"

// Lazy load heavy components for better performance
const StarsCanvas = lazy(() => import("./components/Animation"))
const DataTableDemo = lazy(() => import("./components/DataTable/datatable").then(module => ({ default: module.DataTableDemo })))

export default function App() {
  const [showTable, setShowTable] = useState(false)

  return (
    <>
      {!showTable ? (
        <>
          <Suspense fallback={<div className="absolute inset-0 z-[0] w-full h-full bg-gradient-to-b from-[#05050f] via-[#090913] to-[#000000]" />}>
            <StarsCanvas />
          </Suspense>
          <InputFieldDemo onSuccess={() => setShowTable(true)} />
        </>
      ) : (
        <Suspense fallback={
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-400">
              <span className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></span>
              <span>Loading data table...</span>
            </div>
          </div>
        }>
          <DataTableDemo />
        </Suspense>
      )}
    </>
  )
}
