import { Component, type ReactNode } from 'react';

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
 * On-disk / nested icon data: `svgPathData` (preferred) or deprecated `svgPath` (at least one is required at
 * runtime for rendering; if both are set, `svgPathData` takes precedence in {@link resolveSvgPathData}).
 */
export interface IconDefinition extends IconDefinitionBase {
  svgPathData?: string | SVGPathObject[];
  /**
   * @deprecated Use {@link IconDefinition.svgPathData} instead.
   */
  svgPath?: string | SVGPathObject[];
}

/**
 * {@link createIconBase} and rendering use this after {@link resolveSvgPathData} — not part of the public
 * type surface.
 */
type NormalizedIconDefinition = Required<Pick<IconDefinition, 'svgPathData'>> & IconDefinition;

/**
 * Nested (current) public API: `{ icon, rhUiIcon?, name? }` as produced by the icon generator and
 * `createIconBase` consumers.
 */
export interface CreateIconBaseProps {
  name?: string;
  icon: IconDefinition;
  rhUiIcon?: IconDefinition | null;
}

/**
 * **Flat (legacy) public API** for {@link createIcon} only — not an alias of {@link IconDefinition} so
 * the legacy shape is obvious at the call site. `createIcon` maps this to {@link CreateIconBaseProps}.
 */
export interface CreateIconLegacyProps {
  name?: string;
  width: number;
  height: number;
  xOffset?: number;
  yOffset?: number;
  svgPathData?: string | SVGPathObject[];
  /**
   * @deprecated Use {@link CreateIconLegacyProps.svgPathData} instead.
   */
  svgPath?: string | SVGPathObject[];
  svgClassName?: string;
  /**
   * Optional second variant for the `set="rh-ui"` / nested-inner-SVG layout, matching {@link createIconBase}.
   */
  rhUiIcon?: IconDefinition | null;
}

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

/** Produces a single {@link NormalizedIconDefinition} for internal rendering. */
function normalizeIconDefinition(icon: IconDefinition): NormalizedIconDefinition {
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

/** Renders <path> element(s) from resolved (normalized) path data. */
function pathElementsFromResolvedData(svgPathData: string | SVGPathObject[]): ReactNode {
  return Array.isArray(svgPathData) ? (
    svgPathData.map((pathObject, index) => (
      <path className={pathObject.className} key={`${pathObject.path}-${index}`} d={pathObject.path} />
    ))
  ) : (
    <path d={svgPathData} />
  );
}

/** Renders an inner `<svg>` with viewBox and path(s) for the dual-SVG (CSS swap) layout. */
const createSvg = (icon: NormalizedIconDefinition, iconClassName: string) => {
  const { xOffset, yOffset, width, height, svgPathData, svgClassName } = icon;
  const _xOffset = xOffset ?? 0;
  const _yOffset = yOffset ?? 0;
  const viewBox = [_xOffset, _yOffset, width, height].join(' ');

  const classNames: string[] = [];

  if (svgClassName) {
    classNames.push(svgClassName);
  }
  if (iconClassName) {
    classNames.push(iconClassName);
  }

  return (
    <svg viewBox={viewBox} className={classNames.join(' ')}>
      {pathElementsFromResolvedData(svgPathData)}
    </svg>
  );
};

/**
 * Preferred factory for **nested** icon config (`icon` and optional `rhUiIcon`). Package-generated icons use this.
 *
 * @param name Optional display name for the component; falls back to `icon.name` when not set.
 * @see {@link createIcon} for the legacy **flat** argument shape.
 */
export function createIconBase({
  name,
  icon,
  rhUiIcon = null
}: CreateIconBaseProps): React.ComponentClass<SVGIconProps> {
  if (icon == null) {
    const label = name != null ? ` (name: ${String(name)})` : '';
    throw new Error(`@patternfly/react-icons: createIconBase requires an \`icon\` definition${label}.`);
  }
  const normalizedIcon = normalizeIconDefinition(icon);
  const normalizedRhUiIcon = rhUiIcon != null ? normalizeIconDefinition(rhUiIcon) : null;
  const displayName = name ?? icon.name;

  return class SVGIcon extends Component<SVGIconProps> {
    static displayName = displayName;

    id = `icon-title-${currentId++}`;

    private warnedMissingRhUi = false;

    static defaultProps: SVGIconProps = {
      noDefaultStyle: false
    };

    private warnIfMissingRhUiMapping = () => {
      if (this.warnedMissingRhUi) {
        return;
      }
      if (this.props.set === 'rh-ui' && normalizedRhUiIcon === null) {
        this.warnedMissingRhUi = true;
        // eslint-disable-next-line no-console -- intentional dev-facing warning for invalid set/rh-ui pairing
        console.warn(
          `Set "rh-ui" was provided for ${displayName}, but no rh-ui icon data exists for this icon. The default icon will be rendered.`
        );
      }
    };

    componentDidMount() {
      this.warnIfMissingRhUiMapping();
    }

    componentDidUpdate() {
      this.warnIfMissingRhUiMapping();
    }

    /** Renders one root `<svg>`; either a single variant or nested inner SVGs for RH UI swap. */
    render() {
      const { title, className: propsClassName, set, noDefaultStyle, ...props } = this.props;

      const hasTitle = Boolean(title);
      const classNames = ['pf-v6-svg'];

      if (propsClassName) {
        classNames.push(propsClassName);
      }

      if (set !== undefined || normalizedRhUiIcon === null) {
        const iconData: NormalizedIconDefinition =
          set === 'rh-ui' && normalizedRhUiIcon !== null ? normalizedRhUiIcon : normalizedIcon;
        const { xOffset, yOffset, width, height, svgPathData, svgClassName } = iconData;
        const _xOffset = xOffset ?? 0;
        const _yOffset = yOffset ?? 0;
        const viewBox = [_xOffset, _yOffset, width, height].join(' ');

        if (svgClassName && !noDefaultStyle) {
          classNames.push(svgClassName);
        }

        const svgPaths = pathElementsFromResolvedData(svgPathData);

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
      }
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
          {createSvg(normalizedIcon, 'pf-v6-icon-default')}
          {normalizedRhUiIcon && createSvg(normalizedRhUiIcon, 'pf-v6-icon-rh-ui')}
        </svg>
      );
    }
  };
}

/**
 * Flat **legacy** entry point: turn {@link CreateIconLegacyProps} into a nested
 * `icon: IconDefinition` with `svgPathData` resolved, then call {@link createIconBase} (all legacy mapping
 * lives in this function). Prefer {@link createIconBase} for the nested `icon` / `rhUiIcon` shape.
 */
export function createIcon(legacy: CreateIconLegacyProps): React.ComponentClass<SVGIconProps> {
  const { rhUiIcon = null, ...flat } = legacy;
  const icon: IconDefinition = {
    name: flat.name,
    width: flat.width,
    height: flat.height,
    xOffset: flat.xOffset,
    yOffset: flat.yOffset,
    svgClassName: flat.svgClassName,
    // Fold deprecated svgPath (and de-dupe vs svgPathData) in one place, then omit svgPath in the object.
    svgPathData: resolveSvgPathData(flat as IconDefinition)
  };
  return createIconBase({ name: icon.name, icon, rhUiIcon });
}
