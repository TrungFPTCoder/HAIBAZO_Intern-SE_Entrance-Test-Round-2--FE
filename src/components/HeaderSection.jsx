import { Button } from "antd";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderSection({ title, description, buttonLabel, navigateTo }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold text-zinc-850 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-zinc-500 font-light">{description}</p>
      </div>
      <Button
        onClick={() => navigate(navigateTo)}
        color="purple"
        variant="solid"
        size="large"
      >
        <Plus className="h-5 w-5" strokeWidth="2.5" />
        <span>{buttonLabel}</span>
      </Button>
    </div>
  );
}
