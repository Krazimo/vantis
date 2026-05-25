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
          <div className="bg-surface border border-border rounded-sm p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne text-lg text-off-white">Schedule Hearing</h3>
              <button onClick={onCloseSchedule}><X className="w-4 h-4 text-gray hover:text-off-white transition-colors duration-150" /></button>
            </div>
            <p className="text-xs text-gray mb-4">
              <span className="font-mono text-gold">{scheduleModal.id}</span> — {ANON[scheduleModal.id]}
            </p>
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-widest text-gray block mb-2">Hearing Date</label>
              <input
                type="date"
                value={scheduleModal.date}
                onChange={e => onScheduleChange({ ...scheduleModal, date: e.target.value })}
                className="w-full bg-surface2 border border-border rounded-sm px-3 py-2 text-sm text-off-white focus:outline-none focus:border-gold/50 [color-scheme:dark]"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={onCloseSchedule} className="flex-1 py-2 text-xs text-gray border border-border rounded-sm hover:text-off-white transition-colors duration-150">Cancel</button>
              <button onClick={onCloseSchedule} className="flex-1 py-2 text-xs bg-gold/15 text-gold border border-gold/30 rounded-sm hover:bg-gold/20 transition-colors duration-150">Confirm Schedule</button>
            </div>
          </div>
        </div>
      )}

      {orderModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={onCloseOrder}>
          <div className="bg-surface border border-border rounded-sm p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne text-lg text-off-white">Record Order</h3>
              <button onClick={onCloseOrder}><X className="w-4 h-4 text-gray hover:text-off-white transition-colors duration-150" /></button>
            </div>
            <p className="text-xs text-gray mb-4">
              <span className="font-mono text-gold">{orderModal.id}</span> — {ANON[orderModal.id]}
            </p>
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-widest text-gray block mb-2">Order Summary</label>
              <textarea
                value={orderModal.text}
                onChange={e => onOrderChange({ ...orderModal, text: e.target.value })}
                rows={4}
                placeholder="Enter the order details and any directions issued..."
                className="w-full bg-surface2 border border-border rounded-sm px-3 py-2 text-sm text-off-white focus:outline-none focus:border-gold/50 resize-none placeholder:text-gray/50"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={onCloseOrder} className="flex-1 py-2 text-xs text-gray border border-border rounded-sm hover:text-off-white transition-colors duration-150">Cancel</button>
              <button onClick={onCloseOrder} className="flex-1 py-2 text-xs bg-gold/15 text-gold border border-gold/30 rounded-sm hover:bg-gold/20 transition-colors duration-150">Save Order</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
