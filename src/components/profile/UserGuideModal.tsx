import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  HelpCircleIcon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  BookOpen01Icon,
  Wallet01Icon,
  Analytics01Icon,
  FolderSecurityIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface UserGuideModalProps {
  open: boolean;
  onClose: () => void;
}

interface GuideTopic {
  id: string;
  icon: typeof HelpCircleIcon;
  badgeBg: string;
  title: string;
  summary: string;
  content: string[];
}

const GUIDE_TOPICS: GuideTopic[] = [
  {
    id: "basic",
    icon: BookOpen01Icon,
    badgeBg: "bg-[#007AFF]",
    title: "Hướng dẫn sử dụng cơ bản",
    summary: "Thêm giao dịch thu chi hàng ngày",
    content: [
      "Nhấn vào nút (+) màu tím ở giữa thanh điều hướng bên dưới để bắt đầu ghi chép giao dịch.",
      "Nhập số tiền giao dịch, chọn loại (Chi tiêu hoặc Thu nhập).",
      "Chọn Danh mục tương ứng (ví dụ: Ăn uống, Di chuyển, Mua sắm...) và Ví tiền sử dụng.",
      "Nhấn 'Lưu giao dịch' để cập nhật ngay vào số dư ví của bạn.",
    ],
  },
  {
    id: "wallets",
    icon: Wallet01Icon,
    badgeBg: "bg-[#34C759]",
    title: "Quản lý Ví tiền & Ngân hàng",
    summary: "Tạo và theo dõi các nguồn tiền khác nhau",
    content: [
      "Vào mục 'Ví' trên thanh điều hướng để xem danh sách các ví tiền hiện có.",
      "Bạn có thể tạo thêm ví mới như Tiền mặt, Thẻ ngân hàng (VCB, TCB, MB...) hoặc Ví điện tử (Momo, ZaloPay...).",
      "Mỗi ví sẽ quản lý số dư riêng biệt giúp bạn theo dõi rõ ràng từng nguồn tiền.",
    ],
  },
  {
    id: "reports",
    icon: Analytics01Icon,
    badgeBg: "bg-[#AF52DE]",
    title: "Xem Báo cáo & Thống kê",
    summary: "Phân tích thói quen thu chi theo thời gian",
    content: [
      "Chuyển sang mục 'Báo cáo' để xem biểu đồ chi tiêu tổng quan.",
      "Ứng dụng tự động phân tích tỷ lệ chi tiêu theo từng danh mục giúp bạn biết tiền của mình đã đi đâu.",
      "Có thể lọc báo cáo theo tuần, tháng hoặc khoảng thời gian tùy chỉnh.",
    ],
  },
  {
    id: "backup",
    icon: FolderSecurityIcon,
    badgeBg: "bg-[#FF9500]",
    title: "Bảo mật & Sao lưu dữ liệu",
    summary: "An toàn dữ liệu cá nhân trên thiết bị của bạn",
    content: [
      "Dữ liệu của bạn được lưu trữ an toàn ngay trên trình duyệt thiết bị (LocalStorage).",
      "Bạn có thể chủ động Export (Xuất tệp sao lưu) trong phần Cài đặt để cất giữ an toàn.",
      "Khi đổi thiết bị mới, chỉ cần dùng tính năng Import (Nhập dữ liệu) để khôi phục toàn bộ giao dịch.",
    ],
  },
];

export default function UserGuideModal({ open, onClose }: UserGuideModalProps) {
  const [activeId, setActiveId] = useState<string | null>("basic");

  if (!open) return null;

  const toggleTopic = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* iOS Backdrop Dim */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* iOS Sheet Dialog */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-[28px] sm:rounded-[26px] bg-surface p-6 shadow-2xl text-text-primary border border-border/80">
        {/* iOS Drag Handle indicator for mobile */}
        <div className="sm:hidden -mt-2 mb-4 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-text-tertiary/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#FF9500] text-white shadow-xs">
              <HugeiconsIcon icon={HelpCircleIcon} size={20} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary leading-tight">
                Hướng dẫn sử dụng
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Giải đáp nhanh các thao tác trong Montra
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Content - Apple Grouped Accordion List */}
        <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-2.5">
          {GUIDE_TOPICS.map((topic) => {
            const isOpen = activeId === topic.id;
            const Icon = topic.icon;

            return (
              <div
                key={topic.id}
                className="rounded-[18px] border border-border/60 bg-background transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleTopic(topic.id)}
                  className="flex w-full items-center justify-between p-3.5 text-left hover:bg-surface-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] ${topic.badgeBg} text-white shadow-xs`}>
                      <HugeiconsIcon icon={Icon} size={17} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-text-primary leading-tight">
                        {topic.title}
                      </p>
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        {topic.summary}
                      </p>
                    </div>
                  </div>

                  <HugeiconsIcon
                    icon={isOpen ? ArrowDown01Icon : ArrowRight01Icon}
                    size={16}
                    strokeWidth={2}
                    className="text-text-tertiary shrink-0 ml-2"
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-border/60 bg-surface/50 p-4">
                    <ul className="space-y-2.5">
                      {topic.content.map((step, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed"
                        >
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-[10px] font-bold text-primary-500">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <Button onClick={onClose} variant="secondary" className="w-full rounded-full font-medium">
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
