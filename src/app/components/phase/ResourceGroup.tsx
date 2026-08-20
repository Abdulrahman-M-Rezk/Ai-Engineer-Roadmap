import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DisplayResource } from './shared';
import { SortableResourceItem } from './SortableResourceItem';

interface ResourceGroupProps {
  title: string;
  color: string;
  rgb: string;
  resources: DisplayResource[];
  sensors: Parameters<typeof DndContext>[0]['sensors'];
  onDragEnd: (event: DragEndEvent, group: DisplayResource[]) => void;
  onRemoveCustom: (id: string) => void;
}

export function ResourceGroup({ title, color, rgb, resources, sensors, onDragEnd, onRemoveCustom }: ResourceGroupProps) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
        <h4 className="text-slate-300 text-sm font-bold m-0">{title}</h4>
        <div className="flex-1 h-[1px]" style={{ background: `rgba(${rgb}, 0.2)` }} />
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => onDragEnd(e, resources)}>
        <SortableContext items={resources.map(r => r.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-0">
            {resources.map(r => (
              <SortableResourceItem key={r.id} resource={r} rgb={rgb} color={color} onRemoveCustom={onRemoveCustom} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}