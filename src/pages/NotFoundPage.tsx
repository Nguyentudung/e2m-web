import { Link } from "react-router-dom";
import noDataImg from "../assets/icons/no-data.svg";

function NotFoundPage() {
  return (
    <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <img
        src={noDataImg}
        alt="Không tìm thấy dữ liệu"
        className="mb-4 h-80 w-80 object-contain"
      />
      <h1 className="mb-6 text-xl font-bold text-text-primary">
        Không tìm thấy dữ liệu
      </h1>
      <Link
        to="/"
        className="rounded-xl bg-primary-accent px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
      >
        Quay về Trang chính
      </Link>
    </section>
  );
}

export default NotFoundPage;
