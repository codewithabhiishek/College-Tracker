import { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { statusConfig } from '@/lib/statusConfig';

const localizer = momentLocalizer(moment);

export default function CalendarView({ universities, onEventClick }) {
  const events = useMemo(() => {
    return universities
      .filter((u) => u.deadline)
      .map((u) => {
        // Parse the deadline date and exact time
        const deadlineDate = new Date(u.deadline);
        return {
          id: u.id,
          title: u.name,
          start: deadlineDate,
          end: deadlineDate,
          allDay: false,
          resource: u,
        };
      });
  }, [universities]);

  const eventStyleGetter = (event) => {
    const statusInfo = statusConfig[event.resource.status];
    // We map Tailwind hex equivalents roughly
    let backgroundColor = '#334155'; // slate-700
    if (statusInfo) {
      if (statusInfo.dot.includes('bg-yellow')) backgroundColor = '#eab308';
      if (statusInfo.dot.includes('bg-green')) backgroundColor = '#22c55e';
      if (statusInfo.dot.includes('bg-blue')) backgroundColor = '#3b82f6';
      if (statusInfo.dot.includes('bg-red')) backgroundColor = '#ef4444';
      if (statusInfo.dot.includes('bg-purple')) backgroundColor = '#a855f7';
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
      }
    };
  };

  return (
    <div className="h-full w-full p-4 bg-background overflow-auto flex justify-center items-start">
      <div className="w-full max-w-6xl h-[700px] rounded-md border border-border p-4 bg-card shadow-sm">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month', 'week', 'day', 'agenda']}
          onSelectEvent={(event) => onEventClick(event.resource)}
          eventPropGetter={eventStyleGetter}
          popup
        />
      </div>
      {/* We need some custom styles to override big-calendar's white backgrounds for dark mode */}
      <style>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
          border-color: hsl(var(--border));
        }
        .rbc-header {
          border-bottom: 1px solid hsl(var(--border)) !important;
          border-left: 1px solid hsl(var(--border)) !important;
          padding: 8px 0;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
        }
        .rbc-header + .rbc-header {
          border-left: 1px solid hsl(var(--border));
        }
        .rbc-month-row {
          border-top: 1px solid hsl(var(--border));
        }
        .rbc-day-bg {
          border-left: 1px solid hsl(var(--border));
        }
        .rbc-off-range-bg {
          background-color: hsl(var(--muted) / 0.3);
        }
        .rbc-today {
          background-color: hsl(var(--accent) / 0.5);
        }
        .rbc-date-cell {
          padding: 4px 8px;
          font-size: 14px;
        }
        .rbc-btn-group button {
          color: hsl(var(--foreground));
          border-color: hsl(var(--border));
        }
        .rbc-btn-group button.rbc-active {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-color: hsl(var(--primary));
          box-shadow: none;
        }
        .rbc-btn-group button:hover:not(.rbc-active) {
          background-color: hsl(var(--accent));
        }
        .rbc-toolbar button {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .rbc-toolbar-label {
          font-weight: 600;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}
