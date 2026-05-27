interface Props {
  score: number
}

export default function ScoreBar({ score }: Props) {
  const color = score >= 70 ? '#2ECC71' : score >= 40 ? '#F39C12' : '#E74C3C'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-bold" style={{ color }}>{score}</span>
    </div>
  )
}
