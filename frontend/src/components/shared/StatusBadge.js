const STYLES = {
  Available: "bg-status-available-bg text-status-available-text",
  Occupied: "bg-status-occupied-bg text-status-occupied-text",
  Maintenance: "bg-status-maintenance-bg text-status-maintenance-text",
  Confirmed: "bg-status-available-bg text-status-available-text",
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
