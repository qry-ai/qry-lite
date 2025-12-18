import { AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

type AlertType = 'info' | 'warning' | 'error' | 'success';

interface AlertProps {
	type?: AlertType;
	title?: string;
	children: React.ReactNode;
	hideIcon?: boolean
}

const alertStyles = {
	info: {
		bg: 'bg-blue-50/50',
		border: 'border-blue-100',
		icon: 'text-blue-600',
		title: 'text-gray-900',
		Icon: Info
	},
	warning: {
		bg: 'bg-amber-50/50',
		border: 'border-amber-100',
		icon: 'text-amber-600',
		title: 'text-gray-900',
		Icon: AlertTriangle
	},
	error: {
		bg: 'bg-red-50/50',
		border: 'border-red-100',
		icon: 'text-red-600',
		title: 'text-gray-900',
		Icon: XCircle
	},
	success: {
		bg: 'bg-green-50/50',
		border: 'border-green-100',
		icon: 'text-green-600',
		title: 'text-gray-900',
		Icon: AlertCircle
	}
};

export function Alert({ type = 'info', title, children, hideIcon = false }: AlertProps) {
	const styles = alertStyles[type];
	const Icon = styles.Icon;

	return (
		<div className={`mt-8 p-4 ${styles.bg} border ${styles.border} rounded-xl`}>
			<div className="flex items-start gap-3">
				{!hideIcon && <Icon className={`${styles.icon} flex-shrink-0 mt-0.5`} size={20} />}
				<div className="text-sm text-gray-700">
					{title && <p className={`font-medium ${styles.title} mb-1`}>{title}</p>}
					<div>{children}</div>
				</div>
			</div>
		</div>
	);
}