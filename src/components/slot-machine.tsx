"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  const [totalWins, setTotalWins] = useState(0)
  const [lastWinAmount, setLastWinAmount] = useState(0)
  const [shakeEnabled, setShakeEnabled] = useState(false)
  const [autoSpin, setAutoSpin] = useState(false)
  const [autoSpinCount, setAutoSpinCount] = useState(10)
  const [remainingAutoSpins, setRemainingAutoSpins] = useState(0)
  const autoSpinIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoSpinRef = useRef(false)
  const remainingAutoSpinsRef = useRef(0)
  const creditsRef = useRef(1000)

  // Shake detection refs
  const lastAcceleration = useRef<{ x: number; y: number; z: number } | null>(null)
  const shakeThreshold = 15 // Sensitivity threshold for shake detection
  const lastShakeTime = useRef<number>(0)
  const shakeCooldown = 2000 // 2 seconds cooldown between shakes
  const spinRef = useRef<(() => void) | null>(null)

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

  // Keep credits ref in sync
  useEffect(() => {
    creditsRef.current = credits
  }, [credits])

  const spin = useCallback(() => {
    if (isSpinning || creditsRef.current < 10) return

    setCredits((prev) => {
      creditsRef.current = prev - 10
      return prev - 10
    })
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
          setTotalWins((prev) => prev + wins.length)
          setLastWinAmount(winAmount)
        } else {
          setLastWinAmount(0)
        }

        setIsSpinning(false)

        // Continue autospin if enabled (using refs to avoid dependency issues)
        if (autoSpinRef.current && remainingAutoSpinsRef.current > 0) {
          remainingAutoSpinsRef.current -= 1
          setRemainingAutoSpins(remainingAutoSpinsRef.current)
          
          // Small delay before next autospin
          setTimeout(() => {
            if (autoSpinRef.current && remainingAutoSpinsRef.current > 0 && creditsRef.current >= 10) {
              spin()
            } else {
              autoSpinRef.current = false
              setAutoSpin(false)
              setRemainingAutoSpins(0)
              remainingAutoSpinsRef.current = 0
            }
          }, 500)
        } else if (remainingAutoSpinsRef.current === 0 && autoSpinRef.current) {
          autoSpinRef.current = false
          setAutoSpin(false)
        }
      }
    }, spinInterval)
  }, [isSpinning, credits])

  // Store spin function in ref for shake detection
  useEffect(() => {
    spinRef.current = spin
  }, [spin])

  // Handle autospin start/stop
  const toggleAutoSpin = () => {
    if (autoSpin) {
      // Stop autospin
      autoSpinRef.current = false
      setAutoSpin(false)
      setRemainingAutoSpins(0)
      remainingAutoSpinsRef.current = 0
    } else {
      // Start autospin
      if (credits >= 10 && !isSpinning) {
        autoSpinRef.current = true
        remainingAutoSpinsRef.current = autoSpinCount
        setAutoSpin(true)
        setRemainingAutoSpins(autoSpinCount)
        // Start first spin
        setTimeout(() => spin(), 300)
      }
    }
  }

  // Stop autospin when credits run out
  useEffect(() => {
    if (autoSpin && credits < 10) {
      autoSpinRef.current = false
      setAutoSpin(false)
      setRemainingAutoSpins(0)
      remainingAutoSpinsRef.current = 0
    }
  }, [credits, autoSpin])

  // Shake detection effect
  useEffect(() => {
    // Request permission for device motion (iOS 13+)
    if (typeof DeviceMotionEvent !== "undefined" && typeof (DeviceMotionEvent as any).requestPermission === "function") {
      ;(DeviceMotionEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === "granted") {
            setShakeEnabled(true)
          }
        })
        .catch(() => {
          // Permission denied or error
        })
    } else {
      // Android and older iOS - no permission needed
      setShakeEnabled(true)
    }

    if (!shakeEnabled) return

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      if (!event.accelerationIncludingGravity) return

      const { x, y, z } = event.accelerationIncludingGravity

      if (lastAcceleration.current) {
        const deltaX = Math.abs(x! - lastAcceleration.current.x)
        const deltaY = Math.abs(y! - lastAcceleration.current.y)
        const deltaZ = Math.abs(z! - lastAcceleration.current.z)

        const acceleration = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)

        const now = Date.now()
        if (acceleration > shakeThreshold && now - lastShakeTime.current > shakeCooldown) {
          lastShakeTime.current = now
          // Trigger spin using ref
          if (spinRef.current) {
            spinRef.current()
          }
        }
      }

      lastAcceleration.current = { x: x!, y: y!, z: z! }
    }

    window.addEventListener("devicemotion", handleDeviceMotion as EventListener)

    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion as EventListener)
    }
  }, [shakeEnabled])

  const hasWon = winLines.length > 0

  return (
    <div className={cn("flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-8 min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900", className)}>
      {/* Casino Header */}
      <div className="text-center mb-2 sm:mb-4 w-full">
        <h1 className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
          🎰 LUCKY SLOTS 🎰
        </h1>
        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-2 sm:mt-4 flex-wrap">
          <div className="bg-black/70 backdrop-blur-sm border-2 border-yellow-500 rounded-xl px-3 sm:px-6 py-2 sm:py-3 shadow-[0_0_20px_rgba(234,179,8,0.5)] min-w-[100px] sm:min-w-[140px]">
            <div className="text-yellow-400 text-xs sm:text-sm font-semibold">CREDITS</div>
            <div className="text-lg sm:text-3xl font-bold text-yellow-300">{credits.toLocaleString()}</div>
          </div>
          <div className="bg-black/70 backdrop-blur-sm border-2 border-yellow-500 rounded-xl px-3 sm:px-6 py-2 sm:py-3 shadow-[0_0_20px_rgba(234,179,8,0.5)] min-w-[100px] sm:min-w-[140px]">
            <div className="text-yellow-400 text-xs sm:text-sm font-semibold">BET</div>
            <div className="text-lg sm:text-3xl font-bold text-yellow-300">10</div>
          </div>
          {lastWinAmount > 0 && !isSpinning && (
            <div className="bg-black/70 backdrop-blur-sm border-2 border-green-500 rounded-xl px-3 sm:px-6 py-2 sm:py-3 shadow-[0_0_20px_rgba(34,197,94,0.5)] min-w-[100px] sm:min-w-[140px] animate-pulse">
              <div className="text-green-400 text-xs sm:text-sm font-semibold">LAST WIN</div>
              <div className="text-lg sm:text-3xl font-bold text-green-300">+{lastWinAmount}</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Slot Machine */}
      <div className="relative w-full max-w-2xl px-2 sm:px-0">
        {/* Outer Frame with Neon Effect */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-[0_0_50px_rgba(139,92,246,0.6),inset_0_0_50px_rgba(0,0,0,0.5)] border-2 sm:border-4 border-yellow-500/50">
          {/* Inner Reels Container */}
          <div className="relative bg-black/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 border-2 border-yellow-400/30">
            {/* Win Lines Overlay - More Visible Cross Lines */}
            {hasWon && !isSpinning && (
              <div className="absolute inset-0 pointer-events-none z-10 rounded-lg sm:rounded-xl overflow-hidden">
                {winLines.map((line, idx) => (
                  <WinLineOverlay key={idx} line={line} />
                ))}
              </div>
            )}

            {/* Grid of Reels */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 rounded-xl sm:rounded-2xl">
              <div className="bg-gradient-to-r from-yellow-400/95 via-yellow-300/95 to-yellow-400/95 rounded-xl px-6 sm:px-12 py-4 sm:py-6 shadow-[0_0_40px_rgba(250,204,21,0.9)] animate-pulse">
                <div className="text-3xl sm:text-6xl font-black text-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  🎉 JACKPOT! 🎉
                </div>
                <div className="text-lg sm:text-2xl font-bold text-black mt-2 text-center">
                  {winLines.length} WIN LINE{winLines.length > 1 ? "S" : ""}!
                </div>
              </div>
          </div>
        )}
        </div>
      </div>

      {/* Spin Controls */}
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-3">
        {/* Spin Button */}
        <Button
          onClick={spin}
          disabled={isSpinning || credits < 10 || autoSpin}
          size="lg"
          className={cn(
            "w-full sm:min-w-[300px] h-14 sm:h-16 text-lg sm:text-2xl font-black rounded-full shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all duration-300",
            isSpinning || autoSpin
              ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-400 hover:via-yellow-300 hover:to-yellow-400 hover:shadow-[0_0_40px_rgba(234,179,8,0.8)] hover:scale-105 active:scale-95",
            credits < 10 && "opacity-50 cursor-not-allowed"
          )}
        >
          {credits < 10 ? (
            <span className="text-sm sm:text-base">INSUFFICIENT CREDITS</span>
          ) : autoSpin ? (
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <span className="animate-spin">⚡</span> AUTO SPINNING...
            </span>
          ) : isSpinning ? (
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <span className="animate-spin">🎰</span> SPINNING...
            </span>
          ) : (
            <span className="text-sm sm:text-base">🎰 SPIN 🎰</span>
          )}
        </Button>

        {/* Autospin Controls */}
        <div className="w-full bg-black/70 backdrop-blur-sm border-2 border-yellow-500/50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-300 text-sm sm:text-base font-semibold">AUTOSPIN</span>
            {autoSpin && (
              <span className="text-yellow-400 text-xs sm:text-sm font-bold">
                {remainingAutoSpins} remaining
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            {/* Autospin Count Selector */}
            {!autoSpin && (
              <div className="flex-1 flex items-center gap-2">
                <span className="text-yellow-300 text-xs sm:text-sm">Spins:</span>
                <select
                  value={autoSpinCount}
                  onChange={(e) => setAutoSpinCount(Number(e.target.value))}
                  disabled={autoSpin || isSpinning}
                  className="flex-1 bg-gray-800 border border-yellow-500/50 rounded px-2 py-1 text-yellow-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            )}
            
            {/* Autospin Toggle Button */}
            <Button
              onClick={toggleAutoSpin}
              disabled={isSpinning || credits < 10}
              size="sm"
              className={cn(
                "min-w-[100px] sm:min-w-[120px] h-9 sm:h-10 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300",
                autoSpin
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white",
                (isSpinning || credits < 10) && "opacity-50 cursor-not-allowed"
              )}
            >
              {autoSpin ? (
                <span className="flex items-center gap-1">
                  <span className="animate-pulse">⏹</span> STOP
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span>⚡</span> START
                </span>
              )}
            </Button>
          </div>

          {autoSpin && (
            <div className="text-xs text-yellow-300/70 text-center animate-pulse">
              Autospin active - {remainingAutoSpins} spins remaining
            </div>
          )}
        </div>

        {shakeEnabled && !isSpinning && !autoSpin && credits >= 10 && (
          <div className="text-xs sm:text-sm text-yellow-300/70 text-center animate-pulse">
            📱 Shake your device to spin!
          </div>
        )}
      </div>

      {/* Advanced Win Display */}
      {hasWon && !isSpinning && (
        <div className="w-full max-w-2xl space-y-3">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400 rounded-lg px-4 sm:px-8 py-3 sm:py-4 text-center">
            <div className="text-lg sm:text-xl font-bold text-green-300 mb-2">
              🎊 CONGRATULATIONS! 🎊
            </div>
            <div className="text-base sm:text-lg text-green-200 mb-3">
              You won <span className="font-bold text-green-300">{winLines.length * 50}</span> credits!
            </div>
          </div>

          {/* Win Breakdown */}
          <div className="bg-black/70 backdrop-blur-sm border-2 border-yellow-400/50 rounded-lg p-4 sm:p-6">
            <div className="text-yellow-400 text-sm sm:text-base font-bold mb-3 text-center">
              WIN BREAKDOWN
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Rows */}
              <div className="bg-gray-900/50 rounded-lg p-3 border border-yellow-400/30">
                <div className="text-yellow-300 text-xs sm:text-sm font-semibold mb-2">HORIZONTAL LINES</div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                  {winLines.filter((l) => l.type === "row").length}
                </div>
                {winLines
                  .filter((l) => l.type === "row")
                  .map((line, idx) => (
                    <div key={idx} className="text-xs text-yellow-200 mt-1">
                      Row {line.index + 1}: {line.symbols[0]}
                    </div>
                  ))}
              </div>

              {/* Columns */}
              <div className="bg-gray-900/50 rounded-lg p-3 border border-yellow-400/30">
                <div className="text-yellow-300 text-xs sm:text-sm font-semibold mb-2">VERTICAL LINES</div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                  {winLines.filter((l) => l.type === "column").length}
                </div>
                {winLines
                  .filter((l) => l.type === "column")
                  .map((line, idx) => (
                    <div key={idx} className="text-xs text-yellow-200 mt-1">
                      Col {line.index + 1}: {line.symbols[0]}
                    </div>
                  ))}
              </div>

              {/* Diagonals */}
              <div className="bg-gray-900/50 rounded-lg p-3 border border-yellow-400/30">
                <div className="text-yellow-300 text-xs sm:text-sm font-semibold mb-2">DIAGONAL LINES</div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                  {winLines.filter((l) => l.type === "diagonal").length}
                </div>
                {winLines
                  .filter((l) => l.type === "diagonal")
                  .map((line, idx) => (
                    <div key={idx} className="text-xs text-yellow-200 mt-1">
                      {line.index === 0 ? "Main" : "Anti"}: {line.symbols[0]}
                    </div>
                  ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="mt-4 pt-4 border-t border-yellow-400/30">
              <div className="flex justify-between items-center">
                <span className="text-yellow-300 text-sm sm:text-base font-semibold">Total Win Lines:</span>
                <span className="text-2xl sm:text-3xl font-bold text-yellow-400">{winLines.length}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-yellow-300 text-sm sm:text-base font-semibold">Payout per Line:</span>
                <span className="text-xl sm:text-2xl font-bold text-yellow-400">50</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-yellow-400/20">
                <span className="text-green-300 text-base sm:text-lg font-bold">Total Payout:</span>
                <span className="text-2xl sm:text-4xl font-black text-green-400">
                  {winLines.length * 50}
                </span>
              </div>
            </div>
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
      <>
        {/* Thick horizontal line with strong glow */}
        <div
          className="absolute left-0 right-0 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent border-y-[6px] border-yellow-400 animate-pulse shadow-[0_0_30px_rgba(234,179,8,1)] z-10"
          style={{
            top: `${line.index * 33.33 + 16.665}%`,
            height: "6px",
            transform: "translateY(-50%)",
          }}
        />
        {/* Extended glow effect */}
        <div
          className="absolute left-0 right-0 bg-yellow-400/40 blur-md animate-pulse"
          style={{
            top: `${line.index * 33.33 + 16.665}%`,
            height: "30px",
            transform: "translateY(-50%)",
          }}
        />
      </>
    )
  }
  if (line.type === "column") {
    return (
      <>
        {/* Thick vertical line with strong glow */}
        <div
          className="absolute top-0 bottom-0 bg-gradient-to-b from-transparent via-yellow-400/80 to-transparent border-x-[6px] border-yellow-400 animate-pulse shadow-[0_0_30px_rgba(234,179,8,1)] z-10"
          style={{
            left: `${line.index * 33.33 + 16.665}%`,
            width: "6px",
            transform: "translateX(-50%)",
          }}
        />
        {/* Extended glow effect */}
        <div
          className="absolute top-0 bottom-0 bg-yellow-400/40 blur-md animate-pulse"
          style={{
            left: `${line.index * 33.33 + 16.665}%`,
            width: "30px",
            transform: "translateX(-50%)",
          }}
        />
      </>
    )
  }
  if (line.type === "diagonal") {
    if (line.index === 0) {
      // Top-left to bottom-right
      return (
        <div className="absolute inset-0">
          {/* Thick diagonal line */}
          <div
            className="absolute bg-gradient-to-br from-transparent via-yellow-400/80 to-transparent border-[6px] border-yellow-400 animate-pulse shadow-[0_0_30px_rgba(234,179,8,1)] z-10"
            style={{
              width: "141.42%",
              height: "6px",
              top: "50%",
              left: "0%",
              transform: "translateY(-50%) rotate(45deg)",
              transformOrigin: "left center",
            }}
          />
          {/* Extended glow effect */}
          <div
            className="absolute bg-yellow-400/40 blur-md animate-pulse"
            style={{
              width: "141.42%",
              height: "30px",
              top: "50%",
              left: "0%",
              transform: "translateY(-50%) rotate(45deg)",
              transformOrigin: "left center",
            }}
          />
        </div>
      )
    } else {
      // Top-right to bottom-left
      return (
        <div className="absolute inset-0">
          {/* Thick diagonal line */}
          <div
            className="absolute bg-gradient-to-bl from-transparent via-yellow-400/80 to-transparent border-[6px] border-yellow-400 animate-pulse shadow-[0_0_30px_rgba(234,179,8,1)] z-10"
            style={{
              width: "141.42%",
              height: "6px",
              top: "50%",
              right: "0%",
              transform: "translateY(-50%) rotate(-45deg)",
              transformOrigin: "right center",
            }}
          />
          {/* Extended glow effect */}
          <div
            className="absolute bg-yellow-400/40 blur-md animate-pulse"
            style={{
              width: "141.42%",
              height: "30px",
              top: "50%",
              right: "0%",
              transform: "translateY(-50%) rotate(-45deg)",
              transformOrigin: "right center",
            }}
          />
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
        "relative w-full aspect-[0.85] max-w-[120px] sm:max-w-[140px] bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 rounded-lg sm:rounded-xl border-2 flex items-center justify-center overflow-hidden shadow-lg transition-all duration-300",
        isWinning
          ? "border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,1)] scale-105 z-10 ring-4 ring-yellow-400/50"
          : "border-gray-600",
        isSpinning && "animate-spin-slow"
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className={cn(
          "relative w-full h-full flex items-center justify-center transition-all duration-300 p-1.5 sm:p-2",
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
        <>
          <div className="absolute inset-0 bg-yellow-400/30 animate-pulse rounded-lg sm:rounded-xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse rounded-lg sm:rounded-xl" />
        </>
      )}

      {/* Top and bottom borders for reel effect */}
      <div className="absolute top-0 left-0 right-0 h-1.5 sm:h-2 bg-black/60 border-b border-gray-600/50" />
      <div className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 bg-black/60 border-t border-gray-600/50" />
    </div>
  )
}

