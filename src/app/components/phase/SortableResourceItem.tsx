import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy, Check } from 'lucide-react';
import { DisplayResource } from './shared';

interface SortableResourceItemProps {
  resource: DisplayResource;
  rgb: string;
  color: string;
  onRemoveCustom: (id: string) => void;
}

export function SortableResourceItem({ resource, rgb, color, onRemoveCustom }: SortableResourceItemProps) {
  const [copiedName, setCopiedName] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: resource.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.7 : 1,
    padding: '14px 16px',
    borderRadius: 12,
    border: `1px solid ${isDragging ? `rgba(${rgb}, 0.5)` : 'rgba(255,255,255,0.07)'}`,
    background: isDragging ? `rgba(${rgb}, 0.1)` : 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    position: 'relative' as const,
  };

  const isFree = resource.price === 'free';
  const isAr = resource.lang === 'ar';

  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} className="cursor-grab flex items-center text-slate-500 px-1 touch-none">
        <GripVertical size={18} />
      </div>

      <div className="flex-1">
        <a href={resource.url || '#'} target="_blank" rel="noopener noreferrer" className="no-underline">
           <p style={{ color: resource.isCustom ? color : '#CBD5E1', fontSize: 16, fontWeight: 600, marginBottom: resource.isCustom && !resource.desc ? 0 : 6, lineHeight: 1.6 }}>
              {resource.isCustom ? `📌 ${resource.name}` : resource.name}
           </p>
        </a>

        {!resource.isCustom && (
           <div className="flex gap-[6px] flex-wrap">
             <span className="text-[10px] px-[7px] py-[2px] rounded text-purple-400" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
               {resource.type === 'video' ? '📹 فيديو' : resource.type === 'book' ? '📕 كتاب' : '📄 مقال'}
             </span>
             <span className={`text-[10px] px-[7px] py-[2px] rounded ${isAr ? 'text-emerald-400' : 'text-cyan-400'}`} style={{ background: isAr ? 'rgba(52,211,153,0.1)' : 'rgba(0,212,255,0.1)', border: `1px solid ${isAr ? 'rgba(52,211,153,0.2)' : 'rgba(0,212,255,0.2)'}` }}>
               {isAr ? '🇪🇬 عربي' : '🌍 English'}
             </span>
             <span className={`text-[10px] px-[7px] py-[2px] rounded ${isFree ? 'text-emerald-400' : 'text-amber-400'}`} style={{ background: isFree ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)', border: `1px solid ${isFree ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)'}` }}>
               {isFree ? 'مجاني ✓' : 'مدفوع 💳'}
             </span>
           </div>
        )}

        {resource.desc && (
           <div className="mt-2 p-[8px_12px] rounded-[4px_8px_8px_4px]" style={{ background: 'rgba(56, 189, 248, 0.1)', borderLeft: '3px solid #38BDF8' }}>
             <p className="text-sky-100 text-sm leading-relaxed m-0">{resource.desc}</p>
           </div>
        )}

        {resource.referral && (
          <div className="mt-2 p-[12px_14px] rounded-[8px_4px_4px_8px]" style={{ background: 'rgba(56, 189, 248, 0.08)', borderRight: '3px solid #38BDF8' }}>
            <p className="text-sky-100 text-sm leading-relaxed m-0 mb-3 whitespace-pre-wrap">
              {resource.referral.message}
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(resource.referral?.name || '');
                  setCopiedName(true);
                  setTimeout(() => setCopiedName(false), 2000);
                }}
                className="flex items-center gap-[6px] px-[10px] py-[6px] rounded text-[11px] cursor-pointer transition-all" style={{ border: '1px solid rgba(56, 189, 248, 0.2)', background: 'rgba(255,255,255,0.05)', color: '#38BDF8' }}
              >
                {copiedName ? <Check size={12} /> : <Copy size={12} />}
                {copiedName ? 'تم النسخ' : resource.referral.name}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(resource.referral?.email || '');
                  setCopiedEmail(true);
                  setTimeout(() => setCopiedEmail(false), 2000);
                }}
                className="flex items-center gap-[6px] px-[10px] py-[6px] rounded text-[11px] cursor-pointer transition-all" style={{ border: '1px solid rgba(56, 189, 248, 0.2)', background: 'rgba(255,255,255,0.05)', color: '#38BDF8' }}
              >
                {copiedEmail ? <Check size={12} /> : <Copy size={12} />}
                {copiedEmail ? 'تم النسخ' : resource.referral.email}
              </button>
            </div>
          </div>
        )}
      </div>

      {!resource.isCustom ? (
         <a href={resource.url || '#'} target="_blank" rel="noopener noreferrer" className="no-underline px-1">
           <span style={{ color: color, fontSize: 16, opacity: 0.7 }}>↗</span>
         </a>
      ) : (
         <button onClick={() => onRemoveCustom(resource.id)} className="bg-none border-none text-slate-600 cursor-pointer text-base px-1 shrink-0" title="حذف">
           🗑️
         </button>
      )}
    </div>
  );
}