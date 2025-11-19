import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface OptionCardProps {
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tabIndex?: number;
  isFocused?: boolean;
}

export default function OptionCard({ icon, label, description, selected, onClick, onKeyDown, tabIndex, isFocused }: OptionCardProps) {
  const IconComponent = (Icons[icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;

  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      className={`
        group relative w-full p-6 rounded-xl border-2 transition-all duration-300
        ${selected
          ? 'border-slate-900 bg-slate-50 shadow-lg scale-[1.02]'
          : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-md hover:scale-[1.01]'
        }
        ${isFocused ? '' : ''}
      `}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className={`
          p-4 rounded-full transition-colors duration-300
          ${selected
            ? 'bg-slate-900 text-white'
            : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
          }
        `}>
          <IconComponent size={32} strokeWidth={1.5} />
        </div>

        <div>
          <h3 className={`
            font-semibold text-lg mb-1 transition-colors
            ${selected ? 'text-slate-900' : 'text-slate-800'}
          `}>
            {label}
          </h3>
          <p className={`
            text-sm transition-colors
            ${selected ? 'text-slate-600' : 'text-slate-500'}
          `}>
            {description}
          </p>
        </div>
      </div>

      {selected && (
        <div className="absolute top-3 right-3">
          <Icons.CheckCircle2 size={20} className="text-slate-900" fill="currentColor" />
        </div>
      )}
    </button>
  );
}
