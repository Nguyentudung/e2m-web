import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

interface CreateWalletActionsProps {
  disabled: boolean;
  onCancel: () => void;
}

function CreateWalletActions({ disabled }: CreateWalletActionsProps) {
  return (
    <Field orientation="horizontal" className="justify-end">
      <Button
        type="submit"
        form="create-wallet-form"
        disabled={disabled}
        className={`
          h-12
          flex-1
          rounded-full
          px-6
          font-bold
          transition
          active:scale-[0.98]
          disabled:opacity-100
          ${
            disabled
              ? "cursor-not-allowed bg-disabled-background text-disabled-text border-[1.5px] border-disabled-border"
              : "bg-primary-accent text-text-primary hover:brightness-105"
          }
        `}
      >
        Tạo ví
      </Button>
    </Field>
  );
}

export default CreateWalletActions;
