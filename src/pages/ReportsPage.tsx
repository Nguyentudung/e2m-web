import { useNavigate } from "react-router-dom";
import chartImg from "../assets/icons/chart.png";
import { Button } from "@/components/ui/button";

function ReportsPage() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <img
        src={chartImg}
        alt="Báo cáo"
        className="mb-4 h-40 w-40 object-contain"
      />
      <h1 className="mb-6 text-xl font-bold text-text-primary">
        Chưa có dữ liệu báo cáo
      </h1>
      <Button size="lg" onClick={() => navigate("/add")}>
        Ghi chép giao dịch ngay
      </Button>
    </section>
  );
}

export default ReportsPage;
