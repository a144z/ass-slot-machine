"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SYMBOLS = [
  "ASS",
  "PUSSY",
  "DICK",
  "BOOBS",
  "TITS",
  "COCK",
  "BUTT",
  "BOOTY",
  "MILF",
  "FEET",
  "THIGHS",
  "LEGS",
  "LIPS",
  "MOUTH",
  "TOY",
  "LINGERIE",
  "BIKINI",
  "NUDE",
  "HOT",
  "SEXY",
] as const

type Symbol = (typeof SYMBOLS)[number]

const SYMBOL_IMAGES: Record<Symbol, string> = {
  ASS: "/symbols/ass.svg",
  PUSSY: "/symbols/pussy.svg",
  DICK: "/symbols/dick.svg",
  BOOBS: "/symbols/boobs.svg",
  TITS: "/symbols/boobs.svg",
  COCK: "/symbols/dick.svg",
  BUTT: "/symbols/ass.svg",
  BOOTY: "/symbols/ass.svg",
  MILF: "/symbols/pussy.svg",
  FEET: "/symbols/feet.svg",
  THIGHS: "/symbols/thighs.svg",
  LEGS: "/symbols/legs.svg",
  LIPS: "/symbols/lips.svg",
  MOUTH: "/symbols/lips.svg",
  TOY: "/symbols/dick.svg",
  LINGERIE: "/symbols/bikini.svg",
  BIKINI: "/symbols/bikini.svg",
  NUDE: "/symbols/hot.svg",
  HOT: "/symbols/hot.svg",
  SEXY: "/symbols/hot.svg",
}

type Grid = [
  [Symbol, Symbol, Symbol],
  [Symbol, Symbol, Symbol],
  [Symbol, Symbol, Symbol],
]

type WinLine = {
  type: "row" | "column" | "diagonal"
  index: number
  symbols: Symbol[]
}

interface SlotMachineProps {
  className?: string
}

export function SlotMachine({ className }: SlotMachineProps) {
  const [grid, setGrid] = useState<Grid>([
    ["ASS", "PUSSY", "DICK"],
    ["BOOBS", "TITS", "COCK"],
    ["BUTT", "BOOTY", "MILF"],
  ])
  const [isSpinning, setIsSpinning] = useState(false)
  const [winLines, setWinLines] = useState<WinLine[]>([])
  const [credits, setCredits] = useState(1000)

  const checkWins = (currentGrid: Grid): WinLine[] => {
    const wins: WinLine[] = []

    // Check rows
    for (let row = 0; row < 3; row++) {
      if (
        currentGrid[row][0] === currentGrid[row][1] &&
        currentGrid[row][1] === currentGrid[row][2]
      ) {
        wins.push({
          type: "row",
          index: row,
          symbols: [currentGrid[row][0], currentGrid[row][1], currentGrid[row][2]],
        })
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (
        currentGrid[0][col] === currentGrid[1][col] &&
        currentGrid[1][col] === currentGrid[2][col]
      ) {
        wins.push({
          type: "column",
          index: col,
          symbols: [currentGrid[0][col], currentGrid[1][col], currentGrid[2][col]],
        })
      }
    }

    // Check diagonals
    if (currentGrid[0][0] === currentGrid[1][1] && currentGrid[1][1] === currentGrid[2][2]) {
      wins.push({
        type: "diagonal",
        index: 0,
        symbols: [currentGrid[0][0], currentGrid[1][1], currentGrid[2][2]],
      })
    }
    if (currentGrid[0][2] === currentGrid[1][1] && currentGrid[1][1] === currentGrid[2][0]) {
      wins.push({
        type: "diagonal",
        index: 1,
        symbols: [currentGrid[0][2], currentGrid[1][1], currentGrid[2][0]],
      })
    }

    return wins
  }

  const spin = () => {
    if (isSpinning || credits < 10) return

    setCredits((prev) => prev - 10)
    setIsSpinning(true)
    setWinLines([])

    const spinDuration = 2500
    const spinInterval = 50

    let elapsed = 0
    const spinIntervalId = setInterval(() => {
      elapsed += spinInterval

      // Random symbols during spin
      const randomGrid: Grid = [
        [
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        ],
        [
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        ],
        [
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        ],
      ]
      setGrid(randomGrid)

      if (elapsed >= spinDuration) {
        clearInterval(spinIntervalId)

        // Final result with higher chance of wins
        const finalGrid: Grid = [
          [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          ],
          [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          ],
          [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          ],
        ]

        setGrid(finalGrid)

        // Check for wins
        const wins = checkWins(finalGrid)
        setWinLines(wins)

        if (wins.length > 0) {
          const winAmount = wins.length * 50
          setCredits((prev) => prev + winAmount)
        }

        setIsSpinning(false)
      }
    }, spinInterval)
  }

  const hasWon = winLines.length > 0

  return (
    <div className={cn("flex flex-col items-center gap-6 p-8 min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900", className)}>
      {/* Casino Header */}
      <div className="text-center mb-4">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
          🎰 LUCKY SLOTS 🎰
        </h1>
        <div className="flex items-center justify-center gap-8 mt-4">
          <div className="bg-black/50 border-2 border-yellow-500 rounded-lg px-6 py-3 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
            <div className="text-yellow-400 text-sm font-semibold">CREDITS</div>
            <div className="text-3xl font-bold text-yellow-300">{credits.toLocaleString()}</div>
          </div>
          <div className="bg-black/50 border-2 border-yellow-500 rounded-lg px-6 py-3 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
            <div className="text-yellow-400 text-sm font-semibold">BET</div>
            <div className="text-3xl font-bold text-yellow-300">10</div>
          </div>
        </div>
      </div>

      {/* Main Slot Machine */}
      <div className="relative">
        {/* Outer Frame with Neon Effect */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-[0_0_50px_rgba(139,92,246,0.6),inset_0_0_50px_rgba(0,0,0,0.5)] border-4 border-yellow-500/50">
          {/* Inner Reels Container */}
          <div className="relative bg-black/80 rounded-xl p-4 border-2 border-yellow-400/30">
            {/* Win Lines Overlay */}
            {hasWon && !isSpinning && (
              <div className="absolute inset-0 pointer-events-none z-10">
                {winLines.map((line, idx) => (
                  <WinLineOverlay key={idx} line={line} />
                ))}
              </div>
            )}

            {/* Grid of Reels */}
            <div className="grid grid-cols-3 gap-3">
              {grid.map((row, rowIndex) =>
                row.map((symbol, colIndex) => (
                  <Reel
                    key={`${rowIndex}-${colIndex}`}
                    symbol={symbol}
                    isSpinning={isSpinning}
                    delay={(rowIndex * 3 + colIndex) * 80}
                    isWinning={
                      hasWon &&
                      winLines.some((line) => {
                        if (line.type === "row") return line.index === rowIndex
                        if (line.type === "column") return line.index === colIndex
                        if (line.type === "diagonal") {
                          if (line.index === 0) return rowIndex === colIndex
                          return rowIndex + colIndex === 2
                        }
                        return false
                      })
                    }
                  />
                ))
              )}
            </div>
          </div>

          {/* Jackpot Overlay */}
          {hasWon && !isSpinning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="bg-gradient-to-r from-yellow-400/90 via-yellow-300/90 to-yellow-400/90 rounded-xl px-12 py-6 shadow-[0_0_40px_rgba(250,204,21,0.9)] animate-pulse">
                <div className="text-6xl font-black text-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  🎉 JACKPOT! 🎉
                </div>
                <div className="text-2xl font-bold text-black mt-2 text-center">
                  {winLines.length} WIN LINE{winLines.length > 1 ? "S" : ""}!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spin Button */}
      <Button
        onClick={spin}
        disabled={isSpinning || credits < 10}
        size="lg"
        className={cn(
          "min-w-[300px] h-16 text-2xl font-black rounded-full shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all duration-300",
          isSpinning
            ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-400 hover:via-yellow-300 hover:to-yellow-400 hover:shadow-[0_0_40px_rgba(234,179,8,0.8)] hover:scale-105 active:scale-95",
          credits < 10 && "opacity-50 cursor-not-allowed"
        )}
      >
        {credits < 10 ? (
          "INSUFFICIENT CREDITS"
        ) : isSpinning ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">🎰</span> SPINNING...
          </span>
        ) : (
          "🎰 SPIN 🎰"
        )}
      </Button>

      {/* Win Display */}
      {hasWon && !isSpinning && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400 rounded-lg px-8 py-4 text-center">
          <div className="text-xl font-bold text-green-300 mb-2">
            🎊 CONGRATULATIONS! 🎊
          </div>
          <div className="text-lg text-green-200">
            You won {winLines.length * 50} credits!
          </div>
        </div>
      )}
    </div>
  )
}

interface WinLineOverlayProps {
  line: WinLine
}

function WinLineOverlay({ line }: WinLineOverlayProps) {
  if (line.type === "row") {
    return (
      <div
        className="absolute left-0 right-0 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent border-y-2 border-yellow-400 animate-pulse"
        style={{
          top: `${line.index * 33.33}%`,
          height: "33.33%",
        }}
      />
    )
  }
  if (line.type === "column") {
    return (
      <div
        className="absolute top-0 bottom-0 bg-gradient-to-b from-transparent via-yellow-400/40 to-transparent border-x-2 border-yellow-400 animate-pulse"
        style={{
          left: `${line.index * 33.33}%`,
          width: "33.33%",
        }}
      />
    )
  }
  if (line.type === "diagonal") {
    if (line.index === 0) {
      // Top-left to bottom-right
      return (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <div
              className="absolute bg-gradient-to-br from-transparent via-yellow-400/40 to-transparent border-2 border-yellow-400 animate-pulse"
              style={{
                width: "141.42%",
                height: "2px",
                top: "50%",
                left: "0%",
                transform: "translateY(-50%) rotate(45deg)",
                transformOrigin: "left center",
              }}
            />
          </div>
        </div>
      )
    } else {
      // Top-right to bottom-left
      return (
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-full h-full">
            <div
              className="absolute bg-gradient-to-bl from-transparent via-yellow-400/40 to-transparent border-2 border-yellow-400 animate-pulse"
              style={{
                width: "141.42%",
                height: "2px",
                top: "50%",
                right: "0%",
                transform: "translateY(-50%) rotate(-45deg)",
                transformOrigin: "right center",
              }}
            />
          </div>
        </div>
      )
    }
  }
  return null
}

interface ReelProps {
  symbol: Symbol
  isSpinning: boolean
  delay: number
  isWinning?: boolean
}

function Reel({ symbol, isSpinning, delay, isWinning }: ReelProps) {
  return (
    <div
      className={cn(
        "relative w-28 h-32 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 rounded-lg border-2 flex items-center justify-center overflow-hidden shadow-lg transition-all duration-300",
        isWinning
          ? "border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.8)] scale-105 z-10"
          : "border-gray-600",
        isSpinning && "animate-spin-slow"
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className={cn(
          "relative w-full h-full flex items-center justify-center transition-all duration-300 p-2",
          isSpinning && "opacity-60"
        )}
      >
        <Image
          src={SYMBOL_IMAGES[symbol]}
          alt={symbol}
          width={80}
          height={80}
          className="object-contain w-full h-full"
          unoptimized
        />
      </div>

      {/* Spinning overlay effect */}
      {isSpinning && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-pulse" />
      )}

      {/* Winning glow effect */}
      {isWinning && (
        <div className="absolute inset-0 bg-yellow-400/20 animate-pulse rounded-lg" />
      )}

      {/* Top and bottom borders for reel effect */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-black/50 border-b border-gray-600" />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/50 border-t border-gray-600" />
    </div>
  )
}

