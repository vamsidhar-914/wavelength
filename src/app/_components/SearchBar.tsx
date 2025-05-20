"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"

export function SearchBar() {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div
      className={cn(
        "flex items-center rounded-full border bg-background px-3 transition-all",
        isFocused ? "border-emerald-500 shadow-sm ring-1 ring-emerald-500/20" : "border-input",
      )}
    >
      <Search className="h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}
