import Link from 'next/link';
import { CSSProperties, HTMLAttributes, PropsWithChildren } from 'react';

type V2StandardStyle = 'title' | 'label' | 'body';
type V2WeightedStyle = 'display' | 'headline';
type V2Weight = 'light' | 'heavy';
type V2Size = 'large' | 'medium' | 'small';

type V2StandardVariant = `${V2StandardStyle}/${V2Size}`;
type V2WeightedVariant = `${V2WeightedStyle}/${V2Weight}/${V2Size}`;
type V2Variant = V2StandardVariant | V2WeightedVariant;

function isStandardVariant(variant: V2Variant): variant is V2StandardVariant {
  return variant.split('/').length === 2;
}

type ComponentType = 'p' | 'span' | 'div';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant: V2Variant;
  component?: ComponentType;
  // This is used if/when the component is 'a'.
  href?: string;
  className?: string;
}

// Implements styles from https://www.figma.com/file/KQNb1Z6MT1GBxIuoQrChGK/Diamond-Design-System?node-id=27%3A485&mode=dev
const v2StandardSizes: Record<V2StandardStyle, Record<V2Size, string>> = {
  title: {
    large: '1.8125rem',
    medium: '1.625rem',
    small: '1.4375rem',
  },
  label: {
    large: '1.25rem',
    medium: '1.125rem',
    small: '1rem',
  },
  body: {
    large: '1.125rem',
    medium: 'clamp(1.25rem, 2.3vw, 2.1775rem)',
    small: '0.875rem',
  },
};

const v2StandardHeights: Record<V2StandardStyle, Record<V2Size, string>> = {
  title: {
    large: '2.375rem',
    medium: '2.125rem',
    small: '1.875rem',
  },
  label: {
    large: '1.625rem',
    medium: '1.5rem',
    small: '1.3125rem',
  },
  body: {
    large: '1.5rem',
    medium: '1.2',
    small: '1.125rem',
  },
};

const v2StandardSpacings: Partial<Record<V2StandardStyle, Partial<Record<V2Size, string>>>> = {
  label: {
    medium: '0.03125rem',
    small: '0.03125rem',
  },
  body: {
    large: '0.03125rem',
    medium: '0',
    small: '0.025rem',
  },
};

const v2StandardWeights: Record<V2StandardStyle, Record<V2Size, number>> = {
  title: { large: 400, medium: 400, small: 400 },
  label: { large: 500, medium: 500, small: 500 },
  body: { large: 400, medium: 300, small: 400 },
};

const v2WeightedSizes: Record<V2WeightedStyle, Record<V2Size, string>> = {
  display: {
    large: '4.125rem',
    medium: '3.25rem',
    small: '2.875rem',
  },
  headline: {
    large: '2.5625rem',
    medium: '2.25rem',
    small: '2rem',
  },
};

const v2WeightedHeights: Record<V2WeightedStyle, Record<V2Size, string>> = {
  display: {
    large: '5.375rem',
    medium: '4.25rem',
    small: '3.75rem',
  },
  headline: {
    large: '3.3125rem',
    medium: '2.9375rem',
    small: '2.625rem',
  },
};

const v2WeightedSpacings: Record<V2WeightedStyle, Record<V2Size, string>> = {
  display: {
    large: '-0.0625rem',
    medium: '-0.03125rem',
    small: '-0.01563rem',
  },
  headline: {
    large: '-0.01563rem',
    medium: '-0.01563rem',
    small: '-0.01563rem',
  },
};

const v2WeightedWeights: Record<V2WeightedStyle, Record<V2Weight, Record<V2Size, number>>> = {
  display: {
    light: {
      large: 200,
      medium: 200,
      small: 300,
    },
    heavy: {
      large: 800,
      medium: 700,
      small: 600,
    },
  },
  headline: {
    light: {
      large: 300,
      medium: 400,
      small: 400,
    },
    heavy: {
      large: 600,
      medium: 400,
      small: 400,
    },
  },
};

const variantToCSS = (variant: V2Variant): CSSProperties => {
  if (isStandardVariant(variant)) {
    const [style, size] = variant.split('/') as [V2StandardStyle, V2Size];
    return {
      fontSize: v2StandardSizes[style][size],
      lineHeight: v2StandardHeights[style][size],
      letterSpacing: v2StandardSpacings[style]?.[size] ?? 'normal',
      fontWeight: v2StandardWeights[style][size],
    };
  }
  const [style, weight, size] = variant.split('/') as [V2WeightedStyle, V2Weight, V2Size];
  return {
    fontSize: v2WeightedSizes[style][size],
    lineHeight: v2WeightedHeights[style][size],
    letterSpacing: v2WeightedSpacings[style][size],
    fontWeight: v2WeightedWeights[style][weight][size],
  };
};

/**
 * Typography component applies h1-h6 styles from Diamond Design System.
 *
 * https://www.figma.com/file/ihJGLgfFTURKCgl9KNUPcA/Website-%26-Portal%3A-Design-System?node-id=1561%3A263&mode=dev
 * @param props
 * @param props.variant - variant as specified by Diamond Design System, e.g. `h1/bold`, `title/large`, `display/light/small`
 * @param props.component - the actual semantic element, e.g. `h1`, `p`, `div`
 * @param props.style - style prop for JSX component
 * @returns styled typography component
 */
const Typography = (props: PropsWithChildren<TypographyProps>) => {
  const { variant, component, style, children, ...restProps } = props;

  if (restProps.href) {
    return (
      <Link
        href={restProps.href}
        style={{
          ...variantToCSS(variant),
          ...style, // other styles can be customized via style prop
        }}
        {...restProps}
      >
        {children}
      </Link>
    );
  }

  const Component = component || 'div';

  return (
    <Component
      style={{
        ...variantToCSS(variant),
        ...style, // other styles can be customized via style prop
      }}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export default Typography;
