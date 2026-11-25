import { cn } from '@/lib/cn';

type Props = React.ComponentPropsWithoutRef<'div'> & { as?: 'div' | 'section' | 'header' | 'footer' | 'nav' };

/** Centred page-width wrapper with fluid gutters. */
export function Container({ as: Tag = 'div', className, ...rest }: Props) {
	return <Tag className={cn('page-container', className)} {...rest} />;
}
