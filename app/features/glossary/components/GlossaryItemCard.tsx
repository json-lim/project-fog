import type { RvgItem } from "~/types/rvg";

export function GlossaryItemCard({ item }: { item: RvgItem }) {
  return (
    <div className="p-2 border rounded hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="font-mono font-semibold text-blue-600 text-sm">
              {item.asa_item_number}
            </span>
            {item.units !== null && (
              <span className="text-xs text-gray-500">
                {item.units} unit{item.units !== 1 ? "s" : ""}
              </span>
            )}
            {item.time_units_applicable && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                Time Units
              </span>
            )}
            {item.modifying_units_applicable && (
              <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                Modifying Units
              </span>
            )}
          </div>
          <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {item.mbs_items && item.mbs_items.length > 0 && (
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs font-medium text-gray-500 mb-1">MBS Items:</p>
          <div className="flex flex-wrap gap-1">
            {item.mbs_items.map((mbs, idx) => (
              <div
                key={idx}
                className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono"
              >
                {mbs.mbs_item_number}
                {mbs.fee && ` - ${mbs.fee}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

