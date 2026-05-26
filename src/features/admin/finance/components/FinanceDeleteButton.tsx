import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FinanceDeleteButtonProps {
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    isDeleting?: boolean;
    onConfirm: () => void | Promise<void>;
}

export default function FinanceDeleteButton({
    title,
    description,
    confirmLabel,
    cancelLabel,
    isDeleting = false,
    onConfirm,
}: FinanceDeleteButtonProps) {
    const { t } = useTranslation();
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = async () => {
        await onConfirm();
        setIsConfirming(false);
    };

    if (!isConfirming) {
        return (
            <button
                type="button"
                onClick={() => setIsConfirming(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-400 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
            >
                <Trash2 className="h-4 w-4" />
                {confirmLabel}
            </button>
        );
    }

    return (
        <section className="rounded-[2rem] border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200">
                        <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div>
                        <h3 className="text-base font-black">{title}</h3>

                        <p className="mt-1 max-w-2xl text-sm font-semibold leading-6">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setIsConfirming(false)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                    >
                        <X className="h-4 w-4" />
                        {cancelLabel ?? t('financeDeleteButton.cancel')}
                    </button>

                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={handleConfirm}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Trash2 className="h-4 w-4" />
                        {isDeleting ? t('financeDeleteButton.deleting') : confirmLabel}
                    </button>
                </div>
            </div>
        </section>
    );
}