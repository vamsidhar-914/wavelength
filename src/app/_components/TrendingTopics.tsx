"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { TrendingUp, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

// Mock trending topics data
const trendingTopicsData = [
  { id: 1, name: "technology", count: 2453 },
  { id: 2, name: "design", count: 1872 },
  { id: 3, name: "productivity", count: 1245 },
  { id: 4, name: "creativity", count: 987 },
  { id: 5, name: "future", count: 754 },
]

export function TrendingTopics() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [trendingTopics, setTrendingTopics] = useState(trendingTopicsData)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refreshing data
    setTimeout(() => {
      // Shuffle the array to simulate new trending topics
      setTrendingTopics([...trendingTopics].sort(() => Math.random() - 0.5))
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <Card className="border-muted/40 dark:border-muted/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          Trending Topics
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <Link href={`/topic/${topic.name}`} className="hover:underline">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">{index + 1}</span>
                  <span className="font-medium">#{topic.name}</span>
                </div>
              </Link>
              <span className="text-sm text-muted-foreground">{topic.count.toLocaleString()} waves</span>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t">
          <Link href="/discover">
            <Button
              variant="link"
              className="p-0 h-auto text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              Show more topics
            </Button>
          </Link>
          <a href="/createTweet">
          <Button
              variant="link"
              className="p-0 h-auto text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              New Wave
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
