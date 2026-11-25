import type { ReactNode } from "react";
import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-info">
        <p>{title}</p>
        <h2>{value}</h2>
      </div>

      <div className="stat-card-icon" style={{ background: color }}>
        {icon}
      </div>
    </div>
  );
}

export default StatCard;
