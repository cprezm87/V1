"use client"

import { Button } from "@/components/ui/button"
import { Table, LayoutGrid, List } from "lucide-react"
import { useEffect } from "react"

interface ViewSelectorProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  // Set default view to "table" when component mounts
  useEffect(() => {
    if (currentView !== "table") {
      onViewChange("table")
    }
  }, [])

  return (
    <div className="flex items-center space-x-2 bg-background/50 p-1 rounded-md border border-border">
      <Button
        variant={currentView === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        className={currentView === "table" ? "bg-neon-green text-black hover:bg-neon-green/90" : ""}
      >
        <Table className="h-4 w-4 mr-1" />
        Table
      </Button>
      <Button
        variant={currentView === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className={currentView === "grid" ? "bg-neon-green text-black hover:bg-neon-green/90" : ""}
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        Grid
      </Button>
      <Button
        variant={currentView === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        className={currentView === "list" ? "bg-neon-green text-black hover:bg-neon-green/90" : ""}
      >
        <List className="h-4 w-4 mr-1" />
        List
      </Button>
    </div>
  )
}
