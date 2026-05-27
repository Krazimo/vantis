'use client'

import { X } from 'lucide-react'
import { ANON } from '../_data/complaints.data'

interface ScheduleModal { id: string; date: string }
interface OrderModal { id: string; text: string }

interface Props {
  scheduleModal: ScheduleModal | null
  orderModal: OrderModal | null
  onScheduleChange: (m: ScheduleModal) => void
  onOrderChange: (m: OrderModal) => void
  onCloseSchedule: () => void
  onCloseOrder: () => void
}

export default function ComplaintsModals({ scheduleModal, orderModal, onScheduleChange, onOrderChange, onCloseSchedule, onCloseOrder }: Props) {
  return (
    <>
      {scheduleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={onCloseSchedule}>
          <div className="bg-card border border-border rounded-sm p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne text-lg text-foreground">Schedule Hearing</h3>
              <button onClick={onCloseSchedule}><X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors duration-150" /></button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              <span className="font-mono text-primary">{scheduleModal.id}</span> — {ANON[scheduleModal.id]}
            </p>
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Hearing Date</label>
              <input
                type="date"
                value={scheduleModal.date}
                onChange={e => onScheduleChange({ ...scheduleModal, date: e.target.value })}
                className="w-full bg-muted border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 [color-scheme:dark]"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={onCloseSchedule} className="flex-1 py-2 text-xs text-muted-foreground border border-border rounded-sm hover:text-foreground transition-colors duration-150">Cancel</button>
              <button onClick={onCloseSchedule} className="flex-1 py-2 text-xs bg-primary/15 text-primary border border-primary/30 rounded-sm hover:bg-primary/20 transition-colors duration-150">Confirm Schedule</button>
            </div>
          </div>
        </div>
      )}

      {orderModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={onCloseOrder}>
          <div className="bg-card border border-border rounded-sm p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne text-lg text-foreground">Record Order</h3>
              <button onClick={onCloseOrder}><X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors duration-150" /></button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              <span className="font-mono text-primary">{orderModal.id}</span> — {ANON[orderModal.id]}
            </p>
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Order Summary</label>
              <textarea
                value={orderModal.text}
                onChange={e => onOrderChange({ ...orderModal, text: e.target.value })}
                rows={4}
                placeholder="Enter the order details and any directions issued..."
                className="w-full bg-muted border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={onCloseOrder} className="flex-1 py-2 text-xs text-muted-foreground border border-border rounded-sm hover:text-foreground transition-colors duration-150">Cancel</button>
              <button onClick={onCloseOrder} className="flex-1 py-2 text-xs bg-primary/15 text-primary border border-primary/30 rounded-sm hover:bg-primary/20 transition-colors duration-150">Save Order</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
