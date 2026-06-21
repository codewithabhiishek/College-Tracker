import { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { statusConfig } from '@/lib/statusConfig';

const localizer = momentLocalizer(moment);

export default function CalendarView({ universities, onEventClick, onDateSelect }) {
  const events = useMemo(() => {
    return universities
      .filter((u) => u.deadline)
      .map((u) => {
        const deadlineDate = new Date(u.deadline);
        return {
          id: u.id,
          title: u.name,
          start: deadlineDate,
          end: deadlineDate,
          allDay: true,
          resource: u,
        };
      });
  }, [universities]);

  const eventStyleGetter = (event) => {
    const cfg = statusConfig[event.resource.status] || statusConfig.researching;
    return {
      style: {
        backgroundColor: "hsl(var(--muted))",
        borderLeft: `4px solid ${
          cfg.label === "Accepted"
            ? "#10b981"
            : cfg.label === "Rejected"
              ? "#ef4444"
              : "hsl(var(--primary))"
        }`,
        color: "hsl(var(--foreground))",
        fontSize: "11px",
        borderRadius: "4px",
        borderTop: "1px solid hsl(var(--border))",
        borderRight: "1px solid hsl(var(--border))",
        borderBottom: "1px solid hsl(var(--border))",
        padding: "2px 4px",
      },
    };
  };

  return (
    <div className="h-full p-4">
      <div className="h-full bg-card border border-border p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month', 'agenda']}
          defaultView="agenda"
          selectable={true}
          onSelectEvent={(event) => onEventClick(event.resource)}
          onSelectSlot={({ start }) => {
            if (onDateSelect) {
              onDateSelect(start);
            }
          }}
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
