import { Component } from 'react';

export interface SVGPathObject {
  path: string;
  className?: string;
}

export interface IconDefinitionBase {
  name?: string;
  width: number;
  height: number;
  xOffset?: number;
  yOffset?: number;
  svgClassName?: string;
}

/**
 * SVG path content for one icon variant (default or rh-ui). At runtime at least one of
 * `svgPathData` or `svgPath` must be set; if both are present, `svgPathData` is used.
 */
export interface IconDefinition extends IconDefinitionBase {
  svgPathData?: string | SVGPathObject[];
  /**
   * @deprecated Use {@link IconDefinition.svgPathData} instead.
   */
  svgPath?: string | SVGPathObject[];
}

/** Narrows {@link IconDefinition} to the preferred shape with required `svgPathData`. */
export type IconDefinitionWithSvgPathData = Required<Pick<IconDefinition, 'svgPathData'>> & IconDefinition;

/**
 * @deprecated Use {@link IconDefinition} with `svgPathData` instead.
 * Narrows {@link IconDefinition} to the legacy shape with required `svgPath`.
 */
export type IconDefinitionWithSvgPath = Required<Pick<IconDefinition, 'svgPath'>> & IconDefinition;

/** When passing `icon` or `rhUiIcon` keys (nested form), `icon` is required at runtime. */
export interface CreateIconProps {
  name?: string;
  icon?: IconDefinition;
  rhUiIcon?: IconDefinition | null;
}

/**
 * @deprecated The previous `createIcon` accepted a flat {@link IconDefinition} with top-level
 * `svgPath`. Pass {@link CreateIconProps} with a nested `icon` field instead.
 */
export type LegacyFlatIconDefinition = IconDefinition;

export interface SVGIconProps extends Omit<React.HTMLProps<SVGElement>, 'ref'> {
  title?: string;
  className?: string;
  /** Indicates the icon should render using alternate svg data for the unified theme */
  set?: 'default' | 'rh-ui';
  /** Indicates the icon should render without its default styling specified in its IconDefinition.svgClassName. */
  noDefaultStyle?: boolean;
}

let currentId = 0;

/** Returns path data from `svgPathData` or deprecated `svgPath` (prefers `svgPathData` when both exist). */
function resolveSvgPathData(icon: IconDefinition): string | SVGPathObject[] {
  if ('svgPathData' in icon && icon.svgPathData !== undefined) {
    return icon.svgPathData;
  }
  if ('svgPath' in icon && icon.svgPath !== undefined) {
    return icon.svgPath;
  }
  throw new Error('@patternfly/react-icons: IconDefinition must define svgPathData or svgPath');
}

/** Produces a single {@link IconDefinitionWithSvgPathData} for internal rendering. */
function normalizeIconDefinition(icon: IconDefinition): IconDefinitionWithSvgPathData {
  return {
    name: icon.name,
    width: icon.width,
    height: icon.height,
    svgPathData: resolveSvgPathData(icon),
    xOffset: icon.xOffset,
    yOffset: icon.yOffset,
    svgClassName: icon.svgClassName
  };
}

/** True when the argument uses the nested `CreateIconProps` shape (`icon` and/or `rhUiIcon` keys). */
function isNestedCreateIconProps(arg: object): arg is CreateIconProps {
  return 'icon' in arg || 'rhUiIcon' in arg;
}

/** Props after resolving legacy `svgPath` and flat `createIcon` arguments. */
interface NormalizedCreateIconProps {
  name?: string;
  icon?: IconDefinitionWithSvgPathData;
  rhUiIcon: IconDefinitionWithSvgPathData | null;
}

/**
 * Coerces legacy flat or nested props into normalized {@link NormalizedCreateIconProps}.
 * Nested input must include a non-null `icon` or throws.
 */
function normalizeCreateIconArg(arg: CreateIconProps | LegacyFlatIconDefinition): NormalizedCreateIconProps {
  if (isNestedCreateIconProps(arg)) {
    const p = arg as CreateIconProps;
    if (p.icon == null) {
      const label = p.name != null ? ` (name: ${String(p.name)})` : '';
      throw new Error(
        `@patternfly/react-icons: createIcon requires an \`icon\` definition when using nested CreateIconProps${label}.`
      );
    }
    return {
      name: p.name,
      icon: normalizeIconDefinition(p.icon),
      rhUiIcon: p.rhUiIcon != null ? normalizeIconDefinition(p.rhUiIcon) : null
    };
  }
  return {
    name: (arg as LegacyFlatIconDefinition).name,
    icon: normalizeIconDefinition(arg as IconDefinition),
    rhUiIcon: null
  };
}

/** Renders an inner `<svg>` with viewBox and path(s) for the dual-SVG (CSS swap) layout. */
const createSvg = (icon: IconDefinitionWithSvgPathData, iconClassName: string) => {
  const { xOffset, yOffset, width, height, svgPathData, svgClassName } = icon ?? {};
  const _xOffset = xOffset ?? 0;
  const _yOffset = yOffset ?? 0;
  const viewBox = [_xOffset, _yOffset, width, height].join(' ');

  const classNames = [];

  if (svgClassName) {
    classNames.push(svgClassName);
  }
  if (iconClassName) {
    classNames.push(iconClassName);
  }

  const svgPaths =
    svgPathData && Array.isArray(svgPathData) ? (
      svgPathData.map((pathObject, index) => (
        <path className={pathObject.className} key={`${pathObject.path}-${index}`} d={pathObject.path} />
      ))
    ) : (
      <path d={svgPathData as string} />
    );

  return (
    <svg viewBox={viewBox} className={classNames.join(' ')}>
      {svgPaths}
    </svg>
  );
};

/**
 * Builds a React **class** component that renders a PatternFly SVG icon (`role="img"`, optional `<title>` for a11y).
 *
 * **Argument shape — pick one:**
 *
 * 1. **`CreateIconProps` (preferred)** — `{ name?, icon?, rhUiIcon? }`. Dimensions and path data sit on `icon`
 *    (and optionally on `rhUiIcon` for Red Hat UI–mapped icons). If the object **has an `icon` or `rhUiIcon` key**
 *    (including `rhUiIcon: null`), this shape is assumed.
 *
 * 2. **Legacy flat `IconDefinition`** — the same fields as `icon`, but at the **top level** (no nested `icon`).
 *    Still accepted so existing callers are not broken. Prefer migrating to `CreateIconProps`.
 *
 * **Path data on each `IconDefinition`:** use `svgPathData` (string or {@link SVGPathObject}[]). The old name
 * `svgPath` is deprecated but still read; `svgPathData` wins if both are present.
 *
 * **Default vs RH UI rendering:** If `rhUiIcon` is set and the consumer does **not** pass `set` on the component,
 *    the output is an outer `<svg.pf-v6-svg>` containing **two** inner `<svg>`s (default + rh-ui) so CSS can swap
 *    which variant is visible. If `set` is `"default"` or `"rh-ui"`, a **single** flat `<svg>` is rendered for that
 *    variant. Requesting `set="rh-ui"` when there is no `rhUiIcon` falls back to the default glyph and logs a
 *    `console.warn` (see implementation).
 *
 * @param arg Icon configuration: either {@link CreateIconProps} (nested `icon` / `rhUiIcon`) or a legacy flat
 *    {@link LegacyFlatIconDefinition}. Runtime detection follows the rules in **Argument shape** above.
 * @returns A `ComponentClass<SVGIconProps>` — render it as `<YourIcon />` or with `title`, `className`, `set`, etc.
 */
export function createIcon(arg: CreateIconProps | LegacyFlatIconDefinition): React.ComponentClass<SVGIconProps> {
  const { name, icon, rhUiIcon = null } = normalizeCreateIconArg(arg);

  return class SVGIcon extends Component<SVGIconProps> {
    static displayName = name;

    id = `icon-title-${currentId++}`;

    static defaultProps: SVGIconProps = {
      noDefaultStyle: false
    };

    /** Renders one root `<svg>`; either a single variant or nested inner SVGs for RH UI swap. */
    render() {
      const { title, className: propsClassName, set, noDefaultStyle, ...props } = this.props;

      const hasTitle = Boolean(title);
      const classNames = ['pf-v6-svg'];

      if (propsClassName) {
        classNames.push(propsClassName);
      }

      if (set === 'rh-ui' && rhUiIcon === null) {
        // eslint-disable-next-line no-console
        console.warn(
          `Set "rh-ui" was provided for ${name}, but no rh-ui icon data exists for this icon. The default icon will be rendered.`
        );
      }

      if ((set === undefined && rhUiIcon === null) || set !== undefined) {
        const iconData: IconDefinitionWithSvgPathData | undefined =
          set !== undefined && set === 'rh-ui' && rhUiIcon !== null ? rhUiIcon : icon;
        const { xOffset, yOffset, width, height, svgPathData, svgClassName } =
          iconData ?? ({} as Partial<IconDefinitionWithSvgPathData>);
        const _xOffset = xOffset ?? 0;
        const _yOffset = yOffset ?? 0;
        const viewBox = [_xOffset, _yOffset, width, height].join(' ');

        if (svgClassName && !noDefaultStyle) {
          classNames.push(svgClassName);
        }

        const svgPaths =
          svgPathData && Array.isArray(svgPathData) ? (
            svgPathData.map((pathObject, index) => (
              <path className={pathObject.className} key={`${pathObject.path}-${index}`} d={pathObject.path} />
            ))
          ) : (
            <path d={svgPathData as string} />
          );

        return (
          <svg
            className={classNames.join(' ')}
            fill="currentColor"
            viewBox={viewBox}
            aria-labelledby={hasTitle ? this.id : null}
            aria-hidden={hasTitle ? null : true}
            role="img"
            width="1em"
            height="1em"
            {...(props as Omit<React.SVGProps<SVGElement>, 'ref'>)} // Lie.
          >
            {hasTitle && <title id={this.id}>{title}</title>}
            {svgPaths}
          </svg>
        );
      } else {
        return (
          <svg
            className={classNames.join(' ')}
            fill="currentColor"
            aria-labelledby={hasTitle ? this.id : null}
            aria-hidden={hasTitle ? null : true}
            role="img"
            width="1em"
            height="1em"
            {...(props as Omit<React.SVGProps<SVGElement>, 'ref'>)} // Lie.
          >
            {hasTitle && <title id={this.id}>{title}</title>}
            {icon && createSvg(icon, 'pf-v6-icon-default')}
            {rhUiIcon && createSvg(rhUiIcon, 'pf-v6-icon-rh-ui')}
          </svg>
        );
      }
    }
  };
}
